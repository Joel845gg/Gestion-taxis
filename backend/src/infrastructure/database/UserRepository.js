const IUserRepository = require('../../domain/repositories/IUserRepository');
const prisma = require('./prisma');

class PrismaUserRepository extends IUserRepository {
    async create(data) {
        return prisma.user.create({ data });
    }

    async findByEmail(email) {
        return prisma.user.findUnique({ where: { email } });
    }

    async findById(id) {
        return prisma.user.findUnique({ where: { id } });
    }



    async updateAvailability(id, isAvailable) {
        return prisma.user.update({
            where: { id },
            data: { isAvailable }
        });
    }

    async findAvailableDriver() {
        return prisma.user.findFirst({
            where: { role: 'DRIVER', isAvailable: true }
        });
    }

    async findAvailableDrivers() {
        return prisma.user.findMany({
            where: { role: 'DRIVER', isAvailable: true },
            select: { id: true, name: true, email: true, isAvailable: true }
        });
    }

    async findAll() {
        return prisma.user.findMany({
            select: { id: true, name: true, email: true, role: true, isAvailable: true }
        });
    }

    async update(id, data) {
        return prisma.user.update({
            where: { id },
            data
        });
    }
}

module.exports = PrismaUserRepository;
