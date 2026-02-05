<template>
  <div class="dashboard-page">
    <header>
        <h2>Panel de Administrador</h2>
        <button @click="$router.push('/')" class="btn-logout">Salir</button>
    </header>

    <div class="stats-container">
        <!-- USERS TABLE -->
        <div class="glass-card">
            <div class="card-header">
                <h3>👥 Gestión de Usuarios</h3>
                <span class="badgex">{{ users.length }} Registrados</span>
            </div>
            
            <div class="table-responsive">
                <table>
                    <thead>
                        <tr>
                            <th>Nombre</th>
                            <th>Email</th>
                            <th>Rol</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="user in users" :key="user.id">
                            <td>
                                <div class="user-cell">
                                    <div class="avatar-small">{{ user.name.charAt(0) }}</div>
                                    {{ user.name }}
                                </div>
                            </td>
                            <td>{{ user.email }}</td>
                            <td><span :class="['role-badge', user.role]">{{ user.role }}</span></td>
                            <td>
                                <button v-if="user.role !== 'ADMIN'" @click="toggleRole(user)" class="btn-icon">
                                    🔄 Cambiar a {{ user.role === 'CLIENT' ? 'DRIVER' : 'CLIENT' }}
                                </button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>

        <!-- TRIPS TABLE -->
        <div class="glass-card">
            <div class="card-header">
                <h3>🚖 Historial Global de Viajes</h3>
                <span class="badgex">{{ trips.length }} Viajes</span>
            </div>

            <div class="table-responsive">
                <table>
                    <thead>
                        <tr>
                            <th>Fecha</th>
                            <th>Cliente</th>
                            <th>Chofer</th>
                            <th>Ruta</th>
                            <th>Estado</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="trip in trips" :key="trip.id">
                            <td>{{ new Date(trip.createdAt).toLocaleDateString() }}</td>
                            <td>{{ trip.client?.name }}</td>
                            <td>{{ trip.driver?.name || '---' }}</td>
                            <td>
                                <div class="route-cell">
                                    <span class="dot origin"></span> {{ trip.origin }}<br>
                                    <span class="dot dest"></span> {{ trip.destination }}
                                </div>
                            </td>
                            <td><span :class="['status-badge', trip.status]">{{ trip.status }}</span></td>
                        </tr>
                    </tbody>
                </table>
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
      users: [],
      trips: []
    };
  },
  mounted() {
    this.loadData();
  },
  methods: {
    getHeaders() {
        const token = localStorage.getItem('token');
        return { headers: { Authorization: `Bearer ${token}` } };
    },
    async loadData() {
        try {
            const [usersRes, tripsRes] = await Promise.all([
                axios.get('http://localhost:3000/admin/users', this.getHeaders()),
                axios.get('http://localhost:3000/admin/trips', this.getHeaders())
            ]);
            this.users = usersRes.data;
            this.trips = tripsRes.data;
        } catch (err) {
            if (err.response?.status === 401 || err.response?.status === 403) {
                 this.$router.push('/');
             }
        }
    },
    async toggleRole(user) {
        const newRole = user.role === 'CLIENT' ? 'DRIVER' : 'CLIENT';
        if (!confirm(`¿Confirma cambiar el rol de ${user.name} a ${newRole}?`)) return;
        
        try {
            await axios.patch(`http://localhost:3000/admin/users/${user.id}/role`, {
                role: newRole
            }, this.getHeaders());
            this.loadData();
        } catch (err) {
            alert('Error al cambiar rol');
        }
    }
  }
};
</script>

<style scoped>
.dashboard-page { padding-bottom: 50px; }

/* GLOBALS from Main.css are applied, adding specific overrides */
.card-header {
    display: flex; justify-content: space-between; align-items: center;
    margin-bottom: 20px; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 10px;
}
.badgex { background: rgba(255,255,255,0.1); padding: 5px 10px; border-radius: 20px; font-size: 0.8rem; }

/* TABLES */
.table-responsive { overflow-x: auto; }
table { width: 100%; border-collapse: separate; border-spacing: 0 10px; }
th { text-align: left; padding: 15px; color: #888; font-weight: 500; font-size: 0.9rem; }
td { 
    background: rgba(0,0,0,0.2); 
    padding: 15px; 
}
td:first-child { border-radius: 10px 0 0 10px; }
td:last-child { border-radius: 0 10px 10px 0; }
tr:hover td { background: rgba(255,255,255,0.05); }

/* User Cell */
.user-cell { display: flex; align-items: center; gap: 10px; font-weight: bold; }
.avatar-small {
    width: 30px; height: 30px; background: #667eea; border-radius: 50%;
    display: flex; align-items: center; justify-content: center; font-size: 0.8rem;
}

/* Badges */
.role-badge { padding: 4px 8px; border-radius: 5px; font-size: 0.75rem; font-weight: bold; }
.role-badge.ADMIN { background: #ff4757; color: white; }
.role-badge.DRIVER { background: #2ecc71; color: white; }
.role-badge.CLIENT { background: #1e90ff; color: white; }

.status-badge { padding: 4px 8px; border-radius: 5px; font-size: 0.75rem; font-weight: bold; }
.status-badge.SOLICITADO { background: #ffa502; color: black; }
.status-badge.ASIGNADO { background: #1e90ff; color: white; }
.status-badge.EN_CURSO { background: #2ed573; color: white; }
.status-badge.FINALIZADO { background: #57606f; color: white; }

.btn-icon { padding: 5px 10px; font-size: 0.8rem; background: rgba(255,255,255,0.1); width: auto; }
.btn-icon:hover { background: rgba(255,255,255,0.2); }
.btn-logout { width: auto; background: #ff4757; box-shadow: none; padding: 8px 15px; font-size: 0.9rem; }

.route-cell { font-size: 0.85rem; line-height: 1.4; color: #ccc; }
.dot { display: inline-block; width: 6px; height: 6px; border-radius: 50%; margin-right: 5px; }
.dot.origin { background: #2ed573; }
.dot.dest { background: #ff4757; }
</style>
