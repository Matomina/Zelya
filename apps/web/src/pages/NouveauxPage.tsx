import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Star, ArrowLeft } from 'lucide-react'
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

export default function NouveauxPage() {
  const [profiles, setProfiles] = useState<ApiProfile[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    profilesApi
      .getAll({ sortBy: 'recent', limit: 40 })
      .then(({ data }) => setProfiles(data.profiles))
      .catch(() => setError('Impossible de charger les nouveaux profils.'))
      .finally(() => setIsLoading(false))
  }, [])

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      {/* Header */}
      <div className="flex items-center gap-3 mb-2">
        <Link to="/" className="text-z-muted hover:text-z-violet-light transition-colors">
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <span className="badge-new">✦ NOUVEAUTÉS</span>
      </div>

      <div className="mb-8">
        <h1 className="heading-lg text-z-text flex items-center gap-3">
          <Star
            className="w-8 h-8 text-amber-400"
            style={{ filter: 'drop-shadow(0 0 8px rgba(245,158,11,0.5))' }}
          />
          Nouveaux profils
        </h1>
        <p className="text-z-muted text-sm mt-2">
          Les derniers profils à avoir rejoint la plateforme
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
      ) : (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {profiles.map((profile) => (
              <ProfileCard key={profile.id} profile={profile} />
            ))}
          </div>
          <div className="mt-10 text-center">
            <Link to="/profils" className="btn-outline">
              Voir tous les profils
            </Link>
          </div>
        </>
      )}
    </div>
  )
}
