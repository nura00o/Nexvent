/**
 * Centralized token management.
 *
 * Access token  — stored in module-level variable (memory only).
 * Refresh token — stored in localStorage (backend does not support httpOnly cookies).
 *
 * On page reload the access token is lost; AuthContext must call refresh()
 * to restore the session using the persisted refresh token.
 */

const REFRESH_KEY = 'nexvent_refresh_token'

/** @type {string | null} */
let accessToken = null

/* ───────── getters / setters ───────── */

/** @returns {string | null} */
export const getAccessToken = () => accessToken

/** @returns {string | null} */
export const getRefreshToken = () => localStorage.getItem(REFRESH_KEY)

/**
 * Save both tokens after login / refresh.
 * @param {string} access
 * @param {string} refresh
 */
export const setTokens = (access, refresh) => {
    accessToken = access
    if (refresh) {
        localStorage.setItem(REFRESH_KEY, refresh)
    }
}

/** Clear both tokens (logout). */
export const clearTokens = () => {
    accessToken = null
    localStorage.removeItem(REFRESH_KEY)
    // Also clean legacy keys left by old code
    localStorage.removeItem('token')
    localStorage.removeItem('user')
}

/* ───────── JWT helpers ───────── */

/**
 * Decode the payload section of a JWT.
 * @param {string} token
 * @returns {Record<string, unknown> | null}
 */
export const decodeJwt = (token) => {
    try {
        const base64 = token.split('.')[1]
        return JSON.parse(atob(base64))
    } catch {
        return null
    }
}

/**
 * Build a user object from the current access token.
 * Returns null when no token is available or it cannot be decoded.
 *
 * @returns {{ id: number, email: string, roles: string[], exp: number } | null}
 */
export const getUserFromToken = () => {
    if (!accessToken) return null

    const payload = decodeJwt(accessToken)
    if (!payload) return null

    return {
        id: /** @type {number} */ (payload.uid ?? null),
        email: /** @type {string} */ (payload.sub),
        roles: /** @type {string[]} */ (payload.authorities ?? payload.roles ?? []),
        exp: /** @type {number} */ (payload.exp),
    }
}

/**
 * Check whether the current access token is expired (or missing).
 * @returns {boolean}
 */
export const isTokenExpired = () => {
    const user = getUserFromToken()
    if (!user) return true
    // exp is in seconds, Date.now() is in ms
    return user.exp * 1000 < Date.now()
}
