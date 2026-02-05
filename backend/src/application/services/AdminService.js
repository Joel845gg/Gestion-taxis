class AdminService {
    constructor(tripRepository, userRepository) {
        this.tripRepository = tripRepository;
        this.userRepository = userRepository;
    }

    async getAllTrips() {
        return this.tripRepository.findAll();
    }

    async getAllUsers() {
        return this.userRepository.findAll();
    }

    async updateUserRole(id, role) {
        return this.userRepository.update(id, { role });
    }
}

module.exports = AdminService;
