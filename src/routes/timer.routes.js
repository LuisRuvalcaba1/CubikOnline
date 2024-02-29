import Router from 'express';
import { authRequired } from '../middlewares/validateToken.js';
import { createTimer, getTimerById, getTimers, deleteTimerById } from '../controllers/timer.controller.js';
import { validateSchema } from '../middlewares/validator.middleware.js';
import { createTimerSchema } from '../schemas/timer.schema.js';

const router = Router();

router.get('/timerul/', authRequired, getTimers);
router.get('/timerul/:id', authRequired, getTimerById);
router.post('/timerul', authRequired, validateSchema(createTimerSchema), createTimer);
router.delete('/timerul/:id', authRequired, deleteTimerById);

export default router;