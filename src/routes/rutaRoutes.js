import { Router } from 'express';
import rutaController from '../controllers/rutaController.js';
import { requireAuth, requireRoleAPI } from '../middlewares/authMiddleware.js';

const router = Router();

router.get('/', rutaController.getAllRutas);
router.get('/:id', rutaController.getRutaById);
router.post('/', requireAuth, requireRoleAPI(['admin']), rutaController.createRuta);

router.put('/:id', requireAuth, requireRoleAPI(['admin']), rutaController.updateRuta);

router.delete('/:id', requireAuth, requireRoleAPI(['admin']), rutaController.deactivateRuta);

export default router;