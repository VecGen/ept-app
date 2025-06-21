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

    async engineerLogin(email, password) {
      try {
        console.log('Attempting engineer login...', { email })
        const response = await engineerLogin(email, password)
        console.log('Engineer login response:', response)
        
        this.token = response.access_token
        this.userType = response.user_type
        this.isAuthenticated = true
        
        // Handle user data from the API response
        if (response.user_data) {
          this.user = { 
            type: 'engineer',
            email: email,
            name: response.user_data.developer_name || response.user_data.name,
            team: response.user_data.team_name || response.user_data.team,
            ...response.user_data
          }
        } else {
          this.user = { 
            type: 'engineer',
            email: email,
            name: 'Developer',
            team: 'Unknown Team'
          }
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
        throw new Error(error.response?.data?.detail || 'Invalid email or password')
      }
    },

    logout() {
      apiLogout()
      // Clear user data from localStorage as well
      localStorage.removeItem('user_data')
      this.user = null
      this.token = null
      this.userType = null
      this.isAuthenticated = false
    },

    // Check if user is authenticated on app load
    checkAuth() {
      const token = localStorage.getItem('auth_token')
      const userType = localStorage.getItem('user_type')
      const userData = localStorage.getItem('user_data')
      
      console.log('Checking auth on load:', { token: !!token, userType, userData: !!userData })
      
      if (token && userType) {
        this.token = token
        this.userType = userType
        this.isAuthenticated = true
        
        // Restore user data if available
        if (userData && userType === 'engineer') {
          try {
            const parsedUserData = JSON.parse(userData)
            this.user = { 
              type: 'engineer',
              ...parsedUserData
            }
            console.log('Auth and user data restored from localStorage:', this.user)
          } catch (error) {
            console.error('Failed to parse user data:', error)
            this.user = { type: userType }
          }
        } else {
          this.user = { type: userType }
        }
        
        console.log('Auth restored from localStorage')
      } else {
        console.log('No auth found in localStorage')
      }
    }
  }
}) 