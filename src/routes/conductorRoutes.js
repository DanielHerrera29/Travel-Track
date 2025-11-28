// routes/conductorRoutes.js
import { Router } from 'express';
import { requireAuthWeb, requireRoleWeb } from '../middlewares/authMiddleware.js';

const router = Router();

// Dashboard principal del conductor
router.get('/dashboard', requireAuthWeb, requireRoleWeb(['conductor']), (req, res) => {
    res.render('conductor/dashboard', {
        title: 'Dashboard Conductor',
        user: req.session
    });
});

// API endpoints para datos del conductor (usar las rutas admin existentes)
router.get('/api/viajes', requireAuthWeb, requireRoleWeb(['conductor']), async (req, res) => {
    // Reutilizar AdminController.getAllViajes filtrando por conductor
    const { ConductorController } = await import('../controllers/AdminController.js');
    req.query.conductor = req.session.userId;
    await ConductorController.getAllViajes(req, res);
});

router.get('/api/stats', requireAuthWeb, requireRoleWeb(['conductor']), async (req, res) => {
    // Stats específicas del conductor
    res.json({
        success: true,
        data: {
            viajesHoy: 2,
            viajesProgramados: 1,
            viajesEnCurso: 1
        }
    });
});

export default router;
