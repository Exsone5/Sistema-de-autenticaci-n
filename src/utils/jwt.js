import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const SECRET_KEY = process.env.JWT_SECRET || 'CoderSecret123';

export const generateToken = (user) => {
    return jwt.sign(
        { id: user._id, email: user.email, role: user.role },
        SECRET_KEY,
        { expiresIn: '24h' }
    );
};

export const verifyToken = (token) => {
    try {
        return jwt.verify(token, SECRET_KEY);
    } catch (error) {
        return null;
    }
};

/**
 * Genera un token de corta duración para reset de contraseña (1 hora)
 */
export const generateResetToken = (email) => {
    return jwt.sign({ email, type: 'reset' }, SECRET_KEY, { expiresIn: '1h' });
};

/**
 * Verifica y decodifica un token de reset de contraseña
 */
export const verifyResetToken = (token) => {
    try {
        const decoded = jwt.verify(token, SECRET_KEY);
        if (decoded.type !== 'reset') return null;
        return decoded;
    } catch (error) {
        return null;
    }
};
