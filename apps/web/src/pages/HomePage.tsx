import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Search, MapPin, Shield, Zap, Star, TrendingUp } from 'lucide-react'
import ProfileCard from '@/components/ProfileCard'
import { CITIES, DEPARTMENTS } from '@/data/profiles'
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

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [geoTab, setGeoTab] = useState<'villes' | 'departements'>('villes')
  const navigate = useNavigate()

  const [onlineProfiles, setOnlineProfiles] = useState<ApiProfile[]>([])
  const [recentProfiles, setRecentProfiles] = useState<ApiProfile[]>([])
  const [popularProfiles, setPopularProfiles] = useState<ApiProfile[]>([])
  const [onlineCount, setOnlineCount] = useState(0)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      profilesApi.getAll({ online: true, limit: 4 }),
      profilesApi.getAll({ sortBy: 'recent', limit: 4 }),
      profilesApi.getAll({ sortBy: 'popular', limit: 4 }),
    ])
      .then(([onlineRes, recentRes, popularRes]) => {
        setOnlineProfiles(onlineRes.data.profiles)
        setOnlineCount(onlineRes.data.total)
        setRecentProfiles(recentRes.data.profiles)
        setPopularProfiles(popularRes.data.profiles)
      })
      .catch(() => {
        // Silent fail — page still loads with empty sections
      })
      .finally(() => setIsLoading(false))
  }, [])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/recherche?q=${encodeURIComponent(searchQuery.trim())}`)
    }
  }

  const skeletons = (n: number) => (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-4">
      {Array.from({ length: n }).map((_, i) => <ProfileSkeleton key={i} />)}
    </div>
  )

  return (
    <div>
      {/* ── Hero ──────────────────────────────────────────────── */}
      <section className="relative overflow-hidden">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'radial-gradient(ellipse 90% 60% at 50% -5%, rgba(139,92,246,0.22) 0%, transparent 65%), radial-gradient(ellipse 50% 40% at 80% 100%, rgba(109,40,217,0.12) 0%, transparent 60%)',
          }}
        />
        <div className="absolute inset-0 grid-pattern opacity-50 pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-20 sm:py-28 relative">
          <div className="max-w-2xl animate-slide-up">
            {/* Badge online count */}
            <div
              className="inline-flex items-center gap-2 mb-6 px-4 py-2 rounded-full text-xs font-semibold text-z-violet-light"
              style={{ background: 'rgba(139,92,246,0.12)', border: '1px solid rgba(139,92,246,0.3)' }}
            >
              <span className="online-dot" />
              {onlineCount > 0 ? `${onlineCount} profils en ligne maintenant` : 'Profils en ligne maintenant'}
            </div>

            <h1 className="heading-xl text-z-text mb-5 text-balance leading-[1.08]">
              Découvrez des profils{' '}
              <span className="gradient-text glow-text">premium</span>
            </h1>
            <p className="text-z-muted text-lg mb-8 leading-relaxed max-w-xl">
              La plateforme adulte sécurisée, vérifiée et légale pour la France et l'Union Européenne.
            </p>

            {/* Search bar */}
            <form onSubmit={handleSearch} className="flex gap-3 max-w-lg">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-z-faint" />
                <input
                  type="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Ville, pseudo, région..."
                  className="input pl-12 py-4 text-base"
                  aria-label="Rechercher un profil"
                />
              </div>
              <button type="submit" className="btn-primary px-7">
                <Search className="w-4 h-4 sm:hidden" />
                <span className="hidden sm:inline">Rechercher</span>
              </button>
            </form>

            {/* Quick filters */}
            <div className="flex flex-wrap gap-2 mt-5">
              <Link
                to="/en-ligne"
                className="text-xs font-medium px-3.5 py-2 rounded-full transition-all text-z-online hover:bg-z-online/10 border border-z-online/30 hover:border-z-online/60"
              >
                ● En ligne {onlineCount > 0 ? `(${onlineCount})` : ''}
              </Link>
              <Link
                to="/profils?type=verified"
                className="text-xs font-medium px-3.5 py-2 rounded-full transition-all text-z-violet-light hover:bg-z-violet/10 border border-z-border-glow hover:border-z-violet/50"
              >
                ✓ Vérifiés
              </Link>
              <Link
                to="/profils?type=premium"
                className="text-xs font-medium px-3.5 py-2 rounded-full transition-all text-amber-300 hover:bg-amber-400/10 border border-amber-400/25 hover:border-amber-400/50"
              >
                ★ Premium
              </Link>
              <Link
                to="/nouveaux"
                className="text-xs font-medium px-3.5 py-2 rounded-full transition-all text-pink-300 hover:bg-pink-500/10 border border-pink-500/25 hover:border-pink-400/50"
              >
                ✦ Nouveaux
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Stats bar ─────────────────────────────────────────── */}
      <div className="divider-glow mx-0" style={{ margin: 0 }} />
      <section style={{ background: 'rgba(13,12,30,0.6)', borderBottom: '1px solid rgba(139,92,246,0.12)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-5">
          <div className="grid grid-cols-3 gap-4 sm:gap-8 text-center">
            {[
              { value: '2 400+', label: 'Profils actifs' },
              { value: '85+', label: 'Villes couvertes' },
              { value: '100%', label: 'Légal & Sécurisé' },
            ].map((stat) => (
              <div key={stat.label}>
                <p className="text-2xl sm:text-3xl font-black gradient-text">{stat.value}</p>
                <p className="text-z-muted text-xs sm:text-sm mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 space-y-16">

        {/* ── Géo nav ───────────────────────────────────────────── */}
        <section>
          <div className="section-header">
            <h2 className="section-title flex items-center gap-2">
              <MapPin className="w-5 h-5 text-z-violet" />
              Trouver près de vous
            </h2>
          </div>

          <div className="flex gap-2 mb-5">
            {(['villes', 'departements'] as const).map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setGeoTab(tab)}
                className={`px-5 py-2 rounded-xl text-sm font-medium transition-all ${
                  geoTab === tab ? 'text-white' : 'text-z-muted hover:text-z-text'
                }`}
                style={
                  geoTab === tab
                    ? { background: 'linear-gradient(135deg, #6D28D9, #8B5CF6)', boxShadow: '0 0 15px rgba(139,92,246,0.3)' }
                    : { background: 'rgba(13,12,30,0.6)', border: '1px solid rgba(30,27,58,0.8)' }
                }
              >
                {tab === 'villes' ? 'Villes' : 'Départements'}
              </button>
            ))}
          </div>

          {geoTab === 'villes' && (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
              {CITIES.map((city) => (
                <Link
                  key={city.name}
                  to={`/recherche?q=${encodeURIComponent(city.name)}`}
                  className="group flex items-center justify-between px-3 py-2.5 rounded-xl transition-all text-sm"
                  style={{ background: 'rgba(13,12,30,0.7)', border: '1px solid rgba(30,27,58,0.7)' }}
                  onMouseEnter={(e) => {
                    const el = e.currentTarget as HTMLElement
                    el.style.borderColor = 'rgba(139,92,246,0.4)'
                    el.style.boxShadow = '0 0 10px rgba(139,92,246,0.1)'
                  }}
                  onMouseLeave={(e) => {
                    const el = e.currentTarget as HTMLElement
                    el.style.borderColor = 'rgba(30,27,58,0.7)'
                    el.style.boxShadow = ''
                  }}
                >
                  <span className="text-z-sub group-hover:text-z-violet-light transition-colors truncate">
                    {city.name}
                  </span>
                  <span className="text-xs text-z-faint ml-2 flex-shrink-0">
                    {city.count.toLocaleString('fr-FR')}
                  </span>
                </Link>
              ))}
            </div>
          )}

          {geoTab === 'departements' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2">
              {DEPARTMENTS.map((dept) => (
                <Link
                  key={dept.name}
                  to={`/recherche?q=${encodeURIComponent(dept.name)}`}
                  className="group flex items-center justify-between px-3 py-2.5 rounded-xl transition-all text-sm"
                  style={{ background: 'rgba(13,12,30,0.7)', border: '1px solid rgba(30,27,58,0.7)' }}
                  onMouseEnter={(e) => {
                    const el = e.currentTarget as HTMLElement
                    el.style.borderColor = 'rgba(139,92,246,0.4)'
                  }}
                  onMouseLeave={(e) => {
                    const el = e.currentTarget as HTMLElement
                    el.style.borderColor = 'rgba(30,27,58,0.7)'
                  }}
                >
                  <span className="text-z-sub group-hover:text-z-violet-light transition-colors truncate">
                    {dept.name}
                  </span>
                  <span className="text-xs text-z-faint ml-2 flex-shrink-0">
                    {dept.count.toLocaleString('fr-FR')}
                  </span>
                </Link>
              ))}
            </div>
          )}

          <div className="mt-4">
            <Link to="/profils" className="text-sm text-z-violet-light hover:text-z-violet-neon transition-colors">
              Voir tous les profils →
            </Link>
          </div>
        </section>

        {/* ── En ligne ──────────────────────────────────────────── */}
        <section>
          <div className="section-header">
            <h2 className="section-title flex items-center gap-2">
              <Zap
                className="w-5 h-5 text-z-online"
                style={{ filter: 'drop-shadow(0 0 6px rgba(0,245,144,0.8))' }}
              />
              En ligne maintenant
              {onlineCount > 0 && (
                <span
                  className="text-xs font-semibold px-2 py-0.5 rounded-full ml-1 text-z-online"
                  style={{ background: 'rgba(0,245,144,0.1)', border: '1px solid rgba(0,245,144,0.25)' }}
                >
                  {onlineCount}
                </span>
              )}
            </h2>
            <Link to="/en-ligne" className="text-sm text-z-violet-light hover:text-z-violet-neon transition-colors">
              Voir tout →
            </Link>
          </div>
          {isLoading ? skeletons(4) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-4">
              {onlineProfiles.map((profile) => (
                <ProfileCard key={profile.id} profile={profile} />
              ))}
            </div>
          )}
        </section>

        {/* ── Nouveaux profils ──────────────────────────────────── */}
        <section>
          <div className="section-header">
            <h2 className="section-title flex items-center gap-2">
              <Star className="w-5 h-5 text-amber-400" />
              Nouveaux profils
            </h2>
            <Link to="/nouveaux" className="text-sm text-z-violet-light hover:text-z-violet-neon transition-colors">
              Voir tout →
            </Link>
          </div>
          {isLoading ? skeletons(4) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-4">
              {recentProfiles.map((profile) => (
                <ProfileCard key={profile.id} profile={profile} />
              ))}
            </div>
          )}
        </section>

        {/* ── Populaires ────────────────────────────────────────── */}
        <section>
          <div className="section-header">
            <h2 className="section-title flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-z-violet" />
              Profils populaires
            </h2>
            <Link to="/profils" className="text-sm text-z-violet-light hover:text-z-violet-neon transition-colors">
              Voir tout →
            </Link>
          </div>
          {isLoading ? skeletons(4) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-4">
              {popularProfiles.map((profile) => (
                <ProfileCard key={profile.id} profile={profile} />
              ))}
            </div>
          )}
        </section>

        {/* ── Reassurance ───────────────────────────────────────── */}
        <section
          className="rounded-3xl p-8 sm:p-10"
          style={{
            background: 'rgba(13,12,30,0.8)',
            border: '1px solid rgba(139,92,246,0.2)',
            boxShadow: '0 0 60px rgba(139,92,246,0.08)',
          }}
        >
          <div className="flex items-center gap-3 mb-8">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ background: 'rgba(139,92,246,0.15)', border: '1px solid rgba(139,92,246,0.3)' }}
            >
              <Shield className="w-5 h-5 text-z-violet-light" />
            </div>
            <h2 className="heading-sm text-z-text">Zelya s'engage pour votre sécurité</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { emoji: '✅', title: 'Profils vérifiés', desc: 'Notre équipe vérifie manuellement les profils pour garantir leur authenticité.' },
              { emoji: '🔒', title: 'Données protégées', desc: 'Vos données personnelles sont protégées conformément au RGPD.' },
              { emoji: '🚨', title: 'Signalement facile', desc: 'Signalez tout contenu problématique en un clic. Traitement sous 24h.' },
              { emoji: '⚖️', title: '100% légal', desc: 'Zelya respecte la législation française et européenne en vigueur.' },
            ].map((item) => (
              <div
                key={item.title}
                className="flex flex-col gap-3 p-5 rounded-2xl"
                style={{ background: 'rgba(7,7,15,0.5)', border: '1px solid rgba(30,27,58,0.8)' }}
              >
                <div className="text-3xl">{item.emoji}</div>
                <h3 className="font-semibold text-z-text text-sm">{item.title}</h3>
                <p className="text-z-muted text-xs leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}
