import {Router} from 'express';
import { addFriend, getFriends, denyFriend, acceptFriend } from '../controllers/amigos.controller.js';
import { authRequired } from "../middlewares/validateToken.js";

const router = Router();
router.post('/addFriend', authRequired, addFriend);
router.get('/getFriends', authRequired, getFriends);
router.put('/acceptFriend/:id', authRequired, acceptFriend);
router.put('/denyFriend/:id', authRequired, denyFriend);

export default router;