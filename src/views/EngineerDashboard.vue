<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <!-- Header -->
    <div class="mb-8">
      <div class="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-6 text-white">
        <h1 class="text-2xl font-bold mb-2">👋 Welcome, {{ userName }}!</h1>
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
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
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
    </div>

    <!-- Action Buttons -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
      <div class="card">
        <div class="card-body text-center">
          <div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span class="text-2xl">📝</span>
          </div>
          <h3 class="text-lg font-semibold text-gray-900 mb-2">Add New Entry</h3>
          <p class="text-gray-600 mb-4">Log your weekly efficiency gains</p>
          <router-link to="/engineer/entry" class="btn-primary">
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
import { useAuthStore } from '../stores/auth'
import { getEngineerDashboard } from '../services/api'

export default {
  name: 'EngineerDashboard',
  setup() {
    const authStore = useAuthStore()
    const showAnalytics = ref(false)
    const entries = ref([])
    const loading = ref(true)
    const error = ref(null)

    const userName = computed(() => authStore.userData?.developer_name || 'Engineer')
    const teamName = computed(() => authStore.userData?.team_name || 'Unknown Team')

    const totalTimeSaved = computed(() => {
      return entries.value.reduce((sum, entry) => sum + (entry.efficiencyGained || entry.efficiency_gained || 0), 0)
    })

    const totalEntries = computed(() => entries.value.length)

    const thisWeekSaved = computed(() => {
      const now = new Date()
      const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay() + 1))
      startOfWeek.setHours(0, 0, 0, 0)
      
      return entries.value
        .filter(entry => new Date(entry.weekStart || entry.week_start) >= startOfWeek)
        .reduce((sum, entry) => sum + (entry.efficiencyGained || entry.efficiency_gained || 0), 0)
    })

    const categoryData = computed(() => {
      const categories = {}
      entries.value.forEach(entry => {
        const cat = entry.category || 'Other'
        if (!categories[cat]) {
          categories[cat] = 0
        }
        categories[cat] += entry.efficiencyGained || entry.efficiency_gained || 0
      })
      
      return Object.entries(categories)
        .map(([name, hours]) => ({ name, hours }))
        .sort((a, b) => b.hours - a.hours)
    })

    const recentEntries = computed(() => {
      return [...entries.value]
        .sort((a, b) => new Date(b.weekStart || b.week_start) - new Date(a.weekStart || a.week_start))
        .slice(0, 5)
    })

    const formatDate = (dateString) => {
      return new Date(dateString).toLocaleDateString()
    }

    const loadEntries = async () => {
      try {
        loading.value = true
        error.value = null
        
        console.log('Loading engineer dashboard data...')
        const response = await getEngineerDashboard()
        console.log('Engineer dashboard response:', response)
        
        // Handle different possible response structures
        entries.value = response.entries || response.recent_entries || []
        
        console.log('Engineer dashboard data loaded successfully')
        
      } catch (err) {
        console.error('Failed to load engineer dashboard:', err)
        
        if (err.response?.status === 401) {
          error.value = 'Authentication expired. Please log in again.'
          authStore.logout()
          return
        } else if (err.response?.status === 404) {
          error.value = 'Engineer dashboard endpoint not found.'
        } else {
          error.value = `Failed to load dashboard data: ${err.response?.data?.detail || err.message || 'Unknown error'}`
        }
        
        // Fallback to empty data instead of static data
        entries.value = []
        
      } finally {
        loading.value = false
      }
    }

    onMounted(() => {
      loadEntries()
    })

    return {
      showAnalytics,
      userName,
      teamName,
      totalTimeSaved,
      totalEntries,
      thisWeekSaved,
      categoryData,
      recentEntries,
      formatDate,
      loading,
      error
    }
  }
}
</script> 