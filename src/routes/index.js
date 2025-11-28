import { Router } from 'express';
import webRoutes from './webRoutes.js';
import authRoutes from './authRoutes.js';
import rutaRoutes from './rutaRoutes.js';

const router = Router();

router.use('/', webRoutes);
router.use('/api/auth', authRoutes);
router.use('/auth', authRoutes);

router.use('/rutas', rutaRoutes);
export default router;