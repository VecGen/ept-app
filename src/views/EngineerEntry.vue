<template>
  <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <!-- Header -->
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900">📝 Log Weekly Update</h1>
      <p class="mt-2 text-gray-600">Track your efficiency gains from AI coding assistants</p>
      
      <!-- Team and Developer Info -->
      <div v-if="teamName && developerName" class="mt-4 p-3 bg-blue-50 rounded-md">
        <p class="text-sm text-blue-700">
          <strong>Team:</strong> {{ teamName }} | <strong>Developer:</strong> {{ developerName }}
        </p>
      </div>
      
      <!-- Error Message -->
      <div v-if="error" class="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
        <p class="text-sm text-red-800">{{ error }}</p>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="text-center py-8">
      <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      <p class="mt-2 text-gray-600">Loading form settings...</p>
    </div>

    <!-- Form -->
    <form v-else @submit.prevent="submitEntry" class="space-y-6">
      <!-- Week Selection -->
      <div class="card">
        <div class="card-header">
          <h3 class="text-lg font-medium">📅 Week Selection</h3>
        </div>
        <div class="card-body">
          <div class="max-w-xs">
            <label for="week-date" class="block text-sm font-medium text-gray-700">
              Select Week
            </label>
            <input
              id="week-date"
              v-model="form.weekDate"
              type="date"
              :max="maxDate"
              class="input-field"
              required
            />
            <p class="mt-1 text-sm text-gray-500">
              Select any date within the week you want to log
            </p>
          </div>
          
          <div v-if="weekRange" class="mt-4 p-3 bg-blue-50 rounded-md">
            <p class="text-sm text-blue-700">
              📅 <strong>Selected Week:</strong> {{ weekRange }}
            </p>
          </div>
        </div>
      </div>

      <!-- Copilot Usage -->
      <div class="card">
        <div class="card-header">
          <h3 class="text-lg font-medium">🤖 AI Assistant Usage</h3>
        </div>
        <div class="card-body">
          <div class="max-w-xs">
            <label for="copilot-used" class="block text-sm font-medium text-gray-700">
              Used GitHub Copilot?
            </label>
            <select
              id="copilot-used"
              v-model="form.copilotUsed"
              class="input-field"
              required
            >
              <option value="Yes">Yes</option>
              <option value="No">No</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Task Category -->
      <div class="card">
        <div class="card-header">
          <h3 class="text-lg font-medium">📋 Task Category</h3>
        </div>
        <div class="card-body">
          <div class="max-w-xs">
            <label for="category" class="block text-sm font-medium text-gray-700">
              Task Category
            </label>
            <select
              id="category"
              v-model="form.category"
              class="input-field"
              required
            >
              <option v-for="category in categories" :key="category" :value="category">
                {{ category }}
              </option>
            </select>
          </div>
        </div>
      </div>

      <!-- Efficiency Areas (only if using Copilot) -->
      <div v-if="form.copilotUsed === 'Yes'" class="card">
        <div class="card-header">
          <h3 class="text-lg font-medium">🎯 Where did Copilot help?</h3>
        </div>
        <div class="card-body">
          <p class="text-sm text-gray-600 mb-4">
            Select the areas where AI assistance improved your efficiency:
          </p>
          
          <div class="grid grid-cols-2 gap-3">
            <div v-for="area in availableEfficiencyAreas" :key="area" class="flex items-center">
              <input
                :id="`area-${area}`"
                v-model="form.efficiencyAreas"
                :value="area"
                type="checkbox"
                class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label :for="`area-${area}`" class="ml-2 text-sm text-gray-700">
                {{ area }}
              </label>
            </div>
          </div>
          
          <div v-if="form.efficiencyAreas.length > 0" class="mt-4 p-3 bg-green-50 rounded-md">
            <p class="text-sm text-green-700">
              🎯 <strong>Selected:</strong> {{ form.efficiencyAreas.join(', ') }}
            </p>
          </div>
          
          <div v-else class="mt-4 p-3 bg-yellow-50 rounded-md">
            <p class="text-sm text-yellow-700">
              ⚠️ Please select at least one efficiency area
            </p>
          </div>
        </div>
      </div>

      <!-- Task Details -->
      <div class="card">
        <div class="card-header">
          <h3 class="text-lg font-medium">📝 Task Details</h3>
        </div>
        <div class="card-body">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label for="story-id" class="block text-sm font-medium text-gray-700">
                Story/Task ID
              </label>
              <input
                id="story-id"
                v-model="form.storyId"
                type="text"
                placeholder="e.g., ENG-1542"
                class="input-field"
              />
            </div>
            
            <div>
              <label for="original-estimate" class="block text-sm font-medium text-gray-700">
                Original Estimate (Hours)
              </label>
              <input
                id="original-estimate"
                v-model.number="form.originalEstimate"
                type="number"
                min="0"
                step="0.5"
                placeholder="0.0"
                class="input-field"
                required
              />
              <p class="mt-1 text-xs text-gray-500">
                How long would this have taken without Copilot?
              </p>
            </div>
          </div>
          
          <div class="mt-6">
            <label for="efficiency-gained" class="block text-sm font-medium text-gray-700">
              Time Saved (Hours)
            </label>
            <input
              id="efficiency-gained"
              v-model.number="form.efficiencyGained"
              type="number"
              min="0"
              step="0.5"
              placeholder="0.0"
              class="input-field max-w-xs"
              required
            />
            <p class="mt-1 text-xs text-gray-500">
              How much time did AI assistance save you?
            </p>
          </div>
          
          <div class="mt-6">
            <label for="notes" class="block text-sm font-medium text-gray-700">
              Notes (Optional)
            </label>
            <textarea
              id="notes"
              v-model="form.notes"
              rows="3"
              placeholder="Additional details about the task and efficiency gains..."
              class="input-field"
            ></textarea>
          </div>
        </div>
      </div>

      <!-- Submit Button -->
      <div class="flex justify-end space-x-3">
        <router-link 
          :to="`/engineer?team=${teamName}&dev=${developerName}`" 
          class="btn-secondary"
        >
          Cancel
        </router-link>
        <button
          type="submit"
          :disabled="!canSubmit || submitting"
          class="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span v-if="submitting">Saving...</span>
          <span v-else>Save Entry</span>
        </button>
      </div>
    </form>
  </div>
</template>

<script>
import { ref, computed, watch, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'

export default {
  name: 'EngineerEntry',
  setup() {
    const router = useRouter()
    const route = useRoute()
    const submitting = ref(false)
    const loading = ref(true)
    const error = ref(null)
    
    // Get team and developer from URL parameters
    const teamName = ref(route.query.team || '')
    const developerName = ref(route.query.dev || '')
    
    // Form data
    const form = ref({
      weekDate: getCurrentWeekMonday(),
      copilotUsed: 'Yes',
      category: 'Feature Development',
      efficiencyAreas: [],
      storyId: '',
      originalEstimate: 0,
      efficiencyGained: 0,
      notes: ''
    })

    // Dynamic data from API
    const categories = ref([])
    const efficiencyAreas = ref([])

    const efficiencyAreasByCategory = ref({})

    // Computed properties
    const maxDate = computed(() => {
      const today = new Date()
      return today.toISOString().split('T')[0]
    })

    const weekRange = computed(() => {
      if (!form.value.weekDate) return null
      const date = new Date(form.value.weekDate)
      const { monday, sunday } = getWeekDates(date)
      return `${formatDate(monday)} - ${formatDate(sunday)}`
    })

    const availableEfficiencyAreas = computed(() => {
      return efficiencyAreasByCategory.value[form.value.category] || efficiencyAreas.value
    })

    const canSubmit = computed(() => {
      const baseValid = form.value.originalEstimate > 0 && form.value.efficiencyGained >= 0
      if (form.value.copilotUsed === 'Yes') {
        return baseValid && form.value.efficiencyAreas.length > 0
      }
      return baseValid
    })

    // Load settings from API
    const loadSettings = async () => {
      try {
        loading.value = true
        error.value = null
        
        console.log('Loading team settings...')
        
        const response = await fetch('https://mnwpivaen5.us-east-1.awsapprunner.com/api/engineer/settings', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        })
        
        if (response.ok) {
          const settingsData = await response.json()
          console.log('Settings loaded successfully:', settingsData)
          
          if (settingsData.success && settingsData.data) {
            categories.value = settingsData.data.categories || []
            efficiencyAreas.value = settingsData.data.efficiency_areas || []
            efficiencyAreasByCategory.value = settingsData.data.category_efficiency_mapping || {}
          }
        } else {
          throw new Error(`Failed to load settings: ${response.status}`)
        }
        
      } catch (err) {
        console.error('Failed to load settings:', err)
        error.value = `Failed to load settings: ${err.message}`
        
        // Fallback to default values
        categories.value = [
          'Feature Development',
          'Bug Fixes',
          'Code Review',
          'Testing',
          'Documentation',
          'Refactoring',
          'API Development',
          'Database Work'
        ]
        
        efficiencyAreas.value = [
          'Code Generation', 'Code Completion', 'API Design', 'Documentation',
          'Debugging', 'Code Analysis', 'Test Writing', 'Refactoring',
          'Test Data Creation', 'Query Optimization'
        ]
        
      } finally {
        loading.value = false
      }
    }

    // Watch for category changes to reset efficiency areas
    watch(() => form.value.category, () => {
      form.value.efficiencyAreas = []
    })

    // Watch for copilot usage changes
    watch(() => form.value.copilotUsed, () => {
      if (form.value.copilotUsed === 'No') {
        form.value.efficiencyAreas = []
      }
    })

    // Methods
    function getCurrentWeekMonday() {
      const today = new Date()
      const dayOfWeek = today.getDay()
      const monday = new Date(today)
      monday.setDate(today.getDate() - dayOfWeek + 1)
      return monday.toISOString().split('T')[0]
    }

    function getWeekDates(date) {
      const dayOfWeek = date.getDay()
      const monday = new Date(date)
      monday.setDate(date.getDate() - dayOfWeek + 1)
      
      const sunday = new Date(monday)
      sunday.setDate(monday.getDate() + 6)
      
      return { monday, sunday }
    }

    function formatDate(date) {
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      })
    }

    async function submitEntry() {
      if (!canSubmit.value) return
      
      if (!teamName.value || !developerName.value) {
        error.value = 'Missing team or developer information. Please access this page through the proper link.'
        return
      }

      try {
        submitting.value = true
        error.value = null
        
        const entryData = {
          week_date: form.value.weekDate,
          story_id: form.value.storyId || 'No ID',
          original_estimate: form.value.originalEstimate,
          efficiency_gained: form.value.efficiencyGained,
          copilot_used: form.value.copilotUsed,
          category: form.value.category,
          efficiency_areas: form.value.efficiencyAreas,
          notes: form.value.notes || ''
        }

        console.log('Submitting entry:', entryData)
        
        const queryParams = new URLSearchParams({
          developer_name: developerName.value,
          team_name: teamName.value
        })
        
        const response = await fetch(`https://mnwpivaen5.us-east-1.awsapprunner.com/api/engineer/entry?${queryParams}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(entryData)
        })
        
        if (response.ok) {
          const result = await response.json()
          console.log('Entry saved successfully:', result)
          
          // Show success message and redirect
          alert('Entry saved successfully!')
          router.push(`/engineer?team=${teamName.value}&dev=${developerName.value}`)
        } else {
          const errorData = await response.json()
          throw new Error(errorData.detail || `HTTP ${response.status}`)
        }
        
      } catch (error) {
        console.error('Failed to save entry:', error)
        error.value = `Failed to save entry: ${error.message}`
      } finally {
        submitting.value = false
      }
    }

    onMounted(() => {
      loadSettings()
    })

    return {
      form,
      categories,
      efficiencyAreas,
      teamName,
      developerName,
      maxDate,
      weekRange,
      availableEfficiencyAreas,
      canSubmit,
      submitting,
      loading,
      error,
      submitEntry
    }
  }
}
</script> 