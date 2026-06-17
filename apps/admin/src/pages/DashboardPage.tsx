import { Users, Shield, AlertTriangle, Eye } from 'lucide-react'
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
} from 'recharts'

// Placeholder data until API stats endpoint is implemented
const placeholderStats = [
  { label: 'Utilisateurs', value: '—', icon: Users,         color: 'text-z-violet' },
  { label: 'Profils actifs', value: '—', icon: Shield,       color: 'text-z-success' },
  { label: 'Signalements ouverts', value: '—', icon: AlertTriangle, color: 'text-amber-400' },
  { label: 'Médias en attente', value: '—', icon: Eye,       color: 'text-z-violet-light' },
]

const chartPlaceholder = Array.from({ length: 7 }, (_, i) => ({
  day: ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'][i],
  inscriptions: 0,
}))

export default function DashboardPage() {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-z-text">Dashboard</h1>
        <p className="text-z-muted text-sm mt-1">Vue d'ensemble de la plateforme Zelya</p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        {placeholderStats.map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="admin-card flex items-center gap-4">
            <div className={`w-10 h-10 rounded-lg bg-z-raised flex items-center justify-center ${color}`}>
              <Icon className="w-5 h-5" />
            </div>
            <div>
              <p className="text-2xl font-bold text-z-text">{value}</p>
              <p className="text-xs text-z-muted">{label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Chart */}
      <div className="admin-card">
        <h2 className="text-base font-semibold text-z-text mb-4">Inscriptions (7 derniers jours)</h2>
        <p className="text-xs text-amber-400 mb-4">
          TODO: Implémenter l'endpoint GET /api/v1/admin/stats pour alimenter ce graphique.
        </p>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={chartPlaceholder}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1E1B3A" />
            <XAxis dataKey="day" tick={{ fill: '#9795B5', fontSize: 12 }} />
            <YAxis tick={{ fill: '#9795B5', fontSize: 12 }} />
            <Tooltip
              contentStyle={{ background: '#0D0C1E', border: '1px solid #1E1B3A', borderRadius: 8 }}
              labelStyle={{ color: '#F5F3FF' }}
            />
            <Line
              type="monotone" dataKey="inscriptions"
              stroke="#8B5CF6" strokeWidth={2} dot={{ fill: '#8B5CF6' }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Compliance reminders */}
      <div className="admin-card border-amber-500/30">
        <h2 className="text-base font-semibold text-amber-400 mb-3">⚠️ Points de conformité</h2>
        <ul className="space-y-2 text-sm text-z-sub">
          <li>• Vérification d'âge ARCOM : <span className="text-z-danger font-medium">non implémentée — TODO avant mise en production</span></li>
          <li>• Modération des médias : <span className="text-z-danger font-medium">approbation manuelle requise</span></li>
          <li>• Stockage médias S3/R2 : <span className="text-z-danger font-medium">non configuré</span></li>
          <li>• Pages légales : <span className="text-amber-400 font-medium">validation juridique en attente</span></li>
          <li>• Paiement créateurs : <span className="text-z-danger font-medium">bloqué — prestataire adulte requis (CCBill, Segpay…)</span></li>
        </ul>
      </div>
    </div>
  )
}
