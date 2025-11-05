import React, { createContext, useState, useContext, useEffect } from 'react'
import authService from '../services/authService'

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    
    const token = localStorage.getItem('token')
    if (token) {
      const currentUser = authService.getCurrentUser()
      if (currentUser) {
        setUser(currentUser)
      } else {
        localStorage.removeItem('token')
      }
    }
    setLoading(false)
  }, [])

  const login = async (email, password) => {
    const response = await authService.login(email, password)
    localStorage.setItem('token', response.accessToken)
    const currentUser = authService.getCurrentUser()
    setUser(currentUser)
    return currentUser
  }

  const register = async (fullName, email, password) => {
    await authService.register(fullName, email, password)
    
    return await login(email, password)
  }

  const logout = () => {
    authService.logout()
    setUser(null)
  }

  const isAuthenticated = () => {
    return user !== null
  }

  const hasRole = (role) => {
    return authService.hasRole(role)
  }

  const isAdmin = () => {
    return user && user.roles && user.roles.includes('ROLE_ADMIN')
  }

  const isOrganizer = () => {
  return user && user.roles && user.roles.includes('ROLE_ORGANIZER')
}


  const value = {
  user,
  loading,
  login,
  register,
  logout,
  isAuthenticated,
  isAdmin,
  isOrganizer
}

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
