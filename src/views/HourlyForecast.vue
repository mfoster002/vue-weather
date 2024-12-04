<template>
  <div class="hourly-forecast-card">
    <h2>Hourly Forecast for {{ location }}</h2>
    <div class="chart-container" v-if="hourlyData.length">
      <Bar :data="chartData" :options="chartOptions" />
    </div>
    <p v-else>No hourly data available.</p>
    <button class="back-btn" @click="goBack">Go Back</button>
  </div>
</template>

<script>
import { Bar } from 'vue-chartjs';
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js';

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale);

export default {
  name: 'HourlyForecast',
  components: {
    Bar,
  },
  props: {
    location: {
      type: String,
      required: true
    },
    lat: {
      type: String,
      required: true
    },
    lon: {
      type: String,
      required: true
    },
  },
  data() {
    return {
      hourlyData: [],
      chartData: { labels: [], datasets: [] },
      chartOptions: { responsive: true, scales: { y: { beginAtZero: true } } },
      errorMessage: ''
    };
  },
  watch: {
    location: {
      immediate: true,
      handler() {
        this.fetchHourlyData();
      },
    },
  },
  methods: {
    fetchHourlyData() {
      const apiKey = '4df475f18aaaf4aba5fb2eb54246d4f8';
      const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${this.lat}&lon=${this.lon}&units=imperial&appid=${apiKey}`;
      
      fetch(url)
        .then((res) => res.json())
        .then((data) => {
          if (data.cod !== '200' || !data.list) {
            this.errorMessage = 'No hourly data.';
            return;
          }
          this.hourlyData = data.list.slice(0, 12).map((item) => ({
            dt: item.dt,
            temp: item.main.temp,
            time: new Date(item.dt * 1000).toLocaleTimeString(),
          }));
          this.updateChartData();
        })
        .catch((err) => {
          this.errorMessage = 'Error fetching hourly data.';
          console.error(err);
        });
    },
    updateChartData() {
      this.chartData.labels = this.hourlyData.map((data) => data.time);
      this.chartData.datasets = [
        {
          label: 'Temperature (°F)',
          data: this.hourlyData.map((data) => data.temp),
          backgroundColor: 'rgba(75, 192, 192, 0.6)',
        },
      ];
    },
    goBack() {
      this.$router.go(-1);
    },
  },
};
</script>

<style scoped>
.hourly-forecast-card {
  background-color: #ffffffe6;
  border-radius: 8px;
  box-shadow: 3px 6px #00000040;
  padding: 20px;
  text-align: center;
}

.back-btn {
  margin-top: 20px;
  padding: 10px 20px;
  background-color: #008CBA;
  color: #ffffff;
  border: none;
  border-radius: 5px;
}

.back-btn:hover {
  background-color: #007399;
}

.error-message {
  color: #ff0000;
  margin-top: 20px;
}

.chart-container {
  margin-top: 20px;
}
</style>






