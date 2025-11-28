import { Router } from 'express';
import authController from '../controllers/authController.js';
import { validateLogin } from '../middlewares/validationMiddleware.js';
import { requireAuth } from '../middlewares/authMiddleware.js';

const router = Router();

router.post('/login', validateLogin, authController.login);

router.post('/register', authController.register);
router.post('/logout', requireAuth, authController.logout);

router.post('/forgot-password', authController.forgotPassword);

router.get('/verify', authController.verifySession);

export default router;