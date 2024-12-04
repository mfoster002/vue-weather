<template>
  <div :class="weatherClass" id="app">
    <main>
      <!-- Search Bar -->
      <div class="search-box">
        <input
          type="text"
          class="search-bar"
          placeholder="Search..."
          v-model="query"
          @keypress.enter="fetchWeather"
        />
      </div>
      <!-- Save the current location button -->
      <button v-if="weather.main && $route.name === 'Home'" class="save-location-btn" @click="saveLocation">
  Save Location
</button>
     
      <div v-if="errorMessage" class="error-message">{{ errorMessage }}</div>

      <div 
        v-if="weather.main && !errorMessage && $route.name === 'Home'" 
        class="weather-wrap"
      >
        <div class="location-box">
          <div class="location">
            {{ weather.name }}, {{ geoData.state }}, {{ weather.sys.country }}
          </div>
          <div class="date">{{ dateBuilder() }}</div>
        </div>
        <div class="weather-box">
          <div class="temp">{{ Math.round(weather.main.temp) }}°F</div>
          <div class="weather">{{ weather.weather[0].main }}</div>
        </div>
       
        <!-- Nav Buttons -->
        <div class="nav-buttons">
          <button class="button-nav" @click="goToMySavedLocations">View Saved Locations</button>
          <button class="button-nav" @click="goToHourlyForecast">View Hourly Forecast</button>
          <button class="button-nav" @click="goToFiveDayView">View 5-Day Forecast</button>
        </div>
      </div>
      <router-view></router-view>
    </main>
  </div>
</template>

<script>
export default {
  name: "App",
  data() {
    return {
      api_key: "4df475f18aaaf4aba5fb2eb54246d4f8",
      url_base: "https://api.openweathermap.org/data/2.5/",
      query: "",
      weather: {},
      geoData: {},
      savedLocations: [],
      errorMessage: "",
    };
  },
  computed: {
    weatherClass() {
      if (!this.weather.weather) return "default";
      const weatherCondition = this.weather.weather[0].main.toLowerCase();
      const conditionMap = {
        clear: "clear",
        clouds: "clouds",
        rain: "rain",
        drizzle: "drizzle",
        thunderstorm: "thunderstorm",
        snow: "snow",
        mist: "mist",
      };
      return conditionMap[weatherCondition] || "default";
    },
  },
  methods: {
    fetchWeather() {
      if (this.query.trim() !== "") {
        this.errorMessage = "";
        fetch(
          `${this.url_base}weather?q=${this.query}&units=imperial&appid=${this.api_key}`
        )
          .then((res) => res.json())
          .then((data) => {
            if (data.cod !== 200) {
              this.errorMessage = "Location not found. Please try again.";
              return;
            }
            this.weather = data;
            this.fetchGeoData();
          })
          .catch((err) => {
            this.errorMessage = "Error fetching weather data. Please try again.";
            console.error(err);
          });
      }
    },

    fetchGeoData() {
      fetch(
        `https://api.openweathermap.org/geo/1.0/direct?q=${this.weather.name}&limit=1&appid=${this.api_key}`
      )
        .then((res) => res.json())
        .then((data) => {
          if (data.length > 0) {
            const { name, state, country } = data[0];
            this.geoData = { name, state, country };
          }
        })
        .catch((err) => {
          console.error("Error fetching geo data:", err);
          this.errorMessage = "Error fetching geo data.";
        });
    },

    saveLocation() {
      if (!this.weather.name) return;

      const saved = localStorage.getItem("savedLocations");
      const savedLocations = saved ? JSON.parse(saved) : [];

      const exists = savedLocations.find(
        (loc) => loc.name === this.weather.name && loc.country === this.weather.sys.country
      );

      if (!exists) {
        const newLocation = {
          name: this.weather.name,
          country: this.weather.sys.country,
          temp: this.weather.main.temp,
          weather: this.weather.weather[0].main,
        };
        savedLocations.push(newLocation);
        
        localStorage.setItem("savedLocations", JSON.stringify(savedLocations));
      }
    },

    dateBuilder() {
      const now = new Date();
      const options = { weekday: "long", year: "numeric", month: "long", day: "numeric" };
      return now.toLocaleDateString("en-US", options);
    },

    goToMySavedLocations() {
      this.$router.push({ name: "MySavedLocations" });
    },

    goToHourlyForecast() {
      if (this.weather.coord && this.weather.coord.lat && this.weather.coord.lon) {
        const lat = this.weather.coord.lat.toString();
        const lon = this.weather.coord.lon.toString();
        
        this.$router.push({
          name: "HourlyForecast",
          query: { lat, lon, location: this.weather.name },
        });
      } else {
        this.errorMessage = "Error, no hourly data"
      }
    },

    goToFiveDayView() {
      if (this.weather && this.weather.name) {
        this.$router.push({
          name: "FiveDay",
          params: { location: this.weather.name },
        });
      } else {
        this.errorMessage = "Weather data is incomplete. Please try again.";
      }
    },
  },
  
  mounted() {
    const saved = localStorage.getItem("savedLocations");
    this.savedLocations = saved ? JSON.parse(saved) : [];
  },
};
</script>
<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'montserrat', sans-serif;
}

#app {
  background-image: url('./assets/default.jpg');
  background-size: cover;
  background-position: bottom;
  transition: 0.4s;
}

#app.default {
  background-image: url('./assets/default.jpg');
}

#app.clouds {
  background-image: url('./assets/cloudy.jpg');
}

#app.clear {
  background-image: url('./assets/sunny.jpg');
}

#app.mist {
  background-image: url('./assets/fog.jpg');
}

#app.snow {
  background-image: url('./assets/snow.jpg');
}

#app.rain {
  background-image: url('./assets/rain.jpg');
}

#app.drizzle {
  background-image: url('./assets/drizzle.jpg');
}

#app.thunderstorm {
  background-image: url('./assets/thunderstorm.jpg');
}

.save-location-btn {
  display: block;
  font-size: 15px;
  background-color: #FFF;
  color:  #012e3c;
  margin: 10px auto;
  margin-bottom: 30px;
  padding: 10px;
  border: 3px solid #012e3c;
  border-radius: 5px;
}

.save-location-btn:hover {
  background-color: #ffffffb7;
}

.nav-buttons {
  display: flex;
  justify-content: center;
  gap:10px;
  margin-top: 25px;
}

.button-nav {
  font-size: 15px;
  background-color: #FFF;
  color:  #012e3c;
  padding: 10px;
  border: 3px solid #012e3c;
  border-radius: 5px;
}

.button-nav:hover {
  background-color: #ffffffb7;
}

main {
  min-height: 100vh;
  padding: 25px;

  background-image: linear-gradient(to bottom, #00000040, #000000bf);
}

.search-box {
  width: 100%;
  margin-bottom: 30px;
}

.search-box .search-bar {
  display: block;
  width: 100%;
  padding: 15px;
  
  color: #313131;
  font-size: 20px;

  appearance: none;
  border:none;
  outline: none;
  background: none;

  box-shadow: 0px 0px 8px #00000040;
  background-color: #ffffff80;
  border-radius: 0px 16px 0px 16px;
  transition: 0.4s;
}

.search-box .search-bar:focus {
  box-shadow: 0px 0px 16px #00000040;
  background-color: #ffffffbf;
  border-radius: 16px 0px 16px 0px;
}

.location-box .location {
  color: #FFF;
  font-size: 32px;
  font-weight: 500;
  text-align: center;
  text-shadow: 1px 3px rgba(0, 0, 0, 0.25);
}

.location-box .date {
  color: #FFF;
  font-size: 20px;
  font-weight: 300;
  font-style: italic;
  text-align: center;
}

.weather-box {
  text-align: center;
}

.weather-box .temp {
  display: inline-block;
  padding: 10px 25px;
  color: #FFF;
  font-size: 102px;
  font-weight: 900;

  text-shadow: 3px 6px #00000040;
  background-color:#ffffff40;
  border-radius: 16px;
  margin: 30px 0px;

  box-shadow: 3px 6px #00000040;
}

.weather-box .weather {
  color: #FFF;
  font-size: 48px;
  font-weight: 700;
  font-style: italic;
  text-shadow: 3px 6px rgba(0, 0, 0, 0.25);
}
</style>