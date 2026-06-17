import {
  Injectable, NotFoundException, ConflictException,
  ForbiddenException, BadRequestException,
} from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'

export interface CreateReviewDto {
  rating: number   // 1–5
  comment?: string
}

@Injectable()
export class ReviewsService {
  constructor(private prisma: PrismaService) {}

  async create(authorId: string, profileId: string, dto: CreateReviewDto) {
    if (dto.rating < 1 || dto.rating > 5) {
      throw new BadRequestException('La note doit être entre 1 et 5')
    }

    const profile = await this.prisma.profile.findFirst({
      where: { id: profileId, status: 'ACTIVE' },
    })
    if (!profile) throw new NotFoundException('Profil introuvable')

    // Prevent reviewing own profile
    if (profile.userId === authorId) {
      throw new ForbiddenException('Vous ne pouvez pas évaluer votre propre profil')
    }

    const existing = await this.prisma.review.findUnique({
      where: { profileId_authorId: { profileId, authorId } },
    })
    if (existing) throw new ConflictException('Vous avez déjà évalué ce profil')

    const review = await this.prisma.review.create({
      data: { profileId, authorId, rating: dto.rating, comment: dto.comment },
      include: { author: { select: { pseudo: true } } },
    })

    // Update profile aggregate rating
    await this.updateProfileRating(profileId)

    return review
  }

  async findByProfile(profileId: string, page = 1, limit = 10) {
    const skip = (page - 1) * limit

    const profile = await this.prisma.profile.findUnique({ where: { id: profileId } })
    if (!profile) throw new NotFoundException('Profil introuvable')

    const [reviews, total] = await Promise.all([
      this.prisma.review.findMany({
        where: { profileId, isVisible: true },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
        include: { author: { select: { pseudo: true } } },
      }),
      this.prisma.review.count({ where: { profileId, isVisible: true } }),
    ])

    return {
      data: reviews,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    }
  }

  async update(authorId: string, reviewId: string, dto: CreateReviewDto) {
    if (dto.rating < 1 || dto.rating > 5) {
      throw new BadRequestException('La note doit être entre 1 et 5')
    }

    const review = await this.prisma.review.findUnique({ where: { id: reviewId } })
    if (!review) throw new NotFoundException('Avis introuvable')
    if (review.authorId !== authorId) throw new ForbiddenException('Action non autorisée')

    const updated = await this.prisma.review.update({
      where: { id: reviewId },
      data: { rating: dto.rating, comment: dto.comment },
    })

    await this.updateProfileRating(review.profileId)
    return updated
  }

  async remove(authorId: string, reviewId: string) {
    const review = await this.prisma.review.findUnique({ where: { id: reviewId } })
    if (!review) throw new NotFoundException('Avis introuvable')
    if (review.authorId !== authorId) throw new ForbiddenException('Action non autorisée')

    await this.prisma.review.delete({ where: { id: reviewId } })
    await this.updateProfileRating(review.profileId)
    return { deleted: true }
  }

  // ── Private helper ─────────────────────────────────────────────────────────

  private async updateProfileRating(profileId: string) {
    const agg = await this.prisma.review.aggregate({
      where: { profileId, isVisible: true },
      _avg: { rating: true },
      _count: { id: true },
    })

    await this.prisma.profile.update({
      where: { id: profileId },
      data: {
        rating: agg._avg.rating ?? 0,
        reviewCount: agg._count.id,
      },
    })
  }
}
