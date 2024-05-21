import {Router} from 'express';
import { addFriend, getFriends, denyFriend, acceptFriend } from '../controllers/amigos.controller';

const router = Router();
router.post('/addFriend', addFriend);
router.get('/getFriends', getFriends);
router.put('/acceptFriend/:id', acceptFriend);
router.put('/denyFriend/:id', denyFriend);
