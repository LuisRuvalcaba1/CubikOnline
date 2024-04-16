import axios from './axios';

export const getTorneosRequest = () => axios.get(`/torneo`)
export const getTorneoByIdRequest = () => axios.get(`/yourtournament`)
export const createTorneoRequest = (user, torneo) => axios.post(`/torneo`, user, torneo)
export const updateTorneoByIdRequest = (id, torneo) => axios.put(`/torneo/${id}`, torneo)
export const deleteTorneoByIdRequest = (id) => axios.delete(`/torneo/${id}`)
