import { Router } from "express";
import {
  addFriend,
  getFriends,
  denyFriend,
  acceptFriend,
  getYourFriends,
} from "../controllers/amigos.controller.js";
import { authRequired } from "../middlewares/validateToken.js";

const router = Router();
router.post("/addFriend", authRequired, addFriend);
router.get("/getFriends", authRequired, getFriends);
router.get("/getYourFriends", authRequired, getYourFriends);
router.put("/acceptFriend/:id", authRequired, acceptFriend);
router.delete("/denyFriend/:id", authRequired, denyFriend);

export default router;
