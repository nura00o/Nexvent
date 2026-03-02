import api from './api'

/**
 * @typedef {Object} UserSummaryDto
 * @property {number}   id
 * @property {string}   email
 * @property {string}   fullName
 * @property {boolean}  enabled
 * @property {boolean}  locked
 * @property {string[]} roles
 */

/** Allowed role constants (match backend exactly). */
export const ROLES = /** @type {const} */ ({
  USER: 'ROLE_USER',
  ORGANIZER: 'ROLE_ORGANIZER',
  ADMIN: 'ROLE_ADMIN',
})

/** All assignable roles for the multi-select UI. */
export const ALL_ROLES = [ROLES.USER, ROLES.ORGANIZER, ROLES.ADMIN]

/** Human-readable labels by role key. */
export const ROLE_LABELS = {
  [ROLES.USER]: 'User',
  [ROLES.ORGANIZER]: 'Organizer',
  [ROLES.ADMIN]: 'Admin',
}

const adminService = {
  // ── Users ────────────────────────────────────────────

  /**
   * List all users.
   * @returns {Promise<UserSummaryDto[]>}
   */
  getUsers: async () => {
    const response = await api.get('/admin/users')
    return response.data
  },

  /**
   * Set roles for a user (replaces the full set).
   * @param {number}   userId
   * @param {string[]} roles — e.g. ['ROLE_USER', 'ROLE_ORGANIZER']
   * @returns {Promise<UserSummaryDto>}
   */
  setRoles: async (userId, roles) => {
    const response = await api.put(`/admin/users/${userId}/roles`, { roles })
    return response.data
  },

  /**
   * Lock a user account.
   * @param {number} userId
   * @returns {Promise<UserSummaryDto>}
   */
  lockUser: async (userId) => {
    const response = await api.patch(`/admin/users/${userId}/lock`)
    return response.data
  },

  /**
   * Unlock a user account.
   * @param {number} userId
   * @returns {Promise<UserSummaryDto>}
   */
  unlockUser: async (userId) => {
    const response = await api.patch(`/admin/users/${userId}/unlock`)
    return response.data
  },

  /**
   * Grant ROLE_ORGANIZER to a user.
   * @param {number} userId
   * @returns {Promise<UserSummaryDto>}
   */
  grantOrganizer: async (userId) => {
    const response = await api.patch(`/admin/users/${userId}/grant-organizer`)
    return response.data
  },

  /**
   * Revoke ROLE_ORGANIZER from a user.
   * @param {number} userId
   * @returns {Promise<UserSummaryDto>}
   */
  revokeOrganizer: async (userId) => {
    const response = await api.patch(`/admin/users/${userId}/revoke-organizer`)
    return response.data
  },

  // ── Stats / Categories (existing) ───────────────────

    /** @returns {Promise<{users: number, events: number, locked: number, tickets: number}>} */
    getOverview: async () => {
        const { data } = await api.get('/admin/stats/overview')

        return {
            users: data.usersTotal ?? 0,
            events: data.eventsTotal ?? 0,
            locked: data.usersLocked ?? 0,
            tickets: data.ticketsTotal ?? 0,
        }
    },

  /**
   * @param {string} name
   * @returns {Promise<*>}
   */
  createCategory: async (name) => {
    const response = await api.post(`/admin/categories?name=${name}`)
    return response.data
  },
}

export default adminService
