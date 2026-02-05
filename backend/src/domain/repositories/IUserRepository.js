class IUserRepository {
    create(data) { throw new Error('Not implemented'); }
    findByEmail(email) { throw new Error('Not implemented'); }
    findById(id) { throw new Error('Not implemented'); }
    updateAvailability(id, isAvailable) { throw new Error('Not implemented'); }
    findAvailableDriver() { throw new Error('Not implemented'); } // Single (auto)
    findAvailableDrivers() { throw new Error('Not implemented'); } // List (manual)
    findAll() { throw new Error('Not implemented'); }
    update(id, data) { throw new Error('Not implemented'); }
}

module.exports = IUserRepository;
