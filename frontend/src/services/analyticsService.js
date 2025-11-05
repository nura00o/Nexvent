import api from './api'

const analyticsService = {
  // Get event analytics (organizer only)
  getEventAnalytics: async (eventId) => {
    const response = await api.get(`/organizer/events/${eventId}/analytics`)
    return response.data
  },

  // Get event registrations list (organizer only)
  getEventRegistrations: async (eventId) => {
    const response = await api.get(`/organizer/events/${eventId}/registrations`)
    return response.data
  }
}

export default analyticsService
