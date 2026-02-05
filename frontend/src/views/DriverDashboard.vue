<template>
  <div class="dashboard-page">
    <header>
        <h2>🚕 Panel Conductor</h2>
        <div class="header-actions">
           <div class="status-toggle" :class="{ active: isAvailable }" @click="toggleAvailability">
                <span class="indicator"></span>
                {{ isAvailable ? 'Disponible' : 'Ocupado' }}
           </div>
           <button @click="$router.push('/')" class="btn-logout">Salir</button>
        </div>
    </header>

    <div class="container-driver">
        <!-- NO TRIPS -->
        <div v-if="trips.length === 0" class="empty-state glass-card">
            <div class="icon">💤</div>
            <h3>Esperando viajes...</h3>
            <p>Mantente disponible para recibir ofertas.</p>
        </div>

        <!-- TRIP LIST -->
        <div class="trips-grid">
            <div v-for="trip in trips" :key="trip.id" class="trip-card glass-card" :class="trip.status">
                <div class="trip-header">
                    <span class="price-tag">${{ trip.fare }}</span>
                    <span class="status-badge" :class="trip.status">{{ trip.status }}</span>
                </div>
                
                <div class="trip-body">
                    <div class="route-line">
                        <span class="dot origin"></span> 
                        <div class="address">
                            <label>Recoger en</label>
                            <h4>{{ trip.origin }}</h4>
                        </div>
                    </div>
                    <div class="connector"></div>
                    <div class="route-line">
                        <span class="dot dest"></span> 
                         <div class="address">
                            <label>Llevar a</label>
                            <h4>{{ trip.destination }}</h4>
                        </div>
                    </div>
                </div>

                <div class="client-info">
                   <div class="avatar">{{ trip.client?.name.charAt(0) }}</div>
                   <div class="details">
                       <p class="name">{{ trip.client?.name }}</p>
                       <p class="rating">Pasajero ⭐ 5.0</p>
                   </div>
                </div>

                <div class="actions">
                    <button v-if="trip.status === 'ASIGNADO'" @click="updateStatus(trip.id, 'EN_CURSO')" class="btn-action start">
                        ▶ Iniciar Viaje
                    </button>
                    <button v-if="trip.status === 'EN_CURSO'" @click="updateStatus(trip.id, 'FINALIZADO')" class="btn-action finish">
                        🏁 Finalizar
                    </button>
                    <div v-if="trip.status === 'FINALIZADO'" class="completed-msg">
                        ¡Viaje Completado!
                    </div>
                </div>
            </div>
        </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      trips: [],
      isAvailable: true,
      polling: null
    };
  },
  mounted() {
    this.checkAvailability();
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
    async checkAvailability() {
         const user = JSON.parse(localStorage.getItem('user'));
         // Ideally fetch fresh user data, but for now we assume session is fresh enough or set default
         if (user) this.isAvailable = user.isAvailable !== false; // Default true if undefined
    },
    async toggleAvailability() {
        const newStatus = !this.isAvailable;
        try {
            await axios.patch('http://localhost:3000/api/drivers/availability', { isAvailable: newStatus }, this.getHeaders());
            this.isAvailable = newStatus;
            
            // Update local user to persist state across refreshes locally (optional but good UX)
            const user = JSON.parse(localStorage.getItem('user'));
            user.isAvailable = newStatus;
            localStorage.setItem('user', JSON.stringify(user));
            
        } catch (err) {
            alert('Error actualizando disponibilidad');
        }
    },
    async loadTrips() {
      try {
          const res = await axios.get('http://localhost:3000/api/trips', this.getHeaders());
          this.trips = res.data;
      } catch (err) {
          if (err.response?.status === 401) {
              clearInterval(this.polling);
              this.$router.push('/');
          }
      }
    },
    async updateStatus(tripId, status) {
        try {
            await axios.patch(`http://localhost:3000/api/trips/${tripId}/status`, { status }, this.getHeaders());
            this.loadTrips();
        } catch (err) {
            alert('Error actualizando estado');
        }
    }
  }
};
</script>

<style scoped>
.container-driver { max-width: 600px; margin: 0 auto; }
.header-actions { display: flex; align-items: center; gap: 15px; }

/* TOGGLE SWITCH */
.status-toggle {
    background: rgba(0,0,0,0.3); padding: 8px 15px; border-radius: 20px;
    display: flex; align-items: center; cursor: pointer; transition: all 0.3s;
    border: 1px solid rgba(255,255,255,0.1); font-size: 0.9rem; font-weight: bold;
}
.status-toggle .indicator {
    width: 10px; height: 10px; border-radius: 50%; background: #555; margin-right: 8px;
    box-shadow: 0 0 5px rgba(0,0,0,0.5); transition: all 0.3s;
}
.status-toggle.active { background: rgba(46, 213, 115, 0.2); border-color: #2ed573; color: #2ed573; }
.status-toggle.active .indicator { background: #2ed573; box-shadow: 0 0 10px #2ed573; }

.empty-state { text-align: center; padding: 40px; opacity: 0.7; }
.empty-state .icon { font-size: 3rem; margin-bottom: 10px; }

/* TRIP CARD */
.trip-card { padding: 0; overflow: hidden; position: relative; transition: transform 0.3s; }
.trip-card:hover { transform: translateY(-5px); }
.trip-card.FINALIZADO { opacity: 0.6; filter: grayscale(0.8); }

.trip-header {
    background: rgba(0,0,0,0.2); padding: 15px 20px;
    display: flex; justify-content: space-between; align-items: center;
}
.price-tag { font-size: 1.5rem; font-weight: 800; color: #2ed573; }
.status-badge { padding: 4px 10px; border-radius: 12px; font-size: 0.75rem; font-weight: bold; background: #666; color: white; }
.status-badge.SOLICITADO { background: #ffa502; color: black; }
.status-badge.ASIGNADO { background: #1e90ff; }
.status-badge.EN_CURSO { background: #ff4757; animation: pulse 2s infinite; }

.trip-body { padding: 20px; position: relative; }
.route-line { display: flex; gap: 15px; position: relative; z-index: 1; }
.connector { 
    width: 2px; height: 35px; background: rgba(255,255,255,0.2); 
    margin-left: 6px; margin-top: -5px; margin-bottom: -5px;
}
.dot { width: 14px; height: 14px; border-radius: 50%; margin-top: 5px; flex-shrink: 0; }
.dot.origin { background: #2ed573; border: 2px solid white; }
.dot.dest { background: #ff4757; border: 2px solid white; }

.address label { font-size: 0.75rem; color: #aaa; text-transform: uppercase; letter-spacing: 1px; }
.address h4 { margin: 2px 0 0; font-size: 1rem; font-weight: 500; }

.client-info {
    padding: 15px 20px; border-top: 1px solid rgba(255,255,255,0.05);
    display: flex; align-items: center; gap: 15px;
}
.avatar { 
    width: 40px; height: 40px; border-radius: 50%; background: linear-gradient(45deg, #FF9A9E, #FECFEF);
    display: flex; align-items: center; justify-content: center; font-weight: bold; color: #333;
}
.client-info .name { margin: 0; font-weight: bold; }
.client-info .rating { margin: 0; font-size: 0.8rem; color: #aaa; }

.actions { padding: 20px; border-top: 1px solid rgba(255,255,255,0.05); }
.btn-action { width: 100%; padding: 15px; font-size: 1.1rem; border-radius: 12px; font-weight: bold; border: none; cursor: pointer; transition: all 0.2s; }
.btn-action:hover { transform: scale(1.02); }
.btn-action.start { background: linear-gradient(45deg, #1e90ff, #00d2ff); color: white; box-shadow: 0 5px 15px rgba(30, 144, 255, 0.3); }
.btn-action.finish { background: linear-gradient(45deg, #ff4757, #ff6b81); color: white; box-shadow: 0 5px 15px rgba(255, 71, 87, 0.3); }
.completed-msg { text-align: center; color: #2ed573; font-weight: bold; font-size: 1.2rem; }

@keyframes pulse { 0% { opacity: 1; } 50% { opacity: 0.7; } 100% { opacity: 1; } }
</style>
