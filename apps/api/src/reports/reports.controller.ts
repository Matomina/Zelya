import { Controller, Post, Body, UseGuards, Req } from '@nestjs/common'
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger'
import { ReportsService, CreateReportDto } from './reports.service'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'

@ApiTags('reports')
@Controller('reports')
export class ReportsController {
  constructor(private reports: ReportsService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Signaler un profil' })
  create(@Req() req: any, @Body() dto: CreateReportDto) {
    return this.reports.create(req.user.id, dto)
  }
}
