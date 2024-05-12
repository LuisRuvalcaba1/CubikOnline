import express from "express";
import {
  createSurvey,
  getSurveys,
  getSurveyById,
  updateSurvey,
  deleteSurvey,
} from "../controllers/survey.controller.js";
import { authRequired } from "../middlewares/validateToken.js";

const router = express.Router();

router.post("/survey", authRequired, createSurvey);
router.get("/survey", authRequired, getSurveys);
router.get("/survey/:id", authRequired, getSurveyById);
router.put("/survey/:id", authRequired, updateSurvey);
router.delete("/survey/:id", authRequired, deleteSurvey);

export default router;