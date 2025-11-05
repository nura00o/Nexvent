import React, { useState } from 'react'
import { Outlet, Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { useLanguage } from '../contexts/LanguageContext'
import LanguageSwitcher from './LanguageSwitcher'
import { Calendar, Home, PlusCircle, LayoutDashboard, User, LogOut, Menu, X, Ticket } from 'lucide-react'

const Layout = () => {
  const { user, isAuthenticated, isAdmin, logout } = useAuth()
  const { t } = useLanguage()
  const navigate = useNavigate()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-white shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            {/* Logo and Brand */}
            <div className="flex items-center">
              <Link to="/" className="flex items-center space-x-2">
                <Calendar className="h-8 w-8 text-primary-600" />
                <span className="text-2xl font-bold text-gray-900">Nexvent</span>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-4">
              <Link to="/" className="flex items-center space-x-1 px-3 py-2 rounded-md text-gray-700 hover:bg-gray-100 transition">
                <Home className="h-5 w-5" />
                <span>{t('nav.events')}</span>
              </Link>

              {isAuthenticated() && (
                <>
                  <Link to="/my-events" className="flex items-center space-x-1 px-3 py-2 rounded-md text-gray-700 hover:bg-gray-100 transition">
                    <Calendar className="h-5 w-5" />
                    <span>{t('nav.myEvents')}</span>
                  </Link>
                  
                  <Link to="/my-registrations" className="flex items-center space-x-1 px-3 py-2 rounded-md text-gray-700 hover:bg-gray-100 transition">
                    <Ticket className="h-5 w-5" />
                    <span>{t('nav.myRegistrations')}</span>
                  </Link>
                  
                  <Link to="/events/create" className="flex items-center space-x-1 px-3 py-2 rounded-md text-primary-600 hover:bg-primary-50 transition">
                    <PlusCircle className="h-5 w-5" />
                    <span>{t('nav.createEvent')}</span>
                  </Link>
                  
                  {isAdmin() && (
                    <Link to="/admin" className="flex items-center space-x-1 px-3 py-2 rounded-md text-gray-700 hover:bg-gray-100 transition">
                      <LayoutDashboard className="h-5 w-5" />
                      <span>{t('nav.admin')}</span>
                    </Link>
                  )}
                  
                  <Link to="/profile" className="flex items-center space-x-1 px-3 py-2 rounded-md text-gray-700 hover:bg-gray-100 transition">
                    <User className="h-5 w-5" />
                    <span>{t('nav.profile')}</span>
                  </Link>
                  
                  <button onClick={handleLogout} className="flex items-center space-x-1 px-3 py-2 rounded-md text-red-600 hover:bg-red-50 transition">
                    <LogOut className="h-5 w-5" />
                    <span>{t('nav.logout')}</span>
                  </button>
                </>
              )}

              {!isAuthenticated() && (
                <>
                  <Link to="/login" className="px-4 py-2 text-gray-700 hover:text-primary-600 transition">
                    {t('nav.login')}
                  </Link>
                  <Link to="/register" className="btn-primary">
                    {t('nav.register')}
                  </Link>
                </>
              )}
              
              <LanguageSwitcher />
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center space-x-2">
              <LanguageSwitcher />
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="text-gray-700 hover:text-primary-600"
              >
                {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 bg-white">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <Link to="/" className="block px-3 py-2 rounded-md text-gray-700 hover:bg-gray-100" onClick={() => setMobileMenuOpen(false)}>
                <div className="flex items-center space-x-2">
                  <Home className="h-5 w-5" />
                  <span>{t('nav.events')}</span>
                </div>
              </Link>

              {isAuthenticated() && (
                <>
                  <Link to="/my-events" className="block px-3 py-2 rounded-md text-gray-700 hover:bg-gray-100" onClick={() => setMobileMenuOpen(false)}>
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-5 w-5" />
                      <span>{t('nav.myEvents')}</span>
                    </div>
                  </Link>
                  
                  <Link to="/my-registrations" className="block px-3 py-2 rounded-md text-gray-700 hover:bg-gray-100" onClick={() => setMobileMenuOpen(false)}>
                    <div className="flex items-center space-x-2">
                      <Ticket className="h-5 w-5" />
                      <span>{t('nav.myRegistrations')}</span>
                    </div>
                  </Link>
                  
                  <Link to="/events/create" className="block px-3 py-2 rounded-md text-primary-600 hover:bg-primary-50" onClick={() => setMobileMenuOpen(false)}>
                    <div className="flex items-center space-x-2">
                      <PlusCircle className="h-5 w-5" />
                      <span>{t('nav.createEvent')}</span>
                    </div>
                  </Link>
                  
                  {isAdmin() && (
                    <Link to="/admin" className="block px-3 py-2 rounded-md text-gray-700 hover:bg-gray-100" onClick={() => setMobileMenuOpen(false)}>
                      <div className="flex items-center space-x-2">
                        <LayoutDashboard className="h-5 w-5" />
                        <span>{t('nav.admin')}</span>
                      </div>
                    </Link>
                  )}
                  
                  <Link to="/profile" className="block px-3 py-2 rounded-md text-gray-700 hover:bg-gray-100" onClick={() => setMobileMenuOpen(false)}>
                    <div className="flex items-center space-x-2">
                      <User className="h-5 w-5" />
                      <span>{t('nav.profile')}</span>
                    </div>
                  </Link>
                  
                  <button onClick={() => { handleLogout(); setMobileMenuOpen(false); }} className="w-full text-left px-3 py-2 rounded-md text-red-600 hover:bg-red-50">
                    <div className="flex items-center space-x-2">
                      <LogOut className="h-5 w-5" />
                      <span>{t('nav.logout')}</span>
                    </div>
                  </button>
                </>
              )}

              {!isAuthenticated() && (
                <>
                  <Link to="/login" className="block px-3 py-2 rounded-md text-gray-700 hover:bg-gray-100" onClick={() => setMobileMenuOpen(false)}>
                    {t('nav.login')}
                  </Link>
                  <Link to="/register" className="block px-3 py-2 rounded-md text-primary-600 hover:bg-primary-50" onClick={() => setMobileMenuOpen(false)}>
                    {t('nav.register')}
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center text-gray-600">
            <p>&copy; 2024 Nexvent. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Layout
