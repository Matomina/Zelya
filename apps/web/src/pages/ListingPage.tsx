import { useState, useEffect, useCallback } from 'react'
import { useSearchParams } from 'react-router-dom'
import { SlidersHorizontal, X } from 'lucide-react'
import ProfileCard from '@/components/ProfileCard'
import { profilesApi } from '@/lib/api'
import type { ApiProfile } from '@/types/api'

type GenderFilter = 'all' | 'female' | 'male' | 'couple' | 'trans'
type StatusFilter = 'all' | 'online'
type TypeFilter = 'all' | 'verified' | 'premium'
type SortBy = 'online-first' | 'popular' | 'recent'

const GENDER_LABELS: Record<GenderFilter, string> = {
  all: 'Tous', female: 'Femmes', male: 'Hommes', couple: 'Couples', trans: 'Trans',
}
const TYPE_LABELS: Record<TypeFilter, string> = {
  all: 'Tous', verified: 'Vérifiés ✓', premium: '★ Premium',
}

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

export default function ListingPage() {
  const [searchParams] = useSearchParams()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const [gender, setGender] = useState<GenderFilter>('all')
  const [status, setStatus] = useState<StatusFilter>(
    (searchParams.get('statut') as StatusFilter) || 'all',
  )
  const [type, setType] = useState<TypeFilter>(
    (searchParams.get('type') as TypeFilter) || 'all',
  )
  const [sortBy, setSortBy] = useState<SortBy>('online-first')
  const [minAge, setMinAge] = useState(18)
  const [maxAge, setMaxAge] = useState(65)

  const [profiles, setProfiles] = useState<ApiProfile[]>([])
  const [total, setTotal] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  const fetchProfiles = useCallback(async () => {
    setIsLoading(true)
    setError('')
    try {
      const { data } = await profilesApi.getAll({
        gender: gender !== 'all' ? gender.toUpperCase() : undefined,
        online: status === 'online' ? true : undefined,
        verified: type === 'verified' ? true : undefined,
        premium: type === 'premium' ? true : undefined,
        sortBy,
        minAge,
        maxAge,
        limit: 48,
      })
      setProfiles(data.profiles)
      setTotal(data.total)
    } catch {
      setError('Impossible de charger les profils. Vérifiez que l\'API est démarrée.')
      setProfiles([])
    } finally {
      setIsLoading(false)
    }
  }, [gender, status, type, sortBy, minAge, maxAge])

  useEffect(() => {
    fetchProfiles()
  }, [fetchProfiles])

  const resetFilters = () => {
    setGender('all')
    setStatus('all')
    setType('all')
    setMinAge(18)
    setMaxAge(65)
    setSortBy('online-first')
  }

  const FilterPanel = () => (
    <div className="space-y-7">
      {/* Genre */}
      <div>
        <h3 className="text-xs font-bold text-z-muted uppercase tracking-widest mb-3">Genre</h3>
        <div className="space-y-2">
          {(['all', 'female', 'male', 'couple', 'trans'] as GenderFilter[]).map((g) => (
            <label key={g} className="flex items-center gap-2.5 cursor-pointer group">
              <input
                type="radio" name="gender" value={g} checked={gender === g}
                onChange={() => setGender(g)} className="accent-z-violet"
              />
              <span className={`text-sm transition-colors ${gender === g ? 'text-z-violet-light font-medium' : 'text-z-muted group-hover:text-z-text'}`}>
                {GENDER_LABELS[g]}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Statut */}
      <div>
        <h3 className="text-xs font-bold text-z-muted uppercase tracking-widest mb-3">Statut</h3>
        <div className="space-y-2">
          {(['all', 'online'] as StatusFilter[]).map((s) => (
            <label key={s} className="flex items-center gap-2.5 cursor-pointer group">
              <input
                type="radio" name="status" value={s} checked={status === s}
                onChange={() => setStatus(s)} className="accent-z-violet"
              />
              <span className={`text-sm transition-colors ${status === s ? 'text-z-violet-light font-medium' : 'text-z-muted group-hover:text-z-text'}`}>
                {s === 'all' ? 'Tous' : <span className="flex items-center gap-1.5"><span className="online-dot" />En ligne</span>}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Type */}
      <div>
        <h3 className="text-xs font-bold text-z-muted uppercase tracking-widest mb-3">Type</h3>
        <div className="space-y-2">
          {(['all', 'verified', 'premium'] as TypeFilter[]).map((t) => (
            <label key={t} className="flex items-center gap-2.5 cursor-pointer group">
              <input
                type="radio" name="type" value={t} checked={type === t}
                onChange={() => setType(t)} className="accent-z-violet"
              />
              <span className={`text-sm transition-colors ${type === t ? 'text-z-violet-light font-medium' : 'text-z-muted group-hover:text-z-text'}`}>
                {TYPE_LABELS[t]}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Âge */}
      <div>
        <h3 className="text-xs font-bold text-z-muted uppercase tracking-widest mb-3">
          Âge : {minAge} – {maxAge === 65 ? '65+' : maxAge} ans
        </h3>
        <div className="space-y-2">
          <input type="range" min={18} max={65} value={minAge}
            onChange={(e) => setMinAge(Number(e.target.value))}
            className="w-full accent-z-violet" aria-label="Âge minimum"
          />
          <input type="range" min={18} max={65} value={maxAge}
            onChange={(e) => setMaxAge(Number(e.target.value))}
            className="w-full accent-z-violet" aria-label="Âge maximum"
          />
        </div>
      </div>

      <button
        onClick={resetFilters}
        className="w-full text-xs text-z-faint hover:text-z-violet-light transition-colors py-2 border border-z-border rounded-xl"
      >
        Réinitialiser les filtres
      </button>
    </div>
  )

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="heading-md text-z-text">Profils</h1>
          <p className="text-z-muted text-sm mt-1">
            {isLoading ? (
              <span className="skeleton h-4 w-24 inline-block rounded" />
            ) : (
              <>
                <span className="text-z-violet-light font-semibold">{total}</span>{' '}
                profil{total !== 1 ? 's' : ''} trouvé{total !== 1 ? 's' : ''}
              </>
            )}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortBy)}
            className="input input-sm"
            aria-label="Trier par"
          >
            <option value="online-first">En ligne d'abord</option>
            <option value="popular">Populaires</option>
            <option value="recent">Plus récents</option>
          </select>

          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="lg:hidden btn-outline btn-sm"
          >
            <SlidersHorizontal className="w-4 h-4" />
            Filtres
          </button>
        </div>
      </div>

      <div className="flex gap-6">
        {/* Sidebar desktop */}
        <aside className="hidden lg:block w-56 flex-shrink-0">
          <div
            className="p-5 rounded-2xl sticky top-24"
            style={{ background: 'rgba(13,12,30,0.8)', border: '1px solid rgba(30,27,58,0.8)' }}
          >
            <h2 className="text-xs font-bold text-z-muted uppercase tracking-widest mb-6">Filtres</h2>
            <FilterPanel />
          </div>
        </aside>

        {/* Mobile sidebar overlay */}
        {sidebarOpen && (
          <div className="lg:hidden fixed inset-0 z-40 flex">
            <div className="fixed inset-0 bg-black/70" onClick={() => setSidebarOpen(false)} />
            <div
              className="relative ml-auto w-72 h-full overflow-y-auto p-5"
              style={{ background: '#0D0C1E', borderLeft: '1px solid rgba(139,92,246,0.2)' }}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-semibold text-z-text">Filtres</h2>
                <button onClick={() => setSidebarOpen(false)} className="text-z-muted hover:text-z-text p-1">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <FilterPanel />
            </div>
          </div>
        )}

        {/* Grid */}
        <div className="flex-1">
          {error && (
            <div
              className="rounded-2xl px-5 py-4 text-sm text-amber-200/80 mb-6"
              style={{ background: 'rgba(245,158,11,0.07)', border: '1px solid rgba(245,158,11,0.2)' }}
            >
              {error}
            </div>
          )}

          {isLoading ? (
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {Array.from({ length: 12 }).map((_, i) => <ProfileSkeleton key={i} />)}
            </div>
          ) : profiles.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-5xl mb-4">🔍</div>
              <p className="text-z-muted text-lg mb-2">Aucun profil trouvé</p>
              <p className="text-z-faint text-sm">Essayez de modifier vos filtres</p>
              <button onClick={resetFilters} className="btn-outline btn-sm mt-6">
                Réinitialiser les filtres
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {profiles.map((profile) => (
                <ProfileCard key={profile.id} profile={profile} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
