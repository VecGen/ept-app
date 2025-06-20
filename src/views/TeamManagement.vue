<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <!-- Debug Information -->
    <div class="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded">
      <h4 class="font-medium text-yellow-800">🔧 Debug Info</h4>
      <div class="text-sm text-yellow-700 mt-1">
        <p>VITE_API_BASE_URL: <code>{{ viteApiBaseUrl || 'undefined' }}</code></p>
        <p>Computed BASE_URL: <code>{{ debugApiUrl }}</code></p>
        <p>NODE_ENV: <code>{{ nodeEnv }}</code></p>
        <p>MODE: <code>{{ mode }}</code></p>
      </div>
      <div class="mt-2">
        <button
          @click="setWorkingToken"
          class="px-3 py-1 bg-blue-500 text-white text-xs rounded hover:bg-blue-600"
        >
          🔧 Set Working Token from Curl
        </button>
        <button
          @click="debugCurrentToken"
          class="ml-2 px-3 py-1 bg-green-500 text-white text-xs rounded hover:bg-green-600"
        >
          🔍 Debug Current Token
        </button>
        <button
          @click="testCurlRequest"
          class="ml-2 px-3 py-1 bg-purple-500 text-white text-xs rounded hover:bg-purple-600"
        >
          🧪 Test Curl Request
        </button>
        <button 
          @click="testUnauthenticatedEndpoint" 
          class="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600"
        >
          🔓 Test Unauthenticated Endpoint
        </button>
        <button 
          @click="testNewPublicEndpoint" 
          class="ml-2 px-3 py-1 bg-indigo-500 text-white text-xs rounded hover:bg-indigo-600"
        >
          🆕 Test New Public Endpoint
        </button>
      </div>
    </div>

    <!-- Header -->
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900">👥 Team Management</h1>
      <p class="mt-2 text-gray-600">Manage teams and developers in your organization</p>
    </div>

    <!-- Error Message -->
    <div v-if="error" class="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
      <div class="flex">
        <div class="flex-shrink-0">
          <svg class="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
          </svg>
        </div>
        <div class="ml-3">
          <p class="text-sm font-medium text-red-800">{{ error }}</p>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="text-center py-12">
      <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      <p class="mt-2 text-gray-600">Loading teams...</p>
    </div>

    <!-- Content (hidden when loading) -->
    <div v-else>
      <!-- Add Team Section -->
      <div class="card mb-8">
        <div class="card-header">
          <h3 class="text-lg font-medium">➕ Add New Team</h3>
        </div>
        <div class="card-body">
          <form @submit.prevent="addTeam" class="space-y-4">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label for="team-name" class="block text-sm font-medium text-gray-700">
                  Team Name
                </label>
                <input
                  id="team-name"
                  v-model="newTeam.name"
                  type="text"
                  placeholder="e.g., Frontend Team"
                  class="input-field"
                  required
                />
              </div>
              <div>
                <label for="team-description" class="block text-sm font-medium text-gray-700">
                  Description (Optional)
                </label>
                <input
                  id="team-description"
                  v-model="newTeam.description"
                  type="text"
                  placeholder="Brief description of the team"
                  class="input-field"
                />
              </div>
            </div>
            
            <div class="flex justify-end">
              <button
                type="submit"
                :disabled="!newTeam.name.trim() || submitting"
                class="btn-primary disabled:opacity-50"
              >
                {{ submitting ? 'Adding...' : 'Add Team' }}
              </button>
            </div>
          </form>
        </div>
      </div>

      <!-- Teams List -->
      <div class="space-y-6">
        <div v-if="teams.length === 0" class="text-center py-12">
          <div class="text-gray-400 text-6xl mb-4">👥</div>
          <h3 class="text-lg font-medium text-gray-900 mb-2">No teams yet</h3>
          <p class="text-gray-600">Create your first team above to get started.</p>
        </div>

        <div v-for="team in teams" :key="team.id" class="card">
          <div class="card-header">
            <div class="flex justify-between items-center">
              <div>
                <h3 class="text-lg font-medium">{{ team.name }}</h3>
                <p v-if="team.description" class="text-sm text-gray-600 mt-1">{{ team.description }}</p>
              </div>
              <div class="flex space-x-2">
                <button
                  @click="toggleTeamEdit(team)"
                  class="btn-secondary text-sm"
                >
                  {{ editingTeam?.name === team.name ? 'Cancel' : 'Edit' }}
                </button>
                <button
                  @click="deleteTeam(team)"
                  class="text-red-600 hover:text-red-800 text-sm"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
          
          <div class="card-body">
            <!-- Edit Team Form -->
            <div v-if="editingTeam?.name === team.name" class="mb-6 p-4 bg-gray-50 rounded-lg">
              <form @submit.prevent="updateTeam" class="space-y-4">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-700">Team Name</label>
                    <input
                      v-model="editingTeam.name"
                      type="text"
                      class="input-field"
                      required
                    />
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700">Description</label>
                    <input
                      v-model="editingTeam.description"
                      type="text"
                      class="input-field"
                    />
                  </div>
                </div>
                <div class="flex justify-end space-x-2">
                  <button type="button" @click="editingTeam = null" class="btn-secondary">
                    Cancel
                  </button>
                  <button type="submit" class="btn-primary">
                    Update Team
                  </button>
                </div>
              </form>
            </div>

            <!-- Add Developer Section -->
            <div class="mb-6">
              <h4 class="font-medium text-gray-900 mb-3">Add Developer</h4>
              <form @submit.prevent="addDeveloper(team)" class="flex space-x-3">
                <input
                  v-model="newDeveloperName"
                  type="text"
                  placeholder="Developer name"
                  class="input-field flex-1"
                  required
                />
                <button
                  type="submit"
                  :disabled="!newDeveloperName.trim()"
                  class="btn-primary disabled:opacity-50"
                >
                  Add
                </button>
              </form>
            </div>

            <!-- Developers List -->
            <div>
              <h4 class="font-medium text-gray-900 mb-3">
                Developers ({{ team.developers?.length || 0 }})
              </h4>
              
              <div v-if="!team.developers || team.developers.length === 0" 
                   class="text-center py-6 text-gray-500">
                No developers in this team yet.
              </div>
              
              <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                <div v-for="developer in team.developers" :key="developer.id || developer" 
                     class="flex items-center justify-between bg-gray-50 rounded-lg p-3">
                  <div class="flex items-center">
                    <div class="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                      <span class="text-sm font-medium text-blue-600">
                        {{ (developer.name || developer).charAt(0).toUpperCase() }}
                      </span>
                    </div>
                    <span class="text-sm font-medium text-gray-900">
                      {{ developer.name || developer }}
                    </span>
                  </div>
                  <button
                    @click="removeDeveloper(team, developer)"
                    class="text-red-500 hover:text-red-700"
                    title="Remove developer"
                  >
                    <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            <!-- Access Links Section -->
            <div v-if="team.developers && team.developers.length > 0" class="mt-6 pt-6 border-t">
              <h4 class="font-medium text-gray-900 mb-3">Developer Access Links</h4>
              <div class="space-y-2">
                <div v-for="developer in team.developers" :key="`link-${developer.id || developer}`"
                     class="flex items-center justify-between bg-blue-50 rounded p-2">
                  <span class="text-sm text-gray-700">{{ developer.name || developer }}</span>
                  <div class="flex space-x-2">
                    <code class="text-xs bg-white px-2 py-1 rounded border text-blue-600">
                      {{ generateAccessLink(team, developer) }}
                    </code>
                    <button
                      @click="copyToClipboard(generateAccessLink(team, developer))"
                      class="text-blue-600 hover:text-blue-800 text-xs"
                      title="Copy link"
                    >
                      Copy
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, reactive, onMounted, computed } from 'vue'
import { getTeams, createTeam, deleteTeam } from '../services/api'
import { useAuthStore } from '../stores/auth'
import { useRouter } from 'vue-router'

