import { Controller, Get, Post, Patch, Param, Body, Query, UseGuards, Req } from '@nestjs/common'
import { ApiTags, ApiBearerAuth, ApiOperation, ApiQuery } from '@nestjs/swagger'
import { ProfilesService } from './profiles.service'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'

@ApiTags('profiles')
@Controller('profiles')
export class ProfilesController {
  constructor(private profiles: ProfilesService) {}

  @Get()
  @ApiOperation({ summary: 'Liste des profils actifs' })
  @ApiQuery({ name: 'gender', required: false })
  @ApiQuery({ name: 'online', required: false, type: Boolean })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  findAll(@Query() query: any) {
    return this.profiles.findAll(query)
  }

  @Get(':id')
  @ApiOperation({ summary: 'Détail d\'un profil' })
  findOne(@Param('id') id: string) {
    return this.profiles.findById(id)
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Créer un profil créateur' })
  create(@Req() req: any, @Body() body: any) {
    return this.profiles.create(req.user.id, body)
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Modifier mon profil' })
  update(@Param('id') id: string, @Req() req: any, @Body() body: any) {
    return this.profiles.update(id, req.user.id, body)
  }
}
