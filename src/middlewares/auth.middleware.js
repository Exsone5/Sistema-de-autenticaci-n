import passport from 'passport';

/**
 * Wrapper de passport.authenticate para uso como middleware encadenable.
 * Usa la estrategia "current" por defecto (JWT desde cookie).
 */
export const passportCall = (strategy = 'current') => {
    return (req, res, next) => {
        passport.authenticate(strategy, { session: false }, (error, user, info) => {
            if (error) return next(error);
            if (!user) {
                return res.status(401).json({
                    status: 'error',
                    message: info?.message || 'No autenticado. Iniciá sesión primero.'
                });
            }
            req.user = user;
            next();
        })(req, res, next);
    };
};

/**
 * Middleware de autorización por roles.
 * Se usa después de passportCall para verificar que el usuario tenga el rol necesario.
 * 
 * Uso: router.post('/products', passportCall(), authorization(['admin']), handler)
 */
export const authorization = (roles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({
                status: 'error',
                message: 'No autenticado'
            });
        }

        if (!roles.includes(req.user.role)) {
            return res.status(403).json({
                status: 'error',
                message: `Acceso denegado. Rol requerido: ${roles.join(' o ')}`
            });
        }

        next();
    };
};
