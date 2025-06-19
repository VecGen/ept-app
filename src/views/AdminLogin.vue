<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <div>
        <div class="text-center">
          <div class="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-6 text-white mb-6">
            <h1 class="text-2xl font-bold">🔧 Admin Access</h1>
            <p class="text-sm opacity-90 mt-2">Enter admin password to continue</p>
          </div>
        </div>
        <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Sign in to your account
        </h2>
      </div>
      
      <form class="mt-8 space-y-6" @submit.prevent="handleLogin">
        <div>
          <label for="password" class="sr-only">Password</label>
          <input
            id="password"
            name="password"
            type="password"
            required
            v-model="password"
            class="relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 focus:z-10 sm:text-sm"
            placeholder="Admin Password"
          />
        </div>

        <div v-if="error" class="text-red-600 text-sm text-center">
          {{ error }}
        </div>

        <div>
          <button
            type="submit"
            :disabled="loading"
            class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
          >
            <span class="absolute left-0 inset-y-0 flex items-center pl-3">
              <LockClosedIcon class="h-5 w-5 text-primary-500 group-hover:text-primary-400" aria-hidden="true" />
            </span>
            {{ loading ? 'Signing in...' : 'Sign in' }}
          </button>
        </div>

        <div class="text-center">
          <router-link to="/" class="text-primary-600 hover:text-primary-500 text-sm">
            ← Back to home
          </router-link>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { LockClosedIcon } from '@heroicons/vue/24/solid'
import { useAuthStore } from '../stores/auth'

export default {
  name: 'AdminLogin',
  components: {
    LockClosedIcon
  },
  setup() {
    const router = useRouter()
    const authStore = useAuthStore()
    
    const password = ref('')
    const error = ref('')
    const loading = ref(false)

    const handleLogin = async () => {
      loading.value = true
      error.value = ''

      try {
        await authStore.adminLogin(password.value)
        router.push('/admin')
      } catch (err) {
        error.value = err.message
      }
      
      loading.value = false
    }

    return {
      password,
      error,
      loading,
      handleLogin
    }
  }
}
</script> 