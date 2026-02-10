import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const SECRET_KEY = process.env.JWT_SECRET || 'CoderSecret123';

export const generateToken = (user) => {
    return jwt.sign(
        {
            id: user._id,
            email: user.email,
            role: user.role
        },
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