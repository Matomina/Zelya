import { Shield, AlertTriangle } from 'lucide-react'
import { Link } from 'react-router-dom'

interface AgeGateProps {
  onConfirm: () => void
  onReject: () => void
}

export default function AgeGate({ onConfirm, onReject }: AgeGateProps) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{
        background: 'radial-gradient(ellipse 100% 80% at 50% 0%, rgba(109,40,217,0.25) 0%, #07070F 60%)',
      }}
    >
      {/* Grid overlay */}
      <div className="absolute inset-0 grid-pattern opacity-60 pointer-events-none" />

      <div className="relative max-w-md w-full mx-4 animate-fade-in-scale">
        {/* Glass card */}
        <div
          className="rounded-3xl border border-z-border-glow p-8 text-center"
          style={{
            background: 'rgba(13,12,30,0.92)',
            backdropFilter: 'blur(24px)',
            boxShadow: '0 0 60px rgba(139,92,246,0.2), 0 24px 80px rgba(0,0,0,0.8)',
          }}
        >
          {/* Logo */}
          <div className="mb-8">
            <h1
              className="text-5xl font-black tracking-tight gradient-text"
              style={{ letterSpacing: '-0.02em' }}
            >
              Zelya
            </h1>
            <p className="text-z-muted text-sm mt-2">Plateforme adulte premium</p>
          </div>

          {/* Shield icon */}
          <div className="flex justify-center mb-6">
            <div
              className="w-20 h-20 rounded-full flex items-center justify-center"
              style={{
                background: 'rgba(139,92,246,0.12)',
                border: '1px solid rgba(139,92,246,0.4)',
                boxShadow: '0 0 30px rgba(139,92,246,0.3)',
              }}
            >
              <Shield className="w-10 h-10 text-z-violet-light" />
            </div>
          </div>

          {/* Title */}
          <h2 className="text-2xl font-bold text-z-text mb-2">
            Accès réservé aux adultes
          </h2>
          <p className="text-z-muted text-sm mb-6">
            Vous devez avoir 18 ans ou plus pour accéder à ce site.
          </p>

          {/* Checklist */}
          <div
            className="rounded-2xl p-5 mb-6 text-left space-y-3"
            style={{ background: 'rgba(139,92,246,0.06)', border: '1px solid rgba(139,92,246,0.18)' }}
          >
            {[
              'Avoir 18 ans ou plus',
              <>Accepter les{' '}<Link to="/cgu" className="text-z-violet-light hover:underline">conditions d'utilisation</Link></>,
              'Comprendre la nature des contenus proposés',
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-3 text-sm text-z-sub">
                <span className="text-z-violet font-bold mt-0.5 flex-shrink-0">✓</span>
                <span>{item}</span>
              </div>
            ))}
          </div>

          {/* CTAs */}
          <div className="space-y-3 mb-6">
            <button
              onClick={onConfirm}
              className="w-full btn-primary py-4 text-base font-bold"
            >
              J'ai 18 ans ou plus — Entrer
            </button>
            <button
              onClick={onReject}
              className="w-full btn-ghost py-3 text-sm"
            >
              Quitter le site
            </button>
          </div>

          {/* Minor warning */}
          <div
            className="flex items-start gap-3 rounded-xl p-4 mb-6 text-left"
            style={{
              background: 'rgba(245,158,11,0.08)',
              border: '1px solid rgba(245,158,11,0.25)',
            }}
          >
            <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-amber-200/90 leading-relaxed">
              Si vous êtes mineur, quittez ce site immédiatement. L'accès aux mineurs est strictement interdit conformément à la loi française.
            </p>
          </div>

          {/* Legal links */}
          <div className="flex flex-wrap justify-center gap-4 text-xs text-z-faint">
            {[
              { to: '/mentions-legales', label: 'Mentions légales' },
              { to: '/confidentialite', label: 'Confidentialité' },
              { to: '/cgu', label: 'CGU' },
              { to: '/contact', label: 'Contact' },
            ].map((l) => (
              <Link key={l.to} to={l.to} className="hover:text-z-violet-light transition-colors">
                {l.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
