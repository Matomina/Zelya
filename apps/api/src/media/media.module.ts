import { Module } from '@nestjs/common'
import { MediaService } from './media.service'
import { PrismaModule } from '../prisma/prisma.module'

// TODO: Add MediaController once S3/R2 storage is configured
// TODO: Add MediaGateway for upload progress events (WebSocket)

@Module({
  imports: [PrismaModule],
  providers: [MediaService],
  exports: [MediaService],
})
export class MediaModule {}
