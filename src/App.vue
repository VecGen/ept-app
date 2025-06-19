<template>
  <div id="app">
    <!-- Header -->
    <header class="bg-white shadow-sm border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <div class="flex items-center">
            <h1 class="text-xl font-semibold text-gray-900">🎯 Efficiency Tracker</h1>
          </div>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="min-h-screen bg-gray-50">
      <router-view />
    </main>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script> 