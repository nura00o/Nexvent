import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { useLanguage } from '../contexts/LanguageContext'
import { Mail, Lock, User as UserIcon, AlertCircle, Zap, ArrowRight, Eye, EyeOff } from 'lucide-react'

const Register = () => {
  const { t } = useLanguage()
  const [formData, setFormData] = useState({ fullName: '', email: '', password: '', confirmPassword: '' })
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { register } = useAuth()
  const navigate = useNavigate()

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (formData.password !== formData.confirmPassword) { setError(t('auth.passwordsDoNotMatch')); return }
    if (formData.password.length < 6) { setError(t('auth.passwordMinLength')); return }
    setLoading(true)
    try {
      await register(formData.fullName, formData.email, formData.password)
      navigate('/')
    } catch (err) {
      setError(err.response?.data?.message || t('auth.registrationFailed'))
    } finally {
      setLoading(false)
    }
  }

  const Field = ({ id, name, type = 'text', label, placeholder, icon: Icon, autoComplete, right }) => (
    <div>
      <label htmlFor={id} className="form-label">{label}</label>
      <div className="relative">
        <Icon className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <input
          id={id} name={name} type={type} required
          value={formData[name]}
          onChange={handleChange}
          className={`input-field pl-10 ${right ? 'pr-11' : ''}`}
          placeholder={placeholder}
          autoComplete={autoComplete}
        />
        {right}
      </div>
    </div>
  )

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
          <h2 className="text-3xl font-bold text-gray-900 mt-4">{t('auth.createYourAccount')}</h2>
          <p className="text-gray-500 mt-1.5 text-sm">{t('auth.joinUsToDiscover')}</p>
        </div>

        {/* Card */}
        <div className="card shadow-card animate-fade-in-up delay-75">
          {error && (
            <div className="mb-5 p-3.5 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3 animate-fade-in-down">
              <AlertCircle className="h-4 w-4 text-red-500 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="fullName" className="form-label">{t('auth.fullName')}</label>
              <div className="relative">
                <UserIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input id="fullName" name="fullName" type="text" required value={formData.fullName} onChange={handleChange}
                  className="input-field pl-10" placeholder="John Doe" autoComplete="name" />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="form-label">{t('auth.emailAddress')}</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input id="email" name="email" type="email" required value={formData.email} onChange={handleChange}
                  className="input-field pl-10" placeholder="you@example.com" autoComplete="email" />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="form-label">{t('auth.password')}</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input id="password" name="password" type={showPassword ? 'text' : 'password'} required
                  value={formData.password} onChange={handleChange}
                  className="input-field pl-10 pr-11" placeholder="••••••••" autoComplete="new-password" />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors">
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div>
              <label htmlFor="confirmPassword" className="form-label">{t('auth.confirmPassword')}</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input id="confirmPassword" name="confirmPassword" type={showPassword ? 'text' : 'password'} required
                  value={formData.confirmPassword} onChange={handleChange}
                  className="input-field pl-10" placeholder="••••••••" autoComplete="new-password" />
              </div>
            </div>

            <button type="submit" disabled={loading}
              className="w-full btn-primary flex items-center justify-center gap-2 mt-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0">
              {loading ? (
                <>
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  {t('auth.creatingAccount')}
                </>
              ) : (
                <>{t('auth.createAccount')} <ArrowRight className="h-4 w-4" /></>
              )}
            </button>
          </form>

          <div className="mt-6 pt-5 border-t border-gray-100 text-center">
            <p className="text-sm text-gray-500">{t('auth.alreadyHaveAccount')}</p>
            <Link to="/login" className="mt-2 inline-block text-sm font-semibold text-primary-600 hover:text-primary-700">
              {t('auth.signInInstead')}
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Register
