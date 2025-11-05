import React, { useState, useEffect } from 'react'
import adminService from '../services/adminService'
import LoadingSpinner from '../components/LoadingSpinner'
import { Users, Calendar, TrendingUp, Shield, PlusCircle, AlertCircle } from 'lucide-react'

const AdminDashboard = () => {
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
      setCategoryError('Category name is required')
      return
    }

    setCreatingCategory(true)
    try {
      await adminService.createCategory(categoryName)
      setCategorySuccess(`Category "${categoryName}" created successfully!`)
      setCategoryName('')
    } catch (error) {
      setCategoryError(error.response?.data?.message || 'Failed to create category')
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
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600">Manage your platform</p>
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
          <p className="text-blue-100">Total Users</p>
        </div>

        <div className="card bg-gradient-to-br from-primary-500 to-primary-600 text-white">
          <div className="flex items-center justify-between mb-4">
            <Calendar className="h-8 w-8 opacity-80" />
            <TrendingUp className="h-5 w-5 opacity-60" />
          </div>
          <h3 className="text-2xl font-bold mb-1">{stats?.events || 0}</h3>
          <p className="text-primary-100">Total Events</p>
        </div>

        <div className="card bg-gradient-to-br from-purple-500 to-purple-600 text-white">
          <div className="flex items-center justify-between mb-4">
            <Shield className="h-8 w-8 opacity-80" />
            <TrendingUp className="h-5 w-5 opacity-60" />
          </div>
          <h3 className="text-2xl font-bold mb-1">Active</h3>
          <p className="text-purple-100">System Status</p>
        </div>
      </div>

      {/* Category Management */}
      <div className="card mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Category Management</h2>
        
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
            placeholder="Enter category name"
            className="input-field flex-1"
          />
          <button
            type="submit"
            disabled={creatingCategory}
            className="btn-primary flex items-center space-x-2 disabled:opacity-50"
          >
            <PlusCircle className="h-5 w-5" />
            <span>{creatingCategory ? 'Creating...' : 'Create Category'}</span>
          </button>
        </form>

        <p className="text-sm text-gray-600 mt-3">
          Create categories to organize events better. Examples: Music, Tech, Sports, Arts, etc.
        </p>
      </div>

      {/* User Management Section */}
      <div className="card">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">User Management</h2>
        <p className="text-gray-600 mb-4">
          User lock/unlock functionality is available through the API. To manage users:
        </p>
        <ul className="list-disc list-inside space-y-2 text-gray-700">
          <li>Lock a user: <code className="bg-gray-100 px-2 py-1 rounded text-sm">PATCH /api/admin/users/:id/lock</code></li>
          <li>Unlock a user: <code className="bg-gray-100 px-2 py-1 rounded text-sm">PATCH /api/admin/users/:id/unlock</code></li>
        </ul>
        <p className="text-sm text-gray-600 mt-4">
          Note: A full user management UI can be implemented as needed with user listing, search, and inline lock/unlock actions.
        </p>
      </div>
    </div>
  )
}

export default AdminDashboard
