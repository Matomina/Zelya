import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { CheckCircle2, XCircle, AlertTriangle } from 'lucide-react'
import { api } from '@/lib/api'

interface Media {
  id: string
  type: 'PHOTO' | 'VIDEO'
  storageKey: string
  hasConsent: boolean
  visibility: string
  profile: { alias: string }
  createdAt: string
}

export default function MediaModerationPage() {
  const qc = useQueryClient()

  const { data, isLoading, isError } = useQuery({
    queryKey: ['admin-media-pending'],
    queryFn: () =>
      api.get<Media[]>('/media/pending').then(r => r.data),
  })

  const approveMut = useMutation({
    mutationFn: (id: string) => api.patch(`/media/${id}/approve`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin-media-pending'] }),
  })

  const rejectMut = useMutation({
    mutationFn: (id: string) => api.delete(`/media/${id}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin-media-pending'] }),
  })

  return (
    <div className="p-6 space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-z-text">Médias — Modération</h1>
        <p className="text-z-muted text-sm">Approbation des médias en attente</p>
      </div>

      {/* ARCOM warning */}
      <div className="admin-card border-z-danger/30 bg-z-danger/5">
        <div className="flex gap-3">
          <AlertTriangle className="w-5 h-5 text-z-danger flex-shrink-0 mt-0.5" />
          <div className="text-sm text-z-sub">
            <p className="font-semibold text-z-danger mb-1">Obligation légale (ARCOM)</p>
            <p>Avant d'approuver tout média, vérifiez manuellement :</p>
            <ul className="mt-1 space-y-0.5 list-disc list-inside text-z-muted">
              <li>Aucun mineur n'est représenté dans le contenu</li>
              <li>Le consentement de toutes les personnes représentées est documenté</li>
              <li>Le contenu respecte les CGU de la plateforme</li>
            </ul>
          </div>
        </div>
      </div>

      {isLoading && <p className="text-z-muted text-sm">Chargement…</p>}
      {isError && (
        <div className="admin-card text-center text-z-muted py-8">
          <p className="text-z-danger mb-2">Erreur de chargement</p>
          <p className="text-sm">
            TODO: L'endpoint <code className="text-z-violet">/api/v1/media/pending</code> n'est pas encore implémenté.
            Connectez le stockage S3/R2 avant d'activer la modération médias.
          </p>
        </div>
      )}
      {!isLoading && !isError && (!data || data.length === 0) && (
        <div className="admin-card text-center text-z-muted py-12">
          <CheckCircle2 className="w-10 h-10 text-z-success mx-auto mb-3 opacity-50" />
          <p>Aucun média en attente de modération</p>
        </div>
      )}

      {data && data.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
          {data.map(m => (
            <div key={m.id} className="admin-card p-3 space-y-3">
              <div className="aspect-square bg-z-raised rounded-lg flex items-center justify-center text-z-faint text-sm">
                {/* TODO: Display thumbnail from S3/R2 */}
                {m.type === 'VIDEO' ? '▶ Vidéo' : '📷 Photo'}
              </div>
              <div>
                <p className="text-sm font-medium text-z-text">@{m.profile.alias}</p>
                <p className="text-xs text-z-muted">{m.visibility}</p>
                {!m.hasConsent && (
                  <p className="text-xs text-z-danger mt-1">⚠ Consentement non confirmé</p>
                )}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => approveMut.mutate(m.id)}
                  disabled={!m.hasConsent}
                  className="flex-1 btn-primary text-xs py-1.5 disabled:opacity-40"
                  title={!m.hasConsent ? 'Consentement requis' : 'Approuver'}
                >
                  <CheckCircle2 className="w-3.5 h-3.5 inline mr-1" />
                  Approuver
                </button>
                <button
                  onClick={() => rejectMut.mutate(m.id)}
                  className="btn-danger text-xs py-1.5 px-3"
                  title="Rejeter"
                >
                  <XCircle className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
