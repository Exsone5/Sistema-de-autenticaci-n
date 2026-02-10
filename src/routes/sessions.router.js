import { Router } from 'express';
import { userModel } from '../models/user.model.js';
import { createHash, isValidPassword } from '../utils/bcrypt.js';
import { generateToken } from '../utils/jwt.js';
import { passportCall } from '../middlewares/auth.middleware.js';

const router = Router();

// Registro de usuario
router.post('/register', async (req, res) => {
    try {
        const { first_name, last_name, email, age, password } = req.body;

        // Validar que todos los campos estén presentes
        if (!first_name || !last_name || !email || !age || !password) {
            return res.status(400).json({ 
                status: 'error', 
                message: 'Todos los campos son obligatorios' 
            });
        }

        // Verificar si el usuario ya existe
        const existingUser = await userModel.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ 
                status: 'error', 
                message: 'El usuario ya existe' 
            });
        }

        // Crear el usuario con la contraseña encriptada
        const newUser = await userModel.create({
            first_name,
            last_name,
            email,
            age,
            password: createHash(password),
            role: email === 'adminCoder@coder.com' ? 'admin' : 'user'
        });

        res.status(201).json({ 
            status: 'success', 
            message: 'Usuario registrado exitosamente',
            userId: newUser._id
        });
    } catch (error) {
        res.status(500).json({ 
            status: 'error', 
            message: 'Error al registrar usuario: ' + error.message 
        });
    }
});

// Login de usuario
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validar campos
        if (!email || !password) {
            return res.status(400).json({ 
                status: 'error', 
                message: 'Email y contraseña son obligatorios' 
            });
        }

        // Buscar usuario
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.status(401).json({ 
                status: 'error', 
                message: 'Credenciales inválidas' 
            });
        }

        // Verificar contraseña
        if (!isValidPassword(password, user.password)) {
            return res.status(401).json({ 
                status: 'error', 
                message: 'Credenciales inválidas' 
            });
        }

        // Generar token JWT
        const token = generateToken(user);

        // Guardar token en cookie
        res.cookie('coderCookie', token, {
            maxAge: 24 * 60 * 60 * 1000, // 24 horas
            httpOnly: true
        });

        res.json({ 
            status: 'success', 
            message: 'Login exitoso',
            token
        });
    } catch (error) {
        res.status(500).json({ 
            status: 'error', 
            message: 'Error al iniciar sesión: ' + error.message 
        });
    }
});

// Ruta current - Validar usuario logueado
router.get('/current', passportCall('current'), (req, res) => {
    res.json({
        status: 'success',
        user: {
            id: req.user._id,
            first_name: req.user.first_name,
            last_name: req.user.last_name,
            email: req.user.email,
            age: req.user.age,
            role: req.user.role,
            cart: req.user.cart
        }
    });
});

// Logout
router.post('/logout', (req, res) => {
    res.clearCookie('coderCookie');
    res.json({ 
        status: 'success', 
        message: 'Logout exitoso' 
    });
});

export default router;