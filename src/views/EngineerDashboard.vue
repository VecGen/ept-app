<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <!-- Header -->
    <div class="mb-8">
      <div class="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-6 text-white">
        <h1 class="text-2xl font-bold mb-2">👋 Welcome, {{ developerName }}!</h1>
        <p class="text-blue-100">Team: {{ teamName }}</p>
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
        </div>
      </div>
    </div>

    <!-- Quick Stats -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <div class="stat-card">
        <div class="stat-card-content">
          <div class="stat-card-title">Total Time Saved</div>
          <div class="stat-card-value">{{ totalTimeSaved.toFixed(1) }}h</div>
        </div>
      </div>
      
      <div class="stat-card">
        <div class="stat-card-content">
          <div class="stat-card-title">Total Entries</div>
          <div class="stat-card-value">{{ totalEntries }}</div>
        </div>
      </div>
      
      <div class="stat-card">
        <div class="stat-card-content">
          <div class="stat-card-title">This Week</div>
          <div class="stat-card-value">{{ thisWeekSaved.toFixed(1) }}h</div>
        </div>
      </div>
      
      <div class="stat-card">
        <div class="stat-card-content">
          <div class="stat-card-title">Avg Efficiency</div>
          <div class="stat-card-value">{{ averageEfficiency.toFixed(1) }}%</div>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="text-center py-8">
      <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      <p class="mt-2 text-gray-600">Loading dashboard...</p>
    </div>

    <!-- Action Buttons -->
    <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
      <div class="card">
        <div class="card-body text-center">
          <div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span class="text-2xl">📝</span>
          </div>
          <h3 class="text-lg font-semibold text-gray-900 mb-2">Add New Entry</h3>
          <p class="text-gray-600 mb-4">Log your weekly efficiency gains</p>
          <router-link 
            :to="`/engineer/entry?team=${teamName}&dev=${developerName}`" 
            class="btn-primary"
          >
            Add Entry
          </router-link>
        </div>
      </div>
      
      <div class="card">
        <div class="card-body text-center">
          <div class="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span class="text-2xl">📊</span>
          </div>
          <h3 class="text-lg font-semibold text-gray-900 mb-2">View Analytics</h3>
          <p class="text-gray-600 mb-4">See your progress over time</p>
          <button @click="showAnalytics = !showAnalytics" class="btn-secondary">
            {{ showAnalytics ? 'Hide' : 'Show' }} Analytics
          </button>
        </div>
      </div>
    </div>

    <!-- Analytics Section -->
    <div v-if="showAnalytics" class="space-y-6">
      <!-- Category Breakdown -->
      <div class="card">
        <div class="card-header">
          <h3 class="text-lg font-medium">Efficiency by Category</h3>
        </div>
        <div class="card-body">
          <div v-if="categoryData.length === 0" class="text-center text-gray-500 py-8">
            No data available yet. Start logging your efficiency gains!
          </div>
          <div v-else class="space-y-3">
            <div v-for="category in categoryData" :key="category.name" class="flex justify-between items-center">
              <span class="text-sm font-medium text-gray-700">{{ category.name }}</span>
              <span class="text-sm text-gray-500">{{ category.hours.toFixed(1) }}h</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Recent Entries -->
      <div class="card">
        <div class="card-header">
          <h3 class="text-lg font-medium">Recent Entries</h3>
        </div>
        <div class="card-body">
          <div v-if="recentEntries.length === 0" class="text-center text-gray-500 py-8">
            No entries yet.
          </div>
          <div v-else class="space-y-4">
            <div v-for="entry in recentEntries" :key="entry.id" 
                 class="border-l-4 border-blue-500 pl-4 py-2">
              <div class="flex justify-between items-start">
                <div>
                  <p class="font-medium text-gray-900">{{ entry.storyId || 'No ID' }}</p>
                  <p class="text-sm text-gray-600">{{ entry.category }}</p>
                  <p class="text-xs text-gray-500">{{ formatDate(entry.weekStart) }}</p>
                </div>
                <div class="text-right">
                  <p class="font-medium text-green-600">+{{ entry.efficiencyGained.toFixed(1) }}h</p>
                  <p class="text-xs text-gray-500">{{ entry.copilotUsed ? 'With Copilot' : 'No Copilot' }}</p>
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
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

export default {
  name: 'EngineerDashboard',
  setup() {
    const route = useRoute()
    const router = useRouter()
    const authStore = useAuthStore()
    const showAnalytics = ref(false)
    const entries = ref([])
    const dashboardStats = ref({})
    const loading = ref(true)
    const error = ref(null)

    // Get team and developer info from auth store first, then URL parameters
    const teamName = computed(() => {
      if (authStore.isAuthenticated && authStore.user?.team) {
        return authStore.user.team
      }
      return route.query.team || 'Unknown Team'
    })

    const developerName = computed(() => {
      if (authStore.isAuthenticated && authStore.user?.name) {
        return authStore.user.name
      }
      return route.query.dev || 'Unknown Developer'
    })

    // Check for unknown users and redirect to login
    const checkAndRedirectUnknownUser = () => {
      if (teamName.value === 'Unknown Team' || developerName.value === 'Unknown Developer') {
        console.log('Unknown user detected, redirecting to login:', { 
          team: teamName.value, 
          developer: developerName.value 
        })
        
        router.push({
          name: 'EngineerLogin',
          query: {
            team: teamName.value,
            developer: developerName.value,
            redirect: route.fullPath
          }
        })
        return true
      }
      return false
    }

    const totalTimeSaved = computed(() => {
      return dashboardStats.value.total_time_saved || 0
    })

    const totalEntries = computed(() => {
      return dashboardStats.value.total_entries || 0
    })

    const thisWeekSaved = computed(() => {
      // Calculate this week's savings from entries since API doesn't provide it
      const now = new Date()
      const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay() + 1))
      startOfWeek.setHours(0, 0, 0, 0)
      
      return entries.value
        .filter(entry => {
          const entryDate = new Date(entry.Week || entry.week_start)
          return entryDate >= startOfWeek
        })
        .reduce((sum, entry) => sum + (entry.Efficiency_Gained_Hours || 0), 0)
    })

    const averageEfficiency = computed(() => {
      return dashboardStats.value.average_efficiency || 0
    })

    const categoryData = computed(() => {
      const categories = {}
      entries.value.forEach(entry => {
        const cat = entry.Category || 'Other'
        if (!categories[cat]) {
          categories[cat] = 0
        }
        categories[cat] += entry.Efficiency_Gained_Hours || 0
      })
      
      return Object.entries(categories)
        .map(([name, hours]) => ({ name, hours }))
        .sort((a, b) => b.hours - a.hours)
    })

    const recentEntries = computed(() => {
      return [...entries.value]
        .sort((a, b) => new Date(b.Week || b.week_start) - new Date(a.Week || a.week_start))
        .slice(0, 5)
        .map(entry => ({
          id: entry.Story_ID || entry.story_id || Math.random().toString(36),
          storyId: entry.Story_ID || entry.story_id,
          category: entry.Category || entry.category,
          weekStart: entry.Week || entry.week_start,
          efficiencyGained: entry.Efficiency_Gained_Hours || entry.efficiency_gained || 0,
          copilotUsed: entry.Copilot_Used === 'Yes' || entry.copilot_used === 'Yes'
        }))
    })

    const formatDate = (dateString) => {
      return new Date(dateString).toLocaleDateString()
    }

    const loadDashboard = async () => {
      try {
        loading.value = true
        error.value = null
        
        // Check for unknown users and redirect if needed
        if (checkAndRedirectUnknownUser()) {
          return
        }
        
        console.log('Loading engineer dashboard data for:', { team: teamName.value, developer: developerName.value })
        
        const response = await fetch(`https://mnwpivaen5.us-east-1.awsapprunner.com/api/engineer/dashboard?developer_name=${encodeURIComponent(developerName.value)}&team_name=${encodeURIComponent(teamName.value)}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        })
        
        if (!response.ok) {
          throw new Error(`API returned ${response.status}: ${response.statusText}`)
        }
        
        const data = await response.json()
        console.log('Engineer dashboard response:', data)
        
        // API returns data directly at root level, not nested
        dashboardStats.value = {
          total_time_saved: data.total_time_saved || 0,
          total_entries: data.total_entries || 0,
          average_efficiency: data.average_efficiency || 0
        }
        
        // Store recent entries for category analysis and recent entries display
        entries.value = data.recent_entries || []
        
        console.log('Engineer dashboard data loaded successfully:', {
          stats: dashboardStats.value,
          entriesCount: entries.value.length
        })
        
      } catch (err) {
        console.error('Failed to load engineer dashboard:', err)
        error.value = `Failed to load dashboard data: ${err.message || 'Unknown error'}`
        
        // Fallback to empty data
        entries.value = []
        dashboardStats.value = {}
        
      } finally {
        loading.value = false
      }
    }

    onMounted(() => {
      loadDashboard()
    })

    return {
      showAnalytics,
      teamName,
      developerName,
      totalTimeSaved,
      totalEntries,
      thisWeekSaved,
      averageEfficiency,
      categoryData,
      recentEntries,
      formatDate,
      loading,
      error
    }
  }
}
</script> 