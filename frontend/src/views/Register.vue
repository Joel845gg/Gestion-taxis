<template>
  <div class="center-screen">
    <div class="glass-card login-card">
      <div class="logo-area">
        <h1>✨</h1>
        <h2>Crear Cuenta</h2>
        <p>Únete a la mejor red de taxis</p>
      </div>

      <form @submit.prevent="register">
        <div class="form-group">
            <input v-model="name" type="text" placeholder="Nombre Completo" required>
        </div>
        <div class="form-group">
            <input v-model="email" type="email" placeholder="Correo Electrónico" required>
        </div>
        <div class="form-group">
            <input v-model="password" type="password" placeholder="Contraseña" required>
        </div>
        <div class="form-group">
            <select v-model="role">
                <option value="CLIENT">👤 Pasajero</option>
                <option value="DRIVER">🚕 Conductor</option>
            </select>
        </div>
        <button type="submit" class="btn-primary">Registrarse</button>
      </form>

      <div class="footer-links">
        <p>¿Ya tienes cuenta?</p>
        <RouterLink to="/" class="link">Inicia Sesión</RouterLink>
      </div>
    </div>
  </div>
</template>

<script>
import api from '../config/api';

export default {
  data() {
    return {
      name: '',
      email: '',
      password: '',
      role: 'CLIENT'
    };
  },
  methods: {
    async register() {
      try {
        await api.post('/api/register', {
          name: this.name,
          email: this.email,
          password: this.password,
          role: this.role
        });
        alert('Cuenta creada exitosamente');
        this.$router.push('/');
      } catch (err) {
        alert(err.response?.data?.error || 'Error al registrarse');
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
