import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Search, Ban, CheckCircle2, Trash2 } from 'lucide-react'
import { api } from '@/lib/api'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'

interface User {
  id: string
  pseudo: string
  email: string
  role: string
  isActive: boolean
  isBanned: boolean
  createdAt: string
  deletedAt: string | null
}

export default function UsersPage() {
  const [search, setSearch] = useState('')
  const qc = useQueryClient()

  const { data, isLoading, isError } = useQuery({
    queryKey: ['admin-users', search],
    queryFn: () =>
      api.get<{ data: User[] }>('/users', { params: { search, limit: 50 } }).then(r => r.data),
    staleTime: 10_000,
  })

  const banMut = useMutation({
    mutationFn: ({ id, ban }: { id: string; ban: boolean }) =>
      api.patch(`/users/${id}`, { isBanned: ban }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin-users'] }),
  })

  return (
    <div className="p-6 space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-z-text">Utilisateurs</h1>
          <p className="text-z-muted text-sm">Gestion des comptes utilisateurs</p>
        </div>
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-z-faint" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Rechercher…"
            className="bg-z-card border border-z-border rounded-lg pl-9 pr-4 py-2 text-sm text-z-text
                       focus:outline-none focus:border-z-violet w-56 transition-colors"
          />
        </div>
      </div>

      <div className="admin-card p-0 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-z-border text-z-muted text-xs uppercase tracking-wider">
              <th className="px-4 py-3 text-left">Pseudo</th>
              <th className="px-4 py-3 text-left">Email</th>
              <th className="px-4 py-3 text-left">Rôle</th>
              <th className="px-4 py-3 text-left">Statut</th>
              <th className="px-4 py-3 text-left">Inscrit le</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading && (
              <tr><td colSpan={6} className="text-center py-12 text-z-muted">Chargement…</td></tr>
            )}
            {isError && (
              <tr><td colSpan={6} className="text-center py-12 text-z-danger">
                Erreur de chargement — vérifiez que l'API est démarrée.
              </td></tr>
            )}
            {data?.data?.map(u => (
              <tr key={u.id} className="border-b border-z-border/50 hover:bg-z-raised/30 transition-colors">
                <td className="px-4 py-3 font-medium text-z-text">{u.pseudo}</td>
                <td className="px-4 py-3 text-z-sub">{u.email}</td>
                <td className="px-4 py-3">
                  <span className="text-xs px-2 py-0.5 rounded-full bg-z-violet/15 text-z-violet-light">
                    {u.role}
                  </span>
                </td>
                <td className="px-4 py-3">
                  {u.deletedAt ? (
                    <span className="text-xs px-2 py-0.5 rounded-full badge-status-banned">Supprimé</span>
                  ) : u.isBanned ? (
                    <span className="text-xs px-2 py-0.5 rounded-full badge-status-banned">Banni</span>
                  ) : (
                    <span className="text-xs px-2 py-0.5 rounded-full badge-status-active">Actif</span>
                  )}
                </td>
                <td className="px-4 py-3 text-z-muted text-xs">
                  {format(new Date(u.createdAt), 'd MMM yyyy', { locale: fr })}
                </td>
                <td className="px-4 py-3 text-right">
                  <button
                    onClick={() => banMut.mutate({ id: u.id, ban: !u.isBanned })}
                    className={`p-1.5 rounded-lg transition-colors ${
                      u.isBanned
                        ? 'text-z-success hover:bg-z-success/10'
                        : 'text-z-danger hover:bg-z-danger/10'
                    }`}
                    title={u.isBanned ? 'Débannir' : 'Bannir'}
                  >
                    {u.isBanned ? <CheckCircle2 className="w-4 h-4" /> : <Ban className="w-4 h-4" />}
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
