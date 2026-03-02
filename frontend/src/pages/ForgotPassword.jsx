import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import authService from '../services/authService'
import { useLanguage } from '../contexts/LanguageContext'
import { Mail, AlertCircle, CheckCircle, ArrowLeft, Zap, ArrowRight } from 'lucide-react'

const ForgotPassword = () => {
  const { t } = useLanguage()
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess(false)
    setLoading(true)
    try {
      await authService.resetStart({ email })
      setSuccess(true)
    } catch (err) {
      setError(err.response?.data?.message || t('forgotPassword.failedToSend'))
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
          <h2 className="text-3xl font-bold text-gray-900 mt-4">{t('forgotPassword.title')}</h2>
          <p className="text-gray-500 mt-1.5 text-sm">{t('forgotPassword.subtitle')}</p>
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
              {/* Success state */}
              <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-100 rounded-2xl mb-4">
                <CheckCircle className="h-8 w-8 text-emerald-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">{t('forgotPassword.emailSentTitle')}</h3>
              <p className="text-sm text-gray-500 mb-2">{t('forgotPassword.successMessage')}</p>
              <p className="text-xs text-gray-400 mb-6">{t('forgotPassword.successHint')}</p>

              <Link
                to={`/reset-password?email=${encodeURIComponent(email)}`}
                className="btn-primary inline-flex items-center gap-2 mb-4"
              >
                {t('forgotPassword.enterCode')}
                <ArrowRight className="h-4 w-4" />
              </Link>
              <div>
                <Link to="/login" className="text-sm text-primary-600 hover:text-primary-700 font-medium inline-flex items-center gap-1">
                  <ArrowLeft className="h-3.5 w-3.5" />
                  {t('forgotPassword.backToLogin')}
                </Link>
              </div>
            </div>
          ) : (
            <>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="email" className="form-label">{t('forgotPassword.emailAddress')}</label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      id="email" type="email" required
                      value={email} onChange={(e) => setEmail(e.target.value)}
                      className="input-field pl-10"
                      placeholder="you@example.com"
                      autoComplete="email"
                    />
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
                      {t('forgotPassword.sending')}
                    </>
                  ) : (
                    <>{t('forgotPassword.sendCode')} <ArrowRight className="h-4 w-4" /></>
                  )}
                </button>
              </form>

              <div className="mt-6 pt-5 border-t border-gray-100 text-center">
                <Link to="/login" className="text-sm font-medium text-primary-600 hover:text-primary-700 inline-flex items-center gap-1">
                  <ArrowLeft className="h-3.5 w-3.5" />
                  {t('forgotPassword.backToLogin')}
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default ForgotPassword
