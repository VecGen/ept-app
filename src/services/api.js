import axios from 'axios'

// Use HTTPS fallback instead of HTTP to prevent Mixed Content errors
const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://mnwpivaen5.us-east-1.awsapprunner.com'

// Debug logging to see what URL is being used
console.log('🔧 API Configuration:', {
  VITE_API_BASE_URL: import.meta.env.VITE_API_BASE_URL,
  BASE_URL: BASE_URL,
  NODE_ENV: import.meta.env.NODE_ENV,
  MODE: import.meta.env.MODE
})

// Create axios instance
const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
})

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('auth_token')
      localStorage.removeItem('user_type')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

// Auth functions
export const adminLogin = async (password) => {
  const response = await api.post('/api/auth/admin/login', { password })
  const { access_token, user_type } = response.data
  localStorage.setItem('auth_token', access_token)
  localStorage.setItem('user_type', user_type)
  return response.data
}

export const engineerLogin = async (teamName, developerName) => {
  const response = await api.post('/api/auth/engineer/login', {
    team_name: teamName,
    developer_name: developerName
  })
  const { access_token, user_type } = response.data
  localStorage.setItem('auth_token', access_token)
  localStorage.setItem('user_type', user_type)
  return response.data
}

export const logout = () => {
  localStorage.removeItem('auth_token')
  localStorage.removeItem('user_type')
}

// Team management functions
export const getTeams = async () => {
  const response = await api.get('/api/teams')
  return response.data
}

export const createTeam = async (teamData) => {
  const response = await api.post('/api/teams', teamData)
  return response.data
}

export const updateTeam = async (teamName, teamData) => {
  const response = await api.put(`/api/teams/${teamName}`, teamData)
  return response.data
}

export const deleteTeam = async (teamName) => {
  const response = await api.delete(`/api/teams/${teamName}`)
  return response.data
}

// Developer management functions
export const addDeveloper = async (teamName, developerData) => {
  const response = await api.post(`/api/teams/${teamName}/developers`, developerData)
  return response.data
}

export const removeDeveloper = async (teamName, developerName) => {
  const response = await api.delete(`/api/teams/${teamName}/developers/${developerName}`)
  return response.data
}

// Engineer functions
export const submitEntry = async (entryData) => {
  const response = await api.post('/api/engineer/entry', entryData)
  return response.data
}

export const getEngineerDashboard = async () => {
  const response = await api.get('/api/engineer/dashboard')
  return response.data
}

export const getEngineerSettings = async () => {
  const response = await api.get('/api/engineer/settings')
  return response.data
}

// Admin functions
export const getAdminDashboard = async () => {
  const response = await api.get('/api/admin/dashboard')
  return response.data
}

export const getTeamData = async (teamName) => {
  const response = await api.get(`/api/admin/teams/${teamName}/data`)
  return response.data
}

export const getTeamSettings = async () => {
  const response = await api.get('/api/admin/settings')
  return response.data
}

export const updateTeamSettings = async (settings) => {
  const response = await api.put('/api/admin/settings', settings)
  return response.data
}

// Analytics functions
export const getTeamAnalytics = async (teamName, dateRange) => {
  const response = await api.get(`/api/data/analytics/team/${teamName}`, {
    params: dateRange
  })
  return response.data
}

export const getOverallAnalytics = async (dateRange) => {
  const response = await api.get('/api/data/analytics/overall', {
    params: dateRange
  })
  return response.data
}

export const exportTeamData = async (teamName, format = 'excel') => {
  const response = await api.get(`/api/data/export/team/${teamName}`, {
    params: { format },
    responseType: 'blob'
  })
  return response.data
}

export default api 