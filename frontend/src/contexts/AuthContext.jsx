import React, { createContext, useState, useContext, useEffect, useCallback } from 'react'
import authService from '../services/authService'
import { getRefreshToken, clearTokens } from '../services/tokenService'
import { ROLES } from '../services/adminService'

const AuthContext = createContext(null)

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

  /**
   * On mount: try to restore the session.
   * Access token lives in memory and is lost on page reload,
   * so we use the persisted refresh token to obtain a new pair.
   */
  useEffect(() => {
    const restoreSession = async () => {
      const refreshToken = getRefreshToken()
      if (!refreshToken) {
        setLoading(false)
        return
      }

      try {
        const currentUser = await authService.refresh(refreshToken)
        setUser(currentUser)
      } catch {
        // Refresh failed — token is invalid/expired
        clearTokens()
      } finally {
        setLoading(false)
      }
    }

    restoreSession()
  }, [])

  /** @param {{ email: string, password: string }} data */
  const login = useCallback(async (email, password) => {
    const currentUser = await authService.login({ email, password })
    setUser(currentUser)
    return currentUser
  }, [])

  /** @param {{ fullName: string, email: string, password: string }} data */
  const register = useCallback(async (fullName, email, password) => {
    await authService.register({ fullName, email, password })
    // Auto-login after successful registration
    return await login(email, password)
  }, [login])

  const logout = useCallback(() => {
    authService.logout()
    setUser(null)
  }, [])

  /**
   * Re-fetch a fresh token pair and sync user state with the server's current roles.
   * Call this on pages where role information needs to be up-to-date (e.g. Profile).
   * @returns {Promise<void>}
   */
  const refreshUser = useCallback(async () => {
    const refreshToken = getRefreshToken()
    if (!refreshToken) return
    try {
      const updatedUser = await authService.refresh(refreshToken)
      setUser(updatedUser)
    } catch {
      // Refresh failed silently — leave stale data, don't log out
    }
  }, [])

  const isAuthenticated = useCallback(() => {
    return user !== null
  }, [user])

  const isAdmin = useCallback(() => {
    return user?.roles?.includes(ROLES.ADMIN) ?? false
  }, [user])

  const isOrganizer = useCallback(() => {
    return user?.roles?.includes(ROLES.ORGANIZER) ?? false
  }, [user])

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    refreshUser,
    isAuthenticated,
    isAdmin,
    isOrganizer,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
