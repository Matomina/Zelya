import { useState, useEffect } from 'react'
import { Cookie, X } from 'lucide-react'
import { Link } from 'react-router-dom'

const COOKIE_KEY = 'zelya_cookie_consent'

export default function CookieBanner() {
  const [isVisible, setIsVisible] = useState(false)
  const [showDetails, setShowDetails] = useState(false)

  useEffect(() => {
    const consent = localStorage.getItem(COOKIE_KEY)
    if (!consent) {
      const timer = setTimeout(() => setIsVisible(true), 1200)
      return () => clearTimeout(timer)
    }
  }, [])

  const handleAccept = () => {
    localStorage.setItem(COOKIE_KEY, 'essential_only')
    setIsVisible(false)
  }

  const handleRefuse = () => {
    localStorage.setItem(COOKIE_KEY, 'refused')
    setIsVisible(false)
  }

  if (!isVisible) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 p-4 animate-slide-up">
      <div
        className="max-w-4xl mx-auto rounded-2xl p-5"
        style={{
          background: 'rgba(13,12,30,0.97)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(139,92,246,0.3)',
          boxShadow: '0 -4px 40px rgba(0,0,0,0.6), 0 0 30px rgba(139,92,246,0.1)',
        }}
      >
        <div className="flex items-start gap-4">
          <div
            className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
            style={{ background: 'rgba(139,92,246,0.15)', border: '1px solid rgba(139,92,246,0.3)' }}
          >
            <Cookie className="w-4 h-4 text-z-violet-light" />
          </div>

          <div className="flex-1 min-w-0">
            <p className="text-sm text-z-text font-semibold mb-1">
              Gestion des cookies — CNIL
            </p>
            <p className="text-xs text-z-muted leading-relaxed">
              Nous utilisons uniquement des cookies strictement nécessaires au fonctionnement du site.
              Aucun cookie publicitaire ou de traçage sans votre accord.{' '}
              <Link to="/confidentialite" className="text-z-violet-light hover:underline">
                En savoir plus
              </Link>
            </p>

            {showDetails && (
              <div
                className="mt-3 rounded-xl p-3 text-xs text-z-muted space-y-2"
                style={{ background: 'rgba(7,7,15,0.8)', border: '1px solid rgba(139,92,246,0.15)' }}
              >
                {[
                  { label: 'Cookies essentiels (session, sécurité)', status: 'Toujours actifs', color: 'text-z-online' },
                  { label: 'Cookies analytiques', status: 'Non utilisés', color: 'text-z-muted' },
                  { label: 'Cookies publicitaires', status: 'Non utilisés', color: 'text-z-muted' },
                ].map((row) => (
                  <div key={row.label} className="flex items-center justify-between gap-4">
                    <span>{row.label}</span>
                    <span className={`font-medium flex-shrink-0 ${row.color}`}>{row.status}</span>
                  </div>
                ))}
              </div>
            )}

            <button
              onClick={() => setShowDetails(!showDetails)}
              className="mt-2 text-xs text-z-faint hover:text-z-violet-light transition-colors"
            >
              {showDetails ? 'Masquer les détails ↑' : 'Personnaliser ↓'}
            </button>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              onClick={handleRefuse}
              className="text-xs px-4 py-2 border border-z-border text-z-muted hover:border-z-violet/50 hover:text-z-text rounded-xl transition-all"
            >
              Refuser
            </button>
            <button
              onClick={handleAccept}
              className="text-xs px-4 py-2 font-semibold text-white rounded-xl transition-all"
              style={{
                background: 'linear-gradient(135deg, #6D28D9, #8B5CF6)',
                boxShadow: '0 0 15px rgba(139,92,246,0.35)',
              }}
            >
              Accepter
            </button>
          </div>

          <button
            onClick={handleRefuse}
            className="text-z-faint hover:text-z-text flex-shrink-0 transition-colors p-1"
            aria-label="Fermer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
