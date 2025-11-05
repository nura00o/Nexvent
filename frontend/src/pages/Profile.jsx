import React from 'react'
import { useAuth } from '../contexts/AuthContext'
import { User, Mail, Shield, Calendar } from 'lucide-react'

const Profile = () => {
  const { user, isAdmin } = useAuth()

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Profile</h1>

      <div className="card">
        <div className="flex items-center space-x-4 mb-6">
          <div className="h-20 w-20 rounded-full bg-gradient-to-r from-primary-400 to-primary-600 flex items-center justify-center">
            <User className="h-10 w-10 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              {user?.email?.split('@')[0] || 'User'}
            </h2>
            <p className="text-gray-600">Member since {new Date().getFullYear()}</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-start space-x-3 p-4 bg-gray-50 rounded-lg">
            <Mail className="h-5 w-5 text-primary-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-gray-900">Email</p>
              <p className="text-gray-600">{user?.email || 'Not available'}</p>
            </div>
          </div>

          <div className="flex items-start space-x-3 p-4 bg-gray-50 rounded-lg">
            <Shield className="h-5 w-5 text-primary-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-gray-900">Role</p>
              <p className="text-gray-600">
                {isAdmin() ? 'Administrator' : 'User'}
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-3 p-4 bg-gray-50 rounded-lg">
            <Calendar className="h-5 w-5 text-primary-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-gray-900">Account Status</p>
              <p className="text-gray-600">Active</p>
            </div>
          </div>
        </div>

        <div className="mt-6 pt-6 border-t border-gray-200">
          <h3 className="font-bold text-gray-900 mb-3">Account Information</h3>
          <p className="text-sm text-gray-600">
            Your account is secured with JWT authentication. Token expires in 7 days.
          </p>
        </div>
      </div>

      {isAdmin() && (
        <div className="card mt-6 bg-primary-50 border-2 border-primary-200">
          <div className="flex items-center space-x-2 mb-3">
            <Shield className="h-6 w-6 text-primary-600" />
            <h3 className="font-bold text-gray-900">Admin Access</h3>
          </div>
          <p className="text-sm text-gray-700 mb-4">
            You have administrator privileges. You can access the admin dashboard to manage users, categories, and view statistics.
          </p>
          <a href="/admin" className="btn-primary inline-block">
            Go to Admin Dashboard
          </a>
        </div>
      )}
    </div>
  )
}

export default Profile
