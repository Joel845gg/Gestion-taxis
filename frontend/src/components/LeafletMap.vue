<template>
  <div id="map" class="map-container"></div>
</template>

<script>
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

export default {
  props: ['origin', 'destination'],
  data() {
    return {
      map: null,
      markers: []
    };
  },
  mounted() {
    this.initMap();
  },
  methods: {
    initMap() {
        // Center on Quito, Ecuador by default
        this.map = L.map('map').setView([-0.1807, -78.4678], 13);
        
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors'
        }).addTo(this.map);
    }
  }
};
</script>

<style scoped>
.map-container {
    width: 100%;
    height: 300px;
    border-radius: 15px;
    margin-bottom: 20px;
    border: 1px solid rgba(255, 255, 255, 0.2);
    box-shadow: 0 4px 15px rgba(0,0,0,0.3);
    z-index: 1; /* Ensure it stays below dropdowns if any */
}
</style>
