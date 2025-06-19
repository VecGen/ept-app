<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <!-- Header -->
    <div class="mb-8">
      <div class="bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg p-6 text-white">
        <div class="flex justify-between items-start">
          <div>
            <h1 class="text-3xl font-bold mb-2">🎯 Admin Dashboard</h1>
            <p class="text-purple-100">Welcome to the Efficiency Tracker admin panel</p>
          </div>
          <button 
            @click="logout"
            class="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg text-sm transition-colors duration-200"
          >
            Logout
          </button>
        </div>
        
        <!-- Refresh Button -->
        <button 
          @click="loadAnalytics" 
          :disabled="loading"
          class="mt-3 bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg text-sm transition-colors duration-200 disabled:opacity-50"
        >
          {{ loading ? 'Loading...' : 'Refresh Data' }}
        </button>
      </div>
    </div>

    <!-- Error Message -->
    <div v-if="error" class="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
      <div class="flex">
        <div class="flex-shrink-0">
          <span class="text-red-500 text-lg">⚠️</span>
        </div>
        <div class="ml-3">
          <p class="text-sm text-red-800">{{ error }}</p>
          <p class="text-xs text-red-600 mt-1">Showing fallback data for demonstration purposes.</p>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="flex items-center justify-center py-12">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
      <span class="ml-3 text-gray-600">Loading dashboard data...</span>
    </div>

    <!-- Dashboard Content -->
    <div v-else>
      <!-- Key Metrics -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div class="stat-card">
          <div class="stat-card-content">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <div class="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <span class="text-green-600 text-lg">⏰</span>
                </div>
              </div>
              <div class="ml-5 w-0 flex-1">
                <dl>
                  <dt class="text-sm font-medium text-gray-500 truncate">Total Hours Saved</dt>
                  <dd class="text-lg font-medium text-gray-900">{{ analytics.totalHoursSaved.toFixed(1) }}h</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-card-content">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <div class="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <span class="text-blue-600 text-lg">📝</span>
                </div>
              </div>
              <div class="ml-5 w-0 flex-1">
                <dl>
                  <dt class="text-sm font-medium text-gray-500 truncate">Total Entries</dt>
                  <dd class="text-lg font-medium text-gray-900">{{ analytics.totalEntries }}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-card-content">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <div class="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                  <span class="text-purple-600 text-lg">👥</span>
                </div>
              </div>
              <div class="ml-5 w-0 flex-1">
                <dl>
                  <dt class="text-sm font-medium text-gray-500 truncate">Active Teams</dt>
                  <dd class="text-lg font-medium text-gray-900">{{ analytics.activeTeams }}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-card-content">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <div class="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                  <span class="text-yellow-600 text-lg">👨‍💻</span>
                </div>
              </div>
              <div class="ml-5 w-0 flex-1">
                <dl>
                  <dt class="text-sm font-medium text-gray-500 truncate">Active Developers</dt>
                  <dd class="text-lg font-medium text-gray-900">{{ analytics.activeDevelopers }}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Quick Actions -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <router-link to="/admin/teams" class="card hover:shadow-lg transition-shadow duration-200">
          <div class="card-body text-center">
            <div class="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <span class="text-2xl">👥</span>
            </div>
            <h3 class="text-lg font-semibold text-gray-900 mb-2">Manage Teams</h3>
            <p class="text-sm text-gray-600">Create teams, add developers, generate access links</p>
          </div>
        </router-link>

        <router-link to="/admin/settings" class="card hover:shadow-lg transition-shadow duration-200">
          <div class="card-body text-center">
            <div class="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <span class="text-2xl">⚙️</span>
            </div>
            <h3 class="text-lg font-semibold text-gray-900 mb-2">System Settings</h3>
            <p class="text-sm text-gray-600">Configure categories, efficiency areas, settings</p>
          </div>
        </router-link>

        <router-link to="/admin/data" class="card hover:shadow-lg transition-shadow duration-200">
          <div class="card-body text-center">
            <div class="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <span class="text-2xl">📊</span>
            </div>
            <h3 class="text-lg font-semibold text-gray-900 mb-2">Data Management</h3>
            <p class="text-sm text-gray-600">Export data, manage entries, generate reports</p>
          </div>
        </router-link>

        <div class="card">
          <div class="card-body text-center">
            <div class="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <span class="text-2xl">��</span>
            </div>
            <h3 class="text-lg font-semibold text-gray-900 mb-2">View Analytics</h3>
            <p class="text-sm text-gray-600 mb-4">Detailed insights and trends</p>
            <button @click="showAnalytics = !showAnalytics" class="btn-secondary text-sm">
              {{ showAnalytics ? 'Hide' : 'Show' }} Details
            </button>
          </div>
        </div>
      </div>

      <!-- Analytics Section -->
      <div v-if="showAnalytics" class="space-y-6">
        <!-- Team Performance -->
        <div class="card">
          <div class="card-header">
            <h3 class="text-lg font-medium">📊 Team Performance</h3>
          </div>
          <div class="card-body">
            <div class="overflow-x-auto">
              <table class="min-w-full divide-y divide-gray-200">
                <thead class="bg-gray-50">
                  <tr>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Team
                    </th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Hours Saved
                    </th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Entries
                    </th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Avg per Entry
                    </th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Developers
                    </th>
                  </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                  <tr v-for="team in analytics.teamStats" :key="team.name">
                    <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {{ team.name }}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-green-600 font-medium">
                      {{ team.hours.toFixed(1) }}h
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {{ team.entries }}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {{ (team.hours / team.entries).toFixed(1) }}h
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {{ team.developers || 'N/A' }}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <!-- Recent Activity -->
        <div class="card">
          <div class="card-header">
            <h3 class="text-lg font-medium">🕒 Recent Activity</h3>
          </div>
          <div class="card-body">
            <div class="flow-root">
              <ul class="-mb-8">
                <li v-for="(activity, index) in recentActivity" :key="activity.id">
                  <div class="relative pb-8">
                    <span v-if="index !== recentActivity.length - 1" 
                          class="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200" 
                          aria-hidden="true"></span>
                    <div class="relative flex space-x-3">
                      <div>
                        <span class="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center ring-8 ring-white">
                          <span class="text-white text-sm">{{ activity.icon }}</span>
                        </span>
                      </div>
                      <div class="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                        <div>
                          <p class="text-sm text-gray-500">
                            {{ activity.description }}
                          </p>
                        </div>
                        <div class="text-right text-sm whitespace-nowrap text-gray-500">
                          {{ formatTimeAgo(activity.timestamp) }}
                        </div>
                      </div>
                    </div>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <!-- Top Categories -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div class="card">
            <div class="card-header">
              <h3 class="text-lg font-medium">🎯 Top Categories by Hours Saved</h3>
            </div>
            <div class="card-body">
              <div class="space-y-3">
                <div v-for="category in topCategories" :key="category.name" 
                     class="flex justify-between items-center">
                  <span class="text-sm font-medium text-gray-700">{{ category.name }}</span>
                  <div class="flex items-center space-x-2">
                    <div class="w-20 bg-gray-200 rounded-full h-2">
                      <div class="bg-blue-600 h-2 rounded-full" 
                           :style="{ width: (category.hours / topCategories[0].hours * 100) + '%' }"></div>
                    </div>
                    <span class="text-sm text-gray-500 w-12 text-right">{{ category.hours.toFixed(1) }}h</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="card">
            <div class="card-header">
              <h3 class="text-lg font-medium">🤖 Copilot Adoption</h3>
            </div>
            <div class="card-body">
              <div class="text-center">
                <div class="text-3xl font-bold text-green-600 mb-2">
                  {{ ((analytics.copilotUsage?.withCopilot || 0) / (analytics.copilotUsage?.total || 1) * 100).toFixed(1) }}%
                </div>
                <p class="text-sm text-gray-600 mb-4">of entries use Copilot</p>
                
                <div class="space-y-2">
                  <div class="flex justify-between text-sm">
                    <span class="text-gray-600">With Copilot:</span>
                    <span class="font-medium">{{ analytics.copilotUsage?.withCopilot || 0 }} entries</span>
                  </div>
                  <div class="flex justify-between text-sm">
                    <span class="text-gray-600">Without Copilot:</span>
                    <span class="font-medium">{{ analytics.copilotUsage?.withoutCopilot || 0 }} entries</span>
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
import { ref, onMounted } from 'vue'
import { getAdminDashboard, getOverallAnalytics } from '../services/api'
import { useAuthStore } from '../stores/auth'
import { useRouter } from 'vue-router'

