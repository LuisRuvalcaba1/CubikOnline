import Survey from "../models/survey.model.js";

export const createSurvey = async (req, res) => {
  try {
    const { user, situation, hardestStep, solveTime } = req.body;
    const newSurvey = new Survey({ user, situation, hardestStep, solveTime });
    await newSurvey.save();
    res.status(201).json(newSurvey);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const getSurveys = async (req, res) => {
  try {
    const surveys = await Survey.find();
    res.status(200).json(surveys);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getSurveyById = async (req, res) => {
  try {
    const survey = await Survey.findById(req.params.id);
    if (!survey) {
      return res.status(404).json({ error: "Encuesta no encontrada" });
    }
    res.status(200).json(survey);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateSurvey = async (req, res) => {
  try {
    const updatedSurvey = await Survey.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedSurvey) {
      return res.status(404).json({ error: "Encuesta no encontrada" });
    }
    res.status(200).json(updatedSurvey);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const deleteSurvey = async (req, res) => {
  try {
    const deletedSurvey = await Survey.findByIdAndDelete(req.params.id);
    if (!deletedSurvey) {
      return res.status(404).json({ error: "Encuesta no encontrada" });
    }
    res.status(200).json({ message: "Encuesta eliminada correctamente" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};