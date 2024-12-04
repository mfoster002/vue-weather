<template>
  <div class="hourly-forecast-container">
    <h2>Hourly Forecast</h2>
    <div v-if="hourlyData && hourlyData.length > 0">
      <Bar 
        :data="chartData" 
        :options="chartOptions" 
      />
    </div>
    <div v-else>
      <p>No hourly forecast available.</p>
    </div>
    <button @click="goBack" class="back-btn">Back</button>
  </div>
</template>

<script>
import { Bar } from 'vue-chartjs';
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
} from 'chart.js';

ChartJS.register(
  Title, 
  Tooltip, 
  Legend, 
  BarElement, 
  CategoryScale, 
  LinearScale
);

export default {
  name: 'HourlyForecast',
  components: {
    Bar,
  },
  props: {
    hourlyData: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      chartData: {
        labels: [],
        datasets: [
          {
            label: 'Hourly Temperature (°F)',
            data: [],
            backgroundColor: 'rgba(75, 192, 192, 0.6)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1,
          },
        ],
      },
      chartOptions: {
        responsive: true,
        plugins: {
          legend: {
            display: true,
            position: 'top',
          },
          title: {
            display: true,
            text: 'Hourly Temperature Forecast',
          },
        },
        scales: {
          x: {
            title: {
              display: true,
              text: 'Hour',
            },
          },
          y: {
            title: {
              display: true,
              text: 'Temperature (°F)',
            },
            beginAtZero: true,
          },
        },
      },
    };
  },
  watch: {
    hourlyData: {
      immediate: true,
      handler(newData) {
        if (newData && newData.length > 0) {
          this.processHourlyData(newData);
        }
      }
    }
  },
  methods: {
    processHourlyData(data) {
      const limitedData = data.slice(0, 12);
      
      this.chartData.labels = limitedData.map((item) => {
        const date = new Date(item.dt * 1000);
        return `${date.getHours()}:00`;
      });
      
      this.chartData.datasets[0].data = limitedData.map((item) => item.temp);
    },
  },
}
</script>

<style scoped>
.hourly-forecast-container {
  padding: 20px;
  text-align: center;
}

h2 {
  margin-bottom: 20px;
}

canvas {
  max-width: 100%;
  height: 400px;
}
</style>
