import { ExternalLink, CheckCircle2, XCircle, AlertTriangle } from 'lucide-react'

interface ComplianceItem {
  label: string
  status: 'done' | 'todo' | 'warn'
  detail: string
  link?: string
}

const items: ComplianceItem[] = [
  { label: 'Mentions légales', status: 'warn', detail: 'Page créée — validation par avocat requise avant mise en production', link: 'https://www.service-public.fr/professionnels-entreprises/vosdroits/F31228' },
  { label: 'CGU', status: 'warn', detail: 'Placeholder — rédaction par juriste spécialisé numérique requise' },
  { label: 'Politique de confidentialité (RGPD)', status: 'warn', detail: 'Placeholder — validation DPO ou juriste RGPD requise' },
  { label: 'Bannière cookies (CNIL)', status: 'done', detail: 'Implémentée avec consentement explicite et catégories' },
  { label: 'Modèle de consentement DB', status: 'done', detail: 'Table Consent en base — log de chaque consentement avec version et IP' },
  { label: 'Suppression soft (RGPD)', status: 'done', detail: 'Soft delete avec anonymisation email/pseudo' },
  { label: 'Vérification d'âge ARCOM', status: 'todo', detail: 'Non implémentée — prestataire certifié requis (Yoti, IDnow, VerifyMy)', link: 'https://www.arcom.fr/nos-ressources/espace-juridique/les-textes-reglementaires/la-loi-du-30-juillet-2020' },
  { label: 'Audit logs sécurité', status: 'done', detail: 'Table AuditLog — trace toutes les actions sensibles' },
  { label: 'Signalement de contenu', status: 'done', detail: 'Module reports — signalement par utilisateur + modération admin' },
  { label: 'Procédure de retrait LCEN', status: 'todo', detail: 'Formulaire de notification de contenu illicite à implémenter' },
  { label: 'Paiement adulte (KYC, PSP)', status: 'todo', detail: 'Bloqué — prestataire compatible adulte requis (CCBill, Segpay, Epoch) + statut juridique', },
  { label: 'Stockage médias conforme', status: 'todo', detail: 'S3/Cloudflare R2 non configuré — aucun fichier adulte ne doit transiter en base' },
  { label: 'DPO / contact CNIL', status: 'todo', detail: 'Désigner un DPO ou externaliser — obligatoire pour traitement de données à grande échelle', link: 'https://www.cnil.fr/fr/le-delegue-a-la-protection-des-donnees-dpo' },
]

const statusIcon = {
  done: <CheckCircle2 className="w-4 h-4 text-z-success flex-shrink-0" />,
  todo: <XCircle className="w-4 h-4 text-z-danger flex-shrink-0" />,
  warn: <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0" />,
}

export default function LegalPage() {
  const done = items.filter(i => i.status === 'done').length
  const total = items.length

  return (
    <div className="p-6 space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-z-text">Conformité</h1>
        <p className="text-z-muted text-sm">{done}/{total} points validés — faire valider par un juriste avant mise en production</p>
      </div>

      <div className="admin-card space-y-3">
        {items.map(item => (
          <div key={item.label} className="flex items-start gap-3 py-2 border-b border-z-border/40 last:border-0">
            {statusIcon[item.status]}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-z-text">{item.label}</p>
              <p className="text-xs text-z-muted mt-0.5">{item.detail}</p>
            </div>
            {item.link && (
              <a
                href={item.link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-z-violet hover:text-z-violet-light transition-colors flex-shrink-0"
                title="Documentation officielle"
              >
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}
          </div>
        ))}
      </div>

      <div className="admin-card border-amber-500/30 bg-amber-500/5 text-sm text-z-sub">
        <p className="font-semibold text-amber-400 mb-1">Avertissement légal</p>
        <p>
          Ce tableau de bord est une aide au suivi interne. Il ne constitue pas un audit juridique.
          Consultez un avocat spécialisé en droit du numérique et en protection des données
          avant toute mise en production d'une plateforme à contenu adulte en France/UE.
        </p>
      </div>
    </div>
  )
}
