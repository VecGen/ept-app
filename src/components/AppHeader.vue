<template>
  <header class="bg-white shadow">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between h-16">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <h1 class="text-xl font-bold text-gray-900">
              📊 Developer Efficiency Tracker
            </h1>
          </div>
          
          <!-- Navigation -->
          <nav class="hidden md:ml-6 md:flex md:space-x-8" v-if="authStore.isAuthenticated">
            <!-- Admin Navigation -->
            <template v-if="authStore.isAdmin">
              <router-link
                to="/admin"
                class="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                active-class="border-primary-500 text-gray-900"
              >
                Dashboard
              </router-link>
              <router-link
                to="/admin/teams"
                class="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                active-class="border-primary-500 text-gray-900"
              >
                Teams
              </router-link>
              <router-link
                to="/admin/settings"
                class="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                active-class="border-primary-500 text-gray-900"
              >
                Settings
              </router-link>
              <router-link
                to="/admin/data"
                class="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                active-class="border-primary-500 text-gray-900"
              >
                Data
              </router-link>
            </template>
            
            <!-- Engineer Navigation -->
            <template v-else-if="authStore.isEngineer">
              <router-link
                to="/engineer"
                class="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                active-class="border-primary-500 text-gray-900"
              >
                Dashboard
              </router-link>
              <router-link
                to="/engineer/entry"
                class="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                active-class="border-primary-500 text-gray-900"
              >
                Add Entry
              </router-link>
            </template>
          </nav>
        </div>

        <div class="flex items-center" v-if="authStore.isAuthenticated">
          <!-- User menu -->
          <div class="ml-3 relative">
            <Menu as="div" class="relative">
              <MenuButton class="flex text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
                <span class="sr-only">Open user menu</span>
                <div class="h-8 w-8 rounded-full bg-primary-500 flex items-center justify-center">
                  <span class="text-white text-sm font-medium">
                    {{ userInitials }}
                  </span>
                </div>
              </MenuButton>
              <transition
                enter-active-class="transition ease-out duration-200"
                enter-from-class="transform opacity-0 scale-95"
                enter-to-class="transform opacity-100 scale-100"
                leave-active-class="transition ease-in duration-75"
                leave-from-class="transform opacity-100 scale-100"
                leave-to-class="transform opacity-0 scale-95"
              >
                <MenuItems class="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
                  <div class="py-1">
                    <MenuItem v-slot="{ active }">
                      <div class="px-4 py-2 text-sm text-gray-700 border-b border-gray-200">
                        <div class="font-medium">{{ userName }}</div>
                        <div class="text-xs text-gray-500">{{ userRole }}</div>
                      </div>
                    </MenuItem>
                    <MenuItem v-slot="{ active }">
                      <button
                        @click="handleLogout"
                        :class="[active ? 'bg-gray-100' : '', 'block w-full text-left px-4 py-2 text-sm text-gray-700']"
                      >
                        Sign out
                      </button>
                    </MenuItem>
                  </div>
                </MenuItems>
              </transition>
            </Menu>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>

<script>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { Menu, MenuButton, MenuItems, MenuItem } from '@headlessui/vue'
import { useAuthStore } from '../stores/auth'

export default {
  name: 'AppHeader',
  components: {
    Menu,
    MenuButton,
    MenuItems,
    MenuItem
  },
  setup() {
    const authStore = useAuthStore()
    const router = useRouter()

    const userName = computed(() => {
      if (authStore.isAdmin) {
        return 'Admin'
      } else if (authStore.userData?.developer_name) {
        return authStore.userData.developer_name
      }
      return 'User'
    })

    const userRole = computed(() => {
      if (authStore.isAdmin) {
        return 'Administrator'
      } else if (authStore.userData?.team_name) {
        return authStore.userData.team_name
      }
      return 'Engineer'
    })

    const userInitials = computed(() => {
      const name = userName.value
      return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    })

    const handleLogout = () => {
      authStore.logout()
      router.push('/')
    }

    return {
      authStore,
      userName,
      userRole,
      userInitials,
      handleLogout
    }
  }
}
</script> 