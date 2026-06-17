import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { ReportReason } from '@prisma/client'

export interface CreateReportDto {
  profileId: string
  reason: ReportReason
  details?: string
}

@Injectable()
export class ReportsService {
  constructor(private prisma: PrismaService) {}

  async create(reporterId: string, dto: CreateReportDto) {
    return this.prisma.report.create({
      data: {
        reporterId,
        profileId: dto.profileId,
        reason: dto.reason,
        details: dto.details,
      },
    })
  }

  async findAll(status?: string) {
    return this.prisma.report.findMany({
      where: status ? { status: status as any } : undefined,
      include: { reporter: { select: { pseudo: true } } },
      orderBy: { createdAt: 'desc' },
    })
  }

  async resolve(id: string, resolvedBy: string) {
    return this.prisma.report.update({
      where: { id },
      data: { status: 'RESOLVED', resolvedAt: new Date(), resolvedBy },
    })
  }
}
