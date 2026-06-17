import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { MapPin, Star, CheckCircle2, Heart, Flag, Clock, ArrowLeft, MessageCircle } from 'lucide-react'
import ProfileCard from '@/components/ProfileCard'
import { profilesApi } from '@/lib/api'
import type { ApiProfile } from '@/types/api'
import { useAuth } from '@/contexts/AuthContext'

function photoUrl(key: string | null | undefined, seed: string, w: number, h: number): string {
  if (!key || key.includes('placehold.co')) {
    return `https://picsum.photos/seed/${encodeURIComponent(seed)}/${w}/${h}`
  }
  return key
}

function formatLastSeen(isOnline: boolean, lastSeenAt: string): string {
  if (isOnline) return 'En ligne'
  const diff = Date.now() - new Date(lastSeenAt).getTime()
  const h = Math.floor(diff / 3600000)
  const d = Math.floor(h / 24)
  if (h < 1) return 'Il y a moins d\'1h'
  if (h < 24) return `Il y a ${h}h`
  return `Il y a ${d}j`
}

function ProfileDetailSkeleton() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 animate-pulse">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <div className="aspect-[3/4] rounded-2xl skeleton" />
        </div>
        <div className="lg:col-span-2 space-y-4">
          <div className="skeleton h-10 rounded w-1/2" />
          <div className="skeleton h-4 rounded w-1/3" />
          <div className="skeleton h-20 rounded" />
        </div>
      </div>
    </div>
  )
}

export default function ProfileDetailPage() {
  const { id } = useParams<{ id: string }>()
  const { isAuthenticated } = useAuth()

  const [profile, setProfile] = useState<ApiProfile | null>(null)
  const [similar, setSimilar] = useState<ApiProfile[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    if (!id) return
    setIsLoading(true)
    setNotFound(false)

    profilesApi.getById(id)
      .then(({ data }) => {
        setProfile(data)
        // Fetch similar profiles (same gender, exclude current)
        return profilesApi.getAll({
          gender: data.gender,
          limit: 4,
        })
      })
      .then(({ data }) => {
        setSimilar(data.profiles.filter((p) => p.id !== id).slice(0, 3))
      })
      .catch((err) => {
        if (err?.response?.status === 404) setNotFound(true)
      })
      .finally(() => setIsLoading(false))
  }, [id])

  if (isLoading) return <ProfileDetailSkeleton />

  if (notFound || !profile) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 text-center">
        <div className="text-6xl mb-6">🔍</div>
        <p className="text-z-muted text-xl mb-6">Profil introuvable</p>
        <Link to="/profils" className="btn-primary">Retour aux profils</Link>
      </div>
    )
  }

  const tagNames = profile.tags.map((t) => t.name)
  const lastSeen = formatLastSeen(profile.isOnline, profile.lastSeenAt)
  const photos = profile.media ?? []

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-z-muted mb-8" aria-label="Fil d'Ariane">
        <Link to="/" className="hover:text-z-violet-light transition-colors">Accueil</Link>
        <span className="text-z-faint">/</span>
        <Link to="/profils" className="hover:text-z-violet-light transition-colors">Profils</Link>
        <span className="text-z-faint">/</span>
        <span className="text-z-text">{profile.alias}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-14">
        {/* ── Photos ────────────────────────────────────────── */}
        <div className="lg:col-span-1 space-y-3">
          <div
            className="aspect-[3/4] rounded-2xl overflow-hidden"
            style={{ border: '1px solid rgba(139,92,246,0.2)' }}
          >
            <img
              src={photoUrl(profile.avatarKey, profile.alias, 400, 600)}
              alt=""
              role="presentation"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Galerie photos */}
          {photos.length > 0 ? (
            <div className="grid grid-cols-3 gap-2">
              {photos.slice(0, 3).map((m, idx) => (
                <div
                  key={m.id}
                  className="aspect-square rounded-xl overflow-hidden"
                  style={{ border: '1px solid rgba(30,27,58,0.8)' }}
                >
                  <img
                    src={photoUrl(m.storageKey, `${profile.alias}-${idx}`, 200, 200)}
                    alt=""
                    role="presentation"
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-2">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="aspect-square rounded-xl overflow-hidden"
                  style={{ border: '1px solid rgba(30,27,58,0.8)' }}
                >
                  <img
                    src={`https://picsum.photos/seed/${encodeURIComponent(profile.alias)}-${i}/200/200`}
                    alt=""
                    role="presentation"
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          )}

          <Link
            to="/profils"
            className="flex items-center gap-2 text-sm text-z-muted hover:text-z-violet-light transition-colors mt-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Retour aux profils
          </Link>
        </div>

        {/* ── Info ────────────────────────────────────────────── */}
        <div className="lg:col-span-2">
          {/* Header */}
          <div className="flex items-start justify-between mb-5">
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <h1 className="heading-lg text-z-text">{profile.alias}</h1>
                {profile.isVerified && (
                  <CheckCircle2
                    className="w-7 h-7 text-z-violet-light flex-shrink-0"
                    aria-label="Profil vérifié"
                    style={{ filter: 'drop-shadow(0 0 8px rgba(167,139,250,0.7))' }}
                  />
                )}
              </div>
              <div className="flex items-center gap-3 text-z-muted text-sm">
                <span>{profile.age} ans</span>
                <span className="text-z-faint">•</span>
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5" />
                  {profile.city}, {profile.department}
                </span>
              </div>
            </div>
            {profile.isPremium && <span className="badge-premium">★ PREMIUM</span>}
          </div>

          {/* Status & rating */}
          <div className="flex flex-wrap items-center gap-3 mb-6">
            <div
              className="flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium"
              style={
                profile.isOnline
                  ? { background: 'rgba(0,245,144,0.1)', border: '1px solid rgba(0,245,144,0.3)', color: '#00F590' }
                  : { background: 'rgba(13,12,30,0.6)', border: '1px solid rgba(30,27,58,0.8)', color: '#9795B5' }
              }
            >
              <span
                className={`w-2 h-2 rounded-full ${profile.isOnline ? 'bg-z-online' : 'bg-z-faint'}`}
                style={profile.isOnline ? { boxShadow: '0 0 6px rgba(0,245,144,1)' } : {}}
              />
              {lastSeen}
            </div>

            <div className="flex items-center gap-1.5">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`w-4 h-4 ${star <= Math.round(profile.rating) ? 'text-amber-400 fill-amber-400' : 'text-z-border fill-z-border'}`}
                />
              ))}
              <span className="text-z-muted text-sm ml-1">
                {profile.rating.toFixed(1)} ({profile.reviewCount} avis)
              </span>
            </div>
          </div>

          {/* Tags */}
          {tagNames.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-6">
              {tagNames.map((tag) => (
                <span key={tag} className="badge-verified">{tag}</span>
              ))}
            </div>
          )}

          {/* Actions */}
          <div className="flex flex-wrap gap-3 mb-8">
            <Link
              to={isAuthenticated ? '/messages' : '/connexion'}
              className="btn-primary py-3 px-7"
            >
              <MessageCircle className="w-4 h-4" />
              Contacter
            </Link>
            <Link
              to={isAuthenticated ? '#' : '/connexion'}
              className="btn-outline py-3 px-5"
            >
              <Heart className="w-4 h-4" />
              Favoris
            </Link>
            <Link
              to="/contact"
              className="flex items-center gap-2 text-z-faint hover:text-red-400 transition-colors text-sm px-4 py-3 rounded-xl"
              style={{ border: '1px solid rgba(30,27,58,0.8)' }}
            >
              <Flag className="w-4 h-4" />
              Signaler
            </Link>
          </div>

          {/* Bio */}
          {profile.bio && (
            <div
              className="rounded-2xl p-5 mb-4"
              style={{ background: 'rgba(13,12,30,0.7)', border: '1px solid rgba(30,27,58,0.8)' }}
            >
              <h2 className="font-semibold text-z-text mb-3">À propos</h2>
              <p className="text-z-muted text-sm leading-relaxed">{profile.bio}</p>
            </div>
          )}

          {/* Informations */}
          <div
            className="rounded-2xl p-5 mb-4"
            style={{ background: 'rgba(13,12,30,0.7)', border: '1px solid rgba(30,27,58,0.8)' }}
          >
            <h2 className="font-semibold text-z-text mb-4">Informations</h2>
            <dl className="grid grid-cols-2 gap-4 text-sm">
              {[
                { label: 'Région', value: profile.region },
                { label: 'Département', value: profile.department },
                { label: 'Langues', value: 'Français' },
                { label: 'Profil vérifié', value: profile.isVerified ? 'Oui ✓' : 'Non' },
              ].map(({ label, value }) => (
                <div key={label}>
                  <dt className="text-z-faint text-xs mb-1">{label}</dt>
                  <dd className="text-z-text font-medium">{value}</dd>
                </div>
              ))}
            </dl>
          </div>

          {/* Last seen */}
          <div className="flex items-center gap-2 text-xs text-z-faint">
            <Clock className="w-3.5 h-3.5" />
            <span>Dernière activité : {lastSeen}</span>
          </div>
        </div>
      </div>

      {/* ── Avis ─────────────────────────────────────────────── */}
      {profile.reviews && profile.reviews.length > 0 && (
        <section className="mb-14">
          <h2 className="heading-sm text-z-text mb-6">Avis ({profile.reviewCount})</h2>
          <div className="space-y-4">
            {profile.reviews.map((review) => (
              <div
                key={review.id}
                className="rounded-2xl p-5"
                style={{ background: 'rgba(13,12,30,0.7)', border: '1px solid rgba(30,27,58,0.8)' }}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2.5">
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center text-z-faint text-sm font-bold"
                      style={{ background: 'rgba(30,27,58,0.8)' }}
                    >
                      {review.author?.pseudo?.[0]?.toUpperCase() ?? '?'}
                    </div>
                    <span className="text-sm font-medium text-z-text">
                      {review.author?.pseudo ?? 'Utilisateur anonyme'}
                    </span>
                  </div>
                  <span className="text-xs text-z-faint">
                    {new Date(review.createdAt).toLocaleDateString('fr-FR')}
                  </span>
                </div>
                <div className="flex items-center gap-1 mb-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`w-3.5 h-3.5 ${star <= review.rating ? 'text-amber-400 fill-amber-400' : 'text-z-border fill-z-border'}`}
                    />
                  ))}
                </div>
                {review.comment && (
                  <p className="text-sm text-z-muted">{review.comment}</p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ── Profils similaires ────────────────────────────────── */}
      {similar.length > 0 && (
        <section>
          <h2 className="heading-sm text-z-text mb-6">Profils similaires</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {similar.map((p) => (
              <ProfileCard key={p.id} profile={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
