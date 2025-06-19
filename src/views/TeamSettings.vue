<template>
  <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <!-- Header -->
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900">⚙️ System Settings</h1>
      <p class="mt-2 text-gray-600">Manage categories, efficiency areas, and system configuration</p>
    </div>

    <!-- Categories Section -->
    <div class="card mb-8">
      <div class="card-header">
        <h3 class="text-lg font-medium">📋 Task Categories</h3>
        <p class="text-sm text-gray-600 mt-1">Define the categories available for task classification</p>
      </div>
      <div class="card-body">
        <!-- Add Category -->
        <form @submit.prevent="addCategory" class="mb-6">
          <div class="flex space-x-3">
            <input
              v-model="newCategory"
              type="text"
              placeholder="Enter new category"
              class="input-field flex-1"
              required
            />
            <button
              type="submit"
              :disabled="!newCategory.trim() || submitting"
              class="btn-primary disabled:opacity-50"
            >
              Add Category
            </button>
          </div>
        </form>

        <!-- Categories List -->
        <div class="space-y-2">
          <div v-for="(category, index) in categories" :key="category" 
               class="flex items-center justify-between bg-gray-50 rounded-lg p-3">
            <span class="text-sm font-medium text-gray-900">{{ category }}</span>
            <button
              @click="removeCategory(index)"
              class="text-red-500 hover:text-red-700"
              title="Remove category"
            >
              <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Efficiency Areas Section -->
    <div class="card mb-8">
      <div class="card-header">
        <h3 class="text-lg font-medium">🎯 Efficiency Areas</h3>
        <p class="text-sm text-gray-600 mt-1">Define areas where AI assistance can provide efficiency gains</p>
      </div>
      <div class="card-body">
        <!-- Add Efficiency Area -->
        <form @submit.prevent="addEfficiencyArea" class="mb-6">
          <div class="flex space-x-3">
            <input
              v-model="newEfficiencyArea"
              type="text"
              placeholder="Enter new efficiency area"
              class="input-field flex-1"
              required
            />
            <button
              type="submit"
              :disabled="!newEfficiencyArea.trim() || submitting"
              class="btn-primary disabled:opacity-50"
            >
              Add Area
            </button>
          </div>
        </form>

        <!-- Efficiency Areas List -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-2">
          <div v-for="(area, index) in efficiencyAreas" :key="area" 
               class="flex items-center justify-between bg-blue-50 rounded-lg p-3">
            <span class="text-sm font-medium text-gray-900">{{ area }}</span>
            <button
              @click="removeEfficiencyArea(index)"
              class="text-red-500 hover:text-red-700"
              title="Remove efficiency area"
            >
              <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- General Settings -->
    <div class="card">
      <div class="card-header">
        <h3 class="text-lg font-medium">🔧 General Settings</h3>
      </div>
      <div class="card-body">
        <div class="space-y-6">
          <!-- Default Week Start -->
          <div>
            <label class="block text-sm font-medium text-gray-700">Default Week Start</label>
            <select v-model="settings.weekStart" class="input-field max-w-xs">
              <option value="monday">Monday</option>
              <option value="sunday">Sunday</option>
            </select>
            <p class="mt-1 text-xs text-gray-500">When does the work week start for your organization?</p>
          </div>

          <!-- Time Zone -->
          <div>
            <label class="block text-sm font-medium text-gray-700">Time Zone</label>
            <select v-model="settings.timeZone" class="input-field max-w-xs">
              <option value="UTC">UTC</option>
              <option value="America/New_York">Eastern Time</option>
              <option value="America/Chicago">Central Time</option>
              <option value="America/Denver">Mountain Time</option>
              <option value="America/Los_Angeles">Pacific Time</option>
            </select>
          </div>

          <!-- Minimum Entry Time -->
          <div>
            <label class="block text-sm font-medium text-gray-700">Minimum Entry Time (hours)</label>
            <input
              v-model.number="settings.minEntryTime"
              type="number"
              min="0"
              step="0.5"
              class="input-field max-w-xs"
            />
            <p class="mt-1 text-xs text-gray-500">Minimum time that can be logged in a single entry</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Save Button -->
    <div class="mt-8 flex justify-end">
      <button
        @click="saveSettings"
        :disabled="submitting"
        class="btn-primary disabled:opacity-50"
      >
        {{ submitting ? 'Saving...' : 'Save Settings' }}
      </button>
    </div>
  </div>
</template>

<script>
import { ref, reactive, onMounted } from 'vue'

export default {
  name: 'TeamSettings',
  setup() {
    const categories = ref([])
    const efficiencyAreas = ref([])
    const settings = ref({
      weekStart: 'monday',
      timeZone: 'UTC',
      minEntryTime: 0.5
    })
    
    const newCategory = ref('')
    const newEfficiencyArea = ref('')
    const submitting = ref(false)

    const loadSettings = async () => {
      try {
        // This will be implemented when backend is ready
        // const response = await adminAPI.getSettings()
        // categories.value = response.data.categories
        // efficiencyAreas.value = response.data.efficiencyAreas
        // settings.value = { ...settings.value, ...response.data.settings }
        
        // Placeholder data
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
          'Code Generation',
          'Code Completion',
          'API Design',
          'Documentation',
          'Debugging',
          'Code Analysis',
          'Test Writing',
          'Refactoring',
          'Test Data Creation',
          'Query Optimization'
        ]
      } catch (error) {
        console.error('Failed to load settings:', error)
      }
    }

    const addCategory = () => {
      if (!newCategory.value.trim()) return
      if (categories.value.includes(newCategory.value.trim())) {
        alert('Category already exists')
        return
      }
      
      categories.value.push(newCategory.value.trim())
      newCategory.value = ''
    }

    const removeCategory = (index) => {
      if (confirm('Are you sure you want to remove this category? This may affect existing entries.')) {
        categories.value.splice(index, 1)
      }
    }

    const addEfficiencyArea = () => {
      if (!newEfficiencyArea.value.trim()) return
      if (efficiencyAreas.value.includes(newEfficiencyArea.value.trim())) {
        alert('Efficiency area already exists')
        return
      }
      
      efficiencyAreas.value.push(newEfficiencyArea.value.trim())
      newEfficiencyArea.value = ''
    }

    const removeEfficiencyArea = (index) => {
      if (confirm('Are you sure you want to remove this efficiency area?')) {
        efficiencyAreas.value.splice(index, 1)
      }
    }

    const saveSettings = async () => {
      try {
        submitting.value = true
        
        const settingsData = {
          categories: categories.value,
          efficiencyAreas: efficiencyAreas.value,
          settings: settings.value
        }
        
        // This will be implemented when backend is ready
        // await adminAPI.updateSettings(settingsData)
        
        console.log('Settings saved:', settingsData)
        alert('Settings saved successfully!')
        
      } catch (error) {
        console.error('Failed to save settings:', error)
        alert('Failed to save settings. Please try again.')
      } finally {
        submitting.value = false
      }
    }

    onMounted(() => {
      loadSettings()
    })

    return {
      categories,
      efficiencyAreas,
      settings,
      newCategory,
      newEfficiencyArea,
      submitting,
      addCategory,
      removeCategory,
      addEfficiencyArea,
      removeEfficiencyArea,
      saveSettings
    }
  }
}
</script> 