import Router from 'express';
import { authRequired } from '../middlewares/validateToken.js';
import { createTorneo, getTorneos, getTorneoById, updateTorneoById, deleteTorneoById } from '../controllers/torneo.controller.js';

const router = Router();
router.post('/torneo', authRequired, createTorneo);
router.get('/activeTorneos', authRequired, getTorneos);
router.get('/yourtournament', authRequired, getTorneoById);
router.put('/mytorneo/:id', authRequired, updateTorneoById);
router.delete('/mytorneo/:id', authRequired, deleteTorneoById);

export default router;