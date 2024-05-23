import {Router} from 'express';
import { createEncuesta, getEncuestas, getEncuesta, updateEncuesta, deleteEncuesta } from '../controllers/encuesta.controller.js';
import { authRequired } from '../middlewares/validateToken.js';
const router = Router();

router.post('/encuesta', authRequired, createEncuesta);
router.get('/encuestas', getEncuestas);
router.get('/encuesta/:id', authRequired, getEncuesta);
router.put('/encuesta/:id', authRequired, updateEncuesta);
router.delete('/encuesta/:id', authRequired, deleteEncuesta);

export default router;