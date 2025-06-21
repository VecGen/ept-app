<template>
  <Navigation>
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Header -->
      <div class="mb-8">
        <div class="bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg p-6 text-white">
          <div class="flex justify-between items-start">
            <div>
              <h1 class="text-3xl font-bold mb-2">🎯 Admin Dashboard</h1>
              <p class="text-purple-100">Welcome to the Efficiency Tracker admin panel</p>
            </div>
            
            <!-- Refresh Button -->
            <button 
              @click="loadAnalytics" 
              :disabled="loading"
              class="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg text-sm transition-colors duration-200 disabled:opacity-50"
            >
              {{ loading ? 'Loading...' : 'Refresh Data' }}
            </button>
          </div>
        </div>
      </div>

      <!-- Error Message -->
      <div v-if="error" class="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
        <div class="flex">
          <div class="flex-shrink-0">
            <span class="text-red-500 text-lg">⚠️</span>
          </div>
          <div class="ml-3">
            <p class="text-sm text-red-800">{{ error }}</p>
            <p class="text-xs text-red-600 mt-1">Showing fallback data for demonstration purposes.</p>
          </div>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="flex items-center justify-center py-12">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
        <span class="ml-3 text-gray-600">Loading dashboard data...</span>
      </div>

      <!-- Dashboard Content -->
      <div v-else>
        <!-- Key Metrics -->
        <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div class="stat-card">
            <div class="stat-card-content">
              <div class="flex items-center">
                <div class="flex-shrink-0">
                  <div class="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <span class="text-green-600 text-lg">⏰</span>
                  </div>
                </div>
                <div class="ml-5 w-0 flex-1">
                  <dl>
                    <dt class="text-sm font-medium text-gray-500 truncate">Total Hours Saved</dt>
                    <dd class="text-lg font-medium text-gray-900">{{ analytics.totalHoursSaved.toFixed(1) }}h</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div class="stat-card">
            <div class="stat-card-content">
              <div class="flex items-center">
                <div class="flex-shrink-0">
                  <div class="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <span class="text-blue-600 text-lg">📝</span>
                  </div>
                </div>
                <div class="ml-5 w-0 flex-1">
                  <dl>
                    <dt class="text-sm font-medium text-gray-500 truncate">Total Entries</dt>
                    <dd class="text-lg font-medium text-gray-900">{{ analytics.totalEntries }}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div class="stat-card">
            <div class="stat-card-content">
              <div class="flex items-center">
                <div class="flex-shrink-0">
                  <div class="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                    <span class="text-purple-600 text-lg">👥</span>
                  </div>
                </div>
                <div class="ml-5 w-0 flex-1">
                  <dl>
                    <dt class="text-sm font-medium text-gray-500 truncate">Active Teams</dt>
                    <dd class="text-lg font-medium text-gray-900">{{ analytics.activeTeams }}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div class="stat-card">
            <div class="stat-card-content">
              <div class="flex items-center">
                <div class="flex-shrink-0">
                  <div class="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                    <span class="text-yellow-600 text-lg">👨‍💻</span>
                  </div>
                </div>
                <div class="ml-5 w-0 flex-1">
                  <dl>
                    <dt class="text-sm font-medium text-gray-500 truncate">Active Developers</dt>
                    <dd class="text-lg font-medium text-gray-900">{{ analytics.activeDevelopers }}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Quick Actions -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <router-link to="/admin/teams" class="card hover:shadow-lg transition-shadow duration-200">
            <div class="card-body text-center">
              <div class="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <span class="text-2xl">👥</span>
              </div>
              <h3 class="text-lg font-semibold text-gray-900 mb-2">Manage Teams</h3>
              <p class="text-sm text-gray-600">Create teams, add developers, generate access links</p>
            </div>
          </router-link>

          <router-link to="/admin/settings" class="card hover:shadow-lg transition-shadow duration-200">
            <div class="card-body text-center">
              <div class="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <span class="text-2xl">⚙️</span>
              </div>
              <h3 class="text-lg font-semibold text-gray-900 mb-2">System Settings</h3>
              <p class="text-sm text-gray-600">Configure categories, efficiency areas, settings</p>
            </div>
          </router-link>

          <router-link to="/admin/data" class="card hover:shadow-lg transition-shadow duration-200">
            <div class="card-body text-center">
              <div class="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <span class="text-2xl">📊</span>
              </div>
              <h3 class="text-lg font-semibold text-gray-900 mb-2">Data Management</h3>
              <p class="text-sm text-gray-600">Export data, manage entries, generate reports</p>
            </div>
          </router-link>

          <div class="card">
            <div class="card-body text-center">
              <div class="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <span class="text-2xl"></span>
              </div>
              <h3 class="text-lg font-semibold text-gray-900 mb-2">View Analytics</h3>
              <p class="text-sm text-gray-600 mb-4">Detailed insights and trends</p>
              <button @click="showAnalytics = !showAnalytics" class="btn-secondary text-sm">
                {{ showAnalytics ? 'Hide' : 'Show' }} Details
              </button>
            </div>
          </div>
        </div>

        <!-- Analytics Section -->
        <div v-if="showAnalytics" class="space-y-6">
          <!-- Trend Charts Section -->
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <!-- Monthly Trends Chart -->
            <div class="card">
              <div class="card-header">
                <h3 class="text-lg font-medium">📈 Monthly Efficiency Trends</h3>
              </div>
              <div class="card-body">
                <div class="h-64">
                  <TrendChart
                    v-if="monthlyTrendsData.datasets.length > 0"
                    chart-id="monthly-trends"
                    type="line"
                    :data="monthlyTrendsData"
                    :options="chartOptions.line"
                  />
                  <div v-else class="flex items-center justify-center h-full text-gray-500">
                    <div class="text-center">
                      <div class="text-4xl mb-2">📊</div>
                      <p>No monthly trend data available</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Daily Activity Chart -->
            <div class="card">
              <div class="card-header">
                <h3 class="text-lg font-medium">📅 Daily Activity (Last 30 Days)</h3>
              </div>
              <div class="card-body">
                <div class="h-64">
                  <TrendChart
                    v-if="dailyTrendsData.datasets.length > 0"
                    chart-id="daily-trends"
                    type="bar"
                    :data="dailyTrendsData"
                    :options="chartOptions.bar"
                  />
                  <div v-else class="flex items-center justify-center h-full text-gray-500">
                    <div class="text-center">
                      <div class="text-4xl mb-2">📈</div>
                      <p>No daily activity data available</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Team Performance and Category Charts -->
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <!-- Team Performance Chart -->
            <div class="card">
              <div class="card-header">
                <h3 class="text-lg font-medium">👥 Team Performance Comparison</h3>
              </div>
              <div class="card-body">
                <div class="h-64">
                  <TrendChart
                    v-if="teamPerformanceData.datasets.length > 0"
                    chart-id="team-performance"
                    type="bar"
                    :data="teamPerformanceData"
                    :options="chartOptions.bar"
                  />
                  <div v-else class="flex items-center justify-center h-full text-gray-500">
                    <div class="text-center">
                      <div class="text-4xl mb-2">👥</div>
                      <p>No team performance data available</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Category Breakdown Chart -->
            <div class="card">
              <div class="card-header">
                <h3 class="text-lg font-medium">🎯 Efficiency by Category</h3>
              </div>
              <div class="card-body">
                <div class="h-64">
                  <TrendChart
                    v-if="categoryBreakdownData.datasets.length > 0"
                    chart-id="category-breakdown"
                    type="doughnut"
                    :data="categoryBreakdownData"
                    :options="chartOptions.doughnut"
                  />
                  <div v-else class="flex items-center justify-center h-full text-gray-500">
                    <div class="text-center">
                      <div class="text-4xl mb-2">🎯</div>
                      <p>No category breakdown data available</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Enhanced Analytics Overview -->
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <!-- Efficiency Rate Card -->
            <div class="card">
              <div class="card-body">
                <div class="flex items-center">
                  <div class="flex-shrink-0">
                    <div class="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                      <span class="text-green-600 text-lg">⚡</span>
                    </div>
                  </div>
                  <div class="ml-5 w-0 flex-1">
                    <dl>
                      <dt class="text-sm font-medium text-gray-500 truncate">Avg Efficiency Rate</dt>
                      <dd class="text-lg font-medium text-gray-900">
                        {{ analytics.averageEfficiency ? analytics.averageEfficiency.toFixed(1) + '%' : 'N/A' }}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <!-- Copilot Usage Card -->
            <div class="card">
              <div class="card-body">
                <div class="flex items-center">
                  <div class="flex-shrink-0">
                    <div class="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <span class="text-blue-600 text-lg">🤖</span>
                    </div>
                  </div>
                  <div class="ml-5 w-0 flex-1">
                    <dl>
                      <dt class="text-sm font-medium text-gray-500 truncate">Copilot Usage</dt>
                      <dd class="text-lg font-medium text-gray-900">
                        {{ analytics.copilotUsageRate ? analytics.copilotUsageRate.toFixed(1) + '%' : 'N/A' }}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <!-- Hours per Entry Card -->
            <div class="card">
              <div class="card-body">
                <div class="flex items-center">
                  <div class="flex-shrink-0">
                    <div class="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                      <span class="text-orange-600 text-lg">📊</span>
                    </div>
                  </div>
                  <div class="ml-5 w-0 flex-1">
                    <dl>
                      <dt class="text-sm font-medium text-gray-500 truncate">Avg Hours/Entry</dt>
                      <dd class="text-lg font-medium text-gray-900">
                        {{ analytics.totalEntries > 0 ? (analytics.totalHoursSaved / analytics.totalEntries).toFixed(1) + 'h' : 'N/A' }}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <!-- Active Projects Card -->
            <div class="card">
              <div class="card-body">
                <div class="flex items-center">
                  <div class="flex-shrink-0">
                    <div class="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                      <span class="text-purple-600 text-lg">🚀</span>
                    </div>
                  </div>
                  <div class="ml-5 w-0 flex-1">
                    <dl>
                      <dt class="text-sm font-medium text-gray-500 truncate">Active Projects</dt>
                      <dd class="text-lg font-medium text-gray-900">
                        {{ analytics.teamStats.length || 0 }}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Team Performance -->
          <div class="card">
            <div class="card-header">
              <h3 class="text-lg font-medium">📊 Team Performance Analytics</h3>
            </div>
            <div class="card-body">
              <div class="overflow-x-auto">
                <table class="min-w-full divide-y divide-gray-200">
                  <thead class="bg-gray-50">
                    <tr>
                      <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Team
                      </th>
                      <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Hours Saved
                      </th>
                      <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Entries
                      </th>
                      <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Avg per Entry
                      </th>
                      <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Developers
                      </th>
                      <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Productivity
                      </th>
                    </tr>
                  </thead>
                  <tbody class="bg-white divide-y divide-gray-200">
                    <tr v-for="team in analytics.teamStats" :key="team.name">
                      <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {{ team.name }}
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap text-sm text-green-600 font-medium">
                        {{ team.hours.toFixed(1) }}h
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {{ team.entries }}
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {{ team.entries > 0 ? (team.hours / team.entries).toFixed(1) + 'h' : 'N/A' }}
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {{ team.developers || 'N/A' }}
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap">
                        <div class="flex items-center">
                          <div class="w-16 bg-gray-200 rounded-full h-2 mr-2">
                            <div class="bg-blue-600 h-2 rounded-full" 
                                 :style="{ width: Math.min(100, (team.hours / (analytics.totalHoursSaved || 1) * 100)) + '%' }"></div>
                          </div>
                          <span class="text-xs text-gray-500">
                            {{ analytics.totalHoursSaved > 0 ? ((team.hours / analytics.totalHoursSaved) * 100).toFixed(0) + '%' : '0%' }}
                          </span>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <!-- Recent Activity -->
          <div class="card">
            <div class="card-header">
              <h3 class="text-lg font-medium">🕒 Recent Activity</h3>
            </div>
            <div class="card-body">
              <div class="flow-root">
                <ul class="-mb-8">
                  <li v-for="(activity, index) in recentActivity" :key="activity.id">
                    <div class="relative pb-8">
                      <span v-if="index !== recentActivity.length - 1" 
                            class="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200" 
                            aria-hidden="true"></span>
                      <div class="relative flex space-x-3">
                        <div>
                          <span class="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center ring-8 ring-white">
                            <span class="text-white text-sm">{{ activity.icon }}</span>
                          </span>
                        </div>
                        <div class="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                          <div>
                            <p class="text-sm text-gray-500">
                              {{ activity.description }}
                            </p>
                          </div>
                          <div class="text-right text-sm whitespace-nowrap text-gray-500">
                            {{ formatTimeAgo(activity.timestamp) }}
                          </div>
                        </div>
                      </div>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <!-- Top Categories -->
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <!-- Developer Productivity Insights -->
            <div class="card">
              <div class="card-header">
                <h3 class="text-lg font-medium">👨‍💻 Developer Productivity Insights</h3>
              </div>
              <div class="card-body">
                <div class="space-y-4">
                  <!-- Copilot Usage Breakdown -->
                  <div>
                    <div class="flex justify-between items-center mb-2">
                      <span class="text-sm font-medium text-gray-700">Copilot Usage Distribution</span>
                      <span class="text-sm text-gray-500">{{ analytics.copilotUsage.total }} total entries</span>
                    </div>
                    <div class="w-full bg-gray-200 rounded-full h-3">
                      <div class="bg-blue-600 h-3 rounded-full flex">
                        <div class="bg-blue-600 rounded-l-full" 
                             :style="{ width: analytics.copilotUsage.total > 0 ? (analytics.copilotUsage.withCopilot / analytics.copilotUsage.total * 100) + '%' : '0%' }">
                        </div>
                      </div>
                    </div>
                    <div class="flex justify-between text-xs text-gray-600 mt-1">
                      <span>With Copilot: {{ analytics.copilotUsage.withCopilot }}</span>
                      <span>Without: {{ analytics.copilotUsage.withoutCopilot }}</span>
                    </div>
                  </div>

                  <!-- Team Distribution -->
                  <div>
                    <div class="flex justify-between items-center mb-2">
                      <span class="text-sm font-medium text-gray-700">Team Activity Distribution</span>
                      <span class="text-sm text-gray-500">{{ analytics.activeTeams }} teams active</span>
                    </div>
                    <div class="space-y-2">
                      <div v-for="team in analytics.teamStats.slice(0, 3)" :key="team.name" class="flex items-center justify-between">
                        <span class="text-xs text-gray-600 truncate w-20">{{ team.name }}</span>
                        <div class="flex-1 mx-2">
                          <div class="w-full bg-gray-200 rounded-full h-2">
                            <div class="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full" 
                                 :style="{ width: analytics.totalEntries > 0 ? (team.entries / analytics.totalEntries * 100) + '%' : '0%' }">
                            </div>
                          </div>
                        </div>
                        <span class="text-xs text-gray-500 w-12 text-right">{{ team.entries }}</span>
                      </div>
                    </div>
                  </div>

                  <!-- Efficiency Metrics -->
                  <div v-if="analytics.averageEfficiency">
                    <div class="flex justify-between items-center mb-2">
                      <span class="text-sm font-medium text-gray-700">Overall Efficiency</span>
                      <span class="text-sm font-semibold" :class="analytics.averageEfficiency > 50 ? 'text-green-600' : 'text-yellow-600'">
                        {{ analytics.averageEfficiency.toFixed(1) }}%
                      </span>
                    </div>
                    <div class="w-full bg-gray-200 rounded-full h-2">
                      <div class="h-2 rounded-full" 
                           :class="analytics.averageEfficiency > 70 ? 'bg-green-500' : analytics.averageEfficiency > 50 ? 'bg-yellow-500' : 'bg-red-500'"
                           :style="{ width: Math.min(100, analytics.averageEfficiency) + '%' }">
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="card">
              <div class="card-header">
                <h3 class="text-lg font-medium">🎯 Top Categories by Hours Saved</h3>
              </div>
              <div class="card-body">
                <div class="space-y-3">
                  <div v-for="category in topCategories" :key="category.name" 
                       class="flex justify-between items-center">
                    <span class="text-sm font-medium text-gray-700">{{ category.name }}</span>
                    <div class="flex items-center space-x-2">
                      <div class="w-20 bg-gray-200 rounded-full h-2">
                        <div class="bg-blue-600 h-2 rounded-full" 
                             :style="{ width: topCategories.length > 0 && topCategories[0].hours > 0 ? (category.hours / topCategories[0].hours * 100) + '%' : '0%' }"></div>
                      </div>
                      <span class="text-sm text-gray-500 w-12 text-right">{{ category.hours.toFixed(1) }}h</span>
                    </div>
                  </div>
                  
                  <!-- Show message if no categories -->
                  <div v-if="topCategories.length === 0" class="text-center py-8 text-gray-500">
                    <div class="text-4xl mb-2">📊</div>
                    <p class="text-sm">No category data available yet</p>
                    <p class="text-xs">Categories will appear as teams log efficiency entries</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Time Trends and Insights -->
          <div class="card">
            <div class="card-header">
              <h3 class="text-lg font-medium">📈 Productivity Trends & Insights</h3>
            </div>
            <div class="card-body">
              <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                <!-- Trend Analysis -->
                <div class="text-center">
                  <div class="text-2xl font-bold text-blue-600">
                    {{ analytics.totalEntries > 0 ? Math.round(analytics.totalHoursSaved / analytics.totalEntries * 10) / 10 : 0 }}h
                  </div>
                  <div class="text-sm text-gray-500">Average Hours Saved per Entry</div>
                  <div class="text-xs text-gray-400 mt-1">
                    {{ analytics.totalEntries > 0 ? 'Consistent productivity' : 'Start tracking to see trends' }}
                  </div>
                </div>
                
                <!-- Velocity Metric -->
                <div class="text-center">
                  <div class="text-2xl font-bold text-green-600">
                    {{ analytics.activeDevelopers > 0 ? Math.round(analytics.totalEntries / analytics.activeDevelopers * 10) / 10 : 0 }}
                  </div>
                  <div class="text-sm text-gray-500">Entries per Developer</div>
                  <div class="text-xs text-gray-400 mt-1">
                    {{ analytics.activeDevelopers > 0 ? 'Team engagement metric' : 'Add developers to see metrics' }}
                  </div>
                </div>
                
                <!-- Impact Metric -->
                <div class="text-center">
                  <div class="text-2xl font-bold text-purple-600">
                    {{ analytics.activeDevelopers > 0 ? Math.round(analytics.totalHoursSaved / analytics.activeDevelopers * 10) / 10 : 0 }}h
                  </div>
                  <div class="text-sm text-gray-500">Hours Saved per Developer</div>
                  <div class="text-xs text-gray-400 mt-1">
                    {{ analytics.activeDevelopers > 0 ? 'Individual impact score' : 'Track entries to calculate impact' }}
                  </div>
                </div>
              </div>
              
              <!-- Quick Insights -->
              <div class="mt-6 p-4 bg-blue-50 rounded-lg">
                <h4 class="text-sm font-medium text-blue-900 mb-2">💡 Quick Insights</h4>
                <div class="space-y-1 text-sm text-blue-800">
                  <div v-if="analytics.copilotUsageRate > 70">
                    <span class="font-medium">High Copilot Adoption:</span> {{ analytics.copilotUsageRate.toFixed(0) }}% usage rate indicates strong AI tool integration
                  </div>
                  <div v-else-if="analytics.copilotUsageRate > 0">
                    <span class="font-medium">Copilot Opportunity:</span> {{ (100 - analytics.copilotUsageRate).toFixed(0) }}% of entries could benefit from AI assistance
                  </div>
                  <div v-if="analytics.teamStats.length > 0">
                    <span class="font-medium">Top Performer:</span> {{ analytics.teamStats[0]?.name }} leads with {{ analytics.teamStats[0]?.hours.toFixed(1) }}h saved
                  </div>
                  <div v-if="analytics.totalEntries > 20">
                    <span class="font-medium">Good Tracking:</span> {{ analytics.totalEntries }} entries show consistent productivity measurement
                  </div>
                  <div v-else-if="analytics.totalEntries > 0">
                    <span class="font-medium">Building Momentum:</span> {{ analytics.totalEntries }} entries logged - keep tracking for better insights
                  </div>
                  <div v-else>
                    <span class="font-medium">Getting Started:</span> Start logging efficiency entries to see personalized insights here
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Navigation>
</template>

<script>
import { ref, onMounted } from 'vue'
import { getAdminDashboard, getOverallAnalytics } from '../services/api'
import { useAuthStore } from '../stores/auth'
import { useRouter } from 'vue-router'
import Navigation from '../components/Navigation.vue'
import TrendChart from '../components/TrendChart.vue'

export default {
  name: 'AdminDashboard',
  components: {
    Navigation,
    TrendChart
  },
  setup() {
    const authStore = useAuthStore()
    const router = useRouter()
    
    const analytics = ref({
      totalHoursSaved: 0,
      totalEntries: 0,
      activeTeams: 0,
      activeDevelopers: 0,
      teamStats: [],
      copilotUsage: {
        withCopilot: 0,
        withoutCopilot: 0,
        total: 0
      },
      averageEfficiency: null,
      copilotUsageRate: null,
      monthlyTrends: [],
      dailyTrends: [],
      categoryBreakdown: [],
      efficiencyTrends: []
    })
    
    const recentActivity = ref([])
    const topCategories = ref([])
    const showAnalytics = ref(false)
    const loading = ref(true)
    const error = ref(null)

    // Chart data
    const monthlyTrendsData = ref({ labels: [], datasets: [] })
    const dailyTrendsData = ref({ labels: [], datasets: [] })
    const teamPerformanceData = ref({ labels: [], datasets: [] })
    const categoryBreakdownData = ref({ labels: [], datasets: [] })

    // Chart options
    const chartOptions = {
      line: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'top',
          },
          tooltip: {
            mode: 'index',
            intersect: false,
            callbacks: {
              label: function(context) {
                if (context.dataset.label === 'Hours Saved') {
                  return `${context.dataset.label}: ${context.parsed.y.toFixed(1)}h`
                } else if (context.dataset.label === 'Efficiency Rate') {
                  return `${context.dataset.label}: ${context.parsed.y.toFixed(1)}%`
                }
                return `${context.dataset.label}: ${context.parsed.y}`
              }
            }
          }
        },
        scales: {
          x: {
            display: true,
            grid: {
              color: 'rgba(0, 0, 0, 0.1)'
            }
          },
          y: {
            type: 'linear',
            display: true,
            position: 'left',
            beginAtZero: true,
            grid: {
              color: 'rgba(0, 0, 0, 0.1)'
            }
          },
          y1: {
            type: 'linear',
            display: true,
            position: 'right',
            beginAtZero: true,
            grid: {
              drawOnChartArea: false,
            },
          }
        }
      },
      bar: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'top',
          },
          tooltip: {
            callbacks: {
              label: function(context) {
                if (context.dataset.label === 'Hours Saved') {
                  return `${context.dataset.label}: ${context.parsed.y.toFixed(1)}h`
                } else if (context.dataset.label === 'Efficiency Rate') {
                  return `${context.dataset.label}: ${context.parsed.y.toFixed(1)}%`
                }
                return `${context.dataset.label}: ${context.parsed.y}`
              }
            }
          }
        },
        scales: {
          x: {
            display: true,
            grid: {
              color: 'rgba(0, 0, 0, 0.1)'
            }
          },
          y: {
            display: true,
            beginAtZero: true,
            grid: {
              color: 'rgba(0, 0, 0, 0.1)'
            }
          }
        }
      },
      doughnut: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'right',
          },
          tooltip: {
            callbacks: {
              label: function(context) {
                const total = context.dataset.data.reduce((a, b) => a + b, 0)
                const percentage = ((context.parsed / total) * 100).toFixed(1)
                return `${context.label}: ${context.parsed.toFixed(1)}h (${percentage}%)`
              }
            }
          }
        }
      }
    }

    // Process chart data
    const processChartData = () => {
      // Monthly trends
      if (analytics.value.monthlyTrends && analytics.value.monthlyTrends.length > 0) {
        const monthlyLabels = analytics.value.monthlyTrends.map(trend => {
          const date = new Date(trend.month)
          return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
        })
        
        monthlyTrendsData.value = {
          labels: monthlyLabels,
          datasets: [
            {
              label: 'Hours Saved',
              data: analytics.value.monthlyTrends.map(trend => trend.time_saved),
              borderColor: 'rgb(59, 130, 246)',
              backgroundColor: 'rgba(59, 130, 246, 0.1)',
              yAxisID: 'y',
              tension: 0.4
            },
            {
              label: 'Efficiency Rate',
              data: analytics.value.monthlyTrends.map(trend => trend.efficiency_rate),
              borderColor: 'rgb(16, 185, 129)',
              backgroundColor: 'rgba(16, 185, 129, 0.1)',
              yAxisID: 'y1',
              tension: 0.4
            }
          ]
        }
      }

      // Daily trends
      if (analytics.value.dailyTrends && analytics.value.dailyTrends.length > 0) {
        const dailyLabels = analytics.value.dailyTrends.map(trend => {
          const date = new Date(trend.date)
          return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
        })
        
        dailyTrendsData.value = {
          labels: dailyLabels,
          datasets: [
            {
              label: 'Hours Saved',
              data: analytics.value.dailyTrends.map(trend => trend.time_saved),
              backgroundColor: 'rgba(59, 130, 246, 0.8)',
              borderColor: 'rgb(59, 130, 246)',
              borderWidth: 1
            }
          ]
        }
      }

      // Team performance
      if (analytics.value.teamStats && analytics.value.teamStats.length > 0) {
        teamPerformanceData.value = {
          labels: analytics.value.teamStats.map(team => team.name),
          datasets: [
            {
              label: 'Hours Saved',
              data: analytics.value.teamStats.map(team => team.hours),
              backgroundColor: [
                'rgba(59, 130, 246, 0.8)',
                'rgba(16, 185, 129, 0.8)',
                'rgba(245, 158, 11, 0.8)',
                'rgba(239, 68, 68, 0.8)',
                'rgba(139, 92, 246, 0.8)'
              ],
              borderColor: [
                'rgb(59, 130, 246)',
                'rgb(16, 185, 129)',
                'rgb(245, 158, 11)',
                'rgb(239, 68, 68)',
                'rgb(139, 92, 246)'
              ],
              borderWidth: 1
            }
          ]
        }
      }

      // Category breakdown
      if (analytics.value.categoryBreakdown && analytics.value.categoryBreakdown.length > 0) {
        categoryBreakdownData.value = {
          labels: analytics.value.categoryBreakdown.map(cat => cat.category),
          datasets: [
            {
              data: analytics.value.categoryBreakdown.map(cat => cat.time_saved),
              backgroundColor: [
                'rgba(59, 130, 246, 0.8)',
                'rgba(16, 185, 129, 0.8)',
                'rgba(245, 158, 11, 0.8)',
                'rgba(239, 68, 68, 0.8)',
                'rgba(139, 92, 246, 0.8)',
                'rgba(236, 72, 153, 0.8)'
              ],
              borderColor: [
                'rgb(59, 130, 246)',
                'rgb(16, 185, 129)',
                'rgb(245, 158, 11)',
                'rgb(239, 68, 68)',
                'rgb(139, 92, 246)',
                'rgb(236, 72, 153)'
              ],
              borderWidth: 1
            }
          ]
        }
      } else if (topCategories.value && topCategories.value.length > 0) {
        // Fallback to topCategories if no category breakdown
        categoryBreakdownData.value = {
          labels: topCategories.value.map(cat => cat.name),
          datasets: [
            {
              data: topCategories.value.map(cat => cat.hours),
              backgroundColor: [
                'rgba(59, 130, 246, 0.8)',
                'rgba(16, 185, 129, 0.8)',
                'rgba(245, 158, 11, 0.8)',
                'rgba(239, 68, 68, 0.8)',
                'rgba(139, 92, 246, 0.8)'
              ],
              borderColor: [
                'rgb(59, 130, 246)',
                'rgb(16, 185, 129)',
                'rgb(245, 158, 11)',
                'rgb(239, 68, 68)',
                'rgb(139, 92, 246)'
              ],
              borderWidth: 1
            }
          ]
        }
      }
    }

    const loadAnalytics = async () => {
      try {
        loading.value = true
        error.value = null
        
        // Check if user is authenticated
        if (!authStore.isAuthenticated) {
          error.value = 'Not authenticated. Please log in first.'
          router.push('/admin/login')
          return
        }
        
        console.log('Loading dashboard data...')
        console.log('Auth token exists:', !!localStorage.getItem('auth_token'))
        
        // Load admin dashboard data from API
        const response = await getAdminDashboard()
        console.log('Dashboard response:', response)
        
        // Extract data from the response - handle both direct data and wrapped data
        const data = response.data || response
        
        // Helper function to extract team name from various formats
        const extractTeamName = (teamNameField) => {
          if (typeof teamNameField === 'string') {
            return teamNameField
          } else if (typeof teamNameField === 'object' && teamNameField !== null) {
            // Handle cases like {"": "Direct Lens"} or {"name": "Team Name"}
            const values = Object.values(teamNameField)
            return values.length > 0 ? values[0] : 'Unknown Team'
          }
          return 'Unknown Team'
        }
        
        // Update analytics with real data
        analytics.value = {
          totalHoursSaved: data.total_time_saved || 0,
          totalEntries: data.total_entries || 0,
          activeTeams: data.teams_count || 0,
          activeDevelopers: data.developers_count || 0,
          teamStats: (data.team_stats || []).map(team => ({
            name: extractTeamName(team.team_name),
            hours: team.total_time_saved || 0,
            entries: team.total_entries || 0,
            developers: team.developers_count || 0
          })),
          copilotUsage: {
            withCopilot: Math.round((data.copilot_usage_rate || 0) * (data.total_entries || 0) / 100),
            withoutCopilot: (data.total_entries || 0) - Math.round((data.copilot_usage_rate || 0) * (data.total_entries || 0) / 100),
            total: data.total_entries || 0
          },
          averageEfficiency: data.average_efficiency,
          copilotUsageRate: data.copilot_usage_rate,
          monthlyTrends: data.monthly_trends || [],
          dailyTrends: data.daily_trends || [],
          categoryBreakdown: data.category_breakdown || [],
          efficiencyTrends: data.efficiency_trends || []
        }
        
        // Generate recent activity from actual data
        const activities = []
        
        // Add activities for each team
        if (data.team_stats && data.team_stats.length > 0) {
          data.team_stats.forEach((team, index) => {
            const teamName = extractTeamName(team.team_name)
            if (team.total_entries > 0) {
              activities.push({
                id: `team-${index}`,
                icon: '📊',
                description: `${teamName} team logged ${team.total_entries} efficiency entries (${(team.total_time_saved || 0).toFixed(1)} hours saved)`,
                timestamp: new Date(Date.now() - (index + 1) * 2 * 60 * 60 * 1000) // Stagger timestamps
              })
            }
          })
        }
        
        // Add monthly trend activities
        if (data.monthly_trends && data.monthly_trends.length > 0) {
          data.monthly_trends.forEach((trend, index) => {
            activities.push({
              id: `trend-${index}`,
              icon: '📈',
              description: `${trend.month}: ${trend.entries} entries with ${(trend.time_saved || 0).toFixed(1)} hours saved (${(trend.efficiency_rate || 0).toFixed(1)}% efficiency)`,
              timestamp: new Date(Date.now() - (activities.length + index + 1) * 3 * 60 * 60 * 1000)
            })
          })
        }
        
        // Add general system activities if we have data
        if (data.total_entries > 0) {
          activities.push({
            id: 'system-copilot',
            icon: '🤖',
            description: `Copilot usage rate: ${(data.copilot_usage_rate || 0).toFixed(1)}% across all teams`,
            timestamp: new Date(Date.now() - activities.length * 60 * 60 * 1000)
          })
          
          activities.push({
            id: 'system-efficiency',
            icon: '⚡',
            description: `Overall efficiency rate: ${(data.average_efficiency || 0).toFixed(1)}% with ${(data.total_time_saved || 0).toFixed(1)} hours saved`,
            timestamp: new Date(Date.now() - activities.length * 60 * 60 * 1000)
          })
        }
        
        // Fallback activities if no real data
        if (activities.length === 0) {
          activities.push(
            {
              id: 'welcome',
              icon: '🎉',
              description: 'Welcome to the Efficiency Tracking Dashboard!',
              timestamp: new Date(Date.now() - 60 * 60 * 1000)
            },
            {
              id: 'setup',
              icon: '⚙️',
              description: 'System is ready to track efficiency entries',
              timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000)
            }
          )
        }
        
        recentActivity.value = activities.slice(0, 10) // Limit to 10 most recent
        
        // Set top categories from monthly trends if available
        topCategories.value = (data.monthly_trends || []).slice(0, 5).map(trend => ({
          name: trend.month,
          hours: trend.time_saved || 0
        }))
        
        // If no monthly trends, create categories from team data
        if (topCategories.value.length === 0 && data.team_stats) {
          topCategories.value = data.team_stats
            .sort((a, b) => (b.total_time_saved || 0) - (a.total_time_saved || 0))
            .slice(0, 5)
            .map(team => ({
              name: extractTeamName(team.team_name),
              hours: team.total_time_saved || 0
            }))
        }
        
        console.log('Dashboard data loaded successfully')
        console.log('Final analytics:', analytics.value)
        console.log('Recent activities:', recentActivity.value)
        
        processChartData()
      } catch (err) {
        console.error('Failed to load analytics:', err)
        
        // Handle specific error cases
        if (err.response?.status === 401) {
          error.value = 'Authentication expired. Please log in again.'
          authStore.logout()
          router.push('/admin/login')
          return
        } else if (err.response?.status === 403) {
          error.value = 'Access denied. Admin privileges required.'
          return
        } else if (err.response?.status === 404) {
          error.value = 'API endpoint not found. Please check if the API is properly deployed.'
        } else if (err.code === 'NETWORK_ERROR' || err.message.includes('Network Error')) {
          error.value = 'Network error. Please check your internet connection and try again.'
        } else {
          error.value = `Failed to load dashboard data: ${err.response?.data?.detail || err.message || 'Unknown error'}`
        }
        
        // Fallback to placeholder data if API fails
        analytics.value = {
          totalHoursSaved: 120.5,
          totalEntries: 45,
          activeTeams: 3,
          activeDevelopers: 8,
          teamStats: [
            { name: 'Frontend Team', hours: 45.5, entries: 12, developers: 3 },
            { name: 'Backend Team', hours: 35.0, entries: 18, developers: 3 },
            { name: 'Platform Team', hours: 40.0, entries: 15, developers: 2 }
          ],
          copilotUsage: {
            withCopilot: 38,
            withoutCopilot: 7,
            total: 45
          },
          averageEfficiency: null,
          copilotUsageRate: null,
          monthlyTrends: [],
          dailyTrends: [],
          categoryBreakdown: [],
          efficiencyTrends: []
        }
        
        recentActivity.value = [
          {
            id: 1,
            icon: '👥',
            description: 'New team "DevOps Team" was created',
            timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000)
          },
          {
            id: 2,
            icon: '📝',
            description: 'Alice Johnson logged 2.5 hours of efficiency gains',
            timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000)
          },
          {
            id: 3,
            icon: '⚙️',
            description: 'System settings were updated',
            timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000)
          },
          {
            id: 4,
            icon: '👨‍💻',
            description: 'Bob Smith was added to Backend Team',
            timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000)
          }
        ]
        
        topCategories.value = [
          { name: 'Feature Development', hours: 42.5 },
          { name: 'Bug Fixes', hours: 28.0 },
          { name: 'Code Review', hours: 22.0 },
          { name: 'Testing', hours: 18.5 },
          { name: 'API Development', hours: 9.5 }
        ]
        
        processChartData()
      } finally {
        loading.value = false
      }
    }

    const formatTimeAgo = (timestamp) => {
      const now = new Date()
      const diff = now - new Date(timestamp)
      const hours = Math.floor(diff / (1000 * 60 * 60))
      const days = Math.floor(hours / 24)
      
      if (days > 0) {
        return `${days} day${days === 1 ? '' : 's'} ago`
      } else if (hours > 0) {
        return `${hours} hour${hours === 1 ? '' : 's'} ago`
      } else {
        const minutes = Math.floor(diff / (1000 * 60))
        return `${minutes} minute${minutes === 1 ? '' : 's'} ago`
      }
    }

    onMounted(() => {
      loadAnalytics()
    })

    return {
      analytics,
      recentActivity,
      topCategories,
      showAnalytics,
      loading,
      error,
      formatTimeAgo,
      loadAnalytics,
      monthlyTrendsData,
      dailyTrendsData,
      teamPerformanceData,
      categoryBreakdownData,
      chartOptions
    }
  }
}
</script>

<style scoped>
/* Admin Dashboard Specific Styles */
.max-w-7xl {
  position: relative;
  z-index: 1;
}

/* Header styling to ensure it's above any overlapping elements */
.bg-gradient-to-r.from-purple-600.to-blue-600 {
  position: relative;
  z-index: 100;
}

/* Ensure mobile compatibility */
@media (max-width: 1023px) {
  .max-w-7xl.mx-auto.px-4.sm\\:px-6.lg\\:px-8.py-8 {
    margin-top: 5rem; /* Space for mobile menu button */
    padding: 1rem;
  }
}
</style> 