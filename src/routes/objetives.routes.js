import e, {Router} from 'express';
import {authRequired} from '../middlewares/validateToken.js';
import {createObjetive, getObjetives, getObjetive, updateObjetive, deleteObjetive} from '../controllers/objetives.controller.js';

const router = Router();

router.post('/createObjetive', authRequired, createObjetive);
router.get('/getObjetives', authRequired, getObjetives);
router.get('/getObjetive/:id', authRequired, getObjetive);
router.put('/updateObjetive/:id', authRequired, updateObjetive);
router.delete('/deleteObjetive/:id', authRequired, deleteObjetive);

export default router;