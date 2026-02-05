const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

class AuthService {
    constructor(userRepository) {
        this.userRepository = userRepository;
    }

    async register(data) {
        const { email, password, role, name } = data;

        // Validation check for duplicates
        const existing = await this.userRepository.findByEmail(email);
        if (existing) throw new Error('EMAIL_EXISTS');

        const hashedPassword = await bcrypt.hash(password, 10);

        return this.userRepository.create({
            email,
            password: hashedPassword,
            role: role || 'CLIENT',
            name
        });
    }

    async login(email, password) {
        const user = await this.userRepository.findByEmail(email);
        if (!user) throw new Error('USER_NOT_FOUND');

        const validPass = await bcrypt.compare(password, user.password);
        if (!validPass) throw new Error('INVALID_PASSWORD');

        const token = jwt.sign(
            { id: user.id, role: user.role },
            process.env.JWT_SECRET || 'secretkey2026',
            { expiresIn: '24h' }
        );

        return { token, user };
    }
}

module.exports = AuthService;
