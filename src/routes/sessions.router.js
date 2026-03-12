import { Router } from 'express';
import { passportCall } from '../middlewares/auth.middleware.js';
import {
    register,
    login,
    current,
    logout,
    forgotPassword,
    validateResetToken,
    resetPassword
} from '../controllers/sessions.controller.js';

const router = Router();

router.post('/register',        register);
router.post('/login',           login);
router.get('/current',          passportCall('current'), current);
router.post('/logout',          logout);

// Recuperación de contraseña
router.post('/forgot-password',             forgotPassword);
router.get('/reset-password/:token',        validateResetToken);
router.post('/reset-password',              resetPassword);

export default router;
