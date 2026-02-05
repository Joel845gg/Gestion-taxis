const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) return res.status(401).json({ error: 'TOKEN_REQUIRED' });

    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET || 'secretkey2026');
        req.user = verified;
        next();
    } catch (err) {
        res.status(401).json({ error: 'INVALID_TOKEN' });
    }
};

const requireRole = (role) => (req, res, next) => {
    // Add debug log
    console.log(`Checking Role: Required=${role}, Actual=${req.user?.role}`);

    if (!req.user || req.user.role !== role) {
        console.log('Role Mismatch -> 403');
        return res.status(403).json({ error: 'FORBIDDEN' });
    }
    next();
};

module.exports = { authMiddleware, requireRole };
