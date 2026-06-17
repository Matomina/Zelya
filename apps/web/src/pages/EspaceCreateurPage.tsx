import { Link } from 'react-router-dom'
import { Sparkles, TrendingUp, Shield, DollarSign, Camera, AlertTriangle } from 'lucide-react'

export default function EspaceCreateurPage() {
  const features = [
    {
      icon: Camera,
      title: 'Gérez votre profil',
      desc: 'Photos, description, tarifs, disponibilités — tout en un seul endroit.',
    },
    {
      icon: TrendingUp,
      title: 'Suivez vos statistiques',
      desc: 'Vues, contacts, favoris : visualisez votre performance en temps réel.',
    },
    {
      icon: DollarSign,
      title: 'Monétisez votre contenu',
      desc: 'Abonnements, contenus premium, messagerie payante.',
    },
    {
      icon: Shield,
      title: 'Sécurisé & conforme',
      desc: 'Vérification d\'identité, conformité ARCOM, protection de vos données.',
    },
  ]

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12">
      {/* Hero */}
      <div className="text-center mb-14">
        <div
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold mb-6 text-z-violet-light"
          style={{ background: 'rgba(139,92,246,0.12)', border: '1px solid rgba(139,92,246,0.3)' }}
        >
          <Sparkles className="w-4 h-4" />
          Espace Créateur
        </div>

        <h1 className="heading-xl text-z-text mb-5 text-balance">
          Créez, gérez et{' '}
          <span className="gradient-text">monétisez</span>
          <br />votre contenu
        </h1>
        <p className="text-z-muted text-lg max-w-xl mx-auto leading-relaxed mb-8">
          Rejoignez la communauté de créateurs Zelya. Publiez votre profil, gérez vos réservations et développez votre audience.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/inscription" className="btn-primary btn-lg">
            <Sparkles className="w-5 h-5" />
            Commencer gratuitement
          </Link>
          <Link to="/connexion" className="btn-outline btn-lg">
            J'ai déjà un compte
          </Link>
        </div>
      </div>

      {/* Features */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-14">
        {features.map((feat) => (
          <div
            key={feat.title}
            className="rounded-2xl p-6 flex gap-4"
            style={{
              background: 'rgba(13,12,30,0.7)',
              border: '1px solid rgba(30,27,58,0.8)',
              transition: 'border-color 0.2s',
            }}
            onMouseEnter={(e) => {
              const el = e.currentTarget as HTMLElement
              el.style.borderColor = 'rgba(139,92,246,0.35)'
              el.style.boxShadow = '0 0 20px rgba(139,92,246,0.08)'
            }}
            onMouseLeave={(e) => {
              const el = e.currentTarget as HTMLElement
              el.style.borderColor = 'rgba(30,27,58,0.8)'
              el.style.boxShadow = ''
            }}
          >
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: 'rgba(139,92,246,0.12)', border: '1px solid rgba(139,92,246,0.25)' }}
            >
              <feat.icon className="w-6 h-6 text-z-violet-light" />
            </div>
            <div>
              <h3 className="font-semibold text-z-text mb-2">{feat.title}</h3>
              <p className="text-z-muted text-sm leading-relaxed">{feat.desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Legal TODO */}
      <div
        className="rounded-2xl p-6"
        style={{ background: 'rgba(245,158,11,0.07)', border: '1px solid rgba(245,158,11,0.2)' }}
      >
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-amber-300 font-semibold text-sm mb-2">TODO — Points légaux à valider avant production :</p>
            <ul className="text-amber-200/80 text-xs leading-relaxed space-y-1">
              <li>• Vérification d'identité (KYC) des créateurs conforme ARCOM</li>
              <li>• Contrat créateur (CGV spécifiques, partage de revenus)</li>
              <li>• Prestataire de paiement compatible adulte (Stripe réservé à certains comptes, alternatives : CCBill, Epoch)</li>
              <li>• Statut juridique adapté à la monétisation (micro-entreprise, société)</li>
              <li>• Obligations fiscales des créateurs (déclaration, TVA si applicable)</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
