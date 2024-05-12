import express from "express";
import {
  createSurvey,
  getSurveys,
  getSurveyById,
  updateSurvey,
  deleteSurvey,
} from "../controllers/surveyControllers.js";

const router = express.Router();

// Crear una nueva encuesta
router.post("/survey", createSurvey);

// Obtener todas las encuestas
router.get("/survey", getSurveys);

// Obtener una encuesta por ID
router.get("/survey/:id", getSurveyById);

// Actualizar una encuesta
router.put("/survey/:id", updateSurvey);

// Eliminar una encuesta
router.delete("/survey/:id", deleteSurvey);

export default router;