import api from './api'

const registrationService = {
  // Register for an event
  registerForEvent: async (eventId) => {
    const response = await api.post(`/registrations/events/${eventId}`)
    return response.data
  },

  // Cancel registration
  cancelRegistration: async (eventId) => {
    await api.delete(`/registrations/events/${eventId}`)
  },

  // Get user's registrations
  getMyRegistrations: async () => {
    const response = await api.get('/registrations/my-registrations')
    return response.data
  },

  // Check if user is registered for an event
  checkRegistration: async (eventId) => {
    const response = await api.get(`/registrations/events/${eventId}/check`)
    return response.data.isRegistered
  }
}

export default registrationService
