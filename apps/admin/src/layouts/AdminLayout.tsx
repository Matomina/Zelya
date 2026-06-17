import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard, Users, Shield, AlertTriangle,
  ImageIcon, FileText, LogOut, Zap,
} from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'

const navItems = [
  { to: '/',           icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/users',      icon: Users,           label: 'Utilisateurs' },
  { to: '/profiles',   icon: Shield,          label: 'Profils' },
  { to: '/reports',    icon: AlertTriangle,   label: 'Signalements' },
  { to: '/media',      icon: ImageIcon,       label: 'Médias' },
  { to: '/legal',      icon: FileText,        label: 'Conformité' },
]

export default function AdminLayout() {
  const { user, logout } = useAuth()

  return (
    <div className="flex h-screen bg-z-bg overflow-hidden">
      {/* Sidebar */}
      <aside className="w-60 flex-shrink-0 bg-z-surface border-r border-z-border flex flex-col">
        {/* Logo */}
        <div className="h-16 flex items-center px-5 border-b border-z-border">
          <div className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-z-violet" />
            <span className="font-bold text-z-text tracking-wide">Zelya</span>
            <span className="text-xs text-z-muted ml-1 bg-z-violet/20 text-z-violet px-1.5 py-0.5 rounded">
              Admin
            </span>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {navItems.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              className={({ isActive }) =>
                `sidebar-link ${isActive ? 'active' : ''}`
              }
            >
              <Icon className="w-4 h-4 flex-shrink-0" />
              <span className="text-sm font-medium">{label}</span>
            </NavLink>
          ))}
        </nav>

        {/* User footer */}
        <div className="p-4 border-t border-z-border">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 rounded-full bg-z-violet/20 flex items-center justify-center">
              <span className="text-xs font-bold text-z-violet">
                {user?.pseudo?.[0]?.toUpperCase() ?? 'A'}
              </span>
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium text-z-text truncate">{user?.pseudo}</p>
              <p className="text-xs text-z-muted truncate">{user?.role}</p>
            </div>
          </div>
          <button
            onClick={logout}
            className="sidebar-link w-full text-z-danger hover:text-z-danger hover:bg-z-danger/10"
          >
            <LogOut className="w-4 h-4" />
            <span className="text-sm font-medium">Déconnexion</span>
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  )
}
