import { useState } from 'react'
import { Flag, Mail, AlertTriangle, ExternalLink, CheckCircle2 } from 'lucide-react'

type ReportReason = '' | 'illegal' | 'minor' | 'identity' | 'nonconsent' | 'harassment' | 'other'

export default function ContactPage() {
  const [reportProfileId, setReportProfileId] = useState('')
  const [reason, setReason] = useState<ReportReason>('')
  const [details, setDetails] = useState('')
  const [reporterEmail, setReporterEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const handleReport = (e: React.FormEvent) => { e.preventDefault(); setSubmitted(true) }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
      <h1 className="heading-lg text-z-text mb-2">Contact & Signalement</h1>
      <p className="text-z-muted mb-10">Pour toute question ou pour signaler un contenu problématique.</p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Signalement */}
        <section>
          <div className="flex items-center gap-2.5 mb-6">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center"
              style={{ background: 'rgba(139,92,246,0.15)', border: '1px solid rgba(139,92,246,0.3)' }}>
              <Flag className="w-4 h-4 text-z-violet-light" />
            </div>
            <h2 className="heading-sm text-z-text">Signaler un contenu</h2>
          </div>

          {submitted ? (
            <div
              className="rounded-2xl p-8 text-center"
              style={{ background: 'rgba(0,245,144,0.06)', border: '1px solid rgba(0,245,144,0.25)', boxShadow: '0 0 20px rgba(0,245,144,0.05)' }}
            >
              <CheckCircle2 className="w-12 h-12 mx-auto mb-4" style={{ color: '#00F590', filter: 'drop-shadow(0 0 8px rgba(0,245,144,0.5))' }} />
              <p className="text-z-online font-bold text-lg mb-2">Signalement envoyé</p>
              <p className="text-z-muted text-sm leading-relaxed mb-6">
                Merci pour votre signalement. Notre équipe de modération le traitera dans les 24 heures ouvrées.
              </p>
              <button
                onClick={() => { setSubmitted(false); setReportProfileId(''); setReason(''); setDetails(''); setReporterEmail('') }}
                className="btn-outline btn-sm"
              >
                Faire un autre signalement
              </button>
            </div>
          ) : (
            <form onSubmit={handleReport}
              className="rounded-2xl p-6 space-y-5"
              style={{ background: 'rgba(13,12,30,0.8)', border: '1px solid rgba(30,27,58,0.8)' }}
            >
              <div>
                <label htmlFor="profile-id" className="block text-sm font-medium text-z-sub mb-2">
                  Profil concerné (ID ou URL)
                </label>
                <input id="profile-id" type="text" value={reportProfileId}
                  onChange={(e) => setReportProfileId(e.target.value)}
                  className="input" placeholder="/profil/123 ou ID du profil" />
              </div>

              <div>
                <p className="text-sm font-medium text-z-sub mb-3">Motif du signalement *</p>
                <div className="space-y-2.5">
                  {[
                    { value: 'illegal', label: 'Contenu illégal' },
                    { value: 'minor', label: 'Mineur présumé' },
                    { value: 'identity', label: "Usurpation d'identité" },
                    { value: 'nonconsent', label: 'Contenu non consenti' },
                    { value: 'harassment', label: 'Harcèlement' },
                    { value: 'other', label: 'Autre' },
                  ].map((opt) => (
                    <label key={opt.value} className="flex items-center gap-2.5 cursor-pointer group">
                      <input type="radio" name="reason" value={opt.value}
                        checked={reason === opt.value}
                        onChange={(e) => setReason(e.target.value as ReportReason)}
                        className="accent-z-violet" required />
                      <span className={`text-sm transition-colors ${reason === opt.value ? 'text-z-violet-light' : 'text-z-muted group-hover:text-z-text'}`}>
                        {opt.label}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label htmlFor="details" className="block text-sm font-medium text-z-sub mb-2">Détails complémentaires</label>
                <textarea id="details" value={details} onChange={(e) => setDetails(e.target.value)}
                  className="input min-h-[96px] resize-y" placeholder="Décrivez le problème constaté..." rows={4} />
              </div>

              <div>
                <label htmlFor="reporter-email" className="block text-sm font-medium text-z-sub mb-2">Votre email (pour le suivi)</label>
                <input id="reporter-email" type="email" value={reporterEmail}
                  onChange={(e) => setReporterEmail(e.target.value)}
                  className="input" placeholder="votre@email.com" />
              </div>

              <button type="submit" className="w-full btn-primary py-4">
                <Flag className="w-4 h-4" />
                Envoyer le signalement
              </button>
            </form>
          )}
        </section>

        {/* Info column */}
        <div className="space-y-5">
          {/* Contact */}
          <section className="rounded-2xl p-6"
            style={{ background: 'rgba(13,12,30,0.8)', border: '1px solid rgba(30,27,58,0.8)' }}>
            <div className="flex items-center gap-2.5 mb-4">
              <Mail className="w-5 h-5 text-z-violet" />
              <h2 className="font-semibold text-z-text">Nous contacter</h2>
            </div>
            <p className="text-z-muted text-sm leading-relaxed mb-3">
              Pour toute question générale, demande de support ou réclamation :
            </p>
            <p className="text-z-violet-light font-medium">contact@zelya.fr</p>
            <p className="text-xs text-z-faint mt-1">(placeholder — à confirmer)</p>
            <div className="mt-4 pt-4" style={{ borderTop: '1px solid rgba(30,27,58,0.8)' }}>
              <p className="text-xs text-z-faint">Délai de réponse habituel : 48h ouvrées</p>
            </div>
          </section>

          {/* Urgence mineurs */}
          <section className="rounded-2xl p-6"
            style={{ background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.25)' }}>
            <div className="flex items-center gap-2.5 mb-4">
              <AlertTriangle className="w-5 h-5 text-red-400" />
              <h2 className="font-semibold text-red-300">Signalement urgent — Mineurs</h2>
            </div>
            <p className="text-sm text-red-200/80 leading-relaxed mb-4">
              Pour tout contenu impliquant un mineur, contactez directement les autorités :
            </p>
            <a href="https://www.internet-signalement.gouv.fr" target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm text-red-300 hover:text-red-200 font-medium transition-colors">
              <ExternalLink className="w-4 h-4" />
              internet-signalement.gouv.fr
            </a>
            <p className="text-xs text-red-300/60 mt-2">Plateforme officielle du Ministère de l'Intérieur</p>
          </section>

          {/* DPO */}
          <section className="rounded-2xl p-6"
            style={{ background: 'rgba(13,12,30,0.8)', border: '1px solid rgba(30,27,58,0.8)' }}>
            <h2 className="font-semibold text-z-text mb-3">Vos droits RGPD</h2>
            <p className="text-sm text-z-muted leading-relaxed mb-3">
              Pour exercer vos droits d'accès, rectification ou suppression de vos données :
            </p>
            <p className="text-z-violet-light font-medium">dpo@zelya.fr</p>
            <p className="text-xs text-z-faint mt-1">(placeholder — à confirmer)</p>
          </section>
        </div>
      </div>
    </div>
  )
}
