import api from './api'

const PAGE_SIZE = 12

/**
 * Public events service — read-only endpoints for all users.
 */
const eventService = {
  /**
   * Get paginated list of published events.
   * GET /api/events?page=&size=
   * @param {{ page?: number, size?: number }} params
   * @returns {Promise<{ content: Array, totalPages: number, totalElements: number }>}
   */
  getEvents: async ({ page = 0, size = PAGE_SIZE } = {}) => {
    const response = await api.get('/events', { params: { page, size } })
    return response.data
  },

  /**
   * Get single event by ID.
   * GET /api/events/{id}
   * @param {number|string} id
   */
  getEvent: async (id) => {
    const response = await api.get(`/events/${id}`)
    return response.data
  },
}

export default eventService

