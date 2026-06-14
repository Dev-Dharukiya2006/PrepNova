const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

// Helper function to make API requests
async function apiRequest(endpoint, options = {}) {
  const token = localStorage.getItem('token')

  const config = {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers
    }
  }

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config)
    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.message || 'API request failed')
    }

    return data
  } catch (error) {
    console.error('API Error:', error)
    throw error
  }
}

// Auth API
export const authAPI = {
  register: (userData) => apiRequest('/auth/register', {
    method: 'POST',
    body: JSON.stringify(userData)
  }),

  login: async (email, password) => {
    const data = await apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    })
    if (data.data?.token) {
      localStorage.setItem('token', data.data.token)
    }
    return data
  },

  logout: async () => {
    localStorage.removeItem('token')
    return apiRequest('/auth/logout', { method: 'POST' })
  },

  getMe: () => apiRequest('/auth/me'),

  forgotPassword: (email) => apiRequest('/auth/forgot-password', {
    method: 'POST',
    body: JSON.stringify({ email })
  }),

  verifyToken: () => apiRequest('/auth/verify')
}

// User API
export const userAPI = {
  getProfile: () => apiRequest('/users/profile'),

  updateProfile: (updates) => apiRequest('/users/profile', {
    method: 'PUT',
    body: JSON.stringify(updates)
  }),

  getProgress: () => apiRequest('/users/progress'),

  getDashboardStats: () => apiRequest('/users/dashboard')
}

// Aptitude API
export const aptitudeAPI = {
  getTopics: (category) => {
    const params = category ? `?category=${category}` : ''
    return apiRequest(`/aptitude/topics${params}`)
  },

  getTopic: (id) => apiRequest(`/aptitude/topics/${id}`),

  getQuestions: (topicId, difficulty = null, limit = 10) => {
    const params = new URLSearchParams({ limit, random: true })
    if (difficulty) params.append('difficulty', difficulty)
    return apiRequest(`/aptitude/topics/${topicId}/questions?${params}`)
  },

  submitTest: (data) => apiRequest('/aptitude/submit', {
    method: 'POST',
    body: JSON.stringify(data)
  }),

  getResults: () => apiRequest('/aptitude/results')
}

// DSA API
export const dsaAPI = {
  getTopics: () => apiRequest('/dsa/topics'),

  getTopic: (id) => apiRequest(`/dsa/topics/${id}`),

  getQuestions: (topicId, difficulty = null, limit = 10) => {
    const params = new URLSearchParams({ limit, random: true })
    if (difficulty) params.append('difficulty', difficulty)
    return apiRequest(`/dsa/topics/${topicId}/questions?${params}`)
  },

  submitTest: (data) => apiRequest('/dsa/submit', {
    method: 'POST',
    body: JSON.stringify(data)
  }),

  getResults: () => apiRequest('/dsa/results')
}

// Company API
export const companyAPI = {
  getAll: (category, search) => {
    const params = new URLSearchParams()
    if (category) params.append('category', category)
    if (search) params.append('search', search)
    const queryString = params.toString()
    return apiRequest(`/companies${queryString ? `?${queryString}` : ''}`)
  },

  getOne: (id) => apiRequest(`/companies/${id}`),

  save: (companyId, isSaved) => apiRequest(`/companies/${companyId}/save`, {
    method: 'POST',
    body: JSON.stringify({ isSaved })
  }),

  markComplete: (companyId, isCompleted) => apiRequest(`/companies/${companyId}/complete`, {
    method: 'POST',
    body: JSON.stringify({ isCompleted })
  }),

  getUserCompanies: () => apiRequest('/companies/user/saved')
}

// Admin API
export const adminAPI = {
  getStats: () => apiRequest('/admin/stats'),

  getUsers: () => apiRequest('/admin/users'),

  // Aptitude questions
  getAptitudeQuestions: (topicId) => {
    const params = topicId ? `?topicId=${topicId}` : ''
    return apiRequest(`/admin/aptitude/questions${params}`)
  },

  createAptitudeQuestion: (data) => apiRequest('/admin/aptitude/questions', {
    method: 'POST',
    body: JSON.stringify(data)
  }),

  updateAptitudeQuestion: (id, data) => apiRequest(`/admin/aptitude/questions/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data)
  }),

  deleteAptitudeQuestion: (id) => apiRequest(`/admin/aptitude/questions/${id}`, {
    method: 'DELETE'
  }),

  // DSA questions
  getDSAQuestions: (topicId) => {
    const params = topicId ? `?topicId=${topicId}` : ''
    return apiRequest(`/admin/dsa/questions${params}`)
  },

  createDSAQuestion: (data) => apiRequest('/admin/dsa/questions', {
    method: 'POST',
    body: JSON.stringify(data)
  }),

  deleteDSAQuestion: (id) => apiRequest(`/admin/dsa/questions/${id}`, {
    method: 'DELETE'
  }),

  // Companies
  createCompany: (data) => apiRequest('/admin/companies', {
    method: 'POST',
    body: JSON.stringify(data)
  }),

  updateCompany: (id, data) => apiRequest(`/admin/companies/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data)
  }),

  deleteCompany: (id) => apiRequest(`/admin/companies/${id}`, {
    method: 'DELETE'
  }),

  // Topics
  createAptitudeTopic: (data) => apiRequest('/admin/aptitude/topics', {
    method: 'POST',
    body: JSON.stringify(data)
  }),

  createDSATopic: (data) => apiRequest('/admin/dsa/topics', {
    method: 'POST',
    body: JSON.stringify(data)
  })
}

export default {
  auth: authAPI,
  user: userAPI,
  aptitude: aptitudeAPI,
  dsa: dsaAPI,
  company: companyAPI,
  admin: adminAPI
}
