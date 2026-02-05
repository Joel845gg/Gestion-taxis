<template>
  <div class="dashboard-page">
    <header>
        <h2>🚕 TaxiApp</h2>
        <button @click="$router.push('/')" class="btn-logout">Salir</button>
    </header>

    <div class="main-layout">
        <!-- LEFT PANEL: Actions -->
        <div class="glass-card action-panel">
            <h1 class="title">Hola, Pasajero</h1>
            
            <!-- STEP 1: REQUEST FORM -->
            <div v-if="!activeTrip">
                <h3>📍 Nuevo Viaje</h3>
                
                <LocationInput v-model="origin" placeholder="Origen" />
                <LocationInput v-model="destination" placeholder="Destino" />
                
                <div class="fare-group">
                    <label>💰 Tu Oferta ($)</label>
                    <input type="number" v-model="fare" placeholder="Ej: 3.50" min="1" step="0.5">
                </div>
                
                <div v-if="loadingDrivers" class="loading-state">
                    <div class="spinner"></div> Buscando conductores...
                </div>

                <div v-else-if="drivers.length > 0" class="drivers-list">
                    <h4>Conductor Seleccionado:</h4>
                    <transition-group name="list">
                        <div 
                            v-for="driver in drivers" 
                            :key="driver.id" 
                            class="driver-item"
                            :class="{ selected: selectedDriverId === driver.id }"
                            @click="selectedDriverId = driver.id"
                        >
                            <div class="avatar">{{ driver.name.charAt(0) }}</div>
                            <div class="info">
                                <p class="name">{{ driver.name }}</p>
                                <p class="rating">⭐ 4.9 • 🚗 Spark GT</p>
                            </div>
                            <div class="check" v-if="selectedDriverId === driver.id">✔</div>
                        </div>
                    </transition-group>
                    <button @click="confirmTrip" :disabled="!selectedDriverId" class="btn-primary">
                        Confirmar Viaje (${{ fare }})
                    </button>
                </div>

                <div v-else class="actions-row">
                     <button @click="searchDrivers" class="btn-search">
                        🔍 Buscar Choferes
                    </button>
                     <button @click="requestAutoTrip" class="btn-link">
                        Pedir cualquiera
                    </button>
                </div>
            </div>

            <!-- ACTIVE TRIP -->
            <div v-else class="active-trip-view">
                <div class="status-header">
                    <span class="status-indicator" :class="activeTrip.status"></span> 
                    {{ activeTrip.status }}
                </div>
                <div class="trip-info">
                    <p><strong>D:</strong> {{ activeTrip.driver?.name || 'Buscando...' }}</p>
                    <p><strong>Costo:</strong> ${{ activeTrip.fare }}</p>
                    <button v-if="activeTrip.status === 'FINALIZADO'" @click="loadTrips" class="btn-primary">
                        Nuevo Viaje
                    </button>
                </div>
            </div>
        </div>

        <!-- RIGHT PANEL: Map -->
        <div class="map-panel">
            <LeafletMap :origin="origin" :destination="destination" />
        </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import LocationInput from '../components/LocationInput.vue';
import LeafletMap from '../components/LeafletMap.vue';

export default {
  components: { LocationInput, LeafletMap },
  data() {
    return {
      origin: '',
      destination: '',
      fare: '2.50',
      trips: [],
      drivers: [],
      selectedDriverId: null,
      loadingDrivers: false
    };
  },
  computed: {
      activeTrip() {
          return this.trips.find(t => ['SOLICITADO', 'ASIGNADO', 'EN_CURSO'].includes(t.status));
      }
  },
  mounted() {
    this.loadTrips();
    this.polling = setInterval(this.loadTrips, 5000);
  },
  beforeUnmount() {
      if (this.polling) clearInterval(this.polling);
  },
  methods: {
    getHeaders() {
        const token = localStorage.getItem('token');
        return { headers: { Authorization: `Bearer ${token}` } };
    },
    async searchDrivers() {
        if (!this.origin || !this.destination) return alert('Ingresa origen y destino');
        this.loadingDrivers = true;
        try {
            await new Promise(r => setTimeout(r, 1000));
            const res = await axios.get('http://localhost:3000/api/drivers/available', this.getHeaders());
            this.drivers = res.data;
            if (this.drivers.length === 0) alert('No hay conductores disponibles.');
        } catch (err) {
            alert('Error buscando conductores');
        } finally {
            this.loadingDrivers = false;
        }
    },
    async confirmTrip() {
        this.requestTrip(this.selectedDriverId);
    },
    async requestAutoTrip() {
         if (!this.origin || !this.destination) return alert('Ingresa origen y destino');
        this.requestTrip(null);
    },
    async requestTrip(driverId) {
      if (!this.fare || this.fare < 1) return alert('Ingresa una tarifa válida');
      try {
          const res = await axios.post('http://localhost:3000/api/trips', {
            origin: this.origin,
            destination: this.destination,
            driverId,
            fare: this.fare
          }, this.getHeaders());
          
          this.trips.unshift(res.data);
          this.origin = '';
          this.destination = '';
          this.drivers = [];
          this.selectedDriverId = null;
      } catch (err) {
          alert('Error al solicitar viaje');
      }
    },
    async loadTrips() {
      try {
          const res = await axios.get('http://localhost:3000/api/trips', this.getHeaders());
          this.trips = res.data.slice(0, 10); // Show last 10
      } catch (err) {}
    }
  }
};
</script>

<style scoped>
.dashboard-page { padding-bottom: 20px; }
.main-layout {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px;
}
@media (max-width: 768px) {
    .main-layout { grid-template-columns: 1fr; }
}

/* LEFT PANEL */
.action-panel { min-height: 400px; }
.title { font-size: 1.5rem; margin-bottom: 20px; }
.fare-group { margin: 15px 0; }
.fare-group label { display: block; margin-bottom: 5px; font-weight: bold; font-size: 0.9rem; }
.fare-group input { font-size: 1.2rem; font-weight: bold; color: #00d2ff; }

/* DRIVER LIST TRANSITIONS */
.list-enter-active, .list-leave-active { transition: all 0.3s ease; }
.list-enter-from, .list-leave-to { opacity: 0; transform: translateY(10px); }

.driver-item {
    display: flex; align-items: center;
    background: rgba(255,255,255,0.05);
    padding: 10px; border-radius: 10px; margin-bottom: 10px;
    cursor: pointer; border: 1px solid transparent;
}
.driver-item.selected { border-color: #00d2ff; background: rgba(0, 210, 255, 0.1); }
.avatar { width: 40px; height: 40px; border-radius: 50%; background: #6c5ce7; display: flex; align-items: center; justify-content: center; margin-right: 10px; }
.name { margin: 0; font-weight: bold; }
.rating { margin: 0; font-size: 0.8rem; color: #ccc; }
.check { margin-left: auto; color: #00d2ff; font-weight: bold; }

/* MAP PANEL */
.map-panel {
    border-radius: 20px;
    overflow: hidden;
    height: 100%;
    min-height: 400px;
}

/* ACTIVE TRIP */
.status-indicator {
    display: inline-block; width: 12px; height: 12px; border-radius: 50%; margin-right: 10px;
}
.status-indicator.SOLICITADO { background: #ffa502; box-shadow: 0 0 10px #ffa502; }
.status-indicator.ASIGNADO { background: #1e90ff; box-shadow: 0 0 10px #1e90ff; }
.status-indicator.EN_CURSO { background: #2ed573; box-shadow: 0 0 10px #2ed573; }
.btn-logout { background: transparent; border: 1px solid rgba(255,255,255,0.3); width: auto; padding: 5px 15px; }
</style>
