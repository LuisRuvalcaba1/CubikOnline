import {getRank, addRank, deleteRank, updateRank, getRankByUser} from "../controllers/rank.controller.js";
import { Router } from "express";
import { authRequired } from "../middlewares/validateToken.js";

const router = Router();

router.get("/rank", getRank);
router.post("/rank", authRequired, addRank);
router.delete("/rankDelete/:id", authRequired, deleteRank);
router.put("/rankUpdate/:id", authRequired, updateRank);
router.get("/rankUser/:id", getRankByUser);

export default router;