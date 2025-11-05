import api from './api'

const eventService = {
  // Get all events with filters (public)
  getEvents: async (filters = {}) => {
    const params = new URLSearchParams()
    if (filters.category) params.append('category', filters.category)
    if (filters.dateFrom) params.append('dateFrom', filters.dateFrom)
    if (filters.dateTo) params.append('dateTo', filters.dateTo)
    if (filters.page !== undefined) params.append('page', filters.page)
    if (filters.size !== undefined) params.append('size', filters.size)
    
    const response = await api.get(`/events?${params.toString()}`)
    return response.data
  },

  // Get single event by ID (public)
  getEvent: async (id) => {
    const response = await api.get(`/events/${id}`)
    return response.data
  },

  // Create new event (organizer)
  createEvent: async (eventData) => {
    const response = await api.post('/events', eventData)
    return response.data
  },

  // Update event (organizer)
  updateEvent: async (id, eventData) => {
    const response = await api.put(`/organizer/events/${id}`, eventData)
    return response.data
  },

  // Delete event (organizer)
  deleteEvent: async (id) => {
    const response = await api.delete(`/organizer/events/${id}`)
    return response.data
  },
}

export default eventService
