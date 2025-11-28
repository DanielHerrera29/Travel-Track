// routes/adminRoutes.js
import { Router } from 'express';
import { requireAuthAPI, requireRoleAPI } from '../middlewares/authMiddleware.js';
import AdminController from '../controllers/AdminController.js';

const router = Router();

// ============ GESTIÓN DE RUTAS ============

router.get('/rutas', requireAuthAPI, requireRoleAPI(['admin']), async (req, res) => {
    await AdminController.getAllRutas(req, res);
});

router.post('/rutas', requireAuthAPI, requireRoleAPI(['admin']), async (req, res) => {
    await AdminController.createRuta(req, res);
});

router.put('/rutas/:id', requireAuthAPI, requireRoleAPI(['admin']), async (req, res) => {
    await AdminController.updateRuta(req, res);
});

router.delete('/rutas/:id', requireAuthAPI, requireRoleAPI(['admin']), async (req, res) => {
    await AdminController.deleteRuta(req, res);
});

// ============ GESTIÓN DE USUARIOS ============

router.get('/usuarios', requireAuthAPI, requireRoleAPI(['admin']), async (req, res) => {
    await AdminController.getAllUsuarios(req, res);
});

router.post('/usuarios/conductor', requireAuthAPI, requireRoleAPI(['admin']), async (req, res) => {
    await AdminController.createConductor(req, res);
});

router.put('/usuarios/:id', requireAuthAPI, requireRoleAPI(['admin']), async (req, res) => {
    await AdminController.updateUsuario(req, res);
});

router.patch('/usuarios/:id/estado', requireAuthAPI, requireRoleAPI(['admin']), async (req, res) => {
    await AdminController.cambiarEstadoUsuario(req, res);
});

// ============ DASHBOARD ============

router.get('/dashboard/stats', requireAuthAPI, requireRoleAPI(['admin']), async (req, res) => {
    await AdminController.getStats(req, res);
});
router.get('/viajes', requireAuthAPI, requireRoleAPI(['admin']), async (req, res) => {
    await AdminController.getAllViajes(req, res);
});

router.get('/viajes/:id', requireAuthAPI, requireRoleAPI(['admin']), async (req, res) => {
    await AdminController.getViajeById(req, res);
});

router.post('/viajes', requireAuthAPI, requireRoleAPI(['admin']), async (req, res) => {
    await AdminController.createViaje(req, res);
});

router.put('/viajes/:id', requireAuthAPI, requireRoleAPI(['admin']), async (req, res) => {
    await AdminController.updateViaje(req, res);
});

router.delete('/viajes/:id', requireAuthAPI, requireRoleAPI(['admin']), async (req, res) => {
    await AdminController.deleteViaje(req, res);
});

router.patch('/viajes/:id/estado', requireAuthAPI, requireRoleAPI(['admin']), async (req, res) => {
    await AdminController.cambiarEstadoViaje(req, res);
});

router.get('/conductores/disponibles', requireAuthAPI, requireRoleAPI(['admin']), async (req, res) => {
    await AdminController.getConductoresDisponibles(req, res);
});

router.get('/costos/historico', requireAuthAPI, requireRoleAPI(['admin']), async (req, res) => {
    await AdminController.getAllCostos(req, res);
});

router.get('/costos/:id', requireAuthAPI, requireRoleAPI(['admin']), async (req, res) => {
    await AdminController.getCostoById(req, res);
});

router.post('/costos', requireAuthAPI, requireRoleAPI(['admin']), async (req, res) => {
    await AdminController.createCosto(req, res);
});

router.put('/costos/:id', requireAuthAPI, requireRoleAPI(['admin']), async (req, res) => {
    await AdminController.updateCosto(req, res);
});

router.delete('/costos/:id', requireAuthAPI, requireRoleAPI(['admin']), async (req, res) => {
    await AdminController.deleteCosto(req, res);
});

router.get('/costos/viaje/:id', requireAuthAPI, requireRoleAPI(['admin']), async (req, res) => {
    await AdminController.getCostosPorViaje(req, res);
});

router.get('/costos/analisis/por-tipo', requireAuthAPI, requireRoleAPI(['admin']), async (req, res) => {
    await AdminController.getCostosPorTipo(req, res);
});
router.get('/viajes/estadisticas/resumen', requireAuthAPI, requireRoleAPI(['admin']), async (req, res) => {
    await AdminController.getEstadisticasViajes(req, res);
});
export default router;