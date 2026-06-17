import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { ThrottlerModule } from '@nestjs/throttler'
import { PrismaModule } from './prisma/prisma.module'
import { AuthModule } from './auth/auth.module'
import { UsersModule } from './users/users.module'
import { ProfilesModule } from './profiles/profiles.module'
import { MediaModule } from './media/media.module'
import { MessagesModule } from './messages/messages.module'
import { ReviewsModule } from './reviews/reviews.module'
import { ReportsModule } from './reports/reports.module'
import { SearchModule } from './search/search.module'
import { FavoritesModule } from './favorites/favorites.module'

@Module({
  imports: [
    // ─── Config ──────────────────────────────────────────────────────────────
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.local', '.env'],
    }),

    // ─── Rate limiting (ARCOM / DDoS protection) ─────────────────────────────
    ThrottlerModule.forRoot([
      { name: 'short',  ttl: 1000,   limit: 10  },  // 10 req/s
      { name: 'medium', ttl: 60000,  limit: 200 },  // 200 req/min
      { name: 'long',   ttl: 3600000, limit: 1000 }, // 1000 req/h
    ]),

    // ─── Core ────────────────────────────────────────────────────────────────
    PrismaModule,

    // ─── Feature modules ─────────────────────────────────────────────────────
    AuthModule,
    UsersModule,
    ProfilesModule,
    MediaModule,
    MessagesModule,
    ReviewsModule,
    ReportsModule,
    SearchModule,
    FavoritesModule,
  ],
})
export class AppModule {}
