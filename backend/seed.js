const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

async function main() {
    const password = await bcrypt.hash('123456', 10);

    // 1. Crear ADMIN
    const admin = await prisma.user.upsert({
        where: { email: 'admin@taxi.com' },
        update: {},
        create: {
            email: 'admin@taxi.com',
            password,
            name: 'Super Admin',
            role: 'ADMIN',
        },
    });

    // 2. Crear DRIVER (Disponible)
    const driver = await prisma.user.upsert({
        where: { email: 'driver@taxi.com' },
        update: {},
        create: {
            email: 'driver@taxi.com',
            password,
            name: 'Juan Conductor',
            role: 'DRIVER',
            isAvailable: true
        },
    });

    // 3. Crear CLIENT
    const client = await prisma.user.upsert({
        where: { email: 'client@taxi.com' },
        update: {},
        create: {
            email: 'client@taxi.com',
            password,
            name: 'Ana Pasajera',
            role: 'CLIENT',
        },
    });

    console.log('✅ Datos sembrados:', { admin: admin.email, driver: driver.email, client: client.email });
}

main()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    });
