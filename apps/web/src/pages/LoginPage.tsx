import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { Eye, EyeOff, LogIn, Sparkles, AlertCircle } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const from = (location.state as { from?: { pathname: string } })?.from?.pathname ?? '/espace'

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !password) {
      setError('Veuillez remplir tous les champs.')
      return
    }
    setError('')
    setIsSubmitting(true)
    try {
      await login(email, password)
      navigate(from, { replace: true })
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message
      setError(msg ?? 'Identifiants incorrects. Vérifiez votre email et mot de passe.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-12 relative overflow-hidden">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 60% 50% at 50% 20%, rgba(109,40,217,0.2) 0%, transparent 65%)',
        }}
      />
      <div className="absolute inset-0 grid-pattern opacity-40 pointer-events-none" />

      <div className="relative w-full max-w-md animate-fade-in-scale">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-block">
            <span className="text-4xl font-black gradient-text" style={{ letterSpacing: '-0.02em' }}>
              Zelya
            </span>
          </Link>
          <p className="text-z-muted text-sm mt-2">Content de vous revoir</p>
        </div>

        {/* Card */}
        <div
          className="rounded-3xl p-8"
          style={{
            background: 'rgba(13,12,30,0.9)',
            border: '1px solid rgba(139,92,246,0.25)',
            boxShadow: '0 0 60px rgba(139,92,246,0.1), 0 24px 60px rgba(0,0,0,0.7)',
            backdropFilter: 'blur(20px)',
          }}
        >
          <h1 className="heading-sm text-z-text mb-6">Se connecter</h1>

          {error && (
            <div
              className="flex items-start gap-3 rounded-2xl px-4 py-3 mb-5 text-sm"
              style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)' }}
            >
              <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
              <span className="text-red-300">{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5" noValidate>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-z-sub mb-2">
                Email
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input"
                placeholder="votre@email.com"
                required
                disabled={isSubmitting}
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-z-sub mb-2">
                Mot de passe
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input pr-12"
                  placeholder="••••••••"
                  required
                  disabled={isSubmitting}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-z-faint hover:text-z-muted transition-colors"
                  aria-label={showPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full btn-primary py-4 text-base"
              disabled={isSubmitting}
              style={isSubmitting ? { opacity: 0.7, cursor: 'not-allowed' } : {}}
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center gap-2">
                  <span
                    className="w-4 h-4 rounded-full border-2 animate-spin"
                    style={{ borderColor: 'rgba(255,255,255,0.3)', borderTopColor: '#fff' }}
                  />
                  Connexion...
                </span>
              ) : (
                <>
                  <LogIn className="w-4 h-4" />
                  Se connecter
                </>
              )}
            </button>
          </form>

          <div className="flex items-center gap-4 my-6">
            <div className="flex-1 h-px" style={{ background: 'rgba(139,92,246,0.2)' }} />
            <span className="text-z-faint text-xs">ou</span>
            <div className="flex-1 h-px" style={{ background: 'rgba(139,92,246,0.2)' }} />
          </div>

          <p className="text-center text-sm text-z-muted">
            Pas encore de compte ?{' '}
            <Link
              to="/inscription"
              className="text-z-violet-light hover:text-z-violet-neon font-semibold transition-colors"
            >
              Créer un compte
            </Link>
          </p>

          <div
            className="mt-4 flex items-center justify-center gap-2 py-3 px-4 rounded-xl"
            style={{ background: 'rgba(139,92,246,0.06)', border: '1px solid rgba(139,92,246,0.15)' }}
          >
            <Sparkles className="w-4 h-4 text-z-violet" />
            <Link
              to="/espace-createur"
              className="text-sm text-z-muted hover:text-z-violet-light transition-colors"
            >
              Vous êtes créateur ? Accédez à votre espace
            </Link>
          </div>
        </div>

        <p className="text-center text-xs text-z-faint mt-6 leading-relaxed">
          En vous connectant, vous confirmez avoir 18 ans ou plus et acceptez nos{' '}
          <Link to="/cgu" className="text-z-violet-light hover:underline">CGU</Link>{' '}
          et notre{' '}
          <Link to="/confidentialite" className="text-z-violet-light hover:underline">
            politique de confidentialité
          </Link>.
        </p>
      </div>
    </div>
  )
}
