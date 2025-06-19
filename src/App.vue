<template>
  <div id="app" class="min-h-screen bg-gray-50">
    <AppHeader v-if="showHeader" />
    <main class="flex-1">
      <router-view />
    </main>
    
    <!-- Debug Panel (only in development) -->
    <DebugPanel v-if="isDevelopment" />
  </div>
</template>

<script>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import AppHeader from './components/AppHeader.vue'
import DebugPanel from './components/DebugPanel.vue'

export default {
  name: 'App',
  components: {
    AppHeader,
    DebugPanel
  },
  setup() {
    const route = useRoute()
    
    // Hide header on login pages
    const showHeader = computed(() => {
      return !route.path.includes('/login')
    })
    
    // Show debug panel only in development
    const isDevelopment = import.meta.env.VITE_APP_ENV === 'development'

    return {
      showHeader,
      isDevelopment
    }
  }
}
</script> 