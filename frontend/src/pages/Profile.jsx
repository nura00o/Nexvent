import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { useLanguage } from '../contexts/LanguageContext'
import { ROLES, ROLE_LABELS } from '../services/adminService'
import { User, Mail, Shield, Calendar, RefreshCw, CheckCircle, ArrowRight, BarChart3, LayoutDashboard } from 'lucide-react'

const ROLE_STYLES = {
  [ROLES.ADMIN]: { bg: 'bg-red-100', text: 'text-red-700', border: 'border-red-200', dot: 'bg-red-500' },
  [ROLES.ORGANIZER]: { bg: 'bg-purple-100', text: 'text-purple-700', border: 'border-purple-200', dot: 'bg-purple-500' },
  [ROLES.USER]: { bg: 'bg-blue-100', text: 'text-blue-700', border: 'border-blue-200', dot: 'bg-blue-500' },
}

const Profile = () => {
  const { t } = useLanguage()
  const { user, isAdmin, isOrganizer, refreshUser } = useAuth()
  const [refreshing, setRefreshing] = useState(false)
  const [justRefreshed, setJustRefreshed] = useState(false)

  useEffect(() => { refreshUser() }, []) // eslint-disable-line

  const handleRefresh = async () => {
    setRefreshing(true)
    setJustRefreshed(false)
    try {
      await refreshUser()
      setJustRefreshed(true)
      setTimeout(() => setJustRefreshed(false), 3000)
    } finally {
      setRefreshing(false)
    }
  }

  const roles = user?.roles ?? []
  const displayName = user?.fullName || user?.email?.split('@')[0] || 'User'
  const initials = displayName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)

  const InfoRow = ({ icon: Icon, label, value, action }) => (
    <div className="flex items-start gap-4 p-4 rounded-xl bg-gray-50 hover:bg-gray-100/70 transition-colors duration-150">
      <div className="p-2 bg-white rounded-lg shadow-sm border border-gray-200 flex-shrink-0">
        <Icon className="h-4 w-4 text-primary-600" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-0.5">{label}</p>
        {value}
      </div>
      {action}
    </div>
  )

  return (
    <div className="max-w-3xl mx-auto page-enter">
      {/* Hero Banner */}
      <div className="relative bg-gradient-to-br from-primary-600 via-primary-700 to-primary-900 rounded-2xl p-8 mb-6 text-white overflow-hidden">
        {/* Background decoration */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/4 blur-2xl pointer-events-none" />
        <div className="relative flex items-center gap-5">
          {/* Avatar */}
          <div className="h-20 w-20 rounded-2xl bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center flex-shrink-0 shadow-lg">
            <span className="text-2xl font-bold text-white">{initials}</span>
          </div>
          <div>
            <h1 className="text-2xl font-bold">{displayName}</h1>
            <p className="text-primary-200 text-sm mt-0.5">{user?.email}</p>
            <p className="text-primary-300 text-xs mt-1.5">
              {t('profile.memberSince').replace('{{year}}', new Date().getFullYear())}
            </p>
          </div>
        </div>
      </div>

      {/* Info Card */}
      <div className="card mb-5 space-y-3">
        {/* Email */}
        <InfoRow
          icon={Mail}
          label={t('profile.email')}
          value={<p className="text-gray-900 font-medium text-sm">{user?.email || t('profile.notAvailable')}</p>}
        />

        {/* Roles */}
        <InfoRow
          icon={Shield}
          label={t('profile.roles')}
          value={
            roles.length === 0
              ? <p className="text-gray-500 text-sm">{t('profile.noRoles')}</p>
              : (
                <div className="flex flex-wrap gap-2 mt-1">
                  {roles.map((role) => {
                    const style = ROLE_STYLES[role] ?? { bg: 'bg-gray-100', text: 'text-gray-700', border: 'border-gray-200', dot: 'bg-gray-400' }
                    return (
                      <span key={role} className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${style.bg} ${style.text} ${style.border}`}>
                        <span className={`h-2 w-2 rounded-full ${style.dot}`} />
                        {ROLE_LABELS[role] ?? role}
                      </span>
                    )
                  })}
                </div>
              )
          }
          action={
            <button onClick={handleRefresh} disabled={refreshing}
              className="flex items-center gap-1 text-xs text-primary-600 hover:text-primary-800 disabled:opacity-50 transition-colors whitespace-nowrap"
              title={t('profile.refresh')}>
              {justRefreshed
                ? <CheckCircle className="h-3.5 w-3.5 text-emerald-500" />
                : <RefreshCw className={`h-3.5 w-3.5 ${refreshing ? 'animate-spin' : ''}`} />
              }
              <span className="hidden sm:inline">{justRefreshed ? t('profile.updated') : t('profile.refresh')}</span>
            </button>
          }
        />

        {/* Account Status */}
        <InfoRow
          icon={Calendar}
          label={t('profile.accountStatus')}
          value={
            <div className="flex items-center gap-2 mt-0.5">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse-soft" />
              <span className="text-emerald-700 font-semibold text-sm">{t('profile.active')}</span>
            </div>
          }
        />
      </div>

      {/* JWT info */}
      <div className="card mb-5 bg-blue-50 border-blue-100">
        <p className="text-sm text-blue-700">{t('profile.jwtInfo')}</p>
      </div>

      {/* Shortcut panels */}
      <div className="space-y-4">
        {isAdmin() && (
          <div className="card bg-gradient-to-br from-primary-50 to-blue-50 border-2 border-primary-200 animate-fade-in-up">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary-100 rounded-xl">
                  <LayoutDashboard className="h-5 w-5 text-primary-700" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">{t('profile.adminAccess')}</h3>
                  <p className="text-xs text-gray-600 mt-0.5">{t('profile.adminDesc')}</p>
                </div>
              </div>
              <Link to="/admin" className="btn-primary flex items-center gap-1.5 text-sm whitespace-nowrap">
                {t('profile.goToAdmin')} <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        )}

        {isOrganizer() && (
          <div className="card bg-gradient-to-br from-purple-50 to-violet-50 border-2 border-purple-200 animate-fade-in-up delay-75">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-100 rounded-xl">
                  <BarChart3 className="h-5 w-5 text-purple-700" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">{t('profile.organizerAccess')}</h3>
                  <p className="text-xs text-gray-600 mt-0.5">{t('profile.organizerDesc')}</p>
                </div>
              </div>
              <Link to="/organizer" className="btn-primary flex items-center gap-1.5 text-sm whitespace-nowrap bg-purple-600 hover:bg-purple-700">
                {t('profile.goToOrganizer')} <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Profile
