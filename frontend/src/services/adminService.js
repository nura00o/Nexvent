import api from './api'

const adminService = {
  // Get overview statistics
  getOverview: async () => {
    const response = await api.get('/admin/stats/overview')
    return response.data
  },

  // Create new category
  createCategory: async (name) => {
    const response = await api.post(`/admin/categories?name=${name}`)
    return response.data
  },

  // Lock user account
  lockUser: async (userId) => {
    const response = await api.patch(`/admin/users/${userId}/lock`)
    return response.data
  },

  // Unlock user account
  unlockUser: async (userId) => {
    const response = await api.patch(`/admin/users/${userId}/unlock`)
    return response.data
  },
}

export default adminService
