import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Heart, Settings, LogOut, BarChart2, MessageCircle, Bell } from 'lucide-react'
import ProfileCard from '@/components/ProfileCard'
import { useAuth } from '@/contexts/AuthContext'
import { favoritesApi } from '@/lib/api'
import type { ApiProfile } from '@/types/api'

export default function DashboardPage() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [favorites, setFavorites] = useState<ApiProfile[]>([])
  const [favLoading, setFavLoading] = useState(true)

  useEffect(() => {
    favoritesApi
      .getAll(1, 6)
      .then(({ data }) => {
        // API returns { data: ApiProfile[], meta: ... }
        setFavorites(data.data ?? [])
      })
      .catch(() => setFavorites([]))
      .finally(() => setFavLoading(false))
  }, [])

  const handleLogout = async () => {
    await logout()
    navigate('/')
  }

  const navItems = [
    { icon: BarChart2, label: 'Tableau de bord', to: '/espace', active: true },
    { icon: Heart, label: 'Mes favoris', to: '/espace/favoris', active: false },
    { icon: MessageCircle, label: 'Messages', to: '/messages', active: false },
    { icon: Bell, label: 'Notifications', to: '/espace/notifications', active: false },
    { icon: Settings, label: 'Paramètres', to: '/espace/parametres', active: false },
  ]

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar */}
        <aside className="lg:w-60 flex-shrink-0">
          <div
            className="p-3 rounded-2xl sticky top-24"
            style={{ background: 'rgba(13,12,30,0.8)', border: '1px solid rgba(30,27,58,0.8)' }}
          >
            {/* Avatar */}
            <div className="flex items-center gap-3 p-3 mb-3">
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm"
                style={{ background: 'linear-gradient(135deg, #6D28D9, #8B5CF6)' }}
              >
                {user?.pseudo?.[0]?.toUpperCase() ?? 'U'}
              </div>
              <div>
                <p className="text-sm font-semibold text-z-text">{user?.pseudo ?? 'Utilisateur'}</p>
                <p className="text-xs text-z-faint capitalize">{user?.role?.toLowerCase() ?? 'standard'}</p>
              </div>
            </div>

            <div className="h-px mb-3" style={{ background: 'rgba(139,92,246,0.15)' }} />

            {navItems.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all mb-1"
                style={
                  item.active
                    ? { background: 'rgba(139,92,246,0.15)', color: '#A78BFA', border: '1px solid rgba(139,92,246,0.25)' }
                    : {}
                }
              >
                <item.icon className={`w-4 h-4 ${item.active ? 'text-z-violet' : 'text-z-faint'}`} />
                <span className={item.active ? 'text-z-violet-light' : 'text-z-muted hover:text-z-text'}>
                  {item.label}
                </span>
              </Link>
            ))}

            <div className="h-px my-2" style={{ background: 'rgba(30,27,58,0.8)' }} />
            <button
              type="button"
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-z-faint hover:text-red-400 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Se déconnecter
            </button>
          </div>
        </aside>

        {/* Content */}
        <div className="flex-1 space-y-8">
          {/* Welcome */}
          <div>
            <h1 className="heading-md text-z-text mb-1">
              Bonjour,{' '}
              <span className="gradient-text">{user?.pseudo ?? 'Utilisateur'}</span> 👋
            </h1>
            <p className="text-z-muted text-sm">Bienvenue dans votre espace personnel Zelya.</p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4">
            {[
              { label: 'Favoris', value: favorites.length.toString(), icon: Heart },
              { label: 'Messages', value: '0', icon: MessageCircle },
              { label: 'Vues', value: '—', icon: BarChart2 },
            ].map((stat) => (
              <div
                key={stat.label}
                className="rounded-2xl p-5 flex flex-col gap-3"
                style={{ background: 'rgba(13,12,30,0.7)', border: '1px solid rgba(30,27,58,0.8)' }}
              >
                <stat.icon className="w-5 h-5 text-z-violet" />
                <div>
                  <p className="text-2xl font-bold text-z-text">{stat.value}</p>
                  <p className="text-z-muted text-xs">{stat.label}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Favoris */}
          <section>
            <div className="section-header mb-5">
              <h2 className="flex items-center gap-2 font-semibold text-z-text">
                <Heart className="w-4 h-4 text-z-violet" />
                Mes favoris récents
              </h2>
              <Link
                to="/profils"
                className="text-sm text-z-violet-light hover:text-z-violet-neon transition-colors"
              >
                Parcourir →
              </Link>
            </div>

            {favLoading ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="rounded-2xl overflow-hidden" style={{ background: 'rgba(18,17,43,0.85)', border: '1px solid rgba(30,27,58,0.8)' }}>
                    <div className="aspect-[4/5] skeleton" />
                    <div className="p-3 space-y-2">
                      <div className="skeleton h-4 rounded w-3/4" />
                      <div className="skeleton h-3 rounded w-1/2" />
                    </div>
                  </div>
                ))}
              </div>
            ) : favorites.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {favorites.map((p) => <ProfileCard key={p.id} profile={p} />)}
              </div>
            ) : (
              <div
                className="rounded-2xl py-12 text-center"
                style={{ background: 'rgba(13,12,30,0.5)', border: '1px solid rgba(30,27,58,0.8)' }}
              >
                <Heart className="w-10 h-10 mx-auto mb-3 text-z-faint opacity-30" />
                <p className="text-z-muted text-sm">Aucun favori pour le moment</p>
                <Link to="/profils" className="btn-outline btn-sm mt-4 inline-flex">
                  Découvrir des profils
                </Link>
              </div>
            )}
          </section>

          {/* Account settings */}
          <section
            className="rounded-2xl p-6"
            style={{ background: 'rgba(13,12,30,0.7)', border: '1px solid rgba(30,27,58,0.8)' }}
          >
            <h2 className="font-semibold text-z-text mb-5">Paramètres du compte</h2>
            <div className="space-y-0.5">
              {[
                { label: 'Email', value: user?.email ?? '—', action: 'Modifier' },
                { label: 'Pseudo', value: user?.pseudo ?? '—', action: 'Modifier' },
                { label: 'Mot de passe', value: '••••••••', action: 'Changer' },
              ].map((item) => (
                <div
                  key={item.label}
                  className="flex items-center justify-between py-3.5 border-b"
                  style={{ borderColor: 'rgba(30,27,58,0.8)' }}
                >
                  <div>
                    <p className="text-xs text-z-faint mb-0.5">{item.label}</p>
                    <p className="text-sm text-z-text font-medium">{item.value}</p>
                  </div>
                  <button
                    type="button"
                    className="text-sm text-z-violet-light hover:text-z-violet-neon transition-colors font-medium"
                  >
                    {item.action}
                  </button>
                </div>
              ))}
            </div>
            <div className="mt-5 pt-5" style={{ borderTop: '1px solid rgba(30,27,58,0.8)' }}>
              <button
                type="button"
                className="text-sm text-red-400/70 hover:text-red-400 transition-colors"
              >
                Supprimer mon compte
              </button>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
