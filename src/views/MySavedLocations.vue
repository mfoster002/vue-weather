<template>
  <div class="saved-locations-container">
    <h2>My Saved Locations</h2>
    
    <div v-if="savedLocations.length === 0" class="no-locations">
      <p>You haven't saved any locations yet.</p>
    </div>
    
    <div v-else class="locations-grid">
      <div 
        v-for="(location, index) in savedLocations" 
        :key="index" 
        class="location-card"
      >
        <div class="location-header">
          <h3>{{ location.name }}, {{ location.country }}</h3>
          <button 
            @click="removeLocation(index)" 
            class="remove-btn"
            title="Remove Location"
          >
            ✕
          </button>
        </div>
        
        <div class="location-details">
          <p class="temperature">{{ Math.round(location.temp) }}°F</p>
          <p class="weather-description">{{ location.weather }}</p>
        </div>
      </div>
    </div>

    <!-- Back Button -->
    <button 
      @click="$router.push('/')" 
      class="back-btn"
    >
      Back
    </button>
  </div>
</template>

<script>
export default {
  name: "MySavedLocations",
  data() {
    return {
      savedLocations: [], 
    };
  },
  created() {
    this.loadSavedLocations(); 
  },
  methods: {
    loadSavedLocations() {
      const saved = localStorage.getItem("savedLocations");
      this.savedLocations = saved ? JSON.parse(saved) : [];
    },
    removeLocation(index) {
      this.savedLocations.splice(index, 1);
      localStorage.setItem("savedLocations", JSON.stringify(this.savedLocations));
    },
    viewForecast(location) {
      this.$router.push({
        name: "FiveDayForecast",
        params: { location },
      });
    },
    viewHourlyForecast(location) {
      this.$router.push({
        name: "HourlyForecast",
        params: { 
          location: location.name,
          lat: location.lat.toString(),
          lon: location.lon.toString(),
        },
      });
    },
  },
};
</script>

<style scoped>
.saved-locations-container {
  padding: 20px;
  background-color: rgba(255, 255, 255, 0.8);
  border-radius: 8px;
  max-width: 900px;
  margin: 0 auto;
  text-align: center;
}

h2 {
  margin-bottom: 20px;
  color: #333;
}

.no-locations {
  color: #666;
  font-style: italic;
}

.locations-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
  padding: 20px 0;
}

.location-card {
  background-color: rgba(255, 255, 255, 0.9);
  border-radius: 8px;
  box-shadow: 3px 6px rgba(0, 0, 0, 0.25);
  padding: 15px;
}

.location-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #eee;
  padding-bottom: 10px;
}

.remove-btn {
  background-color: #ff4d4d;
  color: white;
  border: none;
  border-radius: 50%;
  width: 25px;
  height: 25px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.location-details {
  margin: 15px 0;
}

.temperature {
  font-size: 27px;
  font-weight: bold;
  color: #333;
}

.weather-description {
  color: #434040;
  text-transform: capitalize;
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
  background-color: #007399;
}
</style>
