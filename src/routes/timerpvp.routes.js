import Router from 'express';
import { authRequired } from '../middlewares/validateToken.js';
import { createTimerPvP, getTimerPvPById, /*getTimersPvP */ deleteTimerPvPById, updateTimerPvPById } from '../controllers/timerpvp.controller.js';

const router = Router();
//router.get('/getTimerpvp', authRequired, getTimersPvP);
router.get('/timerpvp/:id', authRequired, getTimerPvPById);
router.post('/timerpvp', authRequired, createTimerPvP);
router.put('/timerpvp/:id', authRequired, updateTimerPvPById);
router.delete('/timerpvp/:id', authRequired, deleteTimerPvPById);

export default router;
