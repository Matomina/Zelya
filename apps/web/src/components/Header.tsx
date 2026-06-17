import { useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { Search, Menu, X, LogIn, Zap, LayoutDashboard, LogOut } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const navigate = useNavigate()
  const { user, isAuthenticated, logout } = useAuth()

  const navLinks = [
    { to: '/', label: 'Accueil' },
    { to: '/profils', label: 'Profils' },
    { to: '/en-ligne', label: 'En ligne', hot: true },
    { to: '/recherche', label: 'Recherche' },
  ]

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/recherche?q=${encodeURIComponent(searchQuery.trim())}`)
      setMobileMenuOpen(false)
    }
  }

  const handleLogout = async () => {
    await logout()
    navigate('/')
    setMobileMenuOpen(false)
  }

  return (
    <header
      className="sticky top-0 z-30"
      style={{
        background: 'rgba(7,7,15,0.92)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(139,92,246,0.2)',
        boxShadow: '0 4px 30px rgba(0,0,0,0.5)',
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-2 flex-shrink-0 group"
            aria-label="Zelya — Accueil"
          >
            <span
              className="text-2xl font-black tracking-tight gradient-text group-hover:opacity-90 transition-opacity"
              style={{ letterSpacing: '-0.02em' }}
            >
              Zelya
            </span>
            <span
              className="hidden sm:inline-block text-xs text-z-violet-light px-1.5 py-0.5 rounded"
              style={{ background: 'rgba(139,92,246,0.15)', border: '1px solid rgba(139,92,246,0.3)' }}
            >
              18+
            </span>
          </Link>

          {/* Navigation — desktop */}
          <nav className="hidden md:flex items-center gap-1" aria-label="Navigation principale">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === '/'}
                className={({ isActive }) =>
                  `relative px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                    isActive ? 'text-z-violet-light' : 'text-z-muted hover:text-z-text'
                  }`
                }
                style={({ isActive }) =>
                  isActive
                    ? { background: 'rgba(139,92,246,0.12)', boxShadow: '0 0 12px rgba(139,92,246,0.15)' }
                    : {}
                }
              >
                {link.hot && (
                  <Zap
                    className="inline w-3 h-3 mr-1 text-z-online"
                    style={{ filter: 'drop-shadow(0 0 4px rgba(0,245,144,0.8))' }}
                  />
                )}
                {link.label}
              </NavLink>
            ))}
          </nav>

          {/* Search — desktop */}
          <form
            onSubmit={handleSearch}
            className="hidden lg:flex items-center gap-2 flex-1 max-w-xs mx-4"
          >
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-z-faint" />
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Ville, pseudo..."
                className="input input-sm pl-9"
                aria-label="Rechercher un profil"
              />
            </div>
          </form>

          {/* Actions */}
          <div className="flex items-center gap-2">
            {isAuthenticated && user ? (
              <>
                <Link
                  to="/espace"
                  className="hidden sm:flex items-center gap-1.5 btn-ghost text-sm"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  <span className="max-w-[80px] truncate">{user.pseudo}</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="hidden sm:flex items-center gap-1.5 text-sm text-z-muted hover:text-red-400 transition-colors px-3 py-2"
                  aria-label="Se déconnecter"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/connexion"
                  className="hidden sm:flex items-center gap-1.5 btn-ghost text-sm"
                >
                  <LogIn className="w-4 h-4" />
                  <span>Connexion</span>
                </Link>
                <Link to="/inscription" className="hidden sm:flex btn-primary text-sm py-2 px-5">
                  S'inscrire
                </Link>
              </>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-z-muted hover:text-z-text rounded-lg transition-colors"
              aria-label={mobileMenuOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div
          className="md:hidden border-t border-z-border"
          style={{ background: 'rgba(7,7,15,0.97)', backdropFilter: 'blur(20px)' }}
        >
          <div className="max-w-7xl mx-auto px-4 py-4 space-y-2">
            {/* Mobile search */}
            <form onSubmit={handleSearch} className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-z-faint" />
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Rechercher..."
                className="input input-sm pl-9"
              />
            </form>

            {/* Mobile nav */}
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === '/'}
                onClick={() => setMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `flex items-center px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                    isActive ? 'text-z-violet-light' : 'text-z-muted hover:text-z-text'
                  }`
                }
                style={({ isActive }) => (isActive ? { background: 'rgba(139,92,246,0.1)' } : {})}
              >
                {link.hot && <Zap className="w-3.5 h-3.5 mr-2 text-z-online" />}
                {link.label}
              </NavLink>
            ))}

            {/* Mobile auth */}
            <div className="border-t border-z-border pt-3 flex flex-col gap-2">
              {isAuthenticated && user ? (
                <>
                  <Link
                    to="/espace"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-2 px-4 py-3 text-sm text-z-violet-light rounded-xl"
                    style={{ background: 'rgba(139,92,246,0.08)' }}
                  >
                    <LayoutDashboard className="w-4 h-4" />
                    Mon espace ({user.pseudo})
                  </Link>
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="flex items-center gap-2 px-4 py-3 text-sm text-z-muted hover:text-red-400 transition-colors rounded-xl text-left"
                  >
                    <LogOut className="w-4 h-4" />
                    Se déconnecter
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/connexion"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-2 px-4 py-3 text-sm text-z-muted hover:text-z-text rounded-xl transition-colors"
                  >
                    <LogIn className="w-4 h-4" />
                    Connexion
                  </Link>
                  <Link
                    to="/inscription"
                    onClick={() => setMobileMenuOpen(false)}
                    className="btn-primary text-sm text-center py-3"
                  >
                    Créer un compte
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
