import e, {Router} from 'express';
import {authRequired} from '../middlewares/validateToken.js';
import {createObjetive, getObjetives, getObjetive, updateObjetive, deleteObjetive} from '../controllers/objetives.controller.js';

const router = Router();

router.post('/createObjetive1', authRequired, createObjetive);
router.get('/getObjetives1', authRequired, getObjetives);
router.get('/getObjetive/:id', authRequired, getObjetive);
router.put('/updateObjetive1/:id', authRequired, updateObjetive);
router.delete('/deleteObjetive/:id', authRequired, deleteObjetive);

export default router;