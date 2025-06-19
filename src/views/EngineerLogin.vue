<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <div>
        <div class="text-center">
          <div class="bg-gradient-to-r from-green-600 to-blue-600 rounded-lg p-6 text-white mb-6">
            <h1 class="text-2xl font-bold">👩‍💻 Engineer Access</h1>
            <p class="text-sm opacity-90 mt-2">Enter your details to continue</p>
          </div>
        </div>
        <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Access your dashboard
        </h2>
      </div>
      
      <form class="mt-8 space-y-6" @submit.prevent="handleLogin">
        <div class="space-y-4">
          <div>
            <label for="developer_name" class="block text-sm font-medium text-gray-700">
              Developer Name
            </label>
            <input
              id="developer_name"
              name="developer_name"
              type="text"
              required
              v-model="formData.developer_name"
              class="input-field"
              placeholder="Enter your name"
            />
          </div>

          <div>
            <label for="team_name" class="block text-sm font-medium text-gray-700">
              Team Name
            </label>
            <input
              id="team_name"
              name="team_name"
              type="text"
              required
              v-model="formData.team_name"
              class="input-field"
              placeholder="Enter your team name"
            />
          </div>
        </div>

        <div v-if="error" class="text-red-600 text-sm text-center">
          {{ error }}
        </div>

        <div>
          <button
            type="submit"
            :disabled="loading"
            class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
          >
            <span class="absolute left-0 inset-y-0 flex items-center pl-3">
              <UserIcon class="h-5 w-5 text-green-500 group-hover:text-green-400" aria-hidden="true" />
            </span>
            {{ loading ? 'Signing in...' : 'Access Dashboard' }}
          </button>
        </div>

        <div class="text-center">
          <router-link to="/" class="text-green-600 hover:text-green-500 text-sm">
            ← Back to home
          </router-link>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { UserIcon } from '@heroicons/vue/24/solid'
import { useAuthStore } from '../stores/auth'

export default {
  name: 'EngineerLogin',
  components: {
    UserIcon
  },
  setup() {
    const router = useRouter()
    const authStore = useAuthStore()
    
    const formData = reactive({
      developer_name: '',
      team_name: ''
    })
    
    const error = ref('')
    const loading = ref(false)

    const handleLogin = async () => {
      loading.value = true
      error.value = ''

      try {
        await authStore.engineerLogin(formData.team_name, formData.developer_name)
        router.push('/engineer')
      } catch (err) {
        error.value = err.message
      }
      
      loading.value = false
    }

    return {
      formData,
      error,
      loading,
      handleLogin
    }
  }
}
</script> 