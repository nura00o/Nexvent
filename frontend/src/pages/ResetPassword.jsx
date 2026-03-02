import React, { useState, useEffect } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import authService from '../services/authService'
import { useLanguage } from '../contexts/LanguageContext'
import { Lock, Mail, Hash, AlertCircle, CheckCircle, Zap, ArrowRight, Eye, EyeOff } from 'lucide-react'

const ResetPassword = () => {
  const { t } = useLanguage()
  const [searchParams] = useSearchParams()
  const [email, setEmail] = useState('')
  const [code, setCode] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    const emailFromUrl = searchParams.get('email')
    if (emailFromUrl) setEmail(emailFromUrl)
  }, [searchParams])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (password !== confirmPassword) { setError(t('resetPassword.passwordsDoNotMatch')); return }
    if (password.length < 6) { setError(t('auth.passwordMinLength')); return }
    if (!code.trim()) { setError(t('validation.passwordRequired')); return }
    if (!email.trim()) { setError(t('validation.emailRequired')); return }

    setLoading(true)
    try {
      await authService.resetFinish({ email, code: code.trim(), newPassword: password })
      setSuccess(true)
      setTimeout(() => navigate('/login'), 2000)
    } catch (err) {
      setError(err.response?.data?.message || t('resetPassword.failedToReset'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-blue-50 flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full animate-fade-in-up">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex flex-col items-center gap-3 group">
            <div className="p-3 bg-primary-600 rounded-2xl group-hover:bg-primary-700 transition-colors shadow-glow">
              <Zap className="h-8 w-8 text-white" />
            </div>
            <span className="text-2xl font-bold text-gray-900">Nexvent</span>
          </Link>
          <h2 className="text-3xl font-bold text-gray-900 mt-4">{t('resetPassword.title')}</h2>
          <p className="text-gray-500 mt-1.5 text-sm">{t('resetPassword.subtitle')}</p>
        </div>

        {/* Card */}
        <div className="card shadow-card animate-fade-in-up delay-75">
          {error && (
            <div className="mb-5 p-3.5 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3 animate-fade-in-down">
              <AlertCircle className="h-4 w-4 text-red-500 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          {success ? (
            <div className="text-center animate-scale-in">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-100 rounded-2xl mb-4">
                <CheckCircle className="h-8 w-8 text-emerald-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-1">{t('resetPassword.successTitle')}</h3>
              <p className="text-sm text-gray-500 mb-4">{t('resetPassword.successMessage')}</p>
              <div className="h-1 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-primary-500 rounded-full animate-[width_2s_linear]" style={{ width: '100%', transition: 'width 2s linear', animation: 'none' }} />
              </div>
              <p className="text-xs text-gray-400 mt-2">{t('resetPassword.redirecting')}</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email */}
              <div>
                <label htmlFor="email" className="form-label">{t('resetPassword.emailAddress')}</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                    className="input-field pl-10" placeholder="you@example.com" autoComplete="email" />
                </div>
              </div>

              {/* Code */}
              <div>
                <label htmlFor="code" className="form-label">{t('resetPassword.resetCode')}</label>
                <div className="relative">
                  <Hash className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input id="code" type="text" value={code} onChange={(e) => setCode(e.target.value)}
                    className="input-field pl-10 font-mono tracking-widest" placeholder="123456"
                    maxLength={8} autoComplete="one-time-code" />
                </div>
              </div>

              {/* New Password */}
              <div>
                <label htmlFor="password" className="form-label">{t('resetPassword.newPassword')}</label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input id="password" type={showPassword ? 'text' : 'password'} required
                    value={password} onChange={(e) => setPassword(e.target.value)}
                    className="input-field pl-10 pr-11" placeholder="••••••••" autoComplete="new-password" />
                  <button type="button" onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors">
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div>
                <label htmlFor="confirmPassword" className="form-label">{t('resetPassword.confirmNewPassword')}</label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input id="confirmPassword" type={showPassword ? 'text' : 'password'} required
                    value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}
                    className="input-field pl-10" placeholder="••••••••" autoComplete="new-password" />
                </div>
              </div>

              <button type="submit" disabled={loading}
                className="w-full btn-primary flex items-center justify-center gap-2 mt-1 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0">
                {loading ? (
                  <>
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    {t('resetPassword.resetting')}
                  </>
                ) : (
                  <>{t('resetPassword.resetPassword')} <ArrowRight className="h-4 w-4" /></>
                )}
              </button>

              <div className="pt-4 border-t border-gray-100 text-center">
                <Link to="/login" className="text-sm font-medium text-primary-600 hover:text-primary-700">
                  {t('resetPassword.backToLogin')}
                </Link>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}

export default ResetPassword
