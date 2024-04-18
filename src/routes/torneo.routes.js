import Router from 'express';
import { authRequired } from '../middlewares/validateToken.js';
import { createTorneo, getTorneos, getTorneoById, updateTorneoById, deleteTorneoById } from '../controllers/torneo.controller.js';

const router = Router();
router.post('/torneo', authRequired, createTorneo);
router.get('/torneoget', authRequired, getTorneos);
router.get('/yourtournament', authRequired, getTorneoById);
router.put('/yourtournament/:id', authRequired, updateTorneoById);
router.delete('/yourtournament/:id', authRequired, deleteTorneoById);

export default router;