<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <!-- Header -->
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900">📊 Data Management</h1>
      <p class="mt-2 text-gray-600">Export data, manage entries, and generate reports</p>
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

    <!-- Export Section -->
    <div class="card mb-8">
      <div class="card-header">
        <h3 class="text-lg font-medium">📤 Export Data</h3>
        <p class="text-sm text-gray-600 mt-1">Export efficiency tracking data for analysis</p>
      </div>
      <div class="card-body">
        <form @submit.prevent="exportData" class="space-y-6">
          <!-- Export Type -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Export Type</label>
            <div class="space-y-2">
              <label class="flex items-center">
                <input
                  v-model="exportForm.type"
                  value="all"
                  type="radio"
                  class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                />
                <span class="ml-2 text-sm text-gray-700">All Data</span>
              </label>
              <label class="flex items-center">
                <input
                  v-model="exportForm.type"
                  value="team"
                  type="radio"
                  class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                />
                <span class="ml-2 text-sm text-gray-700">Specific Team</span>
              </label>
              <label class="flex items-center">
                <input
                  v-model="exportForm.type"
                  value="dateRange"
                  type="radio"
                  class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                />
                <span class="ml-2 text-sm text-gray-700">Date Range</span>
              </label>
            </div>
          </div>

          <!-- Team Selection (if type is team) -->
          <div v-if="exportForm.type === 'team'">
            <label class="block text-sm font-medium text-gray-700">Select Team</label>
            <select v-model="exportForm.teamId" class="input-field max-w-xs" required>
              <option value="">Choose a team...</option>
              <option v-for="team in teams" :key="team.id" :value="team.id">
                {{ team.name }}
              </option>
            </select>
          </div>

          <!-- Date Range (if type is dateRange) -->
          <div v-if="exportForm.type === 'dateRange'" class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700">Start Date</label>
              <input
                v-model="exportForm.startDate"
                type="date"
                class="input-field"
                required
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">End Date</label>
              <input
                v-model="exportForm.endDate"
                type="date"
                class="input-field"
                required
              />
            </div>
          </div>

          <!-- Export Format -->
          <div>
            <label class="block text-sm font-medium text-gray-700">Export Format</label>
            <select v-model="exportForm.format" class="input-field max-w-xs">
              <option value="csv">CSV</option>
              <option value="excel">Excel</option>
              <option value="json">JSON</option>
            </select>
          </div>

          <!-- Export Button -->
          <div class="flex justify-end">
            <button
              type="submit"
              :disabled="exporting"
              class="btn-primary disabled:opacity-50"
            >
              {{ exporting ? 'Exporting...' : 'Export Data' }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Data Overview -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <div class="stat-card">
        <div class="stat-card-content">
          <div class="stat-card-title">Total Entries</div>
          <div class="stat-card-value">{{ stats.totalEntries }}</div>
        </div>
      </div>
      
      <div class="stat-card">
        <div class="stat-card-content">
          <div class="stat-card-title">Total Hours Saved</div>
          <div class="stat-card-value">{{ stats.totalHoursSaved.toFixed(1) }}h</div>
        </div>
      </div>
      
      <div class="stat-card">
        <div class="stat-card-content">
          <div class="stat-card-title">Active Teams</div>
          <div class="stat-card-value">{{ stats.activeTeams }}</div>
        </div>
      </div>
    </div>

    <!-- Recent Entries Management -->
    <div class="card">
      <div class="card-header">
        <div class="flex justify-between items-center">
          <div>
            <h3 class="text-lg font-medium">📝 Recent Entries</h3>
            <p class="text-sm text-gray-600 mt-1">Manage and review recent efficiency entries</p>
          </div>
          <div class="flex space-x-2">
            <select v-model="filter.team" class="input-field text-sm">
              <option value="">All Teams</option>
              <option v-for="team in teams" :key="team.id" :value="team.name">
                {{ team.name }}
              </option>
            </select>
            <select v-model="filter.period" class="input-field text-sm">
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="quarter">This Quarter</option>
              <option value="all">All Time</option>
            </select>
          </div>
        </div>
      </div>
      <div class="card-body">
        <div v-if="filteredEntries.length === 0" class="text-center py-8 text-gray-500">
          No entries found for the selected filters.
        </div>
        
        <div v-else class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Developer
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Team
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Task ID
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Hours Saved
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Week
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Copilot
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="entry in paginatedEntries" :key="entry.id">
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {{ entry.developerName }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ entry.teamName }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ entry.storyId || '-' }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ entry.category }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-600">
                  {{ entry.efficiencyGained.toFixed(1) }}h
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ formatDate(entry.weekStart) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span :class="entry.copilotUsed === 'Yes' ? 'text-green-600' : 'text-gray-400'">
                    {{ entry.copilotUsed === 'Yes' ? '✓' : '✗' }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    @click="viewEntryDetails(entry)"
                    class="text-blue-600 hover:text-blue-900 mr-3"
                  >
                    View
                  </button>
                  <button
                    @click="deleteEntry(entry)"
                    class="text-red-600 hover:text-red-900"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Pagination -->
        <div v-if="filteredEntries.length > entriesPerPage" class="mt-6 flex justify-between items-center">
          <div class="text-sm text-gray-700">
            Showing {{ ((currentPage - 1) * entriesPerPage) + 1 }} to 
            {{ Math.min(currentPage * entriesPerPage, filteredEntries.length) }} of 
            {{ filteredEntries.length }} entries
          </div>
          <div class="flex space-x-2">
            <button
              @click="currentPage--"
              :disabled="currentPage === 1"
              class="btn-secondary disabled:opacity-50"
            >
              Previous
            </button>
            <button
              @click="currentPage++"
              :disabled="currentPage * entriesPerPage >= filteredEntries.length"
              class="btn-secondary disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Entry Details Modal -->
    <div v-if="selectedEntry" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div class="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <div class="mt-3">
          <h3 class="text-lg font-medium text-gray-900 mb-4">Entry Details</h3>
          
          <div class="space-y-3 text-sm">
            <div><strong>Developer:</strong> {{ selectedEntry.developerName }}</div>
            <div><strong>Team:</strong> {{ selectedEntry.teamName }}</div>
            <div><strong>Task ID:</strong> {{ selectedEntry.storyId || 'N/A' }}</div>
            <div><strong>Category:</strong> {{ selectedEntry.category }}</div>
            <div><strong>Original Estimate:</strong> {{ selectedEntry.originalEstimate }}h</div>
            <div><strong>Time Saved:</strong> {{ selectedEntry.efficiencyGained }}h</div>
            <div><strong>Copilot Used:</strong> {{ selectedEntry.copilotUsed }}</div>
            <div v-if="selectedEntry.efficiencyAreas?.length">
              <strong>Efficiency Areas:</strong> {{ selectedEntry.efficiencyAreas.join(', ') }}
            </div>
            <div v-if="selectedEntry.notes">
              <strong>Notes:</strong> {{ selectedEntry.notes }}
            </div>
            <div><strong>Week Start:</strong> {{ formatDate(selectedEntry.weekStart) }}</div>
            <div><strong>Created:</strong> {{ formatDateTime(selectedEntry.createdAt) }}</div>
          </div>
          
          <div class="mt-6 flex justify-end">
            <button @click="selectedEntry = null" class="btn-secondary">
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'

export default {
  name: 'DataManagement',
  setup() {
    const teams = ref([])
    const entries = ref([])
    const stats = ref({
      totalEntries: 0,
      totalHoursSaved: 0,
      activeTeams: 0
    })
    
    const exportForm = ref({
      type: 'all',
      teamId: '',
      startDate: '',
      endDate: '',
      format: 'csv'
    })
    
    const filter = ref({
      team: '',
      period: 'month'
    })
    
    const selectedEntry = ref(null)
    const currentPage = ref(1)
    const entriesPerPage = 10
    const exporting = ref(false)
    const loading = ref(true)
    const error = ref(null)

    const filteredEntries = ref([])
    const paginatedEntries = ref([])

    const loadData = async () => {
      try {
        loading.value = true
        error.value = null
        
        console.log('Loading data management data...')
        
        // Load teams from public API
        const response = await fetch('https://mnwpivaen5.us-east-1.awsapprunner.com/api/teams/list', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        })
        
        if (response.ok) {
          const teamsData = await response.json()
          teams.value = teamsData || []
          console.log('Teams loaded successfully:', teamsData)
        } else {
          throw new Error(`Failed to load teams: ${response.status}`)
        }
        
        // For now, we don't have efficiency entries in the S3 teams data
        // So we'll use empty data and just show team statistics
        entries.value = []
        
        // Calculate stats from teams data
        stats.value = {
          totalEntries: 0, // No efficiency entries data yet
          totalHoursSaved: 0, // No efficiency entries data yet
          activeTeams: teams.value.length
        }
        
        console.log('Data management data loaded successfully')
        
      } catch (err) {
        console.error('Failed to load data:', err)
        error.value = `Failed to load data: ${err.message}`
        
        // Fallback to empty data
        teams.value = []
        entries.value = []
        stats.value = {
          totalEntries: 0,
          totalHoursSaved: 0,
          activeTeams: 0
        }
        
      } finally {
        loading.value = false
      }
    }

    const exportData = async () => {
      try {
        exporting.value = true
        
        // This will be implemented when backend supports data export
        console.log('Exporting data:', exportForm.value)
        alert('Export functionality will be implemented when backend supports it!')
        
      } catch (error) {
        console.error('Failed to export data:', error)
        alert('Failed to export data. Please try again.')
      } finally {
        exporting.value = false
      }
    }

    const viewEntryDetails = (entry) => {
      selectedEntry.value = entry
    }

    const deleteEntry = async (entry) => {
      if (!confirm(`Are you sure you want to delete the entry for ${entry.storyId}?`)) {
        return
      }
      
      try {
        // This will be implemented when backend supports entry deletion
        console.log('Deleting entry:', entry)
        alert('Delete functionality will be implemented when backend supports it!')
        
      } catch (error) {
        console.error('Failed to delete entry:', error)
        alert('Failed to delete entry. Please try again.')
      }
    }

    const formatDate = (dateString) => {
      return new Date(dateString).toLocaleDateString()
    }

    const formatDateTime = (dateString) => {
      return new Date(dateString).toLocaleString()
    }

    onMounted(() => {
      loadData()
    })

    return {
      teams,
      entries,
      stats,
      exportForm,
      filter,
      selectedEntry,
      currentPage,
      entriesPerPage,
      exporting,
      loading,
      error,
      filteredEntries,
      paginatedEntries,
      exportData,
      viewEntryDetails,
      deleteEntry,
      formatDate,
      formatDateTime
    }
  }
}
</script> 