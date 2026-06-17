import {
  Controller, Post, Get, Param, Query,
  UseGuards, Req, ParseIntPipe, DefaultValuePipe,
} from '@nestjs/common'
import { ApiTags, ApiBearerAuth, ApiOperation, ApiParam, ApiQuery } from '@nestjs/swagger'
import { FavoritesService } from './favorites.service'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'

@ApiTags('favorites')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('favorites')
export class FavoritesController {
  constructor(private favorites: FavoritesService) {}

  @Post(':profileId')
  @ApiOperation({ summary: 'Ajouter / retirer un profil des favoris (toggle)' })
  @ApiParam({ name: 'profileId', type: String })
  toggle(@Req() req: any, @Param('profileId') profileId: string) {
    return this.favorites.toggle(req.user.id, profileId)
  }

  @Get()
  @ApiOperation({ summary: 'Lister mes profils favoris' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  findAll(
    @Req() req: any,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(24), ParseIntPipe) limit: number,
  ) {
    const safeLimit = Math.min(limit, 48)
    return this.favorites.findAllByUser(req.user.id, page, safeLimit)
  }

  @Get(':profileId/status')
  @ApiOperation({ summary: 'Vérifier si un profil est dans mes favoris' })
  @ApiParam({ name: 'profileId', type: String })
  async status(@Req() req: any, @Param('profileId') profileId: string) {
    const favorited = await this.favorites.isFavorited(req.user.id, profileId)
    return { favorited }
  }
}