export default {
  name: 'AdminDashboard',
  setup() {
    const authStore = useAuthStore()
    const router = useRouter()
    
    const analytics = ref({
      totalHoursSaved: 0,
      totalEntries: 0,
      activeTeams: 0,
      activeDevelopers: 0,
      teamStats: [],
      copilotUsage: {
        withCopilot: 0,
        withoutCopilot: 0,
        total: 0
      }
    })
    
    const recentActivity = ref([])
    const topCategories = ref([])
    const showAnalytics = ref(false)
    const loading = ref(true)
    const error = ref(null)

    const loadAnalytics = async () => {
      try {
        loading.value = true
        error.value = null
        
        // Check if user is authenticated
        if (!authStore.isAuthenticated) {
          error.value = 'Not authenticated. Please log in first.'
          router.push('/admin/login')
          return
        }
        
        console.log('Loading dashboard data...')
        console.log('Auth token exists:', !!localStorage.getItem('auth_token'))
        
        // Load admin dashboard data from API
        const dashboardResponse = await getAdminDashboard()
        console.log('Dashboard response:', dashboardResponse)
        
        // Load overall analytics
        const analyticsResponse = await getOverallAnalytics({
          start_date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 30 days ago
          end_date: new Date().toISOString().split('T')[0] // today
        })
        console.log('Analytics response:', analyticsResponse)
        
        // Update analytics with real data
        analytics.value = {
          totalHoursSaved: analyticsResponse.total_hours_saved || 0,
          totalEntries: analyticsResponse.total_entries || 0,
          activeTeams: dashboardResponse.active_teams || 0,
          activeDevelopers: dashboardResponse.active_developers || 0,
          teamStats: analyticsResponse.team_stats || [],
          copilotUsage: analyticsResponse.copilot_usage || {
            withCopilot: 0,
            withoutCopilot: 0,
            total: 0
          }
        }
        
        // Set recent activity from API
        recentActivity.value = dashboardResponse.recent_activity || []
        
        // Set top categories from API
        topCategories.value = analyticsResponse.top_categories || []
        
        console.log('Dashboard data loaded successfully')
        
      } catch (err) {
        console.error('Failed to load analytics:', err)
        
        // Handle specific error cases
        if (err.response?.status === 401) {
          error.value = 'Authentication expired. Please log in again.'
          authStore.logout()
          router.push('/admin/login')
          return
        } else if (err.response?.status === 403) {
          error.value = 'Access denied. Admin privileges required.'
          return
        } else if (err.response?.status === 404) {
          error.value = 'API endpoint not found. Please check if the API is properly deployed.'
        } else if (err.code === 'NETWORK_ERROR' || err.message.includes('Network Error')) {
          error.value = 'Network error. Please check your internet connection and try again.'
        } else {
          error.value = `Failed to load dashboard data: ${err.response?.data?.detail || err.message || 'Unknown error'}`
        }
        
        // Fallback to placeholder data if API fails
        analytics.value = {
          totalHoursSaved: 120.5,
          totalEntries: 45,
          activeTeams: 3,
          activeDevelopers: 8,
          teamStats: [
            { name: 'Frontend Team', hours: 45.5, entries: 12, developers: 3 },
            { name: 'Backend Team', hours: 35.0, entries: 18, developers: 3 },
            { name: 'Platform Team', hours: 40.0, entries: 15, developers: 2 }
          ],
          copilotUsage: {
            withCopilot: 38,
            withoutCopilot: 7,
            total: 45
          }
        }
        
        recentActivity.value = [
          {
            id: 1,
            icon: '👥',
            description: 'New team "DevOps Team" was created',
            timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000)
          },
          {
            id: 2,
            icon: '📝',
            description: 'Alice Johnson logged 2.5 hours of efficiency gains',
            timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000)
          },
          {
            id: 3,
            icon: '⚙️',
            description: 'System settings were updated',
            timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000)
          },
          {
            id: 4,
            icon: '👨‍💻',
            description: 'Bob Smith was added to Backend Team',
            timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000)
          }
        ]
        
        topCategories.value = [
          { name: 'Feature Development', hours: 42.5 },
          { name: 'Bug Fixes', hours: 28.0 },
          { name: 'Code Review', hours: 22.0 },
          { name: 'Testing', hours: 18.5 },
          { name: 'API Development', hours: 9.5 }
        ]
      } finally {
        loading.value = false
      }
    }

    const formatTimeAgo = (timestamp) => {
      const now = new Date()
      const diff = now - new Date(timestamp)
      const hours = Math.floor(diff / (1000 * 60 * 60))
      const days = Math.floor(hours / 24)
      
      if (days > 0) {
        return `${days} day${days === 1 ? '' : 's'} ago`
      } else if (hours > 0) {
        return `${hours} hour${hours === 1 ? '' : 's'} ago`
      } else {
        const minutes = Math.floor(diff / (1000 * 60))
        return `${minutes} minute${minutes === 1 ? '' : 's'} ago`
      }
    }
    
    const logout = () => {
      authStore.logout()
      router.push('/admin/login')
    }

    onMounted(() => {
      loadAnalytics()
    })

    return {
      analytics,
      recentActivity,
      topCategories,
      showAnalytics,
      loading,
      error,
      formatTimeAgo,
      loadAnalytics,
      logout
    }
  }
}
</script> 