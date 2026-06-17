import { Link } from 'react-router-dom'
import { Shield, AlertTriangle, Flag } from 'lucide-react'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer
      className="mt-auto border-t"
      style={{
        borderColor: 'rgba(139,92,246,0.15)',
        background: 'linear-gradient(180deg, rgba(13,12,30,0.8) 0%, #07070F 100%)',
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-14">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link to="/" className="inline-block mb-4">
              <span className="text-3xl font-black gradient-text" style={{ letterSpacing: '-0.02em' }}>
                Zelya
              </span>
            </Link>
            <p className="text-z-muted text-sm leading-relaxed max-w-sm mb-5">
              Plateforme adulte premium, légale et sécurisée pour la France et l'Union Européenne.
              Conforme ARCOM, RGPD et CNIL.
            </p>

            {/* 18+ warning */}
            <div
              className="inline-flex items-center gap-2 rounded-xl px-4 py-2.5"
              style={{ background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.2)' }}
            >
              <AlertTriangle className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
              <span className="text-xs text-amber-300/90 font-medium">
                Accès réservé aux personnes majeures (18+)
              </span>
            </div>

            {/* Compliance badges */}
            <div className="flex flex-wrap gap-2 mt-4">
              {['RGPD', 'ARCOM', 'CNIL'].map((badge) => (
                <span
                  key={badge}
                  className="text-xs text-z-faint px-2.5 py-1 rounded-lg font-medium"
                  style={{ background: 'rgba(139,92,246,0.08)', border: '1px solid rgba(139,92,246,0.15)' }}
                >
                  {badge}
                </span>
              ))}
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="text-z-text font-semibold text-sm mb-5">Navigation</h3>
            <ul className="space-y-3">
              {[
                { to: '/', label: 'Accueil' },
                { to: '/profils', label: 'Profils' },
                { to: '/en-ligne', label: 'En ligne' },
                { to: '/recherche', label: 'Recherche' },
                { to: '/connexion', label: 'Connexion' },
                { to: '/inscription', label: 'Inscription' },
              ].map((l) => (
                <li key={l.to}>
                  <Link
                    to={l.to}
                    className="text-z-muted hover:text-z-violet-light text-sm transition-colors"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-z-text font-semibold text-sm mb-5">Légal & Sécurité</h3>
            <ul className="space-y-3">
              {[
                { to: '/mentions-legales', label: 'Mentions légales' },
                { to: '/confidentialite', label: 'Confidentialité (RGPD)' },
                { to: '/cgu', label: 'CGU' },
                { to: '/contact', label: 'Contact' },
              ].map((l) => (
                <li key={l.to}>
                  <Link
                    to={l.to}
                    className="text-z-muted hover:text-z-violet-light text-sm transition-colors"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  to="/contact"
                  className="flex items-center gap-1.5 text-z-muted hover:text-red-400 text-sm transition-colors"
                >
                  <Flag className="w-3.5 h-3.5" />
                  Signaler un contenu
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="divider-glow mt-10 mb-6" />

        {/* Bottom bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-z-faint text-xs">
            © {currentYear} Zelya. Tous droits réservés. Site réservé aux adultes (18+).
          </p>
          <div className="flex items-center gap-2 text-xs text-z-faint">
            <Shield className="w-3 h-3 text-z-violet/50" />
            <span>Données protégées — Conforme RGPD / CNIL</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
