import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Search, SlidersHorizontal } from 'lucide-react'
import ProfileCard from '@/components/ProfileCard'
import { searchApi } from '@/lib/api'
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

export default function SearchPage() {
  const [searchParams] = useSearchParams()
  const [query, setQuery] = useState(searchParams.get('q') || '')
  const [gender, setGender] = useState('all')
  const [status, setStatus] = useState('all')
  const [minAge, setMinAge] = useState(18)
  const [maxAge, setMaxAge] = useState(65)

  const [results, setResults] = useState<ApiProfile[]>([])
  const [total, setTotal] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [hasSearched, setHasSearched] = useState(false)
  const [error, setError] = useState('')

  const doSearch = async (q: string) => {
    if (!q.trim()) return
    setIsLoading(true)
    setHasSearched(true)
    setError('')
    try {
      const { data } = await searchApi.search({
        q,
        gender: gender !== 'all' ? gender.toUpperCase() : undefined,
        online: status === 'online' ? true : undefined,
        minAge,
        maxAge,
      })
      setResults(data.profiles)
      setTotal(data.total)
    } catch {
      setError('Impossible d\'effectuer la recherche. Vérifiez que l\'API est démarrée.')
      setResults([])
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    const q = searchParams.get('q')
    if (q) doSearch(q)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    doSearch(query)
  }

  const reset = () => {
    setQuery('')
    setGender('all')
    setStatus('all')
    setMinAge(18)
    setMaxAge(65)
    setResults([])
    setHasSearched(false)
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
      <h1 className="heading-md text-z-text mb-2">Recherche avancée</h1>
      <p className="text-z-muted text-sm mb-8">Trouvez le profil qui vous correspond</p>

      {/* Form */}
      <form
        onSubmit={handleSearch}
        className="rounded-2xl p-6 mb-8"
        style={{ background: 'rgba(13,12,30,0.8)', border: '1px solid rgba(139,92,246,0.2)' }}
      >
        {/* Main query */}
        <div className="mb-6">
          <label htmlFor="search-query" className="block text-sm font-medium text-z-sub mb-2">
            Pseudo, ville ou région
          </label>
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-z-faint" />
            <input
              id="search-query"
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Ex : Paris, Léa, Rhône..."
              className="input pl-12 py-4 text-base"
            />
          </div>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-z-sub mb-2">Genre</label>
            <select value={gender} onChange={(e) => setGender(e.target.value)} className="input">
              <option value="all">Tous</option>
              <option value="female">Femmes</option>
              <option value="male">Hommes</option>
              <option value="couple">Couples</option>
              <option value="trans">Trans</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-z-sub mb-2">Statut</label>
            <select value={status} onChange={(e) => setStatus(e.target.value)} className="input">
              <option value="all">Tous</option>
              <option value="online">En ligne</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-z-sub mb-2">
              Âge min : {minAge} ans
            </label>
            <input
              type="range"
              min={18}
              max={65}
              value={minAge}
              onChange={(e) => setMinAge(Number(e.target.value))}
              className="w-full accent-z-violet mt-3"
              aria-label="Âge minimum"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-z-sub mb-2">
              Âge max : {maxAge === 65 ? '65+' : maxAge} ans
            </label>
            <input
              type="range"
              min={18}
              max={65}
              value={maxAge}
              onChange={(e) => setMaxAge(Number(e.target.value))}
              className="w-full accent-z-violet mt-3"
              aria-label="Âge maximum"
            />
          </div>
        </div>

        <div className="flex gap-3">
          <button type="submit" className="btn-primary py-3 px-8">
            <Search className="w-4 h-4" />
            Rechercher
          </button>
          {hasSearched && (
            <button type="button" onClick={reset} className="btn-ghost py-3 px-6">
              Réinitialiser
            </button>
          )}
        </div>
      </form>

      {/* Error */}
      {error && (
        <div
          className="rounded-2xl px-5 py-4 text-sm text-amber-200/80 mb-6"
          style={{ background: 'rgba(245,158,11,0.07)', border: '1px solid rgba(245,158,11,0.2)' }}
        >
          {error}
        </div>
      )}

      {/* Results */}
      {isLoading ? (
        <>
          <p className="text-z-muted text-sm mb-6">Recherche en cours...</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {Array.from({ length: 10 }).map((_, i) => <ProfileSkeleton key={i} />)}
          </div>
        </>
      ) : hasSearched ? (
        <>
          <div className="flex items-center gap-2 mb-6">
            <SlidersHorizontal className="w-4 h-4 text-z-faint" />
            <p className="text-z-muted text-sm">
              <span className="text-z-violet-light font-semibold">{total}</span>{' '}
              résultat{total !== 1 ? 's' : ''} pour{' '}
              <span className="text-z-text">« {query} »</span>
            </p>
          </div>

          {results.length === 0 ? (
            <div
              className="text-center py-20 rounded-2xl"
              style={{ background: 'rgba(13,12,30,0.6)', border: '1px solid rgba(30,27,58,0.8)' }}
            >
              <div className="text-5xl mb-4">🔍</div>
              <p className="text-z-muted text-lg mb-2">Aucun profil trouvé</p>
              <p className="text-z-faint text-sm">Essayez avec un autre terme ou moins de filtres</p>
              <button type="button" onClick={reset} className="btn-outline btn-sm mt-6">
                Nouvelle recherche
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {results.map((profile) => (
                <ProfileCard key={profile.id} profile={profile} />
              ))}
            </div>
          )}
        </>
      ) : (
        <div
          className="text-center py-20 rounded-2xl"
          style={{ background: 'rgba(13,12,30,0.4)', border: '1px solid rgba(30,27,58,0.5)' }}
        >
          <Search className="w-12 h-12 mx-auto mb-4 text-z-faint opacity-30" />
          <p className="text-z-muted">Entrez un terme de recherche pour commencer</p>
        </div>
      )}
    </div>
  )
}
