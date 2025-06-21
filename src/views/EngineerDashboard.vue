<template>
  <Navigation>
    <div class="engineer-dashboard">
      <!-- Dashboard Header -->
      <div class="dashboard-header">
        <div class="header-content">
          <h1 class="dashboard-title">Engineer Dashboard</h1>
          <div class="header-actions">
            <button 
              @click="loadDashboard" 
              :disabled="loading"
              class="btn btn-primary"
            >
              <span v-if="loading">Loading...</span>
              <span v-else>Refresh</span>
            </button>
          </div>
        </div>
      </div>

      <!-- Error Message -->
      <div v-if="error" class="error-message">
        <div class="error-content">
          <span class="error-icon">⚠️</span>
          <span>{{ error }}</span>
          <button @click="loadDashboard" class="retry-btn">Retry</button>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="loading && !error" class="loading-container">
        <div class="loading-spinner"></div>
        <p>Loading your dashboard...</p>
      </div>

      <!-- Dashboard Content -->
      <div v-if="!loading && !error" class="dashboard-content">
        <!-- Team Info Card -->
        <div class="info-card team-info">
          <div class="card-header">
            <h2 class="card-title">
              <span class="card-icon">👥</span>
              Team Information
            </h2>
          </div>
          <div class="card-content">
            <div class="team-details">
              <div class="detail-item">
                <span class="detail-label">Team:</span>
                <span class="detail-value">{{ team.name || 'Not assigned' }}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">Description:</span>
                <span class="detail-value">{{ team.description || 'No description available' }}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">Your Role:</span>
                <span class="detail-value">{{ developer.name || 'Engineer' }}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">Team Members:</span>
                <span class="detail-value">{{ team.developers_count || 0 }} members</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Quick Stats -->
        <div class="stats-grid">
          <div class="stat-card">
            <div class="stat-icon">📝</div>
            <div class="stat-content">
              <div class="stat-value">{{ stats.totalEntries }}</div>
              <div class="stat-label">Total Entries</div>
            </div>
          </div>
          <div class="stat-card">
            <div class="stat-icon">⏰</div>
            <div class="stat-content">
              <div class="stat-value">{{ stats.totalHours }}h</div>
              <div class="stat-label">Hours Saved</div>
            </div>
          </div>
          <div class="stat-card">
            <div class="stat-icon">🔥</div>
            <div class="stat-content">
              <div class="stat-value">{{ stats.thisWeek }}</div>
              <div class="stat-label">This Week</div>
            </div>
          </div>
          <div class="stat-card">
            <div class="stat-icon">🤖</div>
            <div class="stat-content">
              <div class="stat-value">{{ stats.copilotUsage }}%</div>
              <div class="stat-label">AI Usage</div>
            </div>
          </div>
        </div>

        <!-- Recent Entries -->
        <div class="info-card recent-entries">
          <div class="card-header">
            <h2 class="card-title">
              <span class="card-icon">📊</span>
              Recent Efficiency Entries
            </h2>
            <router-link to="/engineer/entry" class="btn btn-secondary">
              Add New Entry
            </router-link>
          </div>
          <div class="card-content">
            <div v-if="recentEntries.length === 0" class="empty-state">
              <div class="empty-icon">📝</div>
              <h3>No entries yet</h3>
              <p>Start tracking your efficiency gains by adding your first entry.</p>
              <router-link to="/engineer/entry" class="btn btn-primary">
                Add Your First Entry
              </router-link>
            </div>
            <div v-else class="entries-list">
              <div 
                v-for="entry in recentEntries" 
                :key="entry.id"
                class="entry-item"
              >
                <div class="entry-header">
                  <div class="entry-title">{{ entry.task_description || 'Efficiency Entry' }}</div>
                  <div class="entry-time">{{ formatDate(entry.date) }}</div>
                </div>
                <div class="entry-details">
                  <span class="entry-hours">{{ entry.time_saved || 0 }}h saved</span>
                  <span class="entry-copilot" v-if="entry.copilot_used">
                    <span class="copilot-icon">🤖</span>
                    AI Assisted
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Performance Insights -->
        <div class="info-card insights">
          <div class="card-header">
            <h2 class="card-title">
              <span class="card-icon">📈</span>
              Performance Insights
            </h2>
          </div>
          <div class="card-content">
            <div class="insights-grid">
              <div class="insight-item">
                <div class="insight-metric">{{ insights.weeklyAverage }}h</div>
                <div class="insight-label">Weekly Average</div>
                <div class="insight-trend positive" v-if="insights.weeklyTrend > 0">
                  ↗️ +{{ insights.weeklyTrend }}h from last week
                </div>
                <div class="insight-trend negative" v-else-if="insights.weeklyTrend < 0">
                  ↘️ {{ insights.weeklyTrend }}h from last week
                </div>
                <div class="insight-trend neutral" v-else>
                  ➡️ Same as last week
                </div>
              </div>
              <div class="insight-item">
                <div class="insight-metric">{{ insights.efficiency }}%</div>
                <div class="insight-label">Efficiency Rate</div>
                <div class="insight-description">
                  {{ insights.efficiencyMessage }}
                </div>
              </div>
              <div class="insight-item">
                <div class="insight-metric">{{ insights.aiUsage }}%</div>
                <div class="insight-label">AI Tool Usage</div>
                <div class="insight-description">
                  {{ insights.aiMessage }}
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
import { ref, onMounted, computed } from 'vue'
import { getEngineerDashboard } from '../services/api'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import Navigation from '../components/Navigation.vue'

export default {
  name: 'EngineerDashboard',
  components: {
    Navigation
  },
  setup() {
    const route = useRoute()
    const router = useRouter()
    const authStore = useAuthStore()
    
    const team = ref({})
    const developer = ref({})
    const stats = ref({
      totalEntries: 0,
      totalHours: 0,
      thisWeek: 0,
      copilotUsage: 0
    })
    const recentEntries = ref([])
    const insights = ref({
      weeklyAverage: 0,
      weeklyTrend: 0,
      efficiency: 0,
      efficiencyMessage: '',
      aiUsage: 0,
      aiMessage: ''
    })
    
    const loading = ref(true)
    const error = ref(null)

    // Get team and developer info from auth store first, then route params as fallback
    const getCurrentTeam = () => {
      return authStore.user?.team || route.query.team || 'Unknown Team'
    }
    
    const getCurrentDeveloper = () => {
      return authStore.user?.name || route.query.dev || 'Unknown Developer'
    }

    // Check for unknown user and redirect if needed
    const checkAndRedirectUnknownUser = () => {
      const queryTeam = route.query.team
      const queryDev = route.query.dev
      
      if (queryTeam === 'Unknown Team' || queryDev === 'Unknown Developer' || 
          (!queryTeam && team.value.name === 'Unknown Team') || 
          (!queryDev && developer.value.name === 'Unknown Developer')) {
        
        console.log('Unknown user detected, redirecting to login...')
        
        // Build redirect URL with current query params
        const redirectQuery = {
          redirect: 'dashboard',
          ...(queryTeam && { team: queryTeam }),
          ...(queryDev && { dev: queryDev })
        }
        
        router.push({
          path: '/engineer/login',
          query: redirectQuery
        })
      }
    }

    const loadDashboard = async () => {
      try {
        loading.value = true
        error.value = null
        
        const queryTeam = getCurrentTeam()
        const queryDev = getCurrentDeveloper()
        
        console.log('Loading dashboard for:', { team: queryTeam, developer: queryDev })
        
        // Call the API
        const response = await getEngineerDashboard(queryTeam, queryDev)
        console.log('Dashboard response:', response)
        
        const data = response.data || response
        
        // Update team and developer info
        team.value = {
          name: data.team_name || queryTeam || 'Unknown Team',
          description: data.team_description || 'No description available',
          developers_count: data.team_developers_count || 0
        }
        
        developer.value = {
          name: data.developer_name || queryDev || 'Unknown Developer'
        }
        
        // Check for unknown user and redirect if needed
        checkAndRedirectUnknownUser()
        
        // Use the correct field names from the API response
        const entries = data.recent_entries || []
        const totalHours = data.total_time_saved || 0
        const totalEntries = data.total_entries || 0
        const averageEfficiency = data.average_efficiency || 0
        
        // Calculate this week entries
        const thisWeekEntries = entries.filter(entry => {
          const entryDate = new Date(entry.Week || entry.Timestamp)
          const weekStart = new Date()
          weekStart.setDate(weekStart.getDate() - weekStart.getDay())
          return entryDate >= weekStart
        }).length
        
        // Calculate Copilot usage
        const copilotEntries = entries.filter(entry => entry.Copilot_Used === 'Yes').length
        const copilotUsage = entries.length > 0 ? Math.round((copilotEntries / entries.length) * 100) : 0
        
        stats.value = {
          totalEntries: totalEntries,
          totalHours: totalHours.toFixed(1),
          thisWeek: thisWeekEntries,
          copilotUsage: copilotUsage
        }
        
        // Set recent entries with proper field mapping
        recentEntries.value = entries
          .sort((a, b) => new Date(b.Timestamp || b.Week) - new Date(a.Timestamp || a.Week))
          .slice(0, 5)
          .map(entry => ({
            id: entry.Story_ID || Math.random().toString(36).substr(2, 9),
            task_description: `${entry.Story_ID || 'Entry'} - ${entry.Category || 'Task'}`,
            date: entry.Week || entry.Timestamp,
            time_saved: entry.Efficiency_Gained_Hours || 0,
            copilot_used: entry.Copilot_Used === 'Yes',
            category: entry.Category,
            notes: entry.Notes
          }))
        
        // Calculate insights with actual data
        const weeklyAverage = totalEntries > 0 ? (totalHours / Math.max(1, Math.ceil(totalEntries / 7))).toFixed(1) : 0
        const efficiency = Math.round(averageEfficiency)
        
        insights.value = {
          weeklyAverage: weeklyAverage,
          weeklyTrend: 0, // Would need historical data to calculate
          efficiency: efficiency,
          efficiencyMessage: efficiency > 80 ? 'Excellent efficiency!' : efficiency > 60 ? 'Good efficiency' : 'Room for improvement',
          aiUsage: copilotUsage,
          aiMessage: copilotUsage > 70 ? 'High AI adoption' : copilotUsage > 30 ? 'Moderate AI usage' : 'Consider using AI tools more'
        }
        
      } catch (err) {
        console.error('Failed to load dashboard:', err)
        error.value = err.response?.data?.detail || err.message || 'Failed to load dashboard'
        
        // Check for specific error cases that might indicate unknown user
        if (err.response?.status === 404) {
          checkAndRedirectUnknownUser()
        }
      } finally {
        loading.value = false
      }
    }

    const formatDate = (dateString) => {
      if (!dateString) return 'Unknown date'
      
      try {
        const date = new Date(dateString)
        return date.toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric'
        })
      } catch (err) {
        return 'Invalid date'
      }
    }

    onMounted(() => {
      loadDashboard()
    })

    return {
      team,
      developer,
      stats,
      recentEntries,
      insights,
      loading,
      error,
      getCurrentTeam,
      getCurrentDeveloper,
      loadDashboard,
      formatDate
    }
  }
}
</script>

<style scoped>
/* Engineer Dashboard Styles */
.engineer-dashboard {
  min-height: 100vh;
  background: #f8fafc;
  padding: 1rem;
}

.dashboard-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 1rem;
  padding: 2rem;
  margin-bottom: 2rem;
  color: white;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
}

.dashboard-title {
  font-size: 2rem;
  font-weight: 700;
  margin: 0;
}

.header-actions {
  display: flex;
  gap: 1rem;
}

.btn {
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  font-weight: 500;
  text-decoration: none;
  transition: all 0.2s;
  border: none;
  cursor: pointer;
}

.btn-primary {
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.3);
}

.btn-primary:hover {
  background: rgba(255, 255, 255, 0.3);
}

.btn-primary:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-secondary {
  background: white;
  color: #667eea;
  border: 1px solid #e2e8f0;
}

.btn-secondary:hover {
  background: #f1f5f9;
}

.error-message {
  background: #fee2e2;
  border: 1px solid #fecaca;
  border-radius: 0.5rem;
  padding: 1rem;
  margin-bottom: 2rem;
}

.error-content {
  display: flex;
  align-items: center;
  gap: 1rem;
  color: #dc2626;
}

.retry-btn {
  background: #dc2626;
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 0.25rem;
  border: none;
  font-size: 0.875rem;
  cursor: pointer;
}

.retry-btn:hover {
  background: #b91c1c;
}

.loading-container {
  text-align: center;
  padding: 3rem;
  color: #64748b;
}

.loading-spinner {
  width: 2rem;
  height: 2rem;
  border: 2px solid #e2e8f0;
  border-top: 2px solid #667eea;
  border-radius: 50%;
  margin: 0 auto 1rem;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.dashboard-content {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.info-card {
  background: white;
  border-radius: 1rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  border: 1px solid #e2e8f0;
  overflow: hidden;
}

.card-header {
  background: #f8fafc;
  padding: 1.5rem;
  border-bottom: 1px solid #e2e8f0;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: #1e293b;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.card-content {
  padding: 1.5rem;
}

.team-details {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
}

.detail-item {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.detail-label {
  font-size: 0.875rem;
  font-weight: 500;
  color: #64748b;
}

.detail-value {
  font-size: 1rem;
  color: #1e293b;
  font-weight: 500;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
}

.stat-card {
  background: white;
  border-radius: 1rem;
  padding: 1.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  border: 1px solid #e2e8f0;
  display: flex;
  align-items: center;
  gap: 1rem;
}

.stat-icon {
  font-size: 2rem;
  width: 3rem;
  height: 3rem;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 1rem;
  color: white;
}

.stat-content {
  flex: 1;
}

.stat-value {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 0.25rem;
}

.stat-label {
  font-size: 0.875rem;
  color: #64748b;
  font-weight: 500;
}

.empty-state {
  text-align: center;
  padding: 3rem;
  color: #64748b;
}

.empty-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.empty-state h3 {
  font-size: 1.25rem;
  color: #1e293b;
  margin-bottom: 0.5rem;
}

.empty-state p {
  margin-bottom: 1.5rem;
}

.entries-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.entry-item {
  padding: 1rem;
  border: 1px solid #e2e8f0;
  border-radius: 0.5rem;
  background: #f8fafc;
}

.entry-header {
  display: flex;
  justify-content: space-between;
  align-items: start;
  margin-bottom: 0.5rem;
}

.entry-title {
  font-weight: 600;
  color: #1e293b;
}

.entry-time {
  font-size: 0.875rem;
  color: #64748b;
}

.entry-details {
  display: flex;
  gap: 1rem;
  align-items: center;
  font-size: 0.875rem;
}

.entry-hours {
  color: #059669;
  font-weight: 500;
}

.entry-copilot {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  color: #7c3aed;
}

.insights-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
}

.insight-item {
  text-align: center;
}

.insight-metric {
  font-size: 2rem;
  font-weight: 700;
  color: #667eea;
  margin-bottom: 0.5rem;
}

.insight-label {
  font-size: 1rem;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 0.5rem;
}

.insight-trend {
  font-size: 0.875rem;
  font-weight: 500;
}

.insight-trend.positive {
  color: #059669;
}

.insight-trend.negative {
  color: #dc2626;
}

.insight-trend.neutral {
  color: #64748b;
}

.insight-description {
  font-size: 0.875rem;
  color: #64748b;
}

/* Responsive Design */
@media (max-width: 768px) {
  .engineer-dashboard {
    padding: 0.5rem;
  }
  
  .dashboard-header {
    padding: 1.5rem;
  }
  
  .dashboard-title {
    font-size: 1.5rem;
  }
  
  .header-content {
    flex-direction: column;
    align-items: stretch;
  }
  
  .stats-grid {
    grid-template-columns: 1fr;
  }
  
  .insights-grid {
    grid-template-columns: 1fr;
  }
  
  .team-details {
    grid-template-columns: 1fr;
  }
  
  .entry-header {
    flex-direction: column;
    align-items: start;
    gap: 0.5rem;
  }
}
</style> 