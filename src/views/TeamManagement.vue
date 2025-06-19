<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <!-- Header -->
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900">👥 Team Management</h1>
      <p class="mt-2 text-gray-600">Manage teams and developers in your organization</p>
    </div>

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
                {{ editingTeam?.id === team.id ? 'Cancel' : 'Edit' }}
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
          <div v-if="editingTeam?.id === team.id" class="mb-6 p-4 bg-gray-50 rounded-lg">
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
</template>

<script>
import { ref, reactive, onMounted } from 'vue'

export default {
  name: 'TeamManagement',
  setup() {
    const teams = ref([])
    const newTeam = ref({ name: '', description: '' })
    const newDeveloperName = ref('')
    const editingTeam = ref(null)
    const submitting = ref(false)

    const loadTeams = async () => {
      try {
        // This will be implemented when backend is ready
        // const response = await adminAPI.getTeams()
        // teams.value = response.data
        
        // Placeholder data
        teams.value = [
          {
            id: 1,
            name: 'Frontend Team',
            description: 'React and Vue.js developers',
            developers: [
              { id: 1, name: 'Alice Johnson' },
              { id: 2, name: 'Bob Smith' }
            ]
          },
          {
            id: 2,
            name: 'Backend Team',
            description: 'Node.js and Python developers',
            developers: [
              { id: 3, name: 'Charlie Brown' }
            ]
          }
        ]
      } catch (error) {
        console.error('Failed to load teams:', error)
      }
    }

    const addTeam = async () => {
      if (!newTeam.value.name.trim()) return

      try {
        submitting.value = true
        
        // This will be implemented when backend is ready
        // await adminAPI.createTeam(newTeam.value)
        
        // Placeholder: add to local state
        const newId = Math.max(...teams.value.map(t => t.id), 0) + 1
        teams.value.push({
          id: newId,
          ...newTeam.value,
          developers: []
        })

        newTeam.value = { name: '', description: '' }
        
      } catch (error) {
        console.error('Failed to add team:', error)
        alert('Failed to add team. Please try again.')
      } finally {
        submitting.value = false
      }
    }

    const toggleTeamEdit = (team) => {
      if (editingTeam.value?.id === team.id) {
        editingTeam.value = null
      } else {
        editingTeam.value = { ...team }
      }
    }

    const updateTeam = async () => {
      if (!editingTeam.value) return

      try {
        // This will be implemented when backend is ready
        // await adminAPI.updateTeam(editingTeam.value.id, editingTeam.value)
        
        // Placeholder: update local state
        const index = teams.value.findIndex(t => t.id === editingTeam.value.id)
        if (index !== -1) {
          teams.value[index] = { ...editingTeam.value }
        }

        editingTeam.value = null
        
      } catch (error) {
        console.error('Failed to update team:', error)
        alert('Failed to update team. Please try again.')
      }
    }

    const deleteTeam = async (team) => {
      if (!confirm(`Are you sure you want to delete "${team.name}"? This action cannot be undone.`)) {
        return
      }

      try {
        // This will be implemented when backend is ready
        // await adminAPI.deleteTeam(team.id)
        
        // Placeholder: remove from local state
        teams.value = teams.value.filter(t => t.id !== team.id)
        
      } catch (error) {
        console.error('Failed to delete team:', error)
        alert('Failed to delete team. Please try again.')
      }
    }

    const addDeveloper = async (team) => {
      if (!newDeveloperName.value.trim()) return

      try {
        // This will be implemented when backend is ready
        // await adminAPI.addDeveloperToTeam(team.id, { name: newDeveloperName.value })
        
        // Placeholder: add to local state
        const newId = Math.max(...(team.developers || []).map(d => d.id || 0), 0) + 1
        if (!team.developers) team.developers = []
        team.developers.push({
          id: newId,
          name: newDeveloperName.value
        })

        newDeveloperName.value = ''
        
      } catch (error) {
        console.error('Failed to add developer:', error)
        alert('Failed to add developer. Please try again.')
      }
    }

    const removeDeveloper = async (team, developer) => {
      if (!confirm(`Remove ${developer.name || developer} from ${team.name}?`)) {
        return
      }

      try {
        // This will be implemented when backend is ready
        // await adminAPI.removeDeveloperFromTeam(team.id, developer.id)
        
        // Placeholder: remove from local state
        team.developers = team.developers.filter(d => 
          (d.id || d) !== (developer.id || developer)
        )
        
      } catch (error) {
        console.error('Failed to remove developer:', error)
        alert('Failed to remove developer. Please try again.')
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

    onMounted(() => {
      loadTeams()
    })

    return {
      teams,
      newTeam,
      newDeveloperName,
      editingTeam,
      submitting,
      addTeam,
      toggleTeamEdit,
      updateTeam,
      deleteTeam,
      addDeveloper,
      removeDeveloper,
      generateAccessLink,
      copyToClipboard
    }
  }
}
</script> 