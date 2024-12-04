<template>
  <div>
    <FiveDayForecast :location="location" />
  </div>
</template>

<script>
import FiveDayForecast from "@/components/FiveDayForecast.vue";

export default {
  name: "FiveDayView",
  components: {
    FiveDayForecast,
  },
  props: {
    location: {
      type: String,
      required: true,
    },
  },
};
</script>

