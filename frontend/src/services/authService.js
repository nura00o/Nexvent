import api from './api'
import { setTokens, clearTokens, getUserFromToken } from './tokenService'

/**
 * Auth service — all authentication API calls.
 * Endpoints match the backend AuthController exactly.
 */
const authService = {
  /**
   * Register a new user.
   * POST /api/auth/register  →  201 Created (no body)
   * @param {{ fullName: string, email: string, password: string }} data
   */
  register: async (data) => {
    await api.post('/auth/register', {
      fullName: data.fullName,
      email: data.email,
      password: data.password,
    })
  },

  /**
   * Login — returns TokenResponse { accessToken, refreshToken }.
   * Stores both tokens via tokenService.
   * POST /api/auth/login
   * @param {{ email: string, password: string }} data
   * @returns {Promise<{ email: string, roles: string[], exp: number } | null>}
   */
  login: async (data) => {
    const response = await api.post('/auth/login', {
      email: data.email,
      password: data.password,
    })

    const { accessToken, refreshToken } = response.data
    setTokens(accessToken, refreshToken)

    return getUserFromToken()
  },

  /**
   * Refresh tokens using the refresh token.
   * POST /api/auth/refresh?refreshToken=...
   * @param {string} refreshToken
   * @returns {Promise<{ email: string, roles: string[], exp: number } | null>}
   */
  refresh: async (refreshToken) => {
    const response = await api.post(
      `/auth/refresh?refreshToken=${encodeURIComponent(refreshToken)}`,
    )

    const { accessToken: newAccess, refreshToken: newRefresh } = response.data
    setTokens(newAccess, newRefresh)

    return getUserFromToken()
  },

  /**
   * Start password reset — sends a code to the user's email.
   * POST /api/auth/reset/start  →  200 OK (no body)
   * @param {{ email: string }} data
   */
  resetStart: async (data) => {
    await api.post('/auth/reset/start', { email: data.email })
  },

  /**
   * Finish password reset — verifies code and sets new password.
   * POST /api/auth/reset/finish  →  200 OK (no body)
   * @param {{ email: string, code: string, newPassword: string }} data
   */
  resetFinish: async (data) => {
    await api.post('/auth/reset/finish', {
      email: data.email,
      code: data.code,
      newPassword: data.newPassword,
    })
  },

  /**
   * Logout — clears all tokens.
   */
  logout: () => {
    clearTokens()
  },

  /**
   * Get current user from in-memory access token.
   * @returns {{ email: string, roles: string[], exp: number } | null}
   */
  getCurrentUser: () => {
    return getUserFromToken()
  },
}

export default authService
