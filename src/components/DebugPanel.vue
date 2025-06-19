<template>
  <div class="fixed bottom-4 right-4 bg-white shadow-lg rounded-lg p-4 border border-gray-200 max-w-md">
    <h3 class="text-lg font-semibold mb-3 text-gray-800">🔧 Debug Panel</h3>
    
    <!-- Auth Status -->
    <div class="mb-4 p-3 bg-gray-50 rounded">
      <h4 class="font-medium text-sm mb-2">Authentication Status</h4>
      <div class="space-y-1 text-xs">
        <div>Store Auth: <span :class="authStore.isAuthenticated ? 'text-green-600' : 'text-red-600'">{{ authStore.isAuthenticated }}</span></div>
        <div>User Type: <span class="font-mono">{{ authStore.userType || 'none' }}</span></div>
        <div>Token: <span class="font-mono">{{ tokenPreview }}</span></div>
      </div>
    </div>
    
    <!-- Environment Variables -->
    <div class="mb-4 p-3 bg-gray-50 rounded">
      <h4 class="font-medium text-sm mb-2">Environment</h4>
      <div class="space-y-1 text-xs">
        <div>API URL: <span class="font-mono text-xs">{{ apiBaseUrl }}</span></div>
        <div>Mock Mode: <span class="font-mono">{{ mockMode }}</span></div>
        <div>App Env: <span class="font-mono">{{ appEnv }}</span></div>
      </div>
    </div>
    
    <!-- Quick Actions -->
    <div class="space-y-2">
      <button 
        @click="setTestToken" 
        class="w-full bg-blue-500 hover:bg-blue-600 text-white text-xs px-3 py-2 rounded"
      >
        Set Working Token
      </button>
      
      <button 
        @click="testDashboard" 
        :disabled="testing"
        class="w-full bg-green-500 hover:bg-green-600 disabled:bg-gray-400 text-white text-xs px-3 py-2 rounded"
      >
        {{ testing ? 'Testing...' : 'Test Dashboard API' }}
      </button>
      
      <button 
        @click="clearAuth" 
        class="w-full bg-red-500 hover:bg-red-600 text-white text-xs px-3 py-2 rounded"
      >
        Clear Auth Data
      </button>
    </div>
    
    <!-- Test Results -->
    <div v-if="testResult" class="mt-3 p-2 rounded text-xs" :class="testResult.success ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'">
      <div class="font-medium">{{ testResult.success ? '✅' : '❌' }} {{ testResult.message }}</div>
      <div v-if="testResult.data" class="mt-1 font-mono text-xs">{{ JSON.stringify(testResult.data).substring(0, 100) }}...</div>
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue'
import { useAuthStore } from '../stores/auth'
import { getAdminDashboard } from '../services/api'

export default {
  name: 'DebugPanel',
  setup() {
    const authStore = useAuthStore()
    const testing = ref(false)
    const testResult = ref(null)
    
    const tokenPreview = computed(() => {
      const token = localStorage.getItem('auth_token')
      return token ? token.substring(0, 20) + '...' : 'none'
    })
    
    const apiBaseUrl = import.meta.env.VITE_API_BASE_URL
    const mockMode = import.meta.env.VITE_MOCK_MODE
    const appEnv = import.meta.env.VITE_APP_ENV
    
    const setTestToken = () => {
      const workingToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX3R5cGUiOiJhZG1pbiIsInN1YiI6ImFkbWluIiwiZXhwIjoxNzUwNDMxNDI0fQ.c1fGmqjGdFDVb2AjmNqiyccIaPFkFPtFzzjkrhE3Ing'
      localStorage.setItem('auth_token', workingToken)
      localStorage.setItem('user_type', 'admin')
      
      // Update auth store
      authStore.token = workingToken
      authStore.userType = 'admin'
      authStore.isAuthenticated = true
      
      testResult.value = { success: true, message: 'Working token set successfully!' }
    }
    
    const clearAuth = () => {
      localStorage.removeItem('auth_token')
      localStorage.removeItem('user_type')
      
      authStore.token = null
      authStore.userType = null
      authStore.isAuthenticated = false
      
      testResult.value = { success: true, message: 'Auth data cleared' }
    }
    
    const testDashboard = async () => {
      testing.value = true
      testResult.value = null
      
      try {
        console.log('Testing dashboard API...')
        console.log('Current token:', localStorage.getItem('auth_token')?.substring(0, 20) + '...')
        console.log('API Base URL:', apiBaseUrl)
        
        const response = await getAdminDashboard()
        console.log('Dashboard response:', response)
        
        testResult.value = {
          success: true,
          message: 'Dashboard API call successful!',
          data: response
        }
      } catch (error) {
        console.error('Dashboard API test failed:', error)
        testResult.value = {
          success: false,
          message: `API call failed: ${error.message}`,
          data: error.response?.data
        }
      } finally {
        testing.value = false
      }
    }
    
    return {
      authStore,
      testing,
      testResult,
      tokenPreview,
      apiBaseUrl,
      mockMode,
      appEnv,
      setTestToken,
      clearAuth,
      testDashboard
    }
  }
}
</script> 