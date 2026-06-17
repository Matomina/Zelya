import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { CheckCircle2, XCircle, Search } from 'lucide-react'
import { api } from '@/lib/api'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'

interface Profile {
  id: string
  alias: string
  city: string
  gender: string
  status: 'PENDING' | 'ACTIVE' | 'SUSPENDED' | 'BANNED'
  isVerified: boolean
  createdAt: string
  user: { email: string }
}

const STATUS_CLASS: Record<string, string> = {
  ACTIVE: 'badge-status-active',
  PENDING: 'badge-status-open',
  SUSPENDED: 'badge-status-banned',
  BANNED: 'badge-status-banned',
}

export default function ProfilesPage() {
  const [search, setSearch] = useState('')
  const qc = useQueryClient()

  const { data, isLoading } = useQuery({
    queryKey: ['admin-profiles', search],
    queryFn: () =>
      api.get<{ data: Profile[] }>('/profiles', { params: { search, limit: 50 } }).then(r => r.data),
  })

  const updateMut = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      api.patch(`/profiles/${id}`, { status }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin-profiles'] }),
  })

  return (
    <div className="p-6 space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-z-text">Profils</h1>
          <p className="text-z-muted text-sm">Validation et gestion des profils</p>
        </div>
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-z-faint" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Alias, ville…"
            className="bg-z-card border border-z-border rounded-lg pl-9 pr-4 py-2 text-sm text-z-text
                       focus:outline-none focus:border-z-violet w-56 transition-colors"
          />
        </div>
      </div>

      <div className="admin-card p-0 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-z-border text-z-muted text-xs uppercase tracking-wider">
              <th className="px-4 py-3 text-left">Alias</th>
              <th className="px-4 py-3 text-left">Email</th>
              <th className="px-4 py-3 text-left">Ville</th>
              <th className="px-4 py-3 text-left">Statut</th>
              <th className="px-4 py-3 text-left">Vérifié</th>
              <th className="px-4 py-3 text-left">Créé le</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading && (
              <tr><td colSpan={7} className="text-center py-12 text-z-muted">Chargement…</td></tr>
            )}
            {data?.data?.map(p => (
              <tr key={p.id} className="border-b border-z-border/50 hover:bg-z-raised/30 transition-colors">
                <td className="px-4 py-3 font-medium text-z-text">@{p.alias}</td>
                <td className="px-4 py-3 text-z-muted text-xs">{p.user?.email}</td>
                <td className="px-4 py-3 text-z-sub">{p.city}</td>
                <td className="px-4 py-3">
                  <span className={`text-xs px-2 py-0.5 rounded-full ${STATUS_CLASS[p.status] ?? ''}`}>
                    {p.status}
                  </span>
                </td>
                <td className="px-4 py-3">
                  {p.isVerified
                    ? <CheckCircle2 className="w-4 h-4 text-z-success" />
                    : <XCircle className="w-4 h-4 text-z-faint" />}
                </td>
                <td className="px-4 py-3 text-z-muted text-xs">
                  {format(new Date(p.createdAt), 'd MMM yyyy', { locale: fr })}
                </td>
                <td className="px-4 py-3 text-right flex items-center justify-end gap-1">
                  {p.status === 'PENDING' && (
                    <button
                      onClick={() => updateMut.mutate({ id: p.id, status: 'ACTIVE' })}
                      className="text-xs px-2 py-1 rounded-lg bg-z-success/10 text-z-success hover:bg-z-success/20 transition-colors"
                    >
                      Activer
                    </button>
                  )}
                  {p.status === 'ACTIVE' && (
                    <button
                      onClick={() => updateMut.mutate({ id: p.id, status: 'SUSPENDED' })}
                      className="text-xs px-2 py-1 rounded-lg bg-z-danger/10 text-z-danger hover:bg-z-danger/20 transition-colors"
                    >
                      Suspendre
                    </button>
                  )}
                  {p.status === 'SUSPENDED' && (
                    <button
                      onClick={() => updateMut.mutate({ id: p.id, status: 'ACTIVE' })}
                      className="text-xs px-2 py-1 rounded-lg bg-z-success/10 text-z-success hover:bg-z-success/20 transition-colors"
                    >
                      Réactiver
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
