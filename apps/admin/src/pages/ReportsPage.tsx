import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { CheckCircle2, XCircle } from 'lucide-react'
import { api } from '@/lib/api'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'

type ReportStatus = 'OPEN' | 'UNDER_REVIEW' | 'RESOLVED' | 'DISMISSED'

interface Report {
  id: string
  reason: string
  details: string | null
  status: ReportStatus
  createdAt: string
  reporter: { pseudo: string }
  profile: { alias: string }
}

const STATUS_LABELS: Record<ReportStatus, string> = {
  OPEN: 'Ouvert',
  UNDER_REVIEW: 'En examen',
  RESOLVED: 'Résolu',
  DISMISSED: 'Rejeté',
}

export default function ReportsPage() {
  const [statusFilter, setStatusFilter] = useState<ReportStatus | 'ALL'>('OPEN')
  const qc = useQueryClient()

  const { data, isLoading, isError } = useQuery({
    queryKey: ['admin-reports', statusFilter],
    queryFn: () =>
      api.get<{ data: Report[] }>('/reports', {
        params: statusFilter !== 'ALL' ? { status: statusFilter } : {},
      }).then(r => r.data),
  })

  const resolveMut = useMutation({
    mutationFn: ({ id, status }: { id: string; status: ReportStatus }) =>
      api.patch(`/reports/${id}/resolve`, { status }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin-reports'] }),
  })

  const filters: (ReportStatus | 'ALL')[] = ['ALL', 'OPEN', 'UNDER_REVIEW', 'RESOLVED', 'DISMISSED']

  return (
    <div className="p-6 space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-z-text">Signalements</h1>
        <p className="text-z-muted text-sm">Gestion et modération des signalements</p>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 flex-wrap">
        {filters.map(f => (
          <button
            key={f}
            onClick={() => setStatusFilter(f)}
            className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
              statusFilter === f
                ? 'bg-z-violet/20 text-z-violet-light border-z-violet/40'
                : 'text-z-muted border-z-border hover:border-z-violet/30'
            }`}
          >
            {f === 'ALL' ? 'Tous' : STATUS_LABELS[f]}
          </button>
        ))}
      </div>

      <div className="admin-card p-0 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-z-border text-z-muted text-xs uppercase tracking-wider">
              <th className="px-4 py-3 text-left">Signaleur</th>
              <th className="px-4 py-3 text-left">Profil signalé</th>
              <th className="px-4 py-3 text-left">Motif</th>
              <th className="px-4 py-3 text-left">Statut</th>
              <th className="px-4 py-3 text-left">Date</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading && (
              <tr><td colSpan={6} className="text-center py-12 text-z-muted">Chargement…</td></tr>
            )}
            {isError && (
              <tr><td colSpan={6} className="text-center py-12 text-z-danger">Erreur de chargement</td></tr>
            )}
            {data?.data?.map(r => (
              <tr key={r.id} className="border-b border-z-border/50 hover:bg-z-raised/30 transition-colors">
                <td className="px-4 py-3 text-z-sub">{r.reporter.pseudo}</td>
                <td className="px-4 py-3 font-medium text-z-text">@{r.profile.alias}</td>
                <td className="px-4 py-3">
                  <span className="text-xs px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-400 border border-amber-500/25">
                    {r.reason}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                    r.status === 'OPEN' || r.status === 'UNDER_REVIEW'
                      ? 'badge-status-open'
                      : r.status === 'RESOLVED'
                      ? 'badge-status-active'
                      : 'bg-z-faint/20 text-z-muted border border-z-faint/25'
                  }`}>
                    {STATUS_LABELS[r.status]}
                  </span>
                </td>
                <td className="px-4 py-3 text-z-muted text-xs">
                  {format(new Date(r.createdAt), 'd MMM yyyy', { locale: fr })}
                </td>
                <td className="px-4 py-3 text-right flex items-center justify-end gap-1">
                  <button
                    onClick={() => resolveMut.mutate({ id: r.id, status: 'RESOLVED' })}
                    className="p-1.5 rounded-lg text-z-success hover:bg-z-success/10 transition-colors"
                    title="Marquer résolu"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => resolveMut.mutate({ id: r.id, status: 'DISMISSED' })}
                    className="p-1.5 rounded-lg text-z-muted hover:bg-z-raised transition-colors"
                    title="Rejeter"
                  >
                    <XCircle className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
