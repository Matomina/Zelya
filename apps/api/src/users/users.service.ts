import { Injectable, NotFoundException, ConflictException } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { Prisma } from '@prisma/client'

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async create(data: Prisma.UserCreateInput) {
    try {
      return await this.prisma.user.create({ data })
    } catch (e: any) {
      if (e.code === 'P2002') throw new ConflictException('Email ou pseudo déjà utilisé')
      throw e
    }
  }

  async findById(id: string) {
    return this.prisma.user.findUnique({
      where: { id, deletedAt: null, isActive: true },
    })
  }

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({ where: { email } })
  }

  async findByPseudo(pseudo: string) {
    return this.prisma.user.findUnique({ where: { pseudo } })
  }

  async update(id: string, data: Prisma.UserUpdateInput) {
    const user = await this.findById(id)
    if (!user) throw new NotFoundException('Utilisateur introuvable')
    return this.prisma.user.update({ where: { id }, data })
  }

  /** Soft delete — RGPD */
  async delete(id: string) {
    const user = await this.findById(id)
    if (!user) throw new NotFoundException('Utilisateur introuvable')
    return this.prisma.user.update({
      where: { id },
      data: {
        deletedAt: new Date(),
        email: `deleted_${id}@deleted.zelya`,  // Anonymize
        pseudo: `deleted_${id}`,
        isActive: false,
      },
    })
  }
}
