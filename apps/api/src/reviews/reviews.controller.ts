import {
  Controller, Get, Post, Patch, Delete, Body, Param,
  Query, UseGuards, Req, ParseIntPipe, DefaultValuePipe,
} from '@nestjs/common'
import { ApiTags, ApiBearerAuth, ApiOperation, ApiParam, ApiQuery } from '@nestjs/swagger'
import { IsInt, IsOptional, IsString, Max, Min } from 'class-validator'
import { Type } from 'class-transformer'
import { ReviewsService } from './reviews.service'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'

class CreateReviewDto {
  @IsInt() @Min(1) @Max(5)
  @Type(() => Number)
  rating: number

  @IsOptional() @IsString()
  comment?: string
}

@ApiTags('reviews')
@Controller('reviews')
export class ReviewsController {
  constructor(private reviews: ReviewsService) {}

  @Get('profile/:profileId')
  @ApiOperation({ summary: 'Avis pour un profil' })
  @ApiParam({ name: 'profileId', type: String })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  findByProfile(
    @Param('profileId') profileId: string,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
  ) {
    return this.reviews.findByProfile(profileId, page, Math.min(limit, 50))
  }

  @Post('profile/:profileId')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Laisser un avis sur un profil' })
  @ApiParam({ name: 'profileId', type: String })
  create(
    @Req() req: any,
    @Param('profileId') profileId: string,
    @Body() dto: CreateReviewDto,
  ) {
    return this.reviews.create(req.user.id, profileId, dto)
  }

  @Patch(':reviewId')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Modifier mon avis' })
  @ApiParam({ name: 'reviewId', type: String })
  update(
    @Req() req: any,
    @Param('reviewId') reviewId: string,
    @Body() dto: CreateReviewDto,
  ) {
    return this.reviews.update(req.user.id, reviewId, dto)
  }

  @Delete(':reviewId')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Supprimer mon avis' })
  @ApiParam({ name: 'reviewId', type: String })
  remove(@Req() req: any, @Param('reviewId') reviewId: string) {
    return this.reviews.remove(req.user.id, reviewId)
  }
}
