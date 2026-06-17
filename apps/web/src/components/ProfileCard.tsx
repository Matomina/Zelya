import { Link } from 'react-router-dom'
import { MapPin, CheckCircle2, Star } from 'lucide-react'
import type { ApiProfile } from '@/types/api'

interface ProfileCardProps {
  profile: ApiProfile
  featured?: boolean
}

function avatarUrl(key: string | null, alias: string, w = 400, h = 500): string {
  if (!key || key.includes('placehold.co')) {
    return `https://picsum.photos/seed/${encodeURIComponent(alias)}/${w}/${h}`
  }
  return key
}

export default function ProfileCard({ profile, featured = false }: ProfileCardProps) {
  const tagNames = profile.tags.map((t) => t.name)

  return (
    <Link
      to={`/profil/${profile.id}`}
      className="group block rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1"
      style={{
        background: 'rgba(18,17,43,0.85)',
        border: '1px solid rgba(30,27,58,0.8)',
        boxShadow: '0 4px 20px rgba(0,0,0,0.5)',
      }}
      onMouseEnter={(e) => {
        const el = e.currentTarget as HTMLElement
        el.style.borderColor = 'rgba(139,92,246,0.45)'
        el.style.boxShadow = '0 8px 40px rgba(0,0,0,0.6), 0 0 20px rgba(139,92,246,0.2)'
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget as HTMLElement
        el.style.borderColor = 'rgba(30,27,58,0.8)'
        el.style.boxShadow = '0 4px 20px rgba(0,0,0,0.5)'
      }}
    >
      {/* Image */}
      <div className={`relative overflow-hidden bg-z-raised ${featured ? 'aspect-[3/4]' : 'aspect-[4/5]'}`}>
        <img
          src={avatarUrl(profile.avatarKey, profile.alias)}
          alt=""
          role="presentation"
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />

        {/* Top badges */}
        <div className="absolute top-2 left-2 right-2 flex items-start justify-between gap-1">
          {profile.isOnline ? (
            <div
              className="flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full"
              style={{
                background: 'rgba(0,245,144,0.15)',
                border: '1px solid rgba(0,245,144,0.35)',
                backdropFilter: 'blur(8px)',
              }}
            >
              <span className="online-dot" />
              <span className="text-z-online">En ligne</span>
            </div>
          ) : (
            <div
              className="flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full"
              style={{
                background: 'rgba(0,0,0,0.5)',
                border: '1px solid rgba(255,255,255,0.08)',
                backdropFilter: 'blur(8px)',
              }}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-z-faint" />
              <span className="text-z-faint">Hors ligne</span>
            </div>
          )}

          {profile.isPremium && (
            <span className="badge-premium text-xs px-2.5 py-1" style={{ backdropFilter: 'blur(8px)' }}>
              ★ PREMIUM
            </span>
          )}
        </div>

        {/* Bottom gradient */}
        <div
          className="absolute bottom-0 left-0 right-0 h-2/5"
          style={{ background: 'linear-gradient(to top, rgba(18,17,43,0.95) 0%, transparent 100%)' }}
        />

        <div className="absolute bottom-2.5 left-3 flex items-center gap-1">
          <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
          <span className="text-xs font-medium text-amber-300">{profile.rating.toFixed(1)}</span>
          <span className="text-xs text-z-muted/80">({profile.reviewCount})</span>
        </div>
      </div>

      {/* Info */}
      <div className="p-3">
        <div className="flex items-start justify-between gap-2 mb-1.5">
          <div className="flex items-center gap-1 min-w-0">
            <h3 className="font-semibold text-z-text text-sm truncate">{profile.alias}</h3>
            {profile.isVerified && (
              <CheckCircle2
                className="w-3.5 h-3.5 text-z-violet-light flex-shrink-0"
                aria-label="Profil vérifié"
                style={{ filter: 'drop-shadow(0 0 4px rgba(167,139,250,0.6))' }}
              />
            )}
          </div>
          <span className="text-z-muted text-xs flex-shrink-0">{profile.age} ans</span>
        </div>

        <div className="flex items-center gap-1.5 text-z-faint text-xs">
          <MapPin className="w-3 h-3 flex-shrink-0" />
          <span className="truncate">{profile.city}</span>
        </div>

        {tagNames.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {tagNames.slice(0, 2).map((tag) => (
              <span
                key={tag}
                className="text-xs px-1.5 py-0.5 rounded-md"
                style={{
                  background: 'rgba(139,92,246,0.1)',
                  border: '1px solid rgba(139,92,246,0.2)',
                  color: '#C4C2E0',
                }}
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </Link>
  )
}
