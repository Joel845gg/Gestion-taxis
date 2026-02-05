const express = require('express');
const cors = require('cors');

// Infrastructure
const PrismaTripRepository = require('./src/infrastructure/database/TripRepository');
const PrismaUserRepository = require('./src/infrastructure/database/UserRepository');

// Application
const AuthService = require('./src/application/services/AuthService');
const TripService = require('./src/application/services/TripService');
const AdminService = require('./src/application/services/AdminService');
const DriverAssignmentStrategy = require('./src/application/services/DriverAssignmentStrategy');

// Interface
const { AuthController, TripController, AdminController, UserController } = require('./src/interface/controllers');
const { authMiddleware, requireRole } = require('./src/interface/middleware/auth');

// --- DEPENDENCY INJECTION ---
const tripRepo = new PrismaTripRepository();
const userRepo = new PrismaUserRepository();
const assignmentStrategy = new DriverAssignmentStrategy(userRepo);

const authService = new AuthService(userRepo);
const tripService = new TripService(tripRepo, userRepo, assignmentStrategy);
const adminService = new AdminService(tripRepo, userRepo);

const authCtrl = AuthController(authService);
const tripCtrl = TripController(tripService);
const adminCtrl = AdminController(adminService);
const userCtrl = UserController(userRepo);

// --- SERVER SETUP ---
const app = express();
app.use(cors());
app.use(express.json());

// --- ROUTES ---
// Auth
app.post('/api/register', authCtrl.register);
app.post('/api/login', authCtrl.login);

// Users / Drivers
app.get('/api/drivers/available', authMiddleware, userCtrl.getAvailableDrivers);
app.patch('/api/drivers/availability', authMiddleware, userCtrl.toggleAvailability);

// Trips
app.post('/api/trips', authMiddleware, tripCtrl.requestTrip);
app.get('/api/trips', authMiddleware, tripCtrl.getMyTrips);
app.patch('/api/trips/:id/status', authMiddleware, requireRole('DRIVER'), tripCtrl.updateStatus);

// Admin
app.get('/admin/users', authMiddleware, requireRole('ADMIN'), adminCtrl.getAllUsers);
app.get('/admin/trips', authMiddleware, requireRole('ADMIN'), adminCtrl.getAllTrips);
app.patch('/admin/users/:id/role', authMiddleware, requireRole('ADMIN'), adminCtrl.updateUserRole);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Clean Architecture Backend running on port ${PORT}`));
