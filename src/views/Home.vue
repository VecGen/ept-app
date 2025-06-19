<template>
  <div class="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
    <div class="sm:mx-auto sm:w-full sm:max-w-4xl">
      <!-- Hero Section -->
      <div class="text-center mb-12">
        <div class="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-8 text-white mb-8">
          <h1 class="text-4xl font-bold mb-4">📊 Developer Efficiency Tracker</h1>
          <p class="text-xl opacity-90">Track and analyze productivity gains from AI coding assistants</p>
        </div>
      </div>

      <!-- Access Options -->
      <div class="bg-white shadow rounded-lg p-8">
        <h2 class="text-2xl font-bold text-gray-900 text-center mb-8">🚪 Access Options</h2>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <!-- Admin Access -->
          <div class="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
            <div class="text-center">
              <div class="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span class="text-2xl">🔧</span>
              </div>
              <h3 class="text-lg font-semibold text-gray-900 mb-2">Admin Access</h3>
              <p class="text-gray-600 mb-4">Manage teams, view analytics, and configure settings</p>
              <router-link
                to="/admin/login"
                class="btn-primary w-full justify-center"
              >
                Admin Login
              </router-link>
            </div>
          </div>

          <!-- Engineer Access -->
          <div class="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
            <div class="text-center">
              <div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span class="text-2xl">👩‍💻</span>
              </div>
              <h3 class="text-lg font-semibold text-gray-900 mb-2">Engineer Access</h3>
              <p class="text-gray-600 mb-4">Log your efficiency gains and view personal analytics</p>
              <router-link
                to="/engineer/login"
                class="btn-primary w-full justify-center"
              >
                Engineer Login
              </router-link>
            </div>
          </div>
        </div>
      </div>

      <!-- Features Overview -->
      <div class="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div class="bg-white rounded-lg p-6 shadow">
          <div class="text-center">
            <div class="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span class="text-xl">👩‍💻</span>
            </div>
            <h3 class="font-semibold text-gray-900 mb-2">For Engineers</h3>
            <ul class="text-sm text-gray-600 space-y-1">
              <li>• Direct access via personal links</li>
              <li>• Log weekly efficiency gains</li>
              <li>• Track time saved with AI tools</li>
              <li>• View personal analytics</li>
            </ul>
          </div>
        </div>

        <div class="bg-white rounded-lg p-6 shadow">
          <div class="text-center">
            <div class="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span class="text-xl">🔧</span>
            </div>
            <h3 class="font-semibold text-gray-900 mb-2">For Admins</h3>
            <ul class="text-sm text-gray-600 space-y-1">
              <li>• Password-protected access</li>
              <li>• Manage teams and developers</li>
              <li>• Generate team reports</li>
              <li>• Export data for analysis</li>
            </ul>
          </div>
        </div>

        <div class="bg-white rounded-lg p-6 shadow">
          <div class="text-center">
            <div class="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span class="text-xl">📈</span>
            </div>
            <h3 class="font-semibold text-gray-900 mb-2">Analytics</h3>
            <ul class="text-sm text-gray-600 space-y-1">
              <li>• Real-time efficiency metrics</li>
              <li>• Trend analysis</li>
              <li>• Category breakdowns</li>
              <li>• Team comparisons</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Home'
}
</script> 