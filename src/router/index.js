import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth'

// Lazy load components
const Home = () => import('../views/Home.vue')
const AdminLogin = () => import('../views/AdminLogin.vue')
const EngineerLogin = () => import('../views/EngineerLogin.vue')
const AdminDashboard = () => import('../views/AdminDashboard.vue')
const TeamManagement = () => import('../views/TeamManagement.vue')
const TeamSettings = () => import('../views/TeamSettings.vue')
const DataManagement = () => import('../views/DataManagement.vue')
const EngineerDashboard = () => import('../views/EngineerDashboard.vue')
const EngineerEntry = () => import('../views/EngineerEntry.vue')
const ApiTest = () => import('../views/ApiTest.vue')

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/api-test',
    name: 'ApiTest',
    component: ApiTest
  },
  {
    path: '/admin/login',
    name: 'AdminLogin',
    component: AdminLogin
  },
  {
    path: '/engineer/login',
    name: 'EngineerLogin',
    component: EngineerLogin
  },
  {
    path: '/admin',
    name: 'AdminDashboard',
    component: AdminDashboard,
    meta: { requiresAuth: true, userType: 'admin' }
  },
  {
    path: '/admin/teams',
    name: 'TeamManagement',
    component: TeamManagement,
    meta: { requiresAuth: true, userType: 'admin' }
  },
  {
    path: '/admin/settings',
    name: 'TeamSettings',
    component: TeamSettings,
    meta: { requiresAuth: true, userType: 'admin' }
  },
  {
    path: '/admin/data',
    name: 'DataManagement',
    component: DataManagement,
    meta: { requiresAuth: true, userType: 'admin' }
  },
  {
    path: '/engineer',
    name: 'EngineerDashboard',
    component: EngineerDashboard,
    meta: { requiresAuth: true, userType: 'engineer' }
  },
  {
    path: '/engineer/entry',
    name: 'EngineerEntry',
    component: EngineerEntry,
    meta: { requiresAuth: true, userType: 'engineer' }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// Route guards
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  
  if (to.meta.requiresAuth) {
    if (!authStore.isAuthenticated) {
      // Redirect to appropriate login page
      if (to.meta.userType === 'admin') {
        next('/admin/login')
      } else {
        next('/engineer/login')
      }
      return
    }
    
    // Check user type authorization
    if (to.meta.userType && authStore.userType !== to.meta.userType && authStore.userType !== 'admin') {
      next('/')
      return
    }
  }
  
  next()
})

export default router 