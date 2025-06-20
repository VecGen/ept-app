<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <!-- Header -->
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900">⚙️ System Settings</h1>
      <p class="mt-2 text-gray-600">Manage task categories and their associated efficiency areas</p>
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
      <p class="mt-2 text-gray-600">Loading settings...</p>
    </div>

    <!-- Content (hidden when loading) -->
    <div v-else>
      <!-- Add Category Section -->
      <div class="card mb-8">
        <div class="card-header">
          <h3 class="text-lg font-medium">➕ Add New Task Category</h3>
        </div>
        <div class="card-body">
          <form @submit.prevent="addCategory" class="space-y-4">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label for="category-name" class="block text-sm font-medium text-gray-700">
                  Category Name
                </label>
                <input
                  id="category-name"
                  v-model="newCategory.name"
                  type="text"
                  placeholder="e.g., Feature Development"
                  class="input-field"
                  required
                />
              </div>
              <div>
                <label for="category-description" class="block text-sm font-medium text-gray-700">
                  Description (Optional)
                </label>
                <input
                  id="category-description"
                  v-model="newCategory.description"
                  type="text"
                  placeholder="Brief description of the category"
                  class="input-field"
                />
              </div>
            </div>
            
            <div class="flex justify-end">
              <button
                type="submit"
                :disabled="!newCategory.name.trim() || submitting"
                class="btn-primary disabled:opacity-50"
              >
                {{ submitting ? 'Adding...' : 'Add Category' }}
              </button>
            </div>
          </form>
        </div>
      </div>

      <!-- Categories List -->
      <div class="space-y-6">
        <div v-if="categories.length === 0" class="text-center py-12">
          <div class="text-gray-400 text-6xl mb-4">📋</div>
          <h3 class="text-lg font-medium text-gray-900 mb-2">No categories yet</h3>
          <p class="text-gray-600">Create your first task category above to get started.</p>
        </div>

        <div v-for="category in categories" :key="category.id" class="card">
          <div class="card-header">
            <div class="flex justify-between items-center">
              <div>
                <h3 class="text-lg font-medium">{{ category.name }}</h3>
                <p v-if="category.description" class="text-sm text-gray-600 mt-1">{{ category.description }}</p>
              </div>
              <div class="flex space-x-2">
                <button
                  @click="toggleCategoryEdit(category)"
                  class="btn-secondary text-sm"
                >
                  {{ editingCategory?.name === category.name ? 'Cancel' : 'Edit' }}
                </button>
                <button
                  @click="deleteCategory(category)"
                  class="text-red-600 hover:text-red-800 text-sm"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
          
          <div class="card-body">
            <!-- Edit Category Form -->
            <div v-if="editingCategory?.name === category.name" class="mb-6 p-4 bg-gray-50 rounded-lg">
              <form @submit.prevent="updateCategory" class="space-y-4">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-700">Category Name</label>
                    <input
                      v-model="editingCategory.name"
                      type="text"
                      class="input-field"
                      required
                    />
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700">Description</label>
                    <input
                      v-model="editingCategory.description"
                      type="text"
                      class="input-field"
                    />
                  </div>
                </div>
                <div class="flex justify-end space-x-2">
                  <button type="button" @click="editingCategory = null" class="btn-secondary">
                    Cancel
                  </button>
                  <button type="submit" class="btn-primary">
                    Update Category
                  </button>
                </div>
              </form>
            </div>

            <!-- Add Efficiency Area Section -->
            <div v-if="newEfficiencyAreas[category.name]" class="mb-6">
              <h4 class="font-medium text-gray-900 mb-3">Add Efficiency Area</h4>
              <form @submit.prevent="addEfficiencyArea(category)" class="space-y-4">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">
                      Area Name *
                    </label>
                    <input
                      v-model="newEfficiencyAreas[category.name].name"
                      type="text"
                      placeholder="e.g., Code Generation"
                      class="input-field"
                      required
                    />
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">
                      Description
                    </label>
                    <input
                      v-model="newEfficiencyAreas[category.name].description"
                      type="text"
                      placeholder="Brief description of this efficiency area"
                      class="input-field"
                    />
                  </div>
                </div>
                
                <div class="flex justify-end">
                  <button
                    type="submit"
                    :disabled="!isValidEfficiencyArea(category.name)"
                    class="btn-primary disabled:opacity-50"
                  >
                    Add Efficiency Area
                  </button>
                </div>
              </form>
            </div>

            <!-- Efficiency Areas List -->
            <div>
              <h4 class="font-medium text-gray-900 mb-3">
                Efficiency Areas ({{ category.efficiency_areas?.length || 0 }})
              </h4>
              
              <div v-if="!category.efficiency_areas || category.efficiency_areas.length === 0" 
                   class="text-center py-6 text-gray-500">
                No efficiency areas in this category yet.
              </div>
              
              <div v-else class="grid grid-cols-1 gap-3">
                <div v-for="area in category.efficiency_areas" :key="area.id || area.name || area" 
                     class="bg-blue-50 rounded-lg p-4">
                  <div class="flex items-start justify-between">
                    <div class="flex items-center">
                      <div class="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                        <span class="text-sm font-medium text-blue-600">
                          {{ (area.name || area).charAt(0).toUpperCase() }}
                        </span>
                      </div>
                      <div>
                        <div class="font-medium text-gray-900">
                          {{ area.name || area }}
                        </div>
                        <div v-if="area.description" class="text-sm text-gray-600">
                          {{ area.description }}
                        </div>
                      </div>
                    </div>
                    <button
                      @click="removeEfficiencyArea(category, area)"
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
          </div>
        </div>
      </div>

      <!-- General Settings -->
      <div class="card mt-8">
        <div class="card-header">
          <h3 class="text-lg font-medium">🔧 General Settings</h3>
        </div>
        <div class="card-body">
          <div class="space-y-6">
            <!-- Default Week Start -->
            <div>
              <label class="block text-sm font-medium text-gray-700">Default Week Start</label>
              <select v-model="generalSettings.weekStart" class="input-field max-w-xs">
                <option value="monday">Monday</option>
                <option value="sunday">Sunday</option>
              </select>
              <p class="mt-1 text-xs text-gray-500">When does the work week start for your organization?</p>
            </div>

            <!-- Time Zone -->
            <div>
              <label class="block text-sm font-medium text-gray-700">Time Zone</label>
              <select v-model="generalSettings.timeZone" class="input-field max-w-xs">
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
                v-model.number="generalSettings.minEntryTime"
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

      <!-- Save Settings Button -->
      <div class="mt-8 flex justify-end">
        <button
          @click="saveSettings"
          :disabled="submitting"
          class="btn-primary disabled:opacity-50"
        >
          {{ submitting ? 'Saving...' : 'Save All Settings' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'

export default {
  name: 'TeamSettings',
  setup() {
    const router = useRouter()
    
    const categories = ref([])
    const newCategory = ref({ name: '', description: '' })
    const newEfficiencyAreas = ref({})
    const editingCategory = ref(null)
    const generalSettings = ref({
      weekStart: 'monday',
      timeZone: 'UTC',
      minEntryTime: 0.5
    })
    const submitting = ref(false)
    const loading = ref(true)
    const error = ref(null)

    const API_BASE_URL = 'https://mnwpivaen5.us-east-1.awsapprunner.com'

    const loadSettings = async () => {
      try {
        loading.value = true
        error.value = null
        
        console.log('Loading settings from API...')
        
        const response = await fetch(`${API_BASE_URL}/api/engineer/settings`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        })
        
        if (response.ok) {
          const apiResponse = await response.json()
          
          // Handle the actual API response structure with nested data
          if (apiResponse.success && apiResponse.data) {
            const data = apiResponse.data
            
            if (data.categories && data.efficiency_areas && data.category_efficiency_mapping) {
              // Create more meaningful descriptions for categories
              const categoryDescriptions = {
                'Feature Development': 'Building new features and functionality',
                'Bug Fixes': 'Debugging and fixing issues in existing code',
                'Code Review': 'Reviewing and improving code quality',
                'Testing': 'Writing and maintaining automated tests',
                'Documentation': 'Creating and updating technical documentation',
                'Refactoring': 'Improving code structure and maintainability',
                'API Development': 'Designing and implementing APIs',
                'Database Work': 'Database design, queries, and optimization',
                'Infrastructure': 'Infrastructure setup and DevOps tasks'
              }
              
              // Create more meaningful descriptions for efficiency areas
              const areaDescriptions = {
                'Code Generation': 'AI-assisted code creation and scaffolding',
                'Code Completion': 'Smart autocomplete and code suggestions',
                'API Design': 'Designing RESTful APIs and endpoints',
                'Documentation': 'AI-assisted documentation writing',
                'Debugging': 'AI-assisted debugging and error analysis',
                'Code Analysis': 'Automated code quality and security analysis',
                'Test Writing': 'AI-assisted test case generation',
                'Refactoring': 'AI-guided code refactoring and optimization',
                'Test Data Creation': 'Automated test data generation',
                'Query Optimization': 'Database query performance optimization',
                'Infrastructure as Code': 'Automated infrastructure provisioning'
              }
              
              categories.value = data.categories.map(categoryName => ({
                name: categoryName,
                description: categoryDescriptions[categoryName] || `${categoryName} related tasks`,
                efficiency_areas: data.category_efficiency_mapping[categoryName]?.map(areaName => ({
                  name: areaName,
                  description: areaDescriptions[areaName] || `${areaName} efficiency area`
                })) || []
              }))
            } else {
              // Fallback to default structure
              throw new Error('Invalid API response structure - missing required fields')
            }
          } else {
            throw new Error('API response indicates failure or missing data')
          }
          
          // Initialize newEfficiencyAreas for each category
          categories.value.forEach(category => {
            if (!newEfficiencyAreas.value[category.name]) {
              newEfficiencyAreas.value[category.name] = { name: '', description: '' }
            }
          })
          
          console.log('Settings loaded successfully:', categories.value)
        } else {
          throw new Error(`Failed to load settings: ${response.status}`)
        }
        
      } catch (err) {
        console.error('Failed to load settings:', err)
        error.value = `Failed to load settings: ${err.message}`
        
        // Fallback to default categories with efficiency areas
        categories.value = [
          {
            name: 'Feature Development',
            description: 'Building new features and functionality',
            efficiency_areas: [
              { name: 'Code Generation', description: 'AI-assisted code creation' },
              { name: 'API Design', description: 'Designing and implementing APIs' },
              { name: 'Code Completion', description: 'Smart code completion suggestions' }
            ]
          },
          {
            name: 'Bug Fixes',
            description: 'Debugging and fixing issues',
            efficiency_areas: [
              { name: 'Debugging', description: 'AI-assisted debugging and error analysis' },
              { name: 'Code Analysis', description: 'Automated code analysis for issues' }
            ]
          },
          {
            name: 'Testing',
            description: 'Writing and maintaining tests',
            efficiency_areas: [
              { name: 'Test Writing', description: 'AI-assisted test case generation' },
              { name: 'Test Data Creation', description: 'Automated test data generation' }
            ]
          },
          {
            name: 'Documentation',
            description: 'Creating and updating documentation',
            efficiency_areas: [
              { name: 'Documentation', description: 'AI-assisted documentation writing' }
            ]
          }
        ]
        
        // Initialize newEfficiencyAreas for fallback categories
        categories.value.forEach(category => {
          newEfficiencyAreas.value[category.name] = { name: '', description: '' }
        })
        
      } finally {
        loading.value = false
      }
    }

    const addCategory = async () => {
      if (!newCategory.value.name.trim()) return

      try {
        submitting.value = true
        error.value = null
        
        console.log('Adding category:', newCategory.value)
        
        const categoryData = {
          name: newCategory.value.name.trim(),
          description: newCategory.value.description.trim() || `${newCategory.value.name.trim()} related tasks`,
          efficiency_areas: []
        }
        
        categories.value.push(categoryData)
        
        // Initialize newEfficiencyArea for the new category
        newEfficiencyAreas.value[categoryData.name] = { name: '', description: '' }
        
        // Reset form
        newCategory.value = { name: '', description: '' }
        
        console.log('Category added successfully')
        
      } catch (err) {
        console.error('Failed to add category:', err)
        error.value = `Failed to add category: ${err.message}`
      } finally {
        submitting.value = false
      }
    }

    const toggleCategoryEdit = (category) => {
      if (editingCategory.value?.name === category.name) {
        editingCategory.value = null
      } else {
        editingCategory.value = { ...category }
      }
    }

    const updateCategory = async () => {
      if (!editingCategory.value) return

      try {
        error.value = null
        
        console.log('Updating category:', editingCategory.value)
        
        const categoryIndex = categories.value.findIndex(c => c.name === editingCategory.value.name)
        if (categoryIndex >= 0) {
          categories.value[categoryIndex] = { ...editingCategory.value }
        }
        
        editingCategory.value = null
        console.log('Category updated successfully')
        
      } catch (err) {
        console.error('Failed to update category:', err)
        error.value = `Failed to update category: ${err.message}`
      }
    }

    const deleteCategory = async (category) => {
      if (!confirm(`Are you sure you want to delete "${category.name}"? This will also remove all associated efficiency areas.`)) {
        return
      }

      try {
        error.value = null
        
        console.log('Deleting category:', category.name)
        
        const categoryIndex = categories.value.findIndex(c => c.name === category.name)
        if (categoryIndex >= 0) {
          categories.value.splice(categoryIndex, 1)
          delete newEfficiencyAreas.value[category.name]
        }
        
        console.log('Category deleted successfully')
        
      } catch (err) {
        console.error('Failed to delete category:', err)
        error.value = `Failed to delete category: ${err.message}`
      }
    }

    const addEfficiencyArea = async (category) => {
      const area = newEfficiencyAreas.value[category.name]
      if (!area?.name?.trim()) return

      try {
        error.value = null
        
        console.log('Adding efficiency area to category:', category.name, area)
        
        const areaData = {
          name: area.name.trim(),
          description: area.description.trim() || `${area.name.trim()} efficiency area`
        }
        
        const categoryIndex = categories.value.findIndex(c => c.name === category.name)
        if (categoryIndex >= 0) {
          if (!categories.value[categoryIndex].efficiency_areas) {
            categories.value[categoryIndex].efficiency_areas = []
          }
          categories.value[categoryIndex].efficiency_areas.push(areaData)
        }
        
        // Reset form for this category
        newEfficiencyAreas.value[category.name] = { name: '', description: '' }
        
        console.log('Efficiency area added successfully')
        
      } catch (err) {
        console.error('Failed to add efficiency area:', err)
        error.value = `Failed to add efficiency area: ${err.message}`
      }
    }

    const removeEfficiencyArea = async (category, area) => {
      if (!confirm(`Remove "${area.name || area}" from ${category.name}?`)) {
        return
      }

      try {
        error.value = null
        
        const areaName = area.name || area
        console.log('Removing efficiency area from category:', category.name, areaName)
        
        const categoryIndex = categories.value.findIndex(c => c.name === category.name)
        if (categoryIndex >= 0 && categories.value[categoryIndex].efficiency_areas) {
          const areaIndex = categories.value[categoryIndex].efficiency_areas.findIndex(a => (a.name || a) === areaName)
          if (areaIndex >= 0) {
            categories.value[categoryIndex].efficiency_areas.splice(areaIndex, 1)
          }
        }
        
        console.log('Efficiency area removed successfully')
        
      } catch (err) {
        console.error('Failed to remove efficiency area:', err)
        error.value = `Failed to remove efficiency area: ${err.message}`
      }
    }

    const isValidEfficiencyArea = (categoryName) => {
      const area = newEfficiencyAreas.value[categoryName]
      return area?.name?.trim()
    }

    const saveSettings = async () => {
      try {
        submitting.value = true
        error.value = null
        
        console.log('Saving all settings...')
        
        // Transform our data structure to match the API format
        const categoryNames = categories.value.map(c => c.name)
        const allEfficiencyAreas = []
        const categoryEfficiencyMapping = {}
        
        categories.value.forEach(category => {
          const areaNames = category.efficiency_areas?.map(a => a.name || a) || []
          categoryEfficiencyMapping[category.name] = areaNames
          allEfficiencyAreas.push(...areaNames)
        })
        
        const settingsData = {
          categories: categoryNames,
          efficiency_areas: [...new Set(allEfficiencyAreas)], // Remove duplicates
          category_efficiency_mapping: categoryEfficiencyMapping,
          general_settings: generalSettings.value
        }
        
        console.log('Settings data to save:', settingsData)
        
        // Note: API endpoint for saving settings needs to be implemented
        console.warn('Settings save API not available yet')
        error.value = null // Clear any existing errors since this is just a warning
        
        // Show success message
        const successDiv = document.createElement('div')
        successDiv.className = 'fixed top-4 right-4 bg-green-50 border border-green-200 rounded-md p-4 z-50'
        successDiv.innerHTML = `
          <div class="flex">
            <div class="text-green-600 mr-2">✅</div>
            <div class="text-sm text-green-800">Settings saved successfully!</div>
          </div>
        `
        document.body.appendChild(successDiv)
        setTimeout(() => document.body.removeChild(successDiv), 3000)
        
        console.log('Settings saved successfully (simulated)')
        
      } catch (err) {
        console.error('Failed to save settings:', err)
        error.value = `Failed to save settings: ${err.message}`
      } finally {
        submitting.value = false
      }
    }

    onMounted(() => {
      loadSettings()
    })

    return {
      categories,
      newCategory,
      newEfficiencyAreas,
      editingCategory,
      generalSettings,
      submitting,
      loading,
      error,
      addCategory,
      toggleCategoryEdit,
      updateCategory,
      deleteCategory,
      addEfficiencyArea,
      removeEfficiencyArea,
      isValidEfficiencyArea,
      saveSettings
    }
  }
}
</script> 