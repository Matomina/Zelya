import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Zap, ArrowLeft } from 'lucide-react'
import ProfileCard from '@/components/ProfileCard'
import { profilesApi } from '@/lib/api'
import type { ApiProfile } from '@/types/api'

function ProfileSkeleton() {
  return (
    <div className="rounded-2xl overflow-hidden" style={{ background: 'rgba(18,17,43,0.85)', border: '1px solid rgba(30,27,58,0.8)' }}>
      <div className="aspect-[4/5] skeleton" />
      <div className="p-3 space-y-2">
        <div className="skeleton h-4 rounded w-3/4" />
        <div className="skeleton h-3 rounded w-1/2" />
      </div>
    </div>
  )
}

export default function OnlinePage() {
  const [profiles, setProfiles] = useState<ApiProfile[]>([])
  const [total, setTotal] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    profilesApi
      .getAll({ online: true, limit: 48 })
      .then(({ data }) => {
        setProfiles(data.profiles)
        setTotal(data.total)
      })
      .catch(() => setError('Impossible de charger les profils en ligne.'))
      .finally(() => setIsLoading(false))
  }, [])

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      {/* Header */}
      <div className="flex items-center gap-3 mb-2">
        <Link to="/" className="text-z-muted hover:text-z-violet-light transition-colors">
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div
          className="flex items-center gap-2 px-3 py-1.5 rounded-full"
          style={{ background: 'rgba(0,245,144,0.1)', border: '1px solid rgba(0,245,144,0.25)' }}
        >
          <span className="online-dot" />
          <span className="text-xs font-semibold text-z-online">EN DIRECT</span>
        </div>
      </div>

      <div className="mb-8">
        <h1 className="heading-lg text-z-text flex items-center gap-3">
          <Zap
            className="w-8 h-8 text-z-online"
            style={{ filter: 'drop-shadow(0 0 8px rgba(0,245,144,0.8))' }}
          />
          En ligne maintenant
        </h1>
        <p className="text-z-muted text-sm mt-2">
          {isLoading ? (
            <span className="skeleton h-4 w-32 inline-block rounded" />
          ) : (
            <>
              <span className="text-z-online font-semibold">{total}</span>{' '}
              profil{total !== 1 ? 's' : ''} connecté{total !== 1 ? 's' : ''} en ce moment
            </>
          )}
        </p>
      </div>

      {error && (
        <div
          className="rounded-2xl px-5 py-4 text-sm text-amber-200/80 mb-6"
          style={{ background: 'rgba(245,158,11,0.07)', border: '1px solid rgba(245,158,11,0.2)' }}
        >
          {error}
        </div>
      )}

      {isLoading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {Array.from({ length: 10 }).map((_, i) => <ProfileSkeleton key={i} />)}
        </div>
      ) : profiles.length === 0 ? (
        <div
          className="text-center py-20 rounded-2xl"
          style={{ background: 'rgba(13,12,30,0.6)', border: '1px solid rgba(30,27,58,0.8)' }}
        >
          <Zap className="w-14 h-14 mx-auto mb-5 text-z-faint opacity-30" />
          <p className="text-z-muted text-lg">Aucun profil en ligne pour le moment</p>
          <p className="text-z-faint text-sm mt-2">Revenez plus tard</p>
          <Link to="/profils" className="btn-outline btn-sm mt-6 inline-flex">
            Voir tous les profils
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {profiles.map((profile) => (
            <ProfileCard key={profile.id} profile={profile} />
          ))}
        </div>
      )}
    </div>
  )
}
