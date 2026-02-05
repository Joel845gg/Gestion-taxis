class TripService {
    constructor(tripRepository, userRepository, assignmentStrategy) {
        this.tripRepository = tripRepository;
        this.userRepository = userRepository;
        this.assignmentStrategy = assignmentStrategy;
    }

    async requestTrip(userId, origin, destination, driverId = null, fare = null) {
        // 1. Create Trip (SOLICITADO)
        const trip = await this.tripRepository.create({
            origin,
            destination,
            // If fare is provided (InDriver style), use it. Else default to 100.
            fare: fare ? parseFloat(fare) : 100.0,
            clientId: userId,
            status: 'SOLICITADO'
        });

        let driver = null;

        // 2a. Manual Assignment
        if (driverId) {
            driver = await this.userRepository.findById(driverId);
            if (!driver || driver.role !== 'DRIVER' || !driver.isAvailable) {
                // If selected driver is not valid, fall back to auto? 
                // Or throw error? For UX, let's fall back or just leave it SOLICITADO.
                // Decided: If manual selection fails, leave as SOLICITADO (no driver).
                driver = null;
            }
        }
        // 2b. Auto Assignment (only if no manual driver selected)
        else {
            driver = await this.assignmentStrategy.assignDriver();
        }

        if (driver) {
            return this.tripRepository.update(trip.id, {
                driverId: driver.id,
                status: 'ASIGNADO'
            });
        }

        return trip;
    }

    async updateStatus(tripId, userId, newStatus) {
        const trip = await this.tripRepository.findById(tripId);
        if (!trip) throw new Error('TRIP_NOT_FOUND');

        // Business Rules
        if (trip.driverId !== userId) throw new Error('UNAUTHORIZED_DRIVER');

        // State Machine
        const validTransitions = {
            'ASIGNADO': ['EN_CURSO', 'CANCELADO'],
            'EN_CURSO': ['FINALIZADO']
        };

        if (!validTransitions[trip.status]?.includes(newStatus)) {
            throw new Error(`INVALID_TRANSITION: ${trip.status} -> ${newStatus}`);
        }

        return this.tripRepository.update(tripId, { status: newStatus });
    }

    async getUserTrips(userId) {
        return this.tripRepository.findByUser(userId);
    }
}

module.exports = TripService;
