import { Injectable, UnauthorizedException, ForbiddenException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { ConfigService } from '@nestjs/config'
import * as bcrypt from 'bcrypt'
import { v4 as uuidv4 } from 'uuid'
import { PrismaService } from '../prisma/prisma.service'
import { UsersService } from '../users/users.service'
import { RegisterDto } from './dto/register.dto'

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private users: UsersService,
    private jwt: JwtService,
    private config: ConfigService,
  ) {}

  // ─── Validate credentials (Passport local) ─────────────────────────────────
  async validateUser(email: string, password: string) {
    const user = await this.users.findByEmail(email)
    if (!user || user.isBanned || !user.isActive) return null
    const valid = await bcrypt.compare(password, user.passwordHash)
    if (!valid) return null
    const { passwordHash, ...result } = user
    return result
  }

  // ─── Register ──────────────────────────────────────────────────────────────
  async register(dto: RegisterDto) {
    // Age verification placeholder
    // TODO: Verify age with ARCOM-certified provider before granting access
    const passwordHash = await bcrypt.hash(dto.password, 12)

    const user = await this.users.create({
      email: dto.email,
      pseudo: dto.pseudo,
      passwordHash,
      dateOfBirth: dto.dateOfBirth ? new Date(dto.dateOfBirth) : undefined,
    })

    // Log consents (RGPD)
    await this.prisma.consent.createMany({
      data: [
        { userId: user.id, type: 'TERMS', accepted: true, version: '1.0' },
        { userId: user.id, type: 'PRIVACY', accepted: true, version: '1.0' },
        ...(dto.acceptMarketing
          ? [{ userId: user.id, type: 'MARKETING' as const, accepted: true, version: '1.0' }]
          : []),
      ],
    })

    return this.generateTokens(user.id, user.email, user.role)
  }

  // ─── Login ─────────────────────────────────────────────────────────────────
  async login(userId: string, email: string, role: string) {
    return this.generateTokens(userId, email, role)
  }

  // ─── Refresh tokens ────────────────────────────────────────────────────────
  async refreshTokens(userId: string, refreshToken: string) {
    const stored = await this.prisma.refreshToken.findUnique({ where: { token: refreshToken } })
    if (!stored || stored.isRevoked || stored.expiresAt < new Date() || stored.userId !== userId) {
      throw new UnauthorizedException('Refresh token invalide ou expiré')
    }

    // Rotate refresh token
    await this.prisma.refreshToken.update({ where: { id: stored.id }, data: { isRevoked: true } })

    const user = await this.users.findById(userId)
    if (!user || user.isBanned) throw new ForbiddenException()

    return this.generateTokens(user.id, user.email, user.role)
  }

  // ─── Logout ────────────────────────────────────────────────────────────────
  async logout(userId: string, refreshToken?: string) {
    if (refreshToken) {
      await this.prisma.refreshToken.updateMany({
        where: { userId, token: refreshToken },
        data: { isRevoked: true },
      })
    }
    return { message: 'Déconnecté avec succès' }
  }

  // ─── Token generation ──────────────────────────────────────────────────────
  private async generateTokens(userId: string, email: string, role: string) {
    const payload = { sub: userId, email, role }

    const accessToken = this.jwt.sign(payload)

    const refreshTokenValue = uuidv4()
    const expiresIn = this.config.get<number>('JWT_REFRESH_EXPIRES_DAYS', 30)
    const expiresAt = new Date()
    expiresAt.setDate(expiresAt.getDate() + expiresIn)

    await this.prisma.refreshToken.create({
      data: { userId, token: refreshTokenValue, expiresAt },
    })

    return { accessToken, refreshToken: refreshTokenValue }
  }
}
