import express from 'express';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import passport from './config/passport.config.js';
import { connectDB } from './config/database.config.js';

// Importar routers
import sessionsRouter from './routes/sessions.router.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(passport.initialize());

// Rutas
app.use('/api/sessions', sessionsRouter);

// Conexión a base de datos e inicio del servidor
connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`🚀 Servidor escuchando en puerto ${PORT}`);
    });
});

export default app;