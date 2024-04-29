import { Router } from 'express';
import { authRequired, removeToken, renewToken } from '../middlewares/validateToken.js';

const router = Router();

// Ruta para renovar el token
router.post('/remove-token', authRequired, removeToken);
router.get('/renew-token', authRequired, renewToken);

export default router;