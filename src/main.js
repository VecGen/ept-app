import { createApp } from 'vue'
import { createPinia } from 'pinia'
import router from './router'
import App from './App.vue'
import './assets/styles.css'
import { useAuthStore } from './stores/auth'

// Initialize the Vue app
const app = createApp(App)

// Add Pinia store
app.use(createPinia())

// Add Vue Router
app.use(router)

// Initialize auth store and check for existing authentication
const authStore = useAuthStore()
authStore.checkAuth()

// Mount the app
app.mount('#app') 