import { Injectable, NotFoundException, ConflictException } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'

@Injectable()
export class FavoritesService {
  constructor(private prisma: PrismaService) {}

  async toggle(userId: string, profileId: string) {
    // Verify profile exists and is active
    const profile = await this.prisma.profile.findFirst({
      where: { id: profileId, status: 'ACTIVE' },
      select: { id: true, alias: true },
    })
    if (!profile) throw new NotFoundException('Profil introuvable')

    const existing = await this.prisma.favorite.findUnique({
      where: { userId_profileId: { userId, profileId } },
    })

    if (existing) {
      await this.prisma.favorite.delete({ where: { id: existing.id } })
      return { favorited: false, profileId }
    }

    await this.prisma.favorite.create({ data: { userId, profileId } })
    return { favorited: true, profileId }
  }

  async findAllByUser(userId: string, page = 1, limit = 24) {
    const skip = (page - 1) * limit

    const [favorites, total] = await Promise.all([
      this.prisma.favorite.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
        include: {
          profile: {
            select: {
              id: true,
              alias: true,
              bio: true,
              avatarKey: true,
              city: true,
              department: true,
              region: true,
              age: true,
              gender: true,
              isOnline: true,
              lastSeenAt: true,
              isVerified: true,
              isPremium: true,
              rating: true,
              reviewCount: true,
              status: true,
              createdAt: true,
              tags: { select: { id: true, name: true } },
            },
          },
        },
      }),
      this.prisma.favorite.count({ where: { userId } }),
    ])

    return {
      data: favorites.map(f => f.profile),
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    }
  }

  async isFavorited(userId: string, profileId: string): Promise<boolean> {
    const count = await this.prisma.favorite.count({
      where: { userId, profileId },
    })
    return count > 0
  }

  async getProfileFavoriteCount(profileId: string): Promise<number> {
    return this.prisma.favorite.count({ where: { profileId } })
  }
}
