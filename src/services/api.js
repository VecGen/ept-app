import axios from 'axios'

// Get the API base URL and ensure it's HTTPS in production
let BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://mnwpivaen5.us-east-1.awsapprunner.com'

// Remove trailing slash to prevent double slashes in URLs
BASE_URL = BASE_URL.replace(/\/$/, '')

// Force HTTPS in production to prevent Mixed Content errors
if (window.location.protocol === 'https:' && BASE_URL.startsWith('http://')) {
  console.warn('🚨 Converting HTTP to HTTPS to prevent Mixed Content error')
  BASE_URL = BASE_URL.replace('http://', 'https://')
}

// Debug logging to see what URL is being used
console.log('🔧 API Configuration:', {
  VITE_API_BASE_URL: import.meta.env.VITE_API_BASE_URL,
  BASE_URL: BASE_URL,
  NODE_ENV: import.meta.env.NODE_ENV,
  MODE: import.meta.env.MODE,
  location_protocol: window.location.protocol,
  location_href: window.location.href
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
  console.log('🔍 getTeams called - BASE_URL:', BASE_URL)
  console.log('🔍 Full URL:', `${BASE_URL}/api/teams`)
  
  // Use relative URL to avoid CORS issues when on same domain
  const response = await api.get('/api/teams', {
    headers: {
      'Cache-Control': 'no-cache',
      'Pragma': 'no-cache'
    }
  })
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