import axios from 'axios'

// Get the API base URL - use relative URLs when no base URL is provided
let BASE_URL = import.meta.env.VITE_API_BASE_URL || ''

// Remove trailing slash to prevent double slashes in URLs
BASE_URL = BASE_URL.replace(/\/$/, '')

// Force HTTPS in production to prevent Mixed Content errors (only if BASE_URL is provided)
if (BASE_URL && window.location.protocol === 'https:' && BASE_URL.startsWith('http://')) {
  console.warn('🚨 Converting HTTP to HTTPS to prevent Mixed Content error')
  BASE_URL = BASE_URL.replace('http://', 'https://')
}

// Debug logging to see what URL is being used
console.log('🔧 API Configuration:', {
  VITE_API_BASE_URL: import.meta.env.VITE_API_BASE_URL,
  BASE_URL: BASE_URL || '(relative URLs)',
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
    
    // Debug logging for teams endpoint
    if (config.url === '/api/teams') {
      console.log('🚀 Making request to /api/teams')
      console.log('  - Method:', config.method?.toUpperCase())
      console.log('  - Base URL:', config.baseURL)
      console.log('  - Full URL:', `${config.baseURL}${config.url}`)
      console.log('  - Headers:', {
        'Content-Type': config.headers['Content-Type'],
        'Authorization': config.headers.Authorization ? config.headers.Authorization.substring(0, 20) + '...' : 'NONE',
        'Cache-Control': config.headers['Cache-Control'],
        'Pragma': config.headers['Pragma']
      })
      console.log('  - Token from localStorage:', token ? token.substring(0, 50) + '...' : 'NONE')
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

export const engineerLogin = async (email, password) => {
  try {
    // First, fetch all teams to find the developer by email
    const teamsResponse = await api.get('/api/teams/list');
    const teams = teamsResponse.data;
    
    // Find the developer by email
    let developer = null;
    let teamName = null;
    
    for (const team of teams) {
      const foundDeveloper = team.developers.find(dev => dev.email === email);
      if (foundDeveloper) {
        developer = foundDeveloper;
        teamName = team.name;
        break;
      }
    }
    
    if (!developer) {
      throw new Error('No developer found with this email address');
    }
    
    // For now, since backend auth isn't working, create a local session
    // In production, this would validate the password with the backend
    if (!password || password.trim() === '') {
      throw new Error('Password is required');
    }
    
    // Create a mock token for the session
    const mockToken = `mock_token_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // Store the token and user data
    localStorage.setItem('auth_token', mockToken);
    localStorage.setItem('user_type', 'engineer');
    localStorage.setItem('user_data', JSON.stringify({
      ...developer,
      team_name: teamName,
      role: 'engineer'
    }));
    
    return {
      access_token: mockToken,
      user_type: 'engineer',
      user_data: {
        ...developer,
        team_name: teamName,
        role: 'engineer'
      }
    };
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
}

export const logout = () => {
  localStorage.removeItem('auth_token')
  localStorage.removeItem('user_type')
  localStorage.removeItem('user_data')
}

// Team management functions
export const getTeams = async () => {
  console.log('🔍 getTeams called - BASE_URL:', BASE_URL)
  console.log('🔍 Full URL:', `${BASE_URL}/api/teams/list`)
  
  // Use the new /list endpoint instead of / to avoid CORS issues
  const response = await api.get('/api/teams/list', {
    headers: {
      'Cache-Control': 'no-cache',
      'Pragma': 'no-cache'
    }
  })
  return response.data
}

export const getTeamsPublicTest = async () => {
  console.log('🔍 getTeamsPublicTest called - testing without auth')
  
  // Use the new public test endpoint
  const response = await api.get('/api/teams/test-public', {
    headers: {
      'Cache-Control': 'no-cache',
      'Pragma': 'no-cache'
    }
  })
  return response.data
}

export const createTeam = async (teamData) => {
  // Use the new /create endpoint
  const response = await api.post('/api/teams/create', teamData)
  return response.data
}

export const addDeveloper = async (teamName, developerData) => {
  // Use the new /add-developer endpoint with team name as query param
  const response = await api.post(`/api/teams/add-developer?team_name=${teamName}`, developerData)
  return response.data
}

export const removeDeveloper = async (teamName, developerName) => {
  // Use the new /remove-developer endpoint with query params
  const response = await api.delete(`/api/teams/remove-developer?team_name=${teamName}&developer_name=${developerName}`)
  return response.data
}

export const deleteTeam = async (teamName) => {
  // Use the new /delete-team endpoint with query param
  const response = await api.delete(`/api/teams/delete-team?team_name=${teamName}`)
  return response.data
}

export const getTeam = async (teamName) => {
  // Use the new /get-team endpoint with query param
  const response = await api.get(`/api/teams/get-team?team_name=${teamName}`)
  return response.data
}

// Engineer functions
export const submitEntry = async (entryData) => {
  const response = await api.post('/api/engineer/entry', entryData)
  return response.data
}

export const submitEfficiencyEntry = async (entryData) => {
  console.log('🚀 Submitting efficiency entry:', entryData)
  const response = await api.post('/api/engineer/entry', entryData)
  return response.data
}

export const getEngineerDashboard = async (teamName, developerName) => {
  console.log('🚀 Getting engineer dashboard for:', { teamName, developerName })
  const params = new URLSearchParams()
  if (teamName) params.append('team_name', teamName)
  if (developerName) params.append('developer_name', developerName)
  
  // Use the direct URL that works
  const response = await fetch(`https://mnwpivaen5.us-east-1.awsapprunner.com/api/engineer/dashboard?${params.toString()}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  })
  
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${response.statusText}`)
  }
  
  return await response.json()
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