<template>
  <div id="app" class="min-h-screen bg-gray-50">
    <AppHeader v-if="showHeader" />
    <main class="flex-1">
      <router-view />
    </main>
  </div>
</template>

<script>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import AppHeader from './components/AppHeader.vue'

export default {
  name: 'App',
  components: {
    AppHeader
  },
  setup() {
    const route = useRoute()
    
    // Hide header on login pages
    const showHeader = computed(() => {
      return !route.path.includes('/login')
    })

    return {
      showHeader
    }
  }
}
</script> 