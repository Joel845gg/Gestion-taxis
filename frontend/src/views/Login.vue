<template>
  <div class="center-screen">
    <div class="glass-card login-card">
      <div class="logo-area">
        <h1>🚖</h1>
        <h2>Taxi App</h2>
        <p>Bienvenido de nuevo</p>
      </div>

      <form @submit.prevent="login">
        <div class="form-group">
            <input v-model="email" type="email" placeholder="Correo Electrónico" required>
        </div>
        <div class="form-group">
            <input v-model="password" type="password" placeholder="Contraseña" required>
        </div>
        <button type="submit" class="btn-primary">Iniciar Sesión</button>
      </form>

      <div class="footer-links">
        <p>¿No tienes cuenta?</p>
        <RouterLink to="/register" class="link">Regístrate aquí</RouterLink>
      </div>
    </div>
  </div>
</template>

<script>
import api from '../config/api';

export default {
  data() {
    return {
      email: '',
      password: ''
    };
  },
  methods: {
    async login() {
      try {
        const res = await api.post('/api/login', {
          email: this.email,
          password: this.password
        });
        
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('user', JSON.stringify(res.data.user));
        
        const role = res.data.user.role;
        const routes = { 'ADMIN': '/admin', 'DRIVER': '/driver', 'CLIENT': '/client' };
        this.$router.push(routes[role] || '/client');
        
      } catch (err) {
        alert(err.response?.data?.error || 'Error al iniciar sesión');
      }
    }
  }
};
</script>

<style scoped>
.logo-area { margin-bottom: 2rem; }
.logo-area h1 { font-size: 3rem; margin: 0; }
.logo-area h2 { margin: 10px 0 5px; font-weight: 700; color: white; }
.logo-area p { color: rgba(255,255,255,0.6); margin: 0; font-size: 0.9rem; }

.footer-links { margin-top: 2rem; font-size: 0.9rem; color: #aaa; }
.link { color: #00d2ff; text-decoration: none; font-weight: bold; margin-left: 5px; }
.link:hover { text-decoration: underline; }
</style>
