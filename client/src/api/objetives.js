import axios from './axios';

export const getObjetivesRequest = () => axios.get(`/getObjetives`);

export const createObjetiveRequest = objetive => axios.post(`/createObjetive`, objetive);

export const getObjetiveRequest = id => axios.get(`/getObjetive/${id}`);

export const updateObjetiveRequest = (id, objetive) => axios.put(`/updateObjetive/${id}`, objetive);

export const deleteObjetiveRequest = id => axios.delete(`/deleteObjetive/${id}`);

