<template>
  <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <!-- Header -->
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900">📝 Log Weekly Update</h1>
      <p class="mt-2 text-gray-600">Track your efficiency gains from AI coding assistants</p>
    </div>

    <!-- Form -->
    <form @submit.prevent="submitEntry" class="space-y-6">
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
        <router-link to="/engineer" class="btn-secondary">
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
import { ref, computed, watch } from 'vue'
import { useRouter } from 'vue-router'

export default {
  name: 'EngineerEntry',
  setup() {
    const router = useRouter()
    const submitting = ref(false)
    
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

    // Static data (will come from backend later)
    const categories = ref([
      'Feature Development',
      'Bug Fixes',
      'Code Review',
      'Testing',
      'Documentation',
      'Refactoring',
      'API Development',
      'Database Work'
    ])

    const efficiencyAreasByCategory = {
      'Feature Development': ['Code Generation', 'API Design', 'Code Completion', 'Documentation'],
      'Bug Fixes': ['Debugging', 'Code Analysis', 'Test Writing', 'Code Completion'],
      'Code Review': ['Code Analysis', 'Code Completion', 'Documentation', 'Refactoring'],
      'Testing': ['Test Writing', 'Code Generation', 'Test Data Creation', 'Debugging'],
      'Documentation': ['Documentation', 'Code Generation', 'API Design', 'Code Completion'],
      'Refactoring': ['Refactoring', 'Code Analysis', 'Code Generation', 'Code Completion'],
      'API Development': ['API Design', 'Code Generation', 'Documentation', 'Test Writing'],
      'Database Work': ['Query Optimization', 'Code Generation', 'Documentation', 'Debugging']
    }

    const allEfficiencyAreas = [
      'Code Generation', 'Code Completion', 'API Design', 'Documentation',
      'Debugging', 'Code Analysis', 'Test Writing', 'Refactoring',
      'Test Data Creation', 'Query Optimization'
    ]

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
      return efficiencyAreasByCategory[form.value.category] || allEfficiencyAreas
    })

    const canSubmit = computed(() => {
      const baseValid = form.value.originalEstimate > 0 && form.value.efficiencyGained >= 0
      if (form.value.copilotUsed === 'Yes') {
        return baseValid && form.value.efficiencyAreas.length > 0
      }
      return baseValid
    })

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

      try {
        submitting.value = true
        
        const entryData = {
          ...form.value,
          weekStart: getWeekDates(new Date(form.value.weekDate)).monday.toISOString().split('T')[0]
        }

        // This will be implemented when backend is ready
        // await engineerAPI.createEntry(entryData)
        
        console.log('Entry data:', entryData)
        
        // Show success message and redirect
        alert('Entry saved successfully!')
        router.push('/engineer')
        
      } catch (error) {
        console.error('Failed to save entry:', error)
        alert('Failed to save entry. Please try again.')
      } finally {
        submitting.value = false
      }
    }

    return {
      form,
      categories,
      maxDate,
      weekRange,
      availableEfficiencyAreas,
      canSubmit,
      submitting,
      submitEntry
    }
  }
}
</script> 