import axios from './axios';

export const getObjetivesRequest = () => axios.get(`/getObjetives1`);

export const createObjetiveRequest = objetive => axios.post(`/createObjetive1`, objetive);

export const getObjetiveRequest = id => axios.get(`/getObjetive/${id}`);

export const updateObjetiveRequest = (id, objetive) => axios.put(`/updateObjetive1/${id}`, objetive);

export const deleteObjetiveRequest = id => axios.delete(`/deleteObjetive/${id}`)