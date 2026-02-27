import api from './api'

const PAGE_SIZE = 12

/**
 * Organizer API layer.
 * All endpoints live under /api/organizer (set by backend OrganizerController).
 *
 * @typedef {Object} EventRequest
 * @property {string}  title
 * @property {string}  description
 * @property {number}  categoryId
 * @property {string}  date        — ISO date (yyyy-MM-dd)
 * @property {string}  time        — HH:mm
 * @property {string}  location
 * @property {number|null}  latitude
 * @property {number|null}  longitude
 * @property {number|null}  capacity
 * @property {boolean} published
 * @property {number|null}  price   — price in tiyins (cents)
 * @property {string|null}  coverUrl
 *
 * @typedef {Object} EventResponse
 * @property {number}  id
 * @property {string}  title
 * @property {string}  description
 * @property {string}  category
 * @property {string}  date
 * @property {string}  time
 * @property {string}  location
 * @property {number|null}  latitude
 * @property {number|null}  longitude
 * @property {number|null}  capacity
 * @property {boolean} published
 * @property {number|null}  price
 * @property {string|null}  coverUrl
 * @property {number}  organizerId
 *
 * @typedef {Object} RegistrationDto
 * @property {number} id
 * @property {number} eventId
 * @property {string} eventTitle
 * @property {string} status      — REGISTERED | PAID | CANCELLED
 * @property {number|null} unitPrice
 *
 * @typedef {Object} Page
 * @property {Array}  content
 * @property {number} totalPages
 * @property {number} totalElements
 * @property {number} number       — current page (0-based)
 * @property {number} size
 */

const organizerService = {
    /* ───────── Events CRUD ───────── */

    /**
     * GET /api/organizer/my-events?page=&size=
     * @param {{ page?: number, size?: number }} params
     * @returns {Promise<Page & { content: EventResponse[] }>}
     */
    getMyEvents: async ({ page = 0, size = PAGE_SIZE } = {}) => {
        const response = await api.get('/organizer/my-events', { params: { page, size } })
        return response.data
    },

    /**
     * POST /api/organizer/events
     * @param {EventRequest} eventData
     * @returns {Promise<EventResponse>}
     */
    createEvent: async (eventData) => {
        const response = await api.post('/organizer/events', eventData)
        return response.data
    },

    /**
     * PUT /api/organizer/events/{id}
     * @param {number|string} id
     * @param {EventRequest} eventData
     * @returns {Promise<EventResponse>}
     */
    updateEvent: async (id, eventData) => {
        const response = await api.put(`/organizer/events/${id}`, eventData)
        return response.data
    },

    /**
     * DELETE /api/organizer/events/{id}
     * @param {number|string} id
     * @returns {Promise<void>}
     */
    deleteEvent: async (id) => {
        await api.delete(`/organizer/events/${id}`)
    },

    /* ───────── Registrations & Analytics ───────── */

    /**
     * GET /api/organizer/events/{id}/analytics
     * NOTE: backend AnalyticsService exists but may lack a controller mapping.
     * @param {number|string} eventId
     * @returns {Promise<Object>}
     */
    getEventAnalytics: async (eventId) => {
        const response = await api.get(`/organizer/events/${eventId}/analytics`)
        return response.data
    },

    /**
       * GET /api/organizer/events/{id}/registrations
       * @param {number|string} eventId
       * @returns {Promise<RegistrationDto[]>}
       */
    getEventRegistrations: async (eventId) => {
        const response = await api.get(`/organizer/events/${eventId}/registrations`)
        return response.data
    },

    /**
     * PATCH /api/organizer/registrations/{registrationId}/mark-paid
     * @param {number|string} registrationId
     * @returns {Promise<void>}
     */
    markPaid: async (registrationId) => {
        await api.patch(`/organizer/registrations/${registrationId}/mark-paid`)
    },
}

export default organizerService