export default {
  name: 'TeamManagement',
  setup() {
    const authStore = useAuthStore()
    const router = useRouter()
    
    const teams = ref([])
    const newTeam = ref({ name: '', description: '' })
    const newDeveloperName = ref('')
    const editingTeam = ref(null)
    const submitting = ref(false)
    const loading = ref(true)
    const error = ref(null)

    // Debug computed property to show actual API URL
    const debugApiUrl = computed(() => {
      return import.meta.env.VITE_API_BASE_URL || 'https://mnwpivaen5.us-east-1.awsapprunner.com'
    })

    const viteApiBaseUrl = computed(() => {
      return import.meta.env.VITE_API_BASE_URL || 'https://mnwpivaen5.us-east-1.awsapprunner.com'
    })

    const nodeEnv = computed(() => {
      return import.meta.env.NODE_ENV
    })

    const mode = computed(() => {
      return import.meta.env.MODE
    })

    const loadTeams = async () => {
      try {
        loading.value = true
        error.value = null
        
        console.log('Loading teams from API...')
        
        // Debug: Log the token being used
        const currentToken = localStorage.getItem('auth_token')
        console.log('🔑 Current token in localStorage:', currentToken ? currentToken.substring(0, 50) + '...' : 'NO TOKEN')
        console.log('🔑 Auth store token:', authStore.token ? authStore.token.substring(0, 50) + '...' : 'NO TOKEN')
        console.log('🔑 Auth store isAuthenticated:', authStore.isAuthenticated)
        console.log('🔑 Auth store userType:', authStore.userType)
        
        // Debug: Compare with working token from curl
        const workingToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX3R5cGUiOiJhZG1pbiIsInN1YiI6ImFkbWluIiwiZXhwIjoxNzUwNDMxNDI0fQ.c1fGmqjGdFDVb2AjmNqiyccIaPFkFPtFzzjkrhE3Ing'
        if (currentToken === workingToken) {
          console.log('✅ Token matches working curl token')
        } else {
          console.log('❌ Token DOES NOT match working curl token')
          console.log('Expected (curl):', workingToken.substring(0, 50) + '...')
          console.log('Actual (browser):', currentToken ? currentToken.substring(0, 50) + '...' : 'NO TOKEN')
        }
        
        const response = await getTeams()
        teams.value = response || []
        
        console.log('Teams loaded successfully:', teams.value)
        
      } catch (err) {
        console.error('Failed to load teams:', err)
        
        // Enhanced error logging
        console.log('❌ Error details:')
        console.log('  - Status:', err.response?.status)
        console.log('  - Data:', err.response?.data)
        console.log('  - Headers:', err.response?.headers)
        console.log('  - Config:', err.config)
        
        if (err.response?.status === 401) {
          error.value = 'Authentication expired. Please log in again.'
          authStore.logout()
          router.push('/admin/login')
          return
        } else if (err.response?.status === 404) {
          error.value = 'Teams API endpoint not found.'
        } else {
          error.value = `Failed to load teams: ${err.response?.data?.detail || err.message || 'Unknown error'}`
        }
        
        // Fallback to empty teams array
        teams.value = []
      } finally {
        loading.value = false
      }
    }

    const addTeam = async () => {
      if (!newTeam.value.name.trim()) return

      try {
        submitting.value = true
        error.value = null
        
        console.log('Creating team:', newTeam.value)
        
        const response = await createTeam({
          team_name: newTeam.value.name.trim(),
          description: newTeam.value.description.trim() || undefined
        })
        
        console.log('Team created successfully:', response)
        
        // Reload teams to get updated list
        await loadTeams()
        
        // Reset form
        newTeam.value = { name: '', description: '' }
        
      } catch (err) {
        console.error('Failed to add team:', err)
        
        if (err.response?.status === 400) {
          error.value = `Failed to create team: ${err.response.data?.detail || 'Team name may already exist'}`
        } else if (err.response?.status === 401) {
          error.value = 'Authentication expired. Please log in again.'
          authStore.logout()
          router.push('/admin/login')
          return
        } else {
          error.value = `Failed to create team: ${err.response?.data?.detail || err.message || 'Unknown error'}`
        }
      } finally {
        submitting.value = false
      }
    }

    const toggleTeamEdit = (team) => {
      if (editingTeam.value?.name === team.name) {
        editingTeam.value = null
      } else {
        editingTeam.value = { ...team }
      }
    }

    const updateTeam = async () => {
      if (!editingTeam.value) return

      try {
        error.value = null
        
        console.log('Updating team:', editingTeam.value)
        
        // Note: The teams API doesn't seem to have an update endpoint in the backend
        // This would need to be implemented in the API first
        console.warn('Team update API not available yet')
        error.value = 'Team update functionality not available yet in the API'
        
        editingTeam.value = null
        
      } catch (err) {
        console.error('Failed to update team:', err)
        error.value = `Failed to update team: ${err.response?.data?.detail || err.message || 'Unknown error'}`
      }
    }

    const deleteTeamHandler = async (team) => {
      if (!confirm(`Are you sure you want to delete "${team.name}"? This action cannot be undone.`)) {
        return
      }

      try {
        error.value = null
        
        console.log('Deleting team:', team.name)
        
        const response = await deleteTeam(team.name)
        console.log('Team deleted successfully:', response)
        
        // Reload teams to get updated list
        await loadTeams()
        
      } catch (err) {
        console.error('Failed to delete team:', err)
        
        if (err.response?.status === 404) {
          error.value = `Team "${team.name}" not found`
        } else if (err.response?.status === 401) {
          error.value = 'Authentication expired. Please log in again.'
          authStore.logout()
          router.push('/admin/login')
          return
        } else {
          error.value = `Failed to delete team: ${err.response?.data?.detail || err.message || 'Unknown error'}`
        }
      }
    }

    const addDeveloper = async (team) => {
      if (!newDeveloperName.value.trim()) return

      try {
        error.value = null
        
        console.log('Adding developer to team:', team.name, newDeveloperName.value)
        
        // For now, add locally since the API endpoint would be POST /api/teams/{team_name}/developers
        // This needs to be implemented in the backend API
        const developerData = {
          dev_name: newDeveloperName.value.trim(),
          dev_email: `${newDeveloperName.value.trim().toLowerCase().replace(/\s+/g, '.')}@company.com`
        }
        
        // Import the addDeveloper API function if it exists
        // For now, simulate the addition locally
        if (!team.developers) team.developers = []
        team.developers.push({
          name: newDeveloperName.value.trim(),
          email: developerData.dev_email
        })

        newDeveloperName.value = ''
        
        console.log('Developer added successfully (locally)')
        
      } catch (err) {
        console.error('Failed to add developer:', err)
        error.value = `Failed to add developer: ${err.response?.data?.detail || err.message || 'Unknown error'}`
      }
    }

    const removeDeveloper = async (team, developer) => {
      if (!confirm(`Remove ${developer.name || developer} from ${team.name}?`)) {
        return
      }

      try {
        error.value = null
        
        console.log('Removing developer from team:', team.name, developer.name)
        
        // For now, remove locally since the API endpoint would be DELETE /api/teams/{team_name}/developers/{developer_name}
        // This needs to be implemented in the backend API
        team.developers = team.developers.filter(d => 
          (d.name || d) !== (developer.name || developer)
        )
        
        console.log('Developer removed successfully (locally)')
        
      } catch (err) {
        console.error('Failed to remove developer:', err)
        error.value = `Failed to remove developer: ${err.response?.data?.detail || err.message || 'Unknown error'}`
      }
    }

    const generateAccessLink = (team, developer) => {
      const baseUrl = window.location.origin
      const devName = developer.name || developer
      return `${baseUrl}/engineer/login?team=${encodeURIComponent(team.name)}&dev=${encodeURIComponent(devName)}`
    }

    const copyToClipboard = async (text) => {
      try {
        await navigator.clipboard.writeText(text)
        alert('Link copied to clipboard!')
      } catch (error) {
        console.error('Failed to copy to clipboard:', error)
        alert('Failed to copy link. Please copy manually.')
      }
    }

    const setWorkingToken = () => {
      const workingToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX3R5cGUiOiJhZG1pbiIsInN1YiI6ImFkbWluIiwiZXhwIjoxNzUwNDMxNDI0fQ.c1fGmqjGdFDVb2AjmNqiyccIaPFkFPtFzzjkrhE3Ing'
      
      // Set token in localStorage
      localStorage.setItem('auth_token', workingToken)
      localStorage.setItem('user_type', 'admin')
      
      // Update auth store
      authStore.token = workingToken
      authStore.userType = 'admin'
      authStore.isAuthenticated = true
      authStore.user = { type: 'admin' }
      
      console.log('✅ Working token set successfully!')
      alert('Working token from curl has been set. Try loading teams now.')
      
      // Automatically retry loading teams
      loadTeams()
    }

    const debugCurrentToken = () => {
      const currentToken = localStorage.getItem('auth_token')
      const userType = localStorage.getItem('user_type')
      
      console.log('=== TOKEN DEBUG INFO ===')
      console.log('localStorage auth_token:', currentToken)
      console.log('localStorage user_type:', userType)
      console.log('authStore.token:', authStore.token)
      console.log('authStore.userType:', authStore.userType)
      console.log('authStore.isAuthenticated:', authStore.isAuthenticated)
      
      const workingToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX3R5cGUiOiJhZG1pbiIsInN1YiI6ImFkbWluIiwiZXhwIjoxNzUwNDMxNDI0fQ.c1fGmqjGdFDVb2AjmNqiyccIaPFkFPtFzzjkrhE3Ing'
      console.log('Working token (curl):', workingToken)
      console.log('Tokens match:', currentToken === workingToken)
      
      // Show in alert for easy viewing
      alert(`Current token: ${currentToken ? currentToken.substring(0, 50) + '...' : 'NONE'}\n\nAuth store: ${authStore.isAuthenticated ? 'Authenticated' : 'Not authenticated'}\n\nUser type: ${authStore.userType || 'None'}`)
    }

    const testCurlRequest = async () => {
      console.log('🧪 Testing exact curl request...')
      
      const workingToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX3R5cGUiOiJhZG1pbiIsInN1YiI6ImFkbWluIiwiZXhwIjoxNzUwNDMxNDI0fQ.c1fGmqjGdFDVb2AjmNqiyccIaPFkFPtFzzjkrhE3Ing'
      const url = 'https://mnwpivaen5.us-east-1.awsapprunner.com/api/teams'
      
      try {
        console.log('Making direct fetch request...')
        console.log('URL:', url)
        console.log('Authorization header:', `Bearer ${workingToken.substring(0, 20)}...`)
        
        const response = await fetch(url, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${workingToken}`,
            'Content-Type': 'application/json'
          }
        })
        
        console.log('Response status:', response.status)
        console.log('Response headers:', response.headers)
        
        if (response.ok) {
          const data = await response.json()
          console.log('✅ Direct fetch SUCCESS:', data)
          alert(`Direct fetch SUCCESS!\nStatus: ${response.status}\nData: ${JSON.stringify(data, null, 2)}`)
        } else {
          const errorText = await response.text()
          console.log('❌ Direct fetch FAILED:', response.status, errorText)
          alert(`Direct fetch FAILED!\nStatus: ${response.status}\nError: ${errorText}`)
        }
        
      } catch (error) {
        console.error('❌ Direct fetch ERROR:', error)
        alert(`Direct fetch ERROR: ${error.message}`)
      }
    }

    const testUnauthenticatedEndpoint = async () => {
      console.log('🔓 Testing unauthenticated endpoint...')
      
      const url = 'https://mnwpivaen5.us-east-1.awsapprunner.com/api/teams/test'
      
      try {
        console.log('Making direct fetch request to test endpoint...')
        console.log('URL:', url)
        
        const response = await fetch(url, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        })
        
        console.log('Response status:', response.status)
        console.log('Response headers:', response.headers)
        
        if (response.ok) {
          const data = await response.json()
          console.log('✅ Unauthenticated endpoint SUCCESS:', data)
          alert(`Unauthenticated endpoint SUCCESS!\nStatus: ${response.status}\nData: ${JSON.stringify(data, null, 2)}`)
        } else {
          const errorText = await response.text()
          console.log('❌ Unauthenticated endpoint FAILED:', response.status, errorText)
          alert(`Unauthenticated endpoint FAILED!\nStatus: ${response.status}\nError: ${errorText}`)
        }
        
      } catch (error) {
        console.error('❌ Unauthenticated endpoint ERROR:', error)
        alert(`Unauthenticated endpoint ERROR: ${error.message}`)
      }
    }

    const testNewPublicEndpoint = async () => {
      console.log('🆕 Testing new public endpoint...')
      
      const url = 'https://mnwpivaen5.us-east-1.awsapprunner.com/api/teams/test-public'
      
      try {
        console.log('Making direct fetch request to new test endpoint...')
        console.log('URL:', url)
        
        const response = await fetch(url, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        })
        
        console.log('Response status:', response.status)
        console.log('Response headers:', response.headers)
        
        if (response.ok) {
          const data = await response.json()
          console.log('✅ New public endpoint SUCCESS:', data)
          alert(`New public endpoint SUCCESS!\nStatus: ${response.status}\nData: ${JSON.stringify(data, null, 2)}`)
        } else {
          const errorText = await response.text()
          console.log('❌ New public endpoint FAILED:', response.status, errorText)
          alert(`New public endpoint FAILED!\nStatus: ${response.status}\nError: ${errorText}`)
        }
        
      } catch (error) {
        console.error('❌ New public endpoint ERROR:', error)
        alert(`New public endpoint ERROR: ${error.message}`)
      }
    }

    onMounted(() => {
      loadTeams()
    })

    return {
      teams,
      newTeam,
      newDeveloperName,
      editingTeam,
      submitting,
      loading,
      error,
      addTeam,
      toggleTeamEdit,
      updateTeam,
      deleteTeam: deleteTeamHandler,
      addDeveloper,
      removeDeveloper,
      generateAccessLink,
      copyToClipboard,
      debugApiUrl,
      viteApiBaseUrl,
      nodeEnv,
      mode,
      setWorkingToken,
      debugCurrentToken,
      testCurlRequest,
      testUnauthenticatedEndpoint,
      testNewPublicEndpoint
    }
  }
}
</script> 