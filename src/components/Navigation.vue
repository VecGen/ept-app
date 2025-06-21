<template>
  <div>
    <!-- Mobile backdrop -->
    <div 
      v-if="isOpen && isMobile" 
      class="fixed inset-0 z-30 bg-gray-600 bg-opacity-75 lg:hidden"
      @click="toggleSidebar"
    ></div>

    <!-- Sidebar -->
    <div 
      :class="[
        'fixed inset-y-0 left-0 z-40 transform transition-transform duration-300 ease-in-out',
        'bg-gradient-to-b from-gray-900 to-gray-800 text-white shadow-xl',
        isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0',
        collapsed && !isMobile ? 'lg:w-16' : 'lg:w-64',
        'w-64'
      ]"
    >
      <!-- Sidebar header -->
      <div class="flex items-center justify-between p-4 border-b border-gray-700">
        <div :class="['flex items-center', collapsed && !isMobile ? 'justify-center' : '']">
          <div class="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
            <span class="text-white font-bold text-sm">ET</span>
          </div>
          <div v-if="!collapsed || isMobile" class="ml-3">
            <h1 class="text-lg font-semibold">Efficiency Tracker</h1>
            <p class="text-xs text-gray-300">{{ userRole === 'admin' ? 'Admin Panel' : 'Dashboard' }}</p>
          </div>
        </div>
        
        <!-- Desktop collapse button -->
        <button 
          v-if="!isMobile"
          @click="toggleCollapse"
          class="p-3 rounded-lg hover:bg-gray-700 transition-colors duration-200 bg-gray-800/50 hover:bg-gray-600"
        >
          <svg 
            :class="['w-6 h-6 transform transition-transform duration-200', collapsed ? 'rotate-180' : '']"
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
            stroke-width="2.5"
          >
            <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <!-- Mobile close button -->
        <button 
          v-if="isMobile"
          @click="toggleSidebar"
          class="p-2 rounded-lg hover:bg-gray-700 transition-colors duration-200"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <!-- Navigation items -->
      <nav class="mt-6 px-3">
        <div class="space-y-2">
          <!-- Admin Navigation -->
          <template v-if="userRole === 'admin'">
            <NavItem 
              icon="📊"
              label="Dashboard"
              route="/admin"
              :collapsed="collapsed && !isMobile"
              @click="handleNavClick"
            />
            <NavItem 
              icon="👥"
              label="Teams"
              route="/admin/teams"
              :collapsed="collapsed && !isMobile"
              @click="handleNavClick"
            />
            <NavItem 
              icon="⚙️"
              label="Settings"
              route="/admin/settings"
              :collapsed="collapsed && !isMobile"
              @click="handleNavClick"
            />
            <NavItem 
              icon="📈"
              label="Data Management"
              route="/admin/data"
              :collapsed="collapsed && !isMobile"
              @click="handleNavClick"
            />
          </template>

          <!-- Engineer Navigation -->
          <template v-else>
            <NavItem 
              icon="📊"
              label="Dashboard"
              :route="engineerDashboardRoute"
              :collapsed="collapsed && !isMobile"
              @click="handleNavClick"
            />
            <NavItem 
              icon="📝"
              label="New Entry"
              route="/engineer/entry"
              :collapsed="collapsed && !isMobile"
              @click="handleNavClick"
            />
          </template>

          <!-- Divider -->
          <div class="border-t border-gray-700 my-4"></div>

          <!-- Common items -->
          <NavItem 
            icon="❓"
            label="Help"
            route="/help"
            :collapsed="collapsed && !isMobile"
            @click="handleNavClick"
          />
          <NavItem 
            icon="🚪"
            label="Logout"
            :is-action="true"
            :collapsed="collapsed && !isMobile"
            @click="handleLogout"
          />
        </div>
      </nav>

      <!-- User info (bottom) -->
      <div class="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-700">
        <div :class="['flex items-center', collapsed && !isMobile ? 'justify-center' : '']">
          <div class="w-8 h-8 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center">
            <span class="text-white text-sm font-medium">
              {{ userInitials }}
            </span>
          </div>
          <div v-if="!collapsed || isMobile" class="ml-3 flex-1 min-w-0">
            <p class="text-sm font-medium text-white truncate">{{ userName }}</p>
            <p class="text-xs text-gray-300 capitalize">{{ userRole }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Mobile menu button -->
    <button
      v-if="isMobile"
      @click="toggleSidebar"
      class="mobile-menu-button fixed top-4 left-4 z-50 p-3 bg-gray-900 hover:bg-gray-800 text-white rounded-lg shadow-lg transition-colors duration-200"
    >
      <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5">
        <path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h16" />
      </svg>
    </button>

    <!-- Content overlay for small screens -->
    <div 
      :class="[
        'transition-all duration-300 ease-in-out',
        !isMobile && (collapsed ? 'lg:ml-16' : 'lg:ml-64')
      ]"
    >
      <slot></slot>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import NavItem from './NavItem.vue'

