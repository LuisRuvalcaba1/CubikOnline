import axios from './axios';

// Crear una nueva encuesta
export const createSurveyRequest = (surveyData) => axios.post('/surveys', surveyData);

// Obtener todas las encuestas
export const getSurveysRequest = () => axios.get('/surveys');

// Obtener una encuesta por ID
export const getSurveyByIdRequest = (id) => axios.get(`/surveys/${id}`);

// Actualizar una encuesta
export const updateSurveyRequest = (id, updatedSurveyData) =>
  axios.put(`/surveys/${id}`, updatedSurveyData);

// Eliminar una encuesta
export const deleteSurveyRequest = (id) => axios.delete(`/surveys/${id}`);