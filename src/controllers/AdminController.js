import { Router } from 'express';
import { requireAuthAPI, requireRoleAPI } from '../middlewares/authMiddleware.js';

// Importación dinámica para evitar problemas
let AdminController;
try {
    const module = await import('../controllers/AdminController.js');
    AdminController = module.default;
} catch (error) {
    console.error('Error al importar AdminController:', error);
}

const router = Router();

// ============ GESTIÓN DE RUTAS ============

router.get('/rutas', requireAuthAPI, requireRoleAPI(['admin']), async (req, res) => {
    try {
        await AdminController.getAllRutas(req, res);
    } catch (error) {
        console.error('Error en getAllRutas:', error);
        res.status(500).json({ success: false, message: error.message });
    }
});

router.post('/rutas', requireAuthAPI, requireRoleAPI(['admin']), async (req, res) => {
    try {
        await AdminController.createRuta(req, res);
    } catch (error) {
        console.error('Error en createRuta:', error);
        res.status(500).json({ success: false, message: error.message });
    }
});

router.put('/rutas/:id', requireAuthAPI, requireRoleAPI(['admin']), async (req, res) => {
    try {
        await AdminController.updateRuta(req, res);
    } catch (error) {
        console.error('Error en updateRuta:', error);
        res.status(500).json({ success: false, message: error.message });
    }
});

router.delete('/rutas/:id', requireAuthAPI, requireRoleAPI(['admin']), async (req, res) => {
    try {
        await AdminController.deleteRuta(req, res);
    } catch (error) {
        console.error('Error en deleteRuta:', error);
        res.status(500).json({ success: false, message: error.message });
    }
});

// ============ GESTIÓN DE USUARIOS ============

router.get('/usuarios', requireAuthAPI, requireRoleAPI(['admin']), async (req, res) => {
    try {
        await AdminController.getAllUsuarios(req, res);
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

router.post('/usuarios/conductor', requireAuthAPI, requireRoleAPI(['admin']), async (req, res) => {
    try {
        await AdminController.createConductor(req, res);
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

router.put('/usuarios/:id', requireAuthAPI, requireRoleAPI(['admin']), async (req, res) => {
    try {
        await AdminController.updateUsuario(req, res);
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

router.patch('/usuarios/:id/estado', requireAuthAPI, requireRoleAPI(['admin']), async (req, res) => {
    try {
        await AdminController.cambiarEstadoUsuario(req, res);
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// ============ GESTIÓN DE VIAJES ============

router.get('/viajes', requireAuthAPI, requireRoleAPI(['admin']), async (req, res) => {
    try {
        await AdminController.getAllViajes(req, res);
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

router.post('/viajes/asignar', requireAuthAPI, requireRoleAPI(['admin']), async (req, res) => {
    try {
        await AdminController.asignarConductor(req, res);
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// ============ GESTIÓN DE COSTOS ============

router.post('/costos', requireAuthAPI, requireRoleAPI(['admin']), async (req, res) => {
    try {
        await AdminController.registrarCosto(req, res);
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

router.get('/costos/historico', requireAuthAPI, requireRoleAPI(['admin']), async (req, res) => {
    try {
        await AdminController.getCostosHistoricos(req, res);
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// ============ REPORTES ============

router.get('/reportes/operacion', requireAuthAPI, requireRoleAPI(['admin']), async (req, res) => {
    try {
        await AdminController.generarReporteOperacion(req, res);
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

router.get('/reportes/costos', requireAuthAPI, requireRoleAPI(['admin']), async (req, res) => {
    try {
        await AdminController.generarReporteCostos(req, res);
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// ============ DASHBOARD ============

router.get('/dashboard/stats', requireAuthAPI, requireRoleAPI(['admin']), async (req, res) => {
    try {
        await AdminController.getStats(req, res);
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

export default router;