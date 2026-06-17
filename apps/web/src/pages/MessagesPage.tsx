import { Link } from 'react-router-dom'
import { MessageCircle, Lock, LogIn } from 'lucide-react'

export default function MessagesPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16 text-center">
      <div
        className="max-w-md mx-auto rounded-3xl p-10"
        style={{
          background: 'rgba(13,12,30,0.85)',
          border: '1px solid rgba(139,92,246,0.25)',
          boxShadow: '0 0 60px rgba(139,92,246,0.1)',
        }}
      >
        {/* Icon */}
        <div
          className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6"
          style={{ background: 'rgba(139,92,246,0.12)', border: '1px solid rgba(139,92,246,0.3)', boxShadow: '0 0 25px rgba(139,92,246,0.2)' }}
        >
          <MessageCircle className="w-10 h-10 text-z-violet-light" />
        </div>

        <h1 className="heading-sm text-z-text mb-3">Messagerie privée</h1>
        <p className="text-z-muted text-sm leading-relaxed mb-8">
          Échangez en privé avec vos profils favoris.<br />
          Connectez-vous pour accéder à vos messages.
        </p>

        <div className="flex flex-col gap-3">
          <Link to="/connexion" className="btn-primary py-4">
            <LogIn className="w-4 h-4" />
            Se connecter
          </Link>
          <Link to="/inscription" className="btn-outline py-3">
            Créer un compte
          </Link>
        </div>

        <div className="flex items-center justify-center gap-2 mt-8 text-xs text-z-faint">
          <Lock className="w-3.5 h-3.5" />
          <span>Messages chiffrés de bout en bout</span>
        </div>

        {/* TODO note */}
        <div
          className="mt-6 rounded-xl p-3 text-left"
          style={{ background: 'rgba(245,158,11,0.06)', border: '1px solid rgba(245,158,11,0.15)' }}
        >
          <p className="text-xs text-amber-200/70 leading-relaxed">
            <strong className="text-amber-300">TODO :</strong> Implémenter la messagerie temps réel (WebSocket / NestJS Gateway) après validation du back-end.
          </p>
        </div>
      </div>
    </div>
  )
}
