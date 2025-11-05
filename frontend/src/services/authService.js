import api from './api'

const authService = {
  // Register new user
  register: async (fullName, email, password) => {
    const response = await api.post('/auth/register', { fullName, email, password })
    return response.data
  },

  // Login user
  // In authService.js, update the login function:
login: async (email, password) => {
  const response = await api.post('/auth/login', { email, password })
  if (response.data.accessToken) {
    localStorage.setItem('token', response.data.accessToken)
    // Save the entire user data including roles
    localStorage.setItem('user', JSON.stringify(response.data.user))
  }
  return response.data
},

// Update getCurrentUser to include roles
getCurrentUser: () => {
  const token = localStorage.getItem('token')
  const userStr = localStorage.getItem('user')
  
  if (!token || !userStr) return null
  
  try {
    const user = JSON.parse(userStr)
    const payload = JSON.parse(atob(token.split('.')[1]))
    
    return {
      ...user,
      exp: payload.exp
    }
  } catch (error) {
    console.error('Error parsing user data:', error)
    return null
  }
},

  // Forgot password - initiate reset
  forgotPassword: async (email) => {
    const response = await api.post(`/auth/forgot-password?email=${email}`)
    return response.data
  },

  // Reset password with token
  resetPassword: async (token, newPassword) => {
    const response = await api.post(`/auth/reset-password?token=${token}&newPassword=${newPassword}`)
    return response.data
  },

  // Logout (client-side only)
  logout: () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
  },

  // Get current user from token
  getCurrentUser: () => {
    const token = localStorage.getItem('token')
    if (!token) return null
    
    try {
      // Decode JWT token to get user info
      const payload = JSON.parse(atob(token.split('.')[1]))
      return {
        email: payload.sub,
        exp: payload.exp,
      }
    } catch (error) {
      return null
    }
  },

  // Check if user has specific role
  hasRole: (role) => {
    const token = localStorage.getItem('token')
    if (!token) return false
    
    try {
      const payload = JSON.parse(atob(token.split('.')[1]))
      // In Spring Security, roles are stored in authorities
      return payload.authorities?.includes(role) || false
    } catch (error) {
      return false
    }
  },
}

export default authService
