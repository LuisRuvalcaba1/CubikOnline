import { createUserPvP, getUserPvP, updateUserPvP, deleteUserPvP, getUserPvPByUser } from "../controllers/userpvp.controller.js";
import Router from "express";
import { authRequired } from "../middlewares/validateToken.js";

const router = Router();

router.post("/userpvp", authRequired , createUserPvP);
router.get("/userpvp", authRequired, getUserPvP);
router.put("/userpvp/:id", authRequired, updateUserPvP);
router.delete("/userpvp/:id", authRequired, deleteUserPvP);
router.get("/userpvp/:user", authRequired, getUserPvPByUser);

export default router;