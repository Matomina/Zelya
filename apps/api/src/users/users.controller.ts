import { Controller, Get, Delete, UseGuards, Req } from '@nestjs/common'
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger'
import { UsersService } from './users.service'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private users: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @Get('me')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Mon profil utilisateur' })
  getMe(@Req() req: any) {
    return this.users.findById(req.user.id)
  }

  @UseGuards(JwtAuthGuard)
  @Delete('me')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Supprimer mon compte (RGPD)' })
  deleteMe(@Req() req: any) {
    return this.users.delete(req.user.id)
  }
}
