import { Controller, Post, Body, UseGuards, Get, Req, HttpCode, HttpStatus } from '@nestjs/common'
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger'
import { AuthService } from './auth.service'
import { RegisterDto } from './dto/register.dto'
import { RefreshDto } from './dto/refresh.dto'
import { LocalAuthGuard } from './guards/local-auth.guard'
import { JwtAuthGuard } from './guards/jwt-auth.guard'

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private auth: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: 'Créer un compte (18+ requis)' })
  register(@Body() dto: RegisterDto) {
    return this.auth.register(dto)
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Se connecter' })
  login(@Req() req: any) {
    return this.auth.login(req.user.id, req.user.email, req.user.role)
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Rafraîchir les tokens' })
  refresh(@Body() dto: RefreshDto) {
    return this.auth.refreshTokens(dto.userId, dto.refreshToken)
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Se déconnecter' })
  logout(@Req() req: any, @Body('refreshToken') refreshToken?: string) {
    return this.auth.logout(req.user.id, refreshToken)
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Profil de l\'utilisateur connecté' })
  me(@Req() req: any) {
    return req.user
  }
}
