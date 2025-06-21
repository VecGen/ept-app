import { defineStore } from 'pinia'
import { adminLogin, engineerLogin, logout as apiLogout } from '../services/api'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    token: localStorage.getItem('auth_token'),
    userType: localStorage.getItem('user_type'),
    isAuthenticated: !!localStorage.getItem('auth_token'),
    teams: [] // Available teams for engineer login
  }),

  getters: {
    isAdmin: (state) => state.userType === 'admin',
    isEngineer: (state) => state.userType === 'engineer'
  },

  actions: {
    async adminLogin(password) {
      try {
        console.log('Attempting admin login...')
        const response = await adminLogin(password)
        console.log('Admin login response:', response)
        
        this.token = response.access_token
        this.userType = response.user_type
        this.isAuthenticated = true
        this.user = { type: 'admin' }
        
        console.log('Auth store updated:', {
          token: !!this.token,
          userType: this.userType,
          isAuthenticated: this.isAuthenticated
        })
        
        return { success: true }
      } catch (error) {
        console.error('Admin login failed:', error)
        throw new Error(error.response?.data?.detail || 'Invalid admin password')
      }
    },

    async engineerLogin(teamName, developerName, password) {
      try {
        console.log('Attempting engineer login...', { teamName, developerName })
        const response = await engineerLogin(teamName, developerName, password)
        console.log('Engineer login response:', response)
        
        this.token = response.access_token
        this.userType = response.user_type
        this.isAuthenticated = true
        this.user = { 
          type: 'engineer',
          name: developerName,
          team: teamName
        }
        
        console.log('Auth store updated:', {
          token: !!this.token,
          userType: this.userType,
          isAuthenticated: this.isAuthenticated,
          user: this.user
        })
        
        return { success: true }
      } catch (error) {
        console.error('Engineer login failed:', error)
        throw new Error(error.response?.data?.detail || 'Invalid credentials')
      }
    },

    logout() {
      apiLogout()
      this.user = null
      this.token = null
      this.userType = null
      this.isAuthenticated = false
    },

    // Check if user is authenticated on app load
    checkAuth() {
      const token = localStorage.getItem('auth_token')
      const userType = localStorage.getItem('user_type')
      
      console.log('Checking auth on load:', { token: !!token, userType })
      
      if (token && userType) {
        this.token = token
        this.userType = userType
        this.isAuthenticated = true
        this.user = { type: userType }
        console.log('Auth restored from localStorage')
      } else {
        console.log('No auth found in localStorage')
      }
    }
  }
}) 