import React, { useState, useEffect } from 'react'
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { useLanguage } from '../contexts/LanguageContext'
import LanguageSwitcher from './LanguageSwitcher'
import { Calendar, Home, PlusCircle, LayoutDashboard, User, LogOut, Menu, X, Ticket, Zap } from 'lucide-react'

const Layout = () => {
  const { user, isAuthenticated, isAdmin, isOrganizer, logout } = useAuth()
  const { t } = useLanguage()
  const navigate = useNavigate()
  const location = useLocation()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  // Navbar shadow-on-scroll
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 8)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false)
  }, [location.pathname])

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const isActive = (path) =>
    path === '/'
      ? location.pathname === '/'
      : location.pathname.startsWith(path)

  const NavLink = ({ to, icon: Icon, label }) => (
    <Link
      to={to}
      className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium transition-all duration-150
        ${isActive(to)
          ? 'text-primary-700 bg-primary-50'
          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
        }`}
    >
      <Icon className="h-4 w-4 flex-shrink-0" />
      <span>{label}</span>
    </Link>
  )

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className={`bg-white sticky top-0 z-50 border-b border-gray-200 transition-shadow duration-300 ${scrolled ? 'shadow-md' : 'shadow-sm'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            {/* Logo */}
            <div className="flex items-center">
              <Link to="/" className="flex items-center gap-2 group">
                <div className="p-1.5 bg-primary-600 rounded-lg group-hover:bg-primary-700 transition-colors duration-200">
                  <Zap className="h-5 w-5 text-white" />
                </div>
                <span className="text-xl font-bold text-gray-900 tracking-tight">Nexvent</span>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-1">
              <NavLink to="/" icon={Home} label={t('nav.events')} />

              {isAuthenticated() && (
                <>
                  <NavLink to="/my-events" icon={Calendar} label={t('nav.myEvents')} />
                  <NavLink to="/my-registrations" icon={Ticket} label={t('nav.myRegistrations')} />

                  {(isOrganizer() || isAdmin()) && (
                    <Link
                      to="/events/create"
                      className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-semibold
                                 text-white bg-primary-600 hover:bg-primary-700 active:bg-primary-800
                                 transition-all duration-150 shadow-sm hover:shadow ml-1"
                    >
                      <PlusCircle className="h-4 w-4" />
                      <span>{t('nav.createEvent')}</span>
                    </Link>
                  )}

                  {isAdmin() && (
                    <NavLink to="/admin" icon={LayoutDashboard} label={t('nav.admin')} />
                  )}

                  <NavLink to="/profile" icon={User} label={t('nav.profile')} />

                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium
                               text-red-600 hover:text-red-700 hover:bg-red-50 transition-all duration-150"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>{t('nav.logout')}</span>
                  </button>
                </>
              )}

              {!isAuthenticated() && (
                <>
                  <Link to="/login" className="flex items-center px-4 py-2 rounded-xl text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-all duration-150">
                    {t('nav.login')}
                  </Link>
                  <Link to="/register" className="btn-primary ml-1">
                    {t('nav.register')}
                  </Link>
                </>
              )}

              <div className="ml-1 pl-2 border-l border-gray-200">
                <LanguageSwitcher />
              </div>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center gap-2">
              <LanguageSwitcher />
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                aria-label="Toggle menu"
              >
                {mobileMenuOpen
                  ? <X className="h-5 w-5" />
                  : <Menu className="h-5 w-5" />
                }
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-100 bg-white animate-fade-in-down">
            <div className="px-3 py-3 space-y-1">
              <Link to="/" className={`flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-medium ${isActive('/') ? 'bg-primary-50 text-primary-700' : 'text-gray-700 hover:bg-gray-100'}`}>
                <Home className="h-4 w-4" /> {t('nav.events')}
              </Link>

              {isAuthenticated() && (
                <>
                  <Link to="/my-events" className={`flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-medium ${isActive('/my-events') ? 'bg-primary-50 text-primary-700' : 'text-gray-700 hover:bg-gray-100'}`}>
                    <Calendar className="h-4 w-4" /> {t('nav.myEvents')}
                  </Link>
                  <Link to="/my-registrations" className={`flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-medium ${isActive('/my-registrations') ? 'bg-primary-50 text-primary-700' : 'text-gray-700 hover:bg-gray-100'}`}>
                    <Ticket className="h-4 w-4" /> {t('nav.myRegistrations')}
                  </Link>

                  {(isOrganizer() || isAdmin()) && (
                    <Link to="/events/create" className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-semibold text-white bg-primary-600 hover:bg-primary-700">
                      <PlusCircle className="h-4 w-4" /> {t('nav.createEvent')}
                    </Link>
                  )}

                  {isAdmin() && (
                    <Link to="/admin" className={`flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-medium ${isActive('/admin') ? 'bg-primary-50 text-primary-700' : 'text-gray-700 hover:bg-gray-100'}`}>
                      <LayoutDashboard className="h-4 w-4" /> {t('nav.admin')}
                    </Link>
                  )}

                  <Link to="/profile" className={`flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-medium ${isActive('/profile') ? 'bg-primary-50 text-primary-700' : 'text-gray-700 hover:bg-gray-100'}`}>
                    <User className="h-4 w-4" /> {t('nav.profile')}
                  </Link>

                  <button onClick={handleLogout} className="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50">
                    <LogOut className="h-4 w-4" /> {t('nav.logout')}
                  </button>
                </>
              )}

              {!isAuthenticated() && (
                <>
                  <Link to="/login" className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-100">
                    {t('nav.login')}
                  </Link>
                  <Link to="/register" className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-semibold text-white bg-primary-600">
                    {t('nav.register')}
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="p-1 bg-primary-600 rounded-md">
                <Zap className="h-4 w-4 text-white" />
              </div>
              <span className="font-bold text-gray-800 text-sm">Nexvent</span>
            </div>
            <p className="text-center text-sm text-gray-500">{t('footer.copyright')}</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Layout
