import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { Prisma, ProfileStatus, MediaVisibility } from '@prisma/client'

@Injectable()
export class ProfilesService {
  constructor(private prisma: PrismaService) {}

  async findAll(query: {
    gender?: string
    online?: boolean | string
    verified?: boolean | string
    premium?: boolean | string
    page?: number
    limit?: number
    sortBy?: string
    minAge?: number
    maxAge?: number
  }) {
    const {
      gender,
      online,
      verified,
      premium,
      page = 1,
      limit = 24,
      sortBy = 'online-first',
      minAge = 18,
      maxAge = 100,
    } = query

    const toBoolean = (v: boolean | string | undefined) => {
      if (v === undefined) return undefined
      return v === true || v === 'true'
    }

    const where: Prisma.ProfileWhereInput = {
      status: ProfileStatus.ACTIVE,
      age: { gte: Number(minAge), lte: Number(maxAge) },
      ...(gender ? { gender: gender.toUpperCase() as any } : {}),
      ...(toBoolean(online) !== undefined ? { isOnline: toBoolean(online) } : {}),
      ...(toBoolean(verified) ? { isVerified: true } : {}),
      ...(toBoolean(premium) ? { isPremium: true } : {}),
    }

    const orderBy: Prisma.ProfileOrderByWithRelationInput[] =
      sortBy === 'popular'
        ? [{ rating: 'desc' }, { reviewCount: 'desc' }]
        : sortBy === 'recent'
        ? [{ createdAt: 'desc' }]
        : [{ isOnline: 'desc' }, { rating: 'desc' }]

    const [profiles, total] = await this.prisma.$transaction([
      this.prisma.profile.findMany({
        where,
        include: { tags: true },
        orderBy,
        skip: (Number(page) - 1) * Number(limit),
        take: Number(limit),
      }),
      this.prisma.profile.count({ where }),
    ])

    return {
      profiles,
      total,
      page: Number(page),
      limit: Number(limit),
      pages: Math.ceil(total / Number(limit)),
    }
  }

  async findById(id: string) {
    const profile = await this.prisma.profile.findUnique({
      where: { id, status: ProfileStatus.ACTIVE },
      include: {
        tags: true,
        media: {
          where: { isApproved: true, visibility: MediaVisibility.PUBLIC },
          orderBy: { createdAt: 'asc' },
          take: 12,
        },
        reviews: {
          where: { isVisible: true },
          take: 10,
          orderBy: { createdAt: 'desc' },
          include: { author: { select: { pseudo: true } } },
        },
      },
    })
    if (!profile) throw new NotFoundException('Profil introuvable')
    return profile
  }

  async findByAlias(alias: string) {
    const profile = await this.prisma.profile.findUnique({
      where: { alias, status: ProfileStatus.ACTIVE },
      include: { tags: true },
    })
    if (!profile) throw new NotFoundException('Profil introuvable')
    return profile
  }

  async create(userId: string, data: Prisma.ProfileCreateInput) {
    return this.prisma.profile.create({
      data: { ...data, user: { connect: { id: userId } } },
    })
  }

  async update(id: string, userId: string, data: Prisma.ProfileUpdateInput) {
    const profile = await this.prisma.profile.findUnique({ where: { id } })
    if (!profile) throw new NotFoundException()
    if (profile.userId !== userId) throw new ForbiddenException()
    return this.prisma.profile.update({ where: { id }, data })
  }

  async setOnline(userId: string, isOnline: boolean) {
    return this.prisma.profile.updateMany({
      where: { userId },
      data: { isOnline, lastSeenAt: new Date() },
    })
  }
}
