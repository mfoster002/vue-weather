import { createRouter, createWebHistory } from 'vue-router';
import HomeView from "@/views/HomeView.vue";
import FiveDayView from '@/views/FiveDayView.vue';
import HourlyForecast from '@/views/HourlyForecast.vue';
import MySavedLocations from '@/views/MySavedLocations.vue';

const routes = [
  {
    path: "/",
    name: "Home",
    component: HomeView,
  },
  {
    path: "/forecast/five-day/:location",
    name: "FiveDay",
    component: FiveDayView,
    props: true, 
  },
  {
    path: "/forecast/hourly",
    name: "HourlyForecast",
    component: HourlyForecast,
    props: route => ({
      lat: route.query.lat,
      lon: route.query.lon,
      location: route.query.location
    }),
  },
  {
    path: "/saved-locations",
    name: "MySavedLocations",
    component: MySavedLocations,
  },
];


const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;





















