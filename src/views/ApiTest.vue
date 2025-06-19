<template>
  <div class="max-w-4xl mx-auto px-4 py-8">
    <div class="bg-white rounded-lg shadow-lg p-6">
      <h1 class="text-2xl font-bold mb-6">API Connection Test</h1>
      
      <!-- API Base URL -->
      <div class="mb-6 p-4 bg-gray-50 rounded-lg">
        <h3 class="font-semibold text-gray-800 mb-2">API Configuration</h3>
        <p class="text-sm text-gray-600">Base URL: <code class="bg-gray-200 px-2 py-1 rounded">{{ apiBaseUrl }}</code></p>
        <p class="text-sm text-gray-600">Mock Mode: <code class="bg-gray-200 px-2 py-1 rounded">{{ mockMode }}</code></p>
      </div>
      
      <!-- Test Buttons -->
      <div class="space-y-4 mb-6">
        <button 
          @click="runConnectionTest" 
          :disabled="testing"
          class="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg mr-4"
        >
          {{ testing ? 'Testing...' : 'Test API Connection' }}
        </button>
        
        <button 
          @click="testAdminLogin" 
          :disabled="testing"
          class="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg mr-4"
        >
          Test Admin Login
        </button>
        
        <button 
          @click="testDashboard" 
          :disabled="testing"
          class="bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg"
        >
          Test Dashboard API
        </button>
      </div>
      
      <!-- Test Results -->
      <div v-if="testResults.length > 0" class="space-y-4">
        <h3 class="font-semibold text-gray-800">Test Results:</h3>
        <div 
          v-for="(result, index) in testResults" 
          :key="index"
          :class="[
            'p-4 rounded-lg border',
            result.success ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
          ]"
        >
          <div class="flex items-start">
            <span class="text-lg mr-2">{{ result.success ? '✅' : '❌' }}</span>
            <div class="flex-1">
              <h4 class="font-medium">{{ result.test }}</h4>
              <p class="text-sm text-gray-600 mt-1">{{ result.message }}</p>
              <p class="text-xs text-gray-500 mt-1">{{ new Date(result.timestamp).toLocaleTimeString() }}</p>
              
              <!-- Show raw response for debugging -->
              <details v-if="result.data" class="mt-2">
                <summary class="text-xs text-gray-500 cursor-pointer">Show raw response</summary>
                <pre class="text-xs bg-gray-100 p-2 rounded mt-1 overflow-x-auto">{{ JSON.stringify(result.data, null, 2) }}</pre>
              </details>
              
              <!-- Show error details -->
              <details v-if="result.error" class="mt-2">
                <summary class="text-xs text-red-500 cursor-pointer">Show error details</summary>
                <pre class="text-xs bg-red-100 p-2 rounded mt-1 overflow-x-auto">{{ JSON.stringify(result.error, null, 2) }}</pre>
              </details>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Quick Admin Login Form -->
      <div class="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
        <h3 class="font-semibold text-yellow-800 mb-3">Quick Admin Login Test</h3>
        <div class="flex items-center space-x-4">
          <input 
            v-model="adminPassword"
            type="password" 
            placeholder="Admin password"
            class="border border-gray-300 rounded px-3 py-2 flex-1"
          >
          <button 
            @click="quickAdminLogin"
            :disabled="testing || !adminPassword"
            class="bg-yellow-600 hover:bg-yellow-700 disabled:bg-gray-400 text-white px-4 py-2 rounded"
          >
            Login & Test
          </button>
        </div>
      </div>
      
      <!-- Manual Token Test -->
      <div class="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <h3 class="font-semibold text-blue-800 mb-3">Test with Existing Token</h3>
        <div class="space-y-3">
          <input 
            v-model="manualToken"
            type="text" 
            placeholder="Paste your JWT token here"
            class="w-full border border-gray-300 rounded px-3 py-2 text-sm"
          >
          <div class="flex space-x-2">
            <button 
              @click="testWithToken"
              :disabled="testing || !manualToken"
              class="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-4 py-2 rounded text-sm"
            >
              Test with Token
            </button>
            <button 
              @click="setTokenFromCurl"
              class="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded text-sm"
            >
              Use Curl Token
            </button>
          </div>
          <p class="text-xs text-blue-600">This will temporarily store the token and test the /api/teams endpoint</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'
import { adminLogin, getAdminDashboard } from '../services/api'
import axios from 'axios'

export default {
  name: 'ApiTest',
  setup() {
    const apiBaseUrl = import.meta.env.VITE_API_BASE_URL
    const mockMode = import.meta.env.VITE_MOCK_MODE
    const testing = ref(false)
    const testResults = ref([])
    const adminPassword = ref('')
    const manualToken = ref('')
    
    // API testing functions
    const testApiConnection = async () => {
      console.log('🔗 Testing API connection to:', apiBaseUrl)
      
      try {
        // Test basic connectivity
        const healthCheck = await axios.get(`${apiBaseUrl}/health`, {
          timeout: 10000
        })
        console.log('✅ Health check passed:', healthCheck.data)
        
        return { success: true, message: 'API connection successful', data: healthCheck.data }
      } catch (error) {
        console.error('❌ API connection failed:', error.message)
        
        if (error.code === 'ECONNREFUSED') {
          return { success: false, message: 'Connection refused - API server may be down' }
        } else if (error.code === 'ETIMEDOUT') {
          return { success: false, message: 'Connection timeout - API server may be slow or unreachable' }
        } else {
          return { success: false, message: error.message }
        }
      }
    }

    const testCORS = async () => {
      console.log('🌐 Testing CORS configuration...')
      
      try {
        const response = await fetch(`${apiBaseUrl}/health`, {
          method: 'GET',
          mode: 'cors',
          headers: {
            'Content-Type': 'application/json',
          }
        })
        
        if (response.ok) {
          console.log('✅ CORS configuration is working')
          return { success: true, message: 'CORS is properly configured' }
        } else {
          console.log('⚠️  CORS may have issues, status:', response.status)
          return { success: false, message: `CORS issue - HTTP ${response.status}` }
        }
      } catch (error) {
        console.error('❌ CORS test failed:', error.message)
        return { success: false, message: 'CORS is not properly configured' }
      }
    }

    const runApiTests = async () => {
      console.log('🧪 Running API connection tests...')
      
      const connectionTest = await testApiConnection()
      const corsTest = await testCORS()
      
      return {
        connection: connectionTest,
        cors: corsTest,
        overall: connectionTest.success && corsTest.success
      }
    }
    
    const addTestResult = (test, success, message, data = null, error = null) => {
      testResults.value.unshift({
        test,
        success,
        message,
        data,
        error,
        timestamp: new Date().toISOString()
      })
    }
    
    const runConnectionTest = async () => {
      testing.value = true
      try {
        const results = await runApiTests()
        
        addTestResult(
          'API Connection Test',
          results.overall,
          results.overall ? 'All tests passed' : 'Some tests failed',
          results
        )
      } catch (error) {
        addTestResult(
          'API Connection Test',
          false,
          'Test execution failed',
          null,
          error
        )
      } finally {
        testing.value = false
      }
    }
    
    const testAdminLogin = async () => {
      testing.value = true
      try {
        const result = await adminLogin('test_password')
        addTestResult(
          'Admin Login Test',
          true,
          'Admin login successful',
          result
        )
      } catch (error) {
        addTestResult(
          'Admin Login Test',
          false,
          error.message || 'Login failed',
          null,
          {
            status: error.response?.status,
            data: error.response?.data,
            message: error.message
          }
        )
      } finally {
        testing.value = false
      }
    }
    
    const testDashboard = async () => {
      testing.value = true
      try {
        const result = await getAdminDashboard()
        addTestResult(
          'Dashboard API Test',
          true,
          'Dashboard data loaded successfully',
          result
        )
      } catch (error) {
        addTestResult(
          'Dashboard API Test',
          false,
          error.message || 'Dashboard API failed',
          null,
          {
            status: error.response?.status,
            data: error.response?.data,
            message: error.message
          }
        )
      } finally {
        testing.value = false
      }
    }
    
    const quickAdminLogin = async () => {
      testing.value = true
      try {
        const loginResult = await adminLogin(adminPassword.value)
        addTestResult(
          'Quick Admin Login',
          true,
          'Login successful',
          loginResult
        )
        
        // Test dashboard after login
        const dashboardResult = await getAdminDashboard()
        addTestResult(
          'Post-Login Dashboard Test',
          true,
          'Dashboard loaded after login',
          dashboardResult
        )
      } catch (error) {
        addTestResult(
          'Quick Admin Login',
          false,
          error.message || 'Login failed',
          null,
          {
            status: error.response?.status,
            data: error.response?.data,
            message: error.message
          }
        )
      } finally {
        testing.value = false
      }
    }
    
    const testWithToken = async () => {
      testing.value = true
      try {
        // Store the original token
        const originalToken = localStorage.getItem('auth_token')
        
        // Temporarily set the manual token
        localStorage.setItem('auth_token', manualToken.value)
        
        // Test the teams endpoint
        const teamsResponse = await axios.get(`${apiBaseUrl}/api/teams`, {
          headers: {
            'Authorization': `Bearer ${manualToken.value}`,
            'Content-Type': 'application/json'
          }
        })
        
        addTestResult(
          'Manual Token Test - Teams',
          true,
          'Teams endpoint accessed successfully with manual token',
          teamsResponse.data
        )
        
        // Test admin dashboard
        try {
          const dashboardResponse = await axios.get(`${apiBaseUrl}/api/admin/dashboard`, {
            headers: {
              'Authorization': `Bearer ${manualToken.value}`,
              'Content-Type': 'application/json'
            }
          })
          
          addTestResult(
            'Manual Token Test - Dashboard',
            true,
            'Admin dashboard accessed successfully',
            dashboardResponse.data
          )
        } catch (dashError) {
          addTestResult(
            'Manual Token Test - Dashboard',
            false,
            'Dashboard endpoint failed with manual token',
            null,
            {
              status: dashError.response?.status,
              data: dashError.response?.data,
              message: dashError.message
            }
          )
        }
        
        // Restore original token
        if (originalToken) {
          localStorage.setItem('auth_token', originalToken)
        } else {
          localStorage.removeItem('auth_token')
        }
        
      } catch (error) {
        addTestResult(
          'Manual Token Test',
          false,
          error.message || 'Token test failed',
          null,
          {
            status: error.response?.status,
            data: error.response?.data,
            message: error.message
          }
        )
        
        // Restore original token on error
        const originalToken = localStorage.getItem('auth_token')
        if (originalToken) {
          localStorage.setItem('auth_token', originalToken)
        } else {
          localStorage.removeItem('auth_token')
        }
      } finally {
        testing.value = false
      }
    }
    
    const setTokenFromCurl = () => {
      // Set the token from your working curl command
      manualToken.value = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX3R5cGUiOiJhZG1pbiIsInN1YiI6ImFkbWluIiwiZXhwIjoxNzUwNDMxNDI0fQ.c1fGmqjGdFDVb2AjmNqiyccIaPFkFPtFzzjkrhE3Ing'
      addTestResult(
        'Token Set',
        true,
        'Token from curl command has been set. Click "Test with Token" to use it.',
        { token_preview: manualToken.value.substring(0, 50) + '...' }
      )
    }
    
    return {
      apiBaseUrl,
      mockMode,
      testing,
      testResults,
      adminPassword,
      manualToken,
      runConnectionTest,
      testAdminLogin,
      testDashboard,
      quickAdminLogin,
      testWithToken,
      setTokenFromCurl
    }
  }
}
</script> 