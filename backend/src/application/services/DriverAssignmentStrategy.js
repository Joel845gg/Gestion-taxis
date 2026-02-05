class DriverAssignmentStrategy {
    constructor(userRepository) {
        this.userRepository = userRepository;
    }

    async assignDriver() {
        return this.userRepository.findAvailableDriver();
    }
}

module.exports = DriverAssignmentStrategy;
