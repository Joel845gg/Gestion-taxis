const { z } = require('zod');

const registerSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
    role: z.enum(['CLIENT', 'DRIVER', 'ADMIN']).optional(),
    name: z.string().optional()
});

const loginSchema = z.object({
    email: z.string().email(),
    password: z.string()
});

const tripRequestSchema = z.object({
    origin: z.string().min(1),
    destination: z.string().min(1)
});

const statusUpdateSchema = z.object({
    status: z.enum(['ASIGNADO', 'EN_CURSO', 'FINALIZADO', 'CANCELADO'])
});

module.exports = {
    registerSchema,
    loginSchema,
    tripRequestSchema,
    statusUpdateSchema
};
