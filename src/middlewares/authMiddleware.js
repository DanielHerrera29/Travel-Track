import AuthService from '../services/AuthService.js';

// ============ MIDDLEWARE PARA RUTAS WEB ============

export const requireAuthWeb = (req, res, next) => {
    if (!req.session || !req.session.userId) {
        return res.redirect('/login');
    }
    next();
};

export const requireRoleWeb = (allowedRoles) => {
    return (req, res, next) => {
        if (!req.session || !req.session.userId) {
            return res.redirect('/login');
        }

        const userRole = req.session.userRole; 
        if (!allowedRoles.includes(userRole)) {
            return res.status(403).render('error', {
                title: 'Acceso Denegado',
                message: 'No tienes permisos para acceder a esta página'
            });
        }

        next();
    };
};

// ============ MIDDLEWARE PARA RUTAS API ============

export const requireAuthAPI = (req, res, next) => {
    console.log('🔍 Verificando autenticación API...');
    console.log('Session:', req.session);
    console.log('Session ID:', req.sessionID);
    console.log('Cookies:', req.cookies);
    
    if (!req.session || !req.session.userId) {
        console.log('❌ No autenticado - Session:', req.session);
        return res.status(401).json({
            success: false,
            message: 'No autenticado'
        });
    }
    
    console.log('✅ Usuario autenticado:', req.session.userId);
    next();
};

export const requireRoleAPI = (allowedRoles) => {
    return (req, res, next) => {
        console.log('🔍 Verificando rol API...');
        console.log('Session userId:', req.session?.userId);
        console.log('Session userRole:', req.session?.userRole);
        console.log('Roles permitidos:', allowedRoles);
        
        if (!req.session || !req.session.userId) {
            console.log('❌ No autenticado en requireRoleAPI');
            return res.status(401).json({
                success: false,
                message: 'No autenticado'
            });
        }

        const userRole = req.session.userRole;
        
        if (!allowedRoles.includes(userRole)) {
            console.log('❌ Rol no permitido:', userRole);
            return res.status(403).json({
                success: false,
                message: 'No tienes permisos para realizar esta acción'
            });
        }

        console.log('✅ Rol verificado:', userRole);
        next();
    };
};

// ============ MIDDLEWARE UNIFICADO (DEPRECADO) ============
// Este middleware es inconsistente - usa requireAuthAPI o requireAuthWeb
export function requireAuth(req, res, next) {
    // Verificar con userId (consistente con otros middlewares)
    if (req.session && req.session.userId) {
        return next();
    }

    // Si es petición HTML, redirigir a login
    if (req.headers.accept && req.headers.accept.includes("text/html")) {
        return res.redirect('/login');
    }

    // Si es API, retornar JSON
    return res.status(401).json({
        success: false,
        message: "No autenticado"
    });
}

// ============ OTROS MIDDLEWARES ============

export const preventAuthAccess = (req, res, next) => {
    if (req.session && req.session.userId) {
        const redirectUrl = getRedirectByRole(req.session.userRole);
        return res.redirect(redirectUrl);
    }
    next();
};

function getRedirectByRole(role) {
    const roleRedirects = {
        'admin': '/admin/dashboard',
        'conductor': '/conductor/dashboard',
        'cliente': '/cliente/dashboard'
    };
    return roleRedirects[role] || '/dashboard';
}

// ============ VALIDACIONES ============

export const validateLogin = (req, res, next) => {
    const { email, password } = req.body;
    const errors = {};

    if (!email || email.trim() === '') {
        errors.email = 'El correo es requerido';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
        errors.email = 'El correo no es válido';
    }

    if (!password || password.trim() === '') {
        errors.password = 'La contraseña es requerida';
    } else if (password.length < 6) {
        errors.password = 'La contraseña debe tener al menos 6 caracteres';
    }

    if (Object.keys(errors).length > 0) {
        return res.status(400).json({
            success: false,
            message: 'Errores de validación',
            errors: errors
        });
    }

    next();
};

export const validateRegister = (req, res, next) => {
    const { nombre, cedula, correo, contrasena, telefono } = req.body;
    const errors = {};

    if (!nombre || nombre.trim() === '') {
        errors.nombre = 'El nombre es requerido';
    }

    if (!cedula || cedula.trim() === '') {
        errors.cedula = 'La cédula es requerida';
    }

    if (!correo || correo.trim() === '') {
        errors.correo = 'El correo es requerido';
    } else if (!/\S+@\S+\.\S+/.test(correo)) {
        errors.correo = 'El correo no es válido';
    }

    if (!contrasena || contrasena.trim() === '') {
        errors.contrasena = 'La contraseña es requerida';
    } else if (contrasena.length < 6) {
        errors.contrasena = 'La contraseña debe tener al menos 6 caracteres';
    }

    if (!telefono || telefono.trim() === '') {
        errors.telefono = 'El teléfono es requerido';
    }

    if (Object.keys(errors).length > 0) {
        return res.status(400).json({
            success: false,
            message: 'Errores de validación',
            errors: errors
        });
    }

    next();
};