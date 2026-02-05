const { registerSchema, loginSchema, tripRequestSchema, statusUpdateSchema } = require('../middleware/validation');

// --- AUTH CONTROLLER ---
const AuthController = (authService) => ({
    register: async (req, res) => {
        try {
            const data = registerSchema.parse(req.body);
            const result = await authService.register(data);
            res.json(result);
        } catch (err) {
            res.status(400).json({ error: err.message || err.errors });
        }
    },
    login: async (req, res) => {
        try {
            const { email, password } = loginSchema.parse(req.body);
            const result = await authService.login(email, password);
            res.json(result);
        } catch (err) {
            res.status(401).json({ error: err.message });
        }
    }
});

// --- TRIP CONTROLLER ---
const TripController = (tripService) => ({
    requestTrip: async (req, res) => {
        try {
            const { origin, destination, driverId, fare } = req.body;
            const trip = await tripService.requestTrip(req.user.id, origin, destination, driverId, fare);
            res.json(trip);
        } catch (err) {
            res.status(400).json({ error: err.message || err.errors });
        }
    },
    updateStatus: async (req, res) => {
        try {
            const { status } = statusUpdateSchema.parse(req.body);
            const trip = await tripService.updateStatus(req.params.id, req.user.id, status);
            res.json(trip);
        } catch (err) {
            res.status(400).json({ error: err.message });
        }
    },
    getMyTrips: async (req, res) => {
        try {
            console.log('Fetching trips for user:', req.user.id);
            const trips = await tripService.getUserTrips(req.user.id);
            res.json(trips);
        } catch (err) {
            console.error('Error in getMyTrips:', err);
            res.status(500).json({ error: err.message });
        }
    }
});

// --- USER CONTROLLER ---
const UserController = (userRepository) => ({
    getAvailableDrivers: async (req, res) => {
        try {
            const drivers = await userRepository.findAvailableDrivers();
            res.json(drivers);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },
    toggleAvailability: async (req, res) => {
        try {
            const { isAvailable } = req.body;
            const user = await userRepository.updateAvailability(req.user.id, isAvailable);
            res.json(user);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }
});

// --- ADMIN CONTROLLER ---
const AdminController = (adminService) => ({
    getAllTrips: async (req, res) => {
        const trips = await adminService.getAllTrips();
        res.json(trips);
    },
    getAllUsers: async (req, res) => {
        const users = await adminService.getAllUsers();
        res.json(users);
    },
    updateUserRole: async (req, res) => {
        const result = await adminService.updateUserRole(req.params.id, req.body.role);
        res.json(result);
    }
});

module.exports = { AuthController, TripController, AdminController, UserController };
