<template>
  <component
    :is="isAction ? 'button' : 'router-link'"
    :to="isAction ? undefined : route"
    @click="handleClick"
    :class="[
      'flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200',
      'hover:bg-gray-700 hover:shadow-md group relative',
      isActive ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg' : 'text-gray-300',
      collapsed ? 'justify-center' : 'justify-start',
      'w-full'
    ]"
  >
    <!-- Icon -->
    <div :class="['flex-shrink-0 text-lg', collapsed ? 'mx-0' : 'mr-3']">
      {{ icon }}
    </div>
    
    <!-- Label -->
    <span 
      v-if="!collapsed" 
      class="truncate"
    >
      {{ label }}
    </span>

    <!-- Tooltip for collapsed state -->
    <div 
      v-if="collapsed"
      class="absolute left-full ml-2 px-2 py-1 bg-gray-800 text-white text-xs rounded-md shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-50 pointer-events-none"
    >
      {{ label }}
      <!-- Tooltip arrow -->
      <div class="absolute top-1/2 left-0 transform -translate-y-1/2 -translate-x-1 w-0 h-0 border-t-2 border-b-2 border-r-2 border-transparent border-r-gray-800"></div>
    </div>

    <!-- Active indicator -->
    <div 
      v-if="isActive && !collapsed"
      class="absolute right-2 w-2 h-2 bg-white rounded-full"
    ></div>
  </component>
</template>

<script>
import { computed } from 'vue'
import { useRoute } from 'vue-router'

export default {
  name: 'NavItem',
  props: {
    icon: {
      type: String,
      required: true
    },
    label: {
      type: String,
      required: true
    },
    route: {
      type: String,
      default: null
    },
    collapsed: {
      type: Boolean,
      default: false
    },
    isAction: {
      type: Boolean,
      default: false
    }
  },
  emits: ['click'],
  setup(props, { emit }) {
    const route = useRoute()
    
    const isActive = computed(() => {
      if (props.isAction || !props.route) return false
      return route.path === props.route || route.path.startsWith(props.route + '/')
    })

    const handleClick = (event) => {
      emit('click', event)
    }

    return {
      isActive,
      handleClick
    }
  }
}
</script> 