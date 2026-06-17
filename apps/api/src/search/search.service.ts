import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'

@Injectable()
export class SearchService {
  constructor(private prisma: PrismaService) {}

  async search(query: string, filters: { gender?: string; online?: boolean; minAge?: number; maxAge?: number; page?: number; limit?: number }) {
    const { gender, online, minAge = 18, maxAge = 100, page = 1, limit = 24 } = filters
    const where: any = {
      status: 'ACTIVE',
      AND: [
        { OR: [
          { alias: { contains: query, mode: 'insensitive' } },
          { city: { contains: query, mode: 'insensitive' } },
          { department: { contains: query, mode: 'insensitive' } },
          { region: { contains: query, mode: 'insensitive' } },
        ]},
        { age: { gte: minAge, lte: maxAge } },
        ...(gender ? [{ gender }] : []),
        ...(online !== undefined ? [{ isOnline: online }] : []),
      ],
    }

    const [profiles, total] = await this.prisma.$transaction([
      this.prisma.profile.findMany({
        where,
        include: { tags: true },
        orderBy: [{ isOnline: 'desc' }, { rating: 'desc' }],
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.profile.count({ where }),
    ])

    return { profiles, total, page, limit, query }
  }
}
