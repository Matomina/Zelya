/**
 * Zelya — Media Service
 *
 * TODO (PRODUCTION REQUIRED):
 * 1. Intégrer Cloudflare R2 ou AWS S3 pour le stockage des fichiers
 *    → npm i @aws-sdk/client-s3 @aws-sdk/s3-request-presigner
 * 2. Implémenter la pipeline de modération :
 *    a. Vérification ARCOM que le contenu ne représente pas de mineur
 *    b. Confirmation du consentement de toutes les personnes représentées
 *    c. Approbation manuelle ou automatisée par modérateur
 * 3. Générer des thumbnails (Sharp) pour les photos
 * 4. Transcodage vidéo (FFmpeg ou service tiers)
 * 5. Jamais stocker de fichier en base de données — uniquement la clé S3/R2
 * 6. Restreindre les types MIME acceptés (image/jpeg, image/png, image/webp, video/mp4)
 * 7. Limiter la taille : photos < 10 MB, vidéos < 500 MB
 */
import {
  Injectable, NotFoundException, BadRequestException,
} from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'

export interface UploadMediaDto {
  type: 'PHOTO' | 'VIDEO'
  visibility?: 'PUBLIC' | 'SUBSCRIBERS' | 'PRIVATE'
  hasConsent: boolean
}

@Injectable()
export class MediaService {
  constructor(private prisma: PrismaService) {}

  /**
   * Retourne une URL présignée pour uploader directement sur S3/R2.
   * TODO: Implémenter avec @aws-sdk/s3-request-presigner
   */
  async getPresignedUploadUrl(_profileId: string, _dto: UploadMediaDto): Promise<{ uploadUrl: string; storageKey: string }> {
    // TODO: Generate real presigned URL
    throw new BadRequestException(
      'Le stockage médias n\'est pas encore configuré. ' +
      'Veuillez connecter un bucket S3 ou Cloudflare R2 et implémenter getPresignedUploadUrl().',
    )
  }

  /**
   * Enregistre les métadonnées d'un média après upload réussi côté client.
   * Le fichier doit déjà exister dans le bucket.
   */
  async confirmUpload(profileId: string, dto: { storageKey: string } & UploadMediaDto) {
    if (!dto.hasConsent) {
      throw new BadRequestException(
        'Le consentement de toutes les personnes représentées est obligatoire (ARCOM).',
      )
    }

    return this.prisma.media.create({
      data: {
        profileId,
        type: dto.type,
        storageKey: dto.storageKey,
        visibility: dto.visibility ?? 'PUBLIC',
        hasConsent: dto.hasConsent,
        // isApproved stays false — requires moderation before visibility
      },
    })
  }

  async findByProfile(profileId: string, requesterId?: string) {
    const profile = await this.prisma.profile.findUnique({
      where: { id: profileId },
      select: { userId: true },
    })
    if (!profile) throw new NotFoundException('Profil introuvable')

    const isOwner = requesterId && profile.userId === requesterId

    return this.prisma.media.findMany({
      where: {
        profileId,
        isApproved: true,
        ...(isOwner ? {} : { visibility: 'PUBLIC' }),
      },
      orderBy: { createdAt: 'desc' },
    })
  }

  async remove(profileId: string, mediaId: string) {
    const media = await this.prisma.media.findFirst({
      where: { id: mediaId, profileId },
    })
    if (!media) throw new NotFoundException('Média introuvable')

    // TODO: Delete from S3/R2 bucket before removing DB record
    // await this.s3.deleteObject({ Bucket: process.env.S3_BUCKET, Key: media.storageKey })

    return this.prisma.media.delete({ where: { id: mediaId } })
  }

  // ── Admin / modération ─────────────────────────────────────────────────────

  async approve(mediaId: string, moderatorId: string) {
    const media = await this.prisma.media.findUnique({ where: { id: mediaId } })
    if (!media) throw new NotFoundException('Média introuvable')

    return this.prisma.media.update({
      where: { id: mediaId },
      data: { isApproved: true, approvedAt: new Date(), approvedBy: moderatorId },
    })
  }

  async reject(mediaId: string) {
    return this.prisma.media.delete({ where: { id: mediaId } })
  }
}
