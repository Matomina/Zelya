import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Eye, EyeOff, AlertTriangle, ChevronRight, ChevronLeft, AlertCircle } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'

type Step = 1 | 2 | 3
type AccountType = 'visitor' | 'creator'

export default function RegisterPage() {
  const [step, setStep] = useState<Step>(1)
  const [showPassword, setShowPassword] = useState(false)
  const [accountType, setAccountType] = useState<AccountType>('visitor')
  const [alias, setAlias] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [birthDay, setBirthDay] = useState('')
  const [birthMonth, setBirthMonth] = useState('')
  const [birthYear, setBirthYear] = useState('')
  const [acceptCgu, setAcceptCgu] = useState(false)
  const [acceptPrivacy, setAcceptPrivacy] = useState(false)
  const [acceptMarketing, setAcceptMarketing] = useState(false)
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const { register } = useAuth()
  const navigate = useNavigate()

  const validateStep1 = () => {
    if (!alias.trim() || alias.length < 3) return 'Le pseudo doit contenir au moins 3 caractères.'
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return 'Email invalide.'
    if (!password || password.length < 8) return 'Le mot de passe doit contenir au moins 8 caractères.'
    if (password !== confirmPassword) return 'Les mots de passe ne correspondent pas.'
    return ''
  }

  const validateStep2 = () => {
    const day = parseInt(birthDay, 10)
    const month = parseInt(birthMonth, 10)
    const year = parseInt(birthYear, 10)
    if (!birthDay || !birthMonth || !birthYear) return 'Veuillez saisir votre date de naissance.'
    if (day < 1 || day > 31 || month < 1 || month > 12 || year < 1900) return 'Date invalide.'
    const dob = new Date(year, month - 1, day)
    const age = Math.floor((Date.now() - dob.getTime()) / (365.25 * 24 * 3600 * 1000))
    if (age < 18) return 'Vous devez avoir au moins 18 ans pour vous inscrire.'
    return ''
  }

  const validateStep3 = () => {
    if (!acceptCgu) return 'Vous devez accepter les CGU.'
    if (!acceptPrivacy) return 'Vous devez accepter la politique de confidentialité.'
    return ''
  }

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (step === 1) {
      const err = validateStep1()
      if (err) { setError(err); return }
      setStep(2)
    } else if (step === 2) {
      const err = validateStep2()
      if (err) { setError(err); return }
      setStep(3)
    } else {
      handleSubmit()
    }
  }

  const handleSubmit = async () => {
    const err = validateStep3()
    if (err) { setError(err); return }

    const day = birthDay.padStart(2, '0')
    const month = birthMonth.padStart(2, '0')
    const dateOfBirth = `${birthYear}-${month}-${day}`

    setIsSubmitting(true)
    try {
      await register({
        email,
        pseudo: alias,
        password,
        dateOfBirth,
        acceptMarketing,
      })
      navigate('/espace', { replace: true })
    } catch (apiErr: unknown) {
      const msg = (apiErr as { response?: { data?: { message?: string | string[] } } })
        ?.response?.data?.message
      const text = Array.isArray(msg) ? msg[0] : (msg ?? 'Une erreur est survenue. Réessayez.')
      setError(text)
    } finally {
      setIsSubmitting(false)
    }
  }

  const inputCard = (content: React.ReactNode) => (
    <div
      className="rounded-3xl p-8"
      style={{
        background: 'rgba(13,12,30,0.9)',
        border: '1px solid rgba(139,92,246,0.25)',
        boxShadow: '0 0 60px rgba(139,92,246,0.1), 0 24px 60px rgba(0,0,0,0.7)',
        backdropFilter: 'blur(20px)',
      }}
    >
      {content}
    </div>
  )

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-12 relative overflow-hidden">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 60% 50% at 50% 20%, rgba(109,40,217,0.18) 0%, transparent 65%)',
        }}
      />
      <div className="absolute inset-0 grid-pattern opacity-40 pointer-events-none" />

      <div className="relative w-full max-w-md animate-fade-in-scale">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/">
            <span className="text-4xl font-black gradient-text" style={{ letterSpacing: '-0.02em' }}>
              Zelya
            </span>
          </Link>
          <p className="text-z-muted text-sm mt-2">Rejoignez la plateforme</p>
        </div>

        {/* Progress */}
        <div className="flex items-center justify-center gap-2 mb-8">
          {([1, 2, 3] as Step[]).map((s) => (
            <div key={s} className="flex items-center gap-2">
              <div
                className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold transition-all"
                style={
                  s === step
                    ? { background: 'linear-gradient(135deg, #6D28D9, #8B5CF6)', color: '#fff', boxShadow: '0 0 15px rgba(139,92,246,0.5)' }
                    : s < step
                    ? { background: 'rgba(139,92,246,0.25)', color: '#A78BFA', border: '1px solid rgba(139,92,246,0.4)' }
                    : { background: 'rgba(13,12,30,0.7)', color: '#5A5880', border: '1px solid rgba(30,27,58,0.8)' }
                }
              >
                {s}
              </div>
              {s < 3 && (
                <div
                  className="w-12 h-0.5"
                  style={{ background: s < step ? 'rgba(139,92,246,0.5)' : 'rgba(30,27,58,0.8)' }}
                />
              )}
            </div>
          ))}
        </div>

        {error && (
          <div
            className="flex items-start gap-3 rounded-2xl px-4 py-3 mb-4 text-sm"
            style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)' }}
          >
            <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
            <span className="text-red-300">{error}</span>
          </div>
        )}

        <form onSubmit={handleNext} className="space-y-4" noValidate>
          {/* STEP 1 */}
          {step === 1 && inputCard(<>
            <h1 className="heading-sm text-z-text mb-1">Votre profil</h1>
            <p className="text-z-muted text-sm mb-6">Étape 1 sur 3</p>

            <div className="grid grid-cols-2 gap-3 mb-5">
              {(['visitor', 'creator'] as AccountType[]).map((t) => (
                <label
                  key={t}
                  className="flex flex-col items-center gap-2 p-4 rounded-2xl cursor-pointer transition-all"
                  style={
                    accountType === t
                      ? { background: 'rgba(139,92,246,0.15)', border: '1px solid rgba(139,92,246,0.5)', boxShadow: '0 0 15px rgba(139,92,246,0.2)' }
                      : { background: 'rgba(7,7,15,0.6)', border: '1px solid rgba(30,27,58,0.8)' }
                  }
                >
                  <input
                    type="radio"
                    name="accountType"
                    value={t}
                    checked={accountType === t}
                    onChange={() => setAccountType(t)}
                    className="sr-only"
                  />
                  <span className="text-2xl">{t === 'visitor' ? '👤' : '✦'}</span>
                  <span className={`text-sm font-medium ${accountType === t ? 'text-z-violet-light' : 'text-z-muted'}`}>
                    {t === 'visitor' ? 'Visiteur' : 'Créateur'}
                  </span>
                </label>
              ))}
            </div>

            <div className="space-y-4">
              <div>
                <label htmlFor="alias" className="block text-sm font-medium text-z-sub mb-2">
                  Pseudo *
                </label>
                <input
                  id="alias"
                  type="text"
                  value={alias}
                  onChange={(e) => setAlias(e.target.value)}
                  className="input"
                  placeholder="VotreAlias"
                  required
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-z-sub mb-2">
                  Email *
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
                />
              </div>
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-z-sub mb-2">
                  Mot de passe *
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="new-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="input pr-12"
                    placeholder="Minimum 8 caractères"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-z-faint hover:text-z-muted transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              <div>
                <label htmlFor="confirm" className="block text-sm font-medium text-z-sub mb-2">
                  Confirmer *
                </label>
                <input
                  id="confirm"
                  type="password"
                  autoComplete="new-password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="input"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>
          </>)}

          {/* STEP 2 */}
          {step === 2 && inputCard(<>
            <h1 className="heading-sm text-z-text mb-1">Confirmation de majorité</h1>
            <p className="text-z-muted text-sm mb-6">Étape 2 sur 3</p>

            <div
              className="flex items-start gap-3 rounded-2xl p-4 mb-5"
              style={{ background: 'rgba(245,158,11,0.07)', border: '1px solid rgba(245,158,11,0.2)' }}
            >
              <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-amber-200/80 leading-relaxed">
                Vous devez avoir 18 ans ou plus. Cette information sera vérifiée.
                <br />
                <br />
                <strong className="text-amber-300">TODO LÉGAL :</strong> Intégrer un système de
                vérification d'âge certifié conforme ARCOM avant mise en production.
              </p>
            </div>

            <div>
              <p className="text-sm font-medium text-z-sub mb-3">Date de naissance *</p>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label htmlFor="day" className="sr-only">Jour</label>
                  <input
                    id="day"
                    type="number"
                    min="1"
                    max="31"
                    value={birthDay}
                    onChange={(e) => setBirthDay(e.target.value)}
                    className="input text-center"
                    placeholder="JJ"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="month" className="sr-only">Mois</label>
                  <input
                    id="month"
                    type="number"
                    min="1"
                    max="12"
                    value={birthMonth}
                    onChange={(e) => setBirthMonth(e.target.value)}
                    className="input text-center"
                    placeholder="MM"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="year" className="sr-only">Année</label>
                  <input
                    id="year"
                    type="number"
                    min="1900"
                    max={new Date().getFullYear() - 18}
                    value={birthYear}
                    onChange={(e) => setBirthYear(e.target.value)}
                    className="input text-center"
                    placeholder="AAAA"
                    required
                  />
                </div>
              </div>
              <p className="text-xs text-z-faint mt-2">Format : JJ / MM / AAAA</p>
            </div>
          </>)}

          {/* STEP 3 */}
          {step === 3 && inputCard(<>
            <h1 className="heading-sm text-z-text mb-1">Consentements RGPD</h1>
            <p className="text-z-muted text-sm mb-6">Étape 3 sur 3</p>

            <div className="space-y-4 mb-5">
              {[
                {
                  checked: acceptCgu,
                  onChange: setAcceptCgu,
                  required: true,
                  label: (
                    <>
                      J'ai lu et j'accepte les{' '}
                      <Link to="/cgu" className="text-z-violet-light hover:underline" target="_blank">
                        CGU
                      </Link>{' '}
                      <span className="text-z-violet">*</span>
                    </>
                  ),
                },
                {
                  checked: acceptPrivacy,
                  onChange: setAcceptPrivacy,
                  required: true,
                  label: (
                    <>
                      J'ai lu la{' '}
                      <Link
                        to="/confidentialite"
                        className="text-z-violet-light hover:underline"
                        target="_blank"
                      >
                        politique de confidentialité
                      </Link>{' '}
                      <span className="text-z-violet">*</span>
                    </>
                  ),
                },
                {
                  checked: acceptMarketing,
                  onChange: setAcceptMarketing,
                  required: false,
                  label: "J'accepte de recevoir des communications Zelya (optionnel)",
                },
              ].map((item, i) => (
                <label key={i} className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={item.checked}
                    onChange={(e) => item.onChange(e.target.checked)}
                    className="accent-z-violet mt-1 w-4 h-4 flex-shrink-0"
                  />
                  <span className="text-sm text-z-sub leading-relaxed">{item.label}</span>
                </label>
              ))}
            </div>

            <div
              className="rounded-xl p-3 text-xs text-z-muted leading-relaxed"
              style={{ background: 'rgba(7,7,15,0.6)', border: '1px solid rgba(30,27,58,0.8)' }}
            >
              En créant un compte, vous confirmez avoir 18 ans ou plus et accepter la politique de
              modération.
            </div>
          </>)}

          {/* Navigation */}
          <div className="flex gap-3">
            {step > 1 && (
              <button
                type="button"
                onClick={() => { setError(''); setStep((step - 1) as Step) }}
                className="btn-ghost py-3 px-5"
                disabled={isSubmitting}
              >
                <ChevronLeft className="w-4 h-4" />
                Précédent
              </button>
            )}
            <button
              type="submit"
              className="flex-1 btn-primary py-4"
              disabled={isSubmitting}
              style={isSubmitting ? { opacity: 0.7, cursor: 'not-allowed' } : {}}
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center gap-2">
                  <span
                    className="w-4 h-4 rounded-full border-2 animate-spin"
                    style={{ borderColor: 'rgba(255,255,255,0.3)', borderTopColor: '#fff' }}
                  />
                  Création...
                </span>
              ) : step < 3 ? (
                <>
                  <span>Suivant</span>
                  <ChevronRight className="w-4 h-4" />
                </>
              ) : (
                'Créer mon compte'
              )}
            </button>
          </div>

          {step === 1 && (
            <p className="text-center text-sm text-z-muted mt-4">
              Déjà un compte ?{' '}
              <Link
                to="/connexion"
                className="text-z-violet-light hover:text-z-violet-neon font-semibold transition-colors"
              >
                Se connecter
              </Link>
            </p>
          )}
        </form>
      </div>
    </div>
  )
}
