import passport from 'passport';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import { userModel } from '../models/user.model.js';
import dotenv from 'dotenv';

dotenv.config();

const SECRET_KEY = process.env.JWT_SECRET || 'CoderSecret123';

// Extrae JWT de la cookie
const cookieExtractor = (req) => {
    let token = null;
    if (req && req.cookies) {
        token = req.cookies['coderCookie'];
    }
    return token;
};

const jwtOptions = {
    jwtFromRequest: ExtractJwt.fromExtractors([cookieExtractor]),
    secretOrKey: SECRET_KEY
};

// Estrategia JWT genérica
passport.use('jwt', new JwtStrategy(jwtOptions, async (jwt_payload, done) => {
    try {
        const user = await userModel.findById(jwt_payload.id);
        if (!user) return done(null, false);
        return done(null, user);
    } catch (error) {
        return done(error, false);
    }
}));

// Estrategia "current" - excluye password
passport.use('current', new JwtStrategy(jwtOptions, async (jwt_payload, done) => {
    try {
        const user = await userModel.findById(jwt_payload.id).select('-password');
        if (!user) return done(null, false, { message: 'Usuario no encontrado' });
        return done(null, user);
    } catch (error) {
        return done(error, false);
    }
}));

export default passport;
