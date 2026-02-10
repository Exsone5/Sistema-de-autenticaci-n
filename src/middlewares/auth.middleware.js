import passport from 'passport';

export const passportCall = (strategy) => {
    return async (req, res, next) => {
        passport.authenticate(strategy, { session: false }, (error, user, info) => {
            if (error) {
                return next(error);
            }
            if (!user) {
                return res.status(401).json({ 
                    status: 'error', 
                    message: info?.message || 'No autenticado' 
                });
            }
            req.user = user;
            next();
        })(req, res, next);
    };
};

export const authorization = (roles) => {
    return async (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ 
                status: 'error', 
                message: 'No autenticado' 
            });
        }
        
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ 
                status: 'error', 
                message: 'Sin permisos suficientes' 
            });
        }
        
        next();
    };
};