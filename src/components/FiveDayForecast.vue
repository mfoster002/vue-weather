<template>
  <div>
    <div v-if="forecastData.length" class="forecast-table-card">
      <h2>{{ location }}'s 5 Day Forecast</h2>
      <table>
        <thead>
          <tr>
            <th>Day</th>
            <th>Weather</th>
            <th>High (°F)</th>
            <th>Low (°F)</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="day in forecastData" :key="day.date">
            <td>{{ day.date }}</td>
            <td>{{ day.weather }}</td>
            <td>{{ day.high }}</td>
            <td>{{ day.low }}</td>
          </tr>
        </tbody>
      </table>
      <button class="back-btn" @click="goBack">Go Back</button>
    </div>
  </div>
</template>
<script>
export default {
  name: "FiveDayForecast",
  props: {
    location: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      forecastData: [],
      errorMessage: "",
    };
  },
  mounted() {
    this.fetchForecastData();
  },
  methods: {
    fetchForecastData() {
      const apiKey = "4df475f18aaaf4aba5fb2eb54246d4f8";
      const url = `https://api.openweathermap.org/data/2.5/forecast?q=${this.location}&units=imperial&appid=${apiKey}`;

      fetch(url)
        .then((response) => response.json())
        .then((data) => {
          if (data.cod !== "200" || !data.list) {
            this.errorMessage = "Unable to fetch forecast data.";
            return;
          }
          const dailyData = data.list.filter((reading) =>
            reading.dt_txt.includes("18:00:00")
          );
          this.forecastData = dailyData.map((item) => ({
            date: new Date(item.dt * 1000).toLocaleDateString("en-US", {
              weekday: "long",
            }),
            weather: item.weather[0].main,
            high: item.main.temp_max,
            low: item.main.temp_min,
          }));
        })
        .catch((error) => {
          console.error(error);
          this.errorMessage = "Error fetching forecast data.";
        });
    },
    goBack() {
      if (window.history.length > 1) {
        this.$router.push("/");
      }
    },
  },
};
</script>



<style scoped>
h2 {
  padding: 10px;
}
.forecast-table-card {
  background-color: #ffffffe6;
  border-radius: 8px;
  box-shadow: 3px 6px #00000040;  padding: 20px;
  text-align: center;
  margin-top: 20px;
}

table {
  width: 100%;
  border-collapse: collapse;
}
th, td {
  padding: 10px;
  text-align: center;
  border: 1px solid #ddd;
}
thead {
  background-color: #f2f2f2;
}
tbody tr:nth-child(even) {
  background-color: #f9f9f9;
}
 .back-btn {
  margin-top: 20px;
  padding: 10px 20px;
  background-color: #008CBA;
  color: white;
  border: none;
  border-radius: 5px;
}
.back-btn:hover {
  background-color: #005f73;
}
</style>