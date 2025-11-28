import { Router } from 'express';
import authController from '../controllers/authController.js';
import homeController from '../controllers/homeController.js';
import { requireAuthWeb, requireRoleWeb, preventAuthAccess } from '../middlewares/authMiddleware.js';

const router = Router();

router.get('/', homeController.showHome);

router.get('/about', (req, res) => {
    res.render('about', {
        title: 'Acerca de Nosotros'
    });
});

router.get('/contact', (req, res) => {
    res.render('contact', {
        title: 'Contacto'
    });
});

router.get('/login', preventAuthAccess, authController.showLoginForm);
router.get('/register', preventAuthAccess, authController.showRegisterForm);
router.get('/forgot-password', authController.showForgotPasswordForm);
router.get('/ruta/:id', requireAuthWeb, homeController.showRutaDetails);
router.get('/admin/dashboard', 
    requireAuthWeb, 
    requireRoleWeb(['admin']), 
    (req, res) => {
        res.render('admin/dashboard', {
            title: 'Panel de Administración',
            user: req.user
        });
    }
);
router.get('/admin/usuarios', 
    requireAuthWeb, 
    requireRoleWeb(['admin']), 
    (req, res) => {
        res.render('admin/usuarios', {
            title: 'Gestión de Usuarios',
            user: req.user
        });
    }
);
router.get('/admin/reportes', 
    requireAuthWeb, 
    requireRoleWeb(['admin']), 
    (req, res) => {
        res.render('admin/reportes', {
            title: 'Reportes',
            user: req.user
        });
    }
);
router.get('/conductor/dashboard', 
    requireAuthWeb, 
    requireRoleWeb(['conductor']), 
    (req, res) => {
        res.render('conductor/dashboard', {
            title: 'Panel de Conductor',
            user: req.user
        });
    }
);
router.get('/conductor/viajes', 
    requireAuthWeb, 
    requireRoleWeb(['conductor']), 
    (req, res) => {
        res.render('conductor/viajes', {
            title: 'Mis Viajes',
            user: req.user
        });
    }
);
router.get('/conductor/pasajes', 
    requireAuthWeb, 
    requireRoleWeb(['conductor']), 
    (req, res) => {
        res.render('conductor/pasajes', {
            title: 'Venta de Pasajes',
            user: req.user
        });
    }
);

router.get('/cliente/dashboard', 
    requireAuthWeb, 
    requireRoleWeb(['cliente']), 
    (req, res) => {
        res.render('cliente/dashboard', {
            title: 'Mi Panel',
            user: req.user
        });
    }
);

router.get('/cliente/comprar-pasajes', 
    requireAuthWeb, 
    requireRoleWeb(['cliente']), 
    (req, res) => {
        res.render('cliente/comprar-pasajes', {
            title: 'Comprar Pasajes',
            user: req.user
        });
    }
);

router.get('/cliente/mis-pasajes', 
    requireAuthWeb, 
    requireRoleWeb(['cliente']), 
    (req, res) => {
        res.render('cliente/mis-pasajes', {
            title: 'Mis Pasajes',
            user: req.user
        });
    }
);
router.get('/profile', requireAuthWeb, (req, res) => {
    res.render('profile', {
        title: 'Mi Perfil',
        user: req.user
    });
});

router.get('/dashboard', requireAuthWeb, (req, res) => {
    const roleRedirects = {
        'admin': '/admin/dashboard',
        'conductor': '/conductor/dashboard',
        'cliente': '/cliente/dashboard'
    };
    
    const redirectUrl = roleRedirects[req.user.role] || '/';
    res.redirect(redirectUrl);
});
// ======== ADMIN ========

router.get('/admin/rutas',
    requireAuthWeb,
    requireRoleWeb(['admin']),
    (req, res) => {
        res.render('admin/rutas', {
            title: 'Gestión de Rutas',
            user: req.user
        });
    }
);

router.get('/admin/viajes',
    requireAuthWeb,
    requireRoleWeb(['admin']),
    (req, res) => {
        res.render('admin/viajes', {
            title: 'Gestión de Viajes',
            user: req.user
        });
    }
);

router.get('/admin/costos',
    requireAuthWeb,
    requireRoleWeb(['admin']),
    (req, res) => {
        res.render('admin/costos', {
            title: 'Costos Operativos',
            user: req.user
        });
    }
);

export default router;