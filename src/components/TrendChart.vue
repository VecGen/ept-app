<template>
  <div class="chart-container">
    <canvas :id="chartId" :width="width" :height="height"></canvas>
  </div>
</template>

<script>
import { onMounted, onUnmounted, watch, ref } from 'vue'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  LineController,
  BarController,
  DoughnutController,
  PieController,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from 'chart.js'

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  LineController,
  BarController,
  DoughnutController,
  PieController,
  Title,
  Tooltip,
  Legend,
  ArcElement
)

export default {
  name: 'TrendChart',
  props: {
    chartId: {
      type: String,
      required: true
    },
    type: {
      type: String,
      default: 'line',
      validator: (value) => ['line', 'bar', 'doughnut', 'pie'].includes(value)
    },
    data: {
      type: Object,
      required: true
    },
    options: {
      type: Object,
      default: () => ({})
    },
    width: {
      type: Number,
      default: 400
    },
    height: {
      type: Number,
      default: 200
    }
  },
  setup(props) {
    const chart = ref(null)

    const defaultOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'top',
        },
        tooltip: {
          mode: 'index',
          intersect: false,
        }
      },
      scales: props.type === 'line' || props.type === 'bar' ? {
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
      } : {}
    }

    const createChart = () => {
      const ctx = document.getElementById(props.chartId)
      if (ctx && props.data.datasets && props.data.datasets.length > 0) {
        chart.value = new ChartJS(ctx, {
          type: props.type,
          data: props.data,
          options: { ...defaultOptions, ...props.options }
        })
      }
    }

    const destroyChart = () => {
      if (chart.value) {
        chart.value.destroy()
        chart.value = null
      }
    }

    const updateChart = () => {
      if (chart.value && props.data.datasets && props.data.datasets.length > 0) {
        chart.value.data = props.data
        chart.value.update()
      } else {
        destroyChart()
        createChart()
      }
    }

    onMounted(() => {
      createChart()
    })

    onUnmounted(() => {
      destroyChart()
    })

    watch(() => props.data, () => {
      updateChart()
    }, { deep: true })

    return {
      chart
    }
  }
}
</script>

<style scoped>
.chart-container {
  position: relative;
  height: 100%;
  width: 100%;
}
</style> 