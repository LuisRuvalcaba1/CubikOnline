import { createContext, useContext } from "react";
import {
  createSurveyRequest,
  getSurveysRequest,
  getSurveyByIdRequest,
  updateSurveyRequest,
  deleteSurveyRequest,
} from "../api/survey";

export const SurveyContext = createContext();

export const useSurvey = () => {
  const context = useContext(SurveyContext);
  if (!context) {
    throw new Error("useSurvey must be used within a SurveyProvider");
  }
  return context;
};

export const SurveyProvider = ({ children }) => {
  const createSurvey = async (surveyData) => {
    try {
      const response = await createSurveyRequest(surveyData);
      console.log(response);
    } catch (error) {
      console.error("Error creating survey:", error);
    }
  };

  const getSurveys = async () => {
    try {
      const response = await getSurveysRequest();
      console.log(response);
      return response; // Devuelve la respuesta completa
    } catch (error) {
      throw new Error(`Error fetching surveys: ${error.message}`);
    }
  };

  const getSurveyById = async (id) => {
    try {
      const response = await getSurveyByIdRequest(id);
      console.log(response);
      return response; // Devuelve la respuesta completa
    } catch (error) {
      throw new Error(`Error fetching survey: ${error.message}`);
    }
  };

  const updateSurvey = async (id, updatedSurveyData) => {
    try {
      const response = await updateSurveyRequest(id, updatedSurveyData);
      console.log(response);
    } catch (error) {
      console.error("Error updating survey:", error);
    }
  };

  const deleteSurvey = async (id) => {
    try {
      const response = await deleteSurveyRequest(id);
      console.log(response);
    } catch (error) {
      console.error("Error deleting survey:", error);
    }
  };

  const value = {
    createSurvey,
    getSurveys,
    getSurveyById,
    updateSurvey,
    deleteSurvey,
  };

  return (
    <SurveyContext.Provider value={value}>{children}</SurveyContext.Provider>
  );
};
