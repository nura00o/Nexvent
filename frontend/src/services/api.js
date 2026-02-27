import axios from 'axios'
import {
  getAccessToken,
  getRefreshToken,
  setTokens,
  clearTokens,
} from './tokenService'

/* ───────── Axios instance ───────── */

const api = axios.create({
  baseURL: 'http://localhost:8080/api',
  headers: { 'Content-Type': 'application/json' },
})

/* ───────── Request interceptor ───────── */

api.interceptors.request.use(
  (config) => {
    const token = getAccessToken()
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error),
)

/* ───────── Refresh-token queue ───────── */

let isRefreshing = false
/** @type {Array<{ resolve: (token: string) => void, reject: (err: unknown) => void }>} */
let refreshQueue = []

/**
 * Process queued requests after a refresh attempt.
 * @param {string | null} newToken
 * @param {unknown} error
 */
const processQueue = (newToken, error) => {
  refreshQueue.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error)
    } else {
      resolve(/** @type {string} */(newToken))
    }
  })
  refreshQueue = []
}

/* ───────── Response interceptor ───────── */

/** Endpoints that should NOT trigger an auto-refresh attempt. */
const AUTH_PATHS = ['/auth/login', '/auth/register', '/auth/refresh']

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    // Only attempt refresh on 401 AND if the request is not an auth endpoint itself
    const isAuthEndpoint = AUTH_PATHS.some((p) => originalRequest.url?.includes(p))

    if (error.response?.status !== 401 || isAuthEndpoint || originalRequest._retry) {
      return Promise.reject(error)
    }

    // If a refresh is already in progress, queue this request
    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        refreshQueue.push({ resolve, reject })
      }).then((token) => {
        originalRequest.headers.Authorization = `Bearer ${token}`
        return api(originalRequest)
      })
    }

    originalRequest._retry = true
    isRefreshing = true

    const refreshToken = getRefreshToken()

    if (!refreshToken) {
      // No refresh token available — force logout
      clearTokens()
      isRefreshing = false
      processQueue(null, error)
      window.location.href = '/login'
      return Promise.reject(error)
    }

    try {
      // Call the backend refresh endpoint
      const { data } = await axios.post(
        `http://localhost:8080/api/auth/refresh?refreshToken=${encodeURIComponent(refreshToken)}`,
        null,
        { headers: { 'Content-Type': 'application/json' } },
      )

      const newAccess = data.accessToken
      const newRefresh = data.refreshToken
      setTokens(newAccess, newRefresh)

      // Retry the original request
      originalRequest.headers.Authorization = `Bearer ${newAccess}`
      processQueue(newAccess, null)

      return api(originalRequest)
    } catch (refreshError) {
      // Refresh failed — clear everything, redirect to login
      clearTokens()
      processQueue(null, refreshError)
      window.location.href = '/login'
      return Promise.reject(refreshError)
    } finally {
      isRefreshing = false
    }
  },
)

export default api
