import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import adminService from '../services/adminService'
import { useLanguage } from '../contexts/LanguageContext'
import LoadingSpinner from '../components/LoadingSpinner'
import { Users, Calendar, TrendingUp, Shield, PlusCircle, AlertCircle, ArrowRight } from 'lucide-react'

const AdminDashboard = () => {
  const { t } = useLanguage()
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [categoryName, setCategoryName] = useState('')
  const [creatingCategory, setCreatingCategory] = useState(false)
  const [categoryError, setCategoryError] = useState('')
  const [categorySuccess, setCategorySuccess] = useState('')

  useEffect(() => {
    loadStats()
  }, [])

  const loadStats = async () => {
    setLoading(true)
    try {
      const data = await adminService.getOverview()
      setStats(data)
    } catch (error) {
      console.error('Failed to load stats:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateCategory = async (e) => {
    e.preventDefault()
    setCategoryError('')
    setCategorySuccess('')

    if (!categoryName.trim()) {
      setCategoryError(t('admin.categoryRequired'))
      return
    }

    setCreatingCategory(true)
    try {
      await adminService.createCategory(categoryName)
      setCategorySuccess(t('admin.categorySuccess').replace('{{name}}', categoryName))
      setCategoryName('')
    } catch (error) {
      setCategoryError(error.response?.data?.message || t('admin.failedToCreateCategory'))
    } finally {
      setCreatingCategory(false)
    }
  }

  if (loading) {
    return (
      <div className="py-12">
        <LoadingSpinner size="large" />
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center space-x-3 mb-8">
        <Shield className="h-8 w-8 text-primary-600" />
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{t('admin.dashboardTitle')}</h1>
          <p className="text-gray-600">{t('admin.dashboardSubtitle')}</p>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <div className="card bg-gradient-to-br from-blue-500 to-blue-600 text-white">
          <div className="flex items-center justify-between mb-4">
            <Users className="h-8 w-8 opacity-80" />
            <TrendingUp className="h-5 w-5 opacity-60" />
          </div>
          <h3 className="text-2xl font-bold mb-1">{stats?.users || 0}</h3>
          <p className="text-blue-100">{t('admin.totalUsers')}</p>
        </div>

        <div className="card bg-gradient-to-br from-primary-500 to-primary-600 text-white">
          <div className="flex items-center justify-between mb-4">
            <Calendar className="h-8 w-8 opacity-80" />
            <TrendingUp className="h-5 w-5 opacity-60" />
          </div>
          <h3 className="text-2xl font-bold mb-1">{stats?.events || 0}</h3>
          <p className="text-primary-100">{t('admin.totalEvents')}</p>
        </div>

        <div className="card bg-gradient-to-br from-purple-500 to-purple-600 text-white">
          <div className="flex items-center justify-between mb-4">
            <Shield className="h-8 w-8 opacity-80" />
            <TrendingUp className="h-5 w-5 opacity-60" />
          </div>
          <h3 className="text-2xl font-bold mb-1">{t('admin.active')}</h3>
          <p className="text-purple-100">{t('admin.systemStatus')}</p>
        </div>
      </div>

      {/* Category Management */}
      <div className="card mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">{t('admin.categoryMgmt')}</h2>

        {categorySuccess && (
          <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg flex items-start space-x-2">
            <AlertCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-green-800">{categorySuccess}</p>
          </div>
        )}

        {categoryError && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start space-x-2">
            <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-red-800">{categoryError}</p>
          </div>
        )}

        <form onSubmit={handleCreateCategory} className="flex space-x-4">
          <input
            type="text"
            value={categoryName}
            onChange={(e) => setCategoryName(e.target.value)}
            placeholder={t('admin.categoryPlaceholder')}
            className="input-field flex-1"
          />
          <button
            type="submit"
            disabled={creatingCategory}
            className="btn-primary flex items-center space-x-2 disabled:opacity-50"
          >
            <PlusCircle className="h-5 w-5" />
            <span>{creatingCategory ? t('admin.creatingCategory') : t('admin.createCategory')}</span>
          </button>
        </form>

        <p className="text-sm text-gray-600 mt-3">
          {t('admin.categoryHint')}
        </p>
      </div>

      {/* User Management Section */}
      <div className="card">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-1">{t('admin.userMgmtTitle')}</h2>
            <p className="text-gray-600">
              {t('admin.userMgmtDesc')}
            </p>
          </div>
          <Link
            to="/admin/users"
            className="btn-primary flex items-center gap-2 whitespace-nowrap"
          >
            <Users className="h-5 w-5" />
            <span>{t('admin.manageUsers')}</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard
