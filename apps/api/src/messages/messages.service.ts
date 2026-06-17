import {
  Injectable, NotFoundException, ForbiddenException, BadRequestException,
} from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'

export interface SendMessageDto {
  receiverId: string
  content: string
}

@Injectable()
export class MessagesService {
  constructor(private prisma: PrismaService) {}

  async send(senderId: string, dto: SendMessageDto) {
    if (!dto.content?.trim()) throw new BadRequestException('Le message ne peut pas être vide')
    if (dto.content.length > 2000) throw new BadRequestException('Message trop long (max 2000 caractères)')
    if (senderId === dto.receiverId) throw new BadRequestException('Vous ne pouvez pas vous écrire à vous-même')

    const receiver = await this.prisma.user.findFirst({
      where: { id: dto.receiverId, isActive: true, isBanned: false, deletedAt: null },
    })
    if (!receiver) throw new NotFoundException('Destinataire introuvable')

    return this.prisma.message.create({
      data: { senderId, receiverId: dto.receiverId, content: dto.content.trim() },
      include: {
        sender: { select: { pseudo: true } },
        receiver: { select: { pseudo: true } },
      },
    })
  }

  async getConversation(userId: string, otherUserId: string, page = 1, limit = 50) {
    const skip = (page - 1) * limit

    const [messages, total] = await Promise.all([
      this.prisma.message.findMany({
        where: {
          isDeleted: false,
          OR: [
            { senderId: userId, receiverId: otherUserId },
            { senderId: otherUserId, receiverId: userId },
          ],
        },
        orderBy: { createdAt: 'asc' },
        skip,
        take: limit,
        include: {
          sender: { select: { pseudo: true } },
        },
      }),
      this.prisma.message.count({
        where: {
          isDeleted: false,
          OR: [
            { senderId: userId, receiverId: otherUserId },
            { senderId: otherUserId, receiverId: userId },
          ],
        },
      }),
    ])

    // Mark unread messages as read
    await this.prisma.message.updateMany({
      where: { senderId: otherUserId, receiverId: userId, isRead: false },
      data: { isRead: true, readAt: new Date() },
    })

    return { data: messages, meta: { total, page, limit } }
  }

  async getInbox(userId: string) {
    // Return latest message per conversation partner
    const messages = await this.prisma.message.findMany({
      where: {
        isDeleted: false,
        OR: [{ senderId: userId }, { receiverId: userId }],
      },
      orderBy: { createdAt: 'desc' },
      distinct: ['senderId', 'receiverId'],
      take: 50,
      include: {
        sender: { select: { id: true, pseudo: true } },
        receiver: { select: { id: true, pseudo: true } },
      },
    })

    // Deduplicate by conversation partner
    const seen = new Set<string>()
    return messages.filter(m => {
      const partnerId = m.senderId === userId ? m.receiverId : m.senderId
      if (seen.has(partnerId)) return false
      seen.add(partnerId)
      return true
    })
  }

  async getUnreadCount(userId: string): Promise<number> {
    return this.prisma.message.count({
      where: { receiverId: userId, isRead: false, isDeleted: false },
    })
  }

  async softDelete(userId: string, messageId: string) {
    const message = await this.prisma.message.findUnique({ where: { id: messageId } })
    if (!message) throw new NotFoundException('Message introuvable')
    if (message.senderId !== userId && message.receiverId !== userId) {
      throw new ForbiddenException('Action non autorisée')
    }

    return this.prisma.message.update({
      where: { id: messageId },
      data: { isDeleted: true },
    })
  }
}
