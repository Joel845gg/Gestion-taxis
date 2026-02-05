const ITripRepository = require('../../domain/repositories/ITripRepository');
const prisma = require('./prisma');

class PrismaTripRepository extends ITripRepository {
    async create(data) {
        return prisma.trip.create({ data });
    }

    async findById(id) {
        return prisma.trip.findUnique({ where: { id } });
    }

    async findByUser(userId) {
        return prisma.trip.findMany({
            where: {
                OR: [{ clientId: userId }, { driverId: userId }]
            },
            include: {
                client: { select: { name: true, email: true } },
                driver: { select: { name: true, email: true } }
            },
            orderBy: { createdAt: 'desc' }
        });
    }

    async update(id, data) {
        return prisma.trip.update({
            where: { id },
            data
        });
    }

    async findAll() {
        return prisma.trip.findMany({
            include: {
                client: { select: { name: true, email: true } },
                driver: { select: { name: true, email: true } }
            },
            orderBy: { createdAt: 'desc' }
        });
    }
}

module.exports = PrismaTripRepository;
