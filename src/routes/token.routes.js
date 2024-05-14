import { Router } from 'express';
import { authRequired, removeToken } from '../middlewares/validateToken.js';

const router = Router();

// Ruta para renovar el token
router.post('/remove-token', authRequired, removeToken);

export default router;