import jwt from 'jsonwebtoken';
import redisClient from '../services/redis.service.js';

export const authUser = async (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'Unauthorised User' });
    }

    const blackListedToken = await redisClient.get(token);
    if (blackListedToken) {
        res.cookie('token', '');
        return res.status(401).json({ error: 'Unauthorised User' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(403).send({ error: 'Unauthorised User' });
    }
}

export const isAdmin = async (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        return res.status(403).json({ error: 'Access denied. Admins only.' });
    }
}