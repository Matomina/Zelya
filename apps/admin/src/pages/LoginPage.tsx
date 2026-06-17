import { useState } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { Zap } from 'lucide-react'

export default function LoginPage() {
  const { login } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await login(email, password)
    } catch {
      setError('Identifiants invalides ou accès non autorisé.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-z-bg flex items-center justify-center p-4">
      <div className="admin-card w-full max-w-sm">
        <div className="flex items-center justify-center gap-2 mb-8">
          <Zap className="w-6 h-6 text-z-violet" />
          <span className="text-xl font-bold text-z-text">Zelya Admin</span>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-z-sub mb-1.5">Email</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full bg-z-bg border border-z-border rounded-lg px-3 py-2 text-z-text
                         focus:outline-none focus:border-z-violet transition-colors"
              required
              autoComplete="email"
            />
          </div>
          <div>
            <label className="block text-sm text-z-sub mb-1.5">Mot de passe</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full bg-z-bg border border-z-border rounded-lg px-3 py-2 text-z-text
                         focus:outline-none focus:border-z-violet transition-colors"
              required
              autoComplete="current-password"
            />
          </div>

          {error && (
            <p className="text-z-danger text-sm bg-z-danger/10 border border-z-danger/20 rounded-lg px-3 py-2">
              {error}
            </p>
          )}

          <button type="submit" disabled={loading} className="btn-primary w-full">
            {loading ? 'Connexion…' : 'Se connecter'}
          </button>
        </form>

        <p className="text-center text-xs text-z-faint mt-6">
          Accès réservé aux administrateurs et modérateurs Zelya
        </p>
      </div>
    </div>
  )
}
