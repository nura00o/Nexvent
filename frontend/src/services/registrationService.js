import api from './api'

/**
 * User-facing registration service.
 * Endpoints match the backend RegistrationController (under /api/registrations).
 */
const registrationService = {
  /**
   * POST /api/registrations/events/{eventId}
   * Register the current user for an event.
   * @returns {Promise<RegistrationDto>} { id, eventId, eventTitle, status, unitPrice }
   */
  registerForEvent: async (eventId) => {
    const response = await api.post(`/registrations/events/${eventId}`)
    return response.data
  },

  /**
   * GET /api/registrations/my
   * Fetch all registrations for the current user.
   * @returns {Promise<RegistrationDto[]>}
   */
  getMyRegistrations: async () => {
    const response = await api.get('/registrations/my')
    return response.data
  },

  /**
   * PATCH /api/registrations/{registrationId}/cancel
   * Cancel a registration by its ID (not the event ID).
   * @param {number} registrationId
   */
  cancelRegistration: async (registrationId) => {
    await api.patch(`/registrations/${registrationId}/cancel`)
  },
}

export default registrationService