export default {
  name: 'Navigation',
  components: {
    NavItem
  },
  setup() {
    const router = useRouter()
    const route = useRoute()
    const authStore = useAuthStore()
    
    const isOpen = ref(false)
    const collapsed = ref(false)
    const windowWidth = ref(window.innerWidth)

    const isMobile = computed(() => windowWidth.value < 1024)
    
    const userRole = computed(() => {
      const path = route.path
      if (path.startsWith('/admin')) return 'admin'
      if (path.startsWith('/engineer')) return 'engineer'
      return 'user'
    })

    const userName = computed(() => {
      if (authStore.user && authStore.user.name) {
        return authStore.user.name
      }
      return route.query.dev || 'Developer'
    })

    const userTeam = computed(() => {
      if (authStore.user && authStore.user.team) {
        return authStore.user.team
      }
      return route.query.team || 'Unknown Team'
    })

    const userInitials = computed(() => {
      const name = userName.value
      return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    })

    const engineerDashboardRoute = computed(() => {
      // Get team and dev from auth store first, then fallback to route params
      const currentTeam = userTeam.value
      const currentDev = userName.value
      
      return `/engineer?team=${encodeURIComponent(currentTeam)}&dev=${encodeURIComponent(currentDev)}`
    })

    const toggleSidebar = () => {
      isOpen.value = !isOpen.value
    }

    const toggleCollapse = () => {
      collapsed.value = !collapsed.value
      localStorage.setItem('sidebar-collapsed', collapsed.value.toString())
    }

    const handleNavClick = () => {
      if (isMobile.value) {
        isOpen.value = false
      }
    }

    const handleLogout = () => {
      authStore.logout()
      if (userRole.value === 'admin') {
        router.push('/admin/login')
      } else {
        router.push('/engineer/login')
      }
    }

    const handleResize = () => {
      windowWidth.value = window.innerWidth
      if (!isMobile.value) {
        isOpen.value = false
      }
    }

    onMounted(() => {
      // Restore collapsed state
      const savedCollapsed = localStorage.getItem('sidebar-collapsed')
      if (savedCollapsed !== null) {
        collapsed.value = savedCollapsed === 'true'
      }
      
      window.addEventListener('resize', handleResize)
    })

    onUnmounted(() => {
      window.removeEventListener('resize', handleResize)
    })

    return {
      isOpen,
      collapsed,
      isMobile,
      userRole,
      userName,
      userTeam,
      userInitials,
      engineerDashboardRoute,
      toggleSidebar,
      toggleCollapse,
      handleNavClick,
      handleLogout
    }
  }
}
</script>

<style scoped>
/* Mobile menu button visibility control */
@media (min-width: 1024px) {
  .mobile-menu-button {
    display: none !important;
    visibility: hidden !important;
    pointer-events: none !important;
  }
}

@media (max-width: 1023px) {
  .mobile-menu-button {
    display: block !important;
    visibility: visible !important;
    pointer-events: auto !important;
  }
}
</style> 