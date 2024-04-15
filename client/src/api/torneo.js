import axios from './axios';

export const getTorneosRequest = () => axios.get(`/torneo`)
export const getTorneoByIdRequest = (id) => axios.get(`/torneo/${id}`)
export const createTorneoRequest = (torneo) => axios.post(`/torneo`, torneo)
export const updateTorneoByIdRequest = (id, torneo) => axios.put(`/torneo/${id}`, torneo)
export const deleteTorneoByIdRequest = (id) => axios.delete(`/torneo/${id}`)
