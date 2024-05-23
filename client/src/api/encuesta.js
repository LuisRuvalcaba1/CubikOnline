import axios from './axios';

export const getEncuestasRequest = () => axios.get(`/encuestas`);

export const getEncuestaRequest = user => axios.get(`/encuesta/${user}`);

export const createEncuestaRequest = encuesta => axios.post(`/encuesta`, encuesta);

export const updateEncuestaRequest = (id, encuesta) => axios.put(`/encuesta/${id}`, encuesta);

export const deleteEncuestaRequest = id => axios.delete(`/encuesta/${id}`);


