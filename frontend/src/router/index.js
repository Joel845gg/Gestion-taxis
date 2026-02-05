import { createRouter, createWebHistory } from 'vue-router'
import Login from '../views/Login.vue'
import Register from '../views/Register.vue'
import ClientDashboard from '../views/ClientDashboard.vue'
import DriverDashboard from '../views/DriverDashboard.vue'
import AdminDashboard from '../views/AdminDashboard.vue'

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            name: 'login',
            component: Login
        },
        {
            path: '/register',
            name: 'register',
            component: Register
        },
        {
            path: '/client',
            name: 'client',
            component: ClientDashboard
        },
        {
            path: '/driver',
            name: 'driver',
            component: DriverDashboard
        },
        {
            path: '/admin',
            name: 'admin',
            component: AdminDashboard
        }
    ]
})

export default router
