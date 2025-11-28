import { Router } from 'express';
import authController from '../controllers/authController.js';
import { requireAuth, requireRole } from '../middlewares/authMiddleware.js';
import { validateLogin, validateRegister } from '../middlewares/validationMiddleware.js';

const router = Router();

router.post('/auth/login', validateLogin, authController.login);
router.post('/auth/logout', requireAuth, authController.logout);
router.get('/auth/verify', authController.verifySession);
router.get('/protected', requireAuth, (req, res) => {
    res.json({
        success: true,
        message: 'Acceso autorizado',
        user: req.user
    });
});

router.get('/admin-only', requireAuth, requireRole('administrador'), (req, res) => {
    res.json({
        success: true,
        message: 'Acceso de administrador',
        user: req.user
    });
});

export default router;