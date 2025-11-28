// routes/adminRoutes.js
import { Router } from 'express';
import { requireAuthAPI, requireRoleAPI } from '../middlewares/authMiddleware.js';
import Ruta from '../models/Ruta.js';

const router = Router();

// ============ GESTIÓN DE RUTAS (sin controlador por ahora) ============

router.get('/rutas', requireAuthAPI, requireRoleAPI(['admin']), async (req, res) => {
    try {
        const rutas = await Ruta.findAll();
        res.json({
            success: true,
            data: rutas
        });
    } catch (error) {
        console.error('Error al obtener rutas:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

router.post('/rutas', requireAuthAPI, requireRoleAPI(['admin']), async (req, res) => {
    try {
        const { nombre, distancia_km, duracion_estimada } = req.body;
        const idRuta = await Ruta.create({ nombre, distancia_km, duracion_estimada });
        res.json({
            success: true,
            message: 'Ruta creada exitosamente',
            data: { id: idRuta }
        });
    } catch (error) {
        console.error('Error al crear ruta:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

router.put('/rutas/:id', requireAuthAPI, requireRoleAPI(['admin']), async (req, res) => {
    try {
        const { id } = req.params;
        const datos = req.body;
        const updated = await Ruta.update(id, datos);
        
        if (!updated) {
            return res.status(404).json({
                success: false,
                message: 'Ruta no encontrada'
            });
        }

        res.json({
            success: true,
            message: 'Ruta actualizada exitosamente'
        });
    } catch (error) {
        console.error('Error al actualizar ruta:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

router.delete('/rutas/:id', requireAuthAPI, requireRoleAPI(['admin']), async (req, res) => {
    try {
        const { id } = req.params;
        const deleted = await Ruta.delete(id);
        
        if (!deleted) {
            return res.status(404).json({
                success: false,
                message: 'Ruta no encontrada'
            });
        }

        res.json({
            success: true,
            message: 'Ruta eliminada exitosamente'
        });
    } catch (error) {
        console.error('Error al eliminar ruta:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// ============ GESTIÓN DE USUARIOS (stub temporal) ============

router.get('/usuarios', requireAuthAPI, requireRoleAPI(['admin']), async (req, res) => {
    res.json({
        success: true,
        data: []
    });
});

// ============ DASHBOARD (stub temporal) ============

router.get('/dashboard/stats', requireAuthAPI, requireRoleAPI(['admin']), async (req, res) => {
    res.json({
        success: true,
        data: {
            viajesHoy: 0,
            conductoresActivos: 0,
            clientesRegistrados: 0,
            ingresosDelMes: 0
        }
    });
});

export default router;