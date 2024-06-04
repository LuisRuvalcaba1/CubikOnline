import axios from './axios';

export const getTorneosRequest = () => axios.get(`/torneoget`)
export const getTorneoByIdRequest = () => axios.get(`/yourtournament`)
export const createTorneoRequest = (user, torneo) => axios.post(`/torneo`, user, torneo)
export const updateTorneoByIdRequest = (id, torneo) => axios.put(`/yourtournament/${id}`, torneo)
export const deleteTorneoByIdRequest = (id) => axios.delete(`/yourtournament/${id}`)
export const deleteTorneoByJuezRequest = () => axios.delete(`/yourtournament`)
export const getTorneoByJuezRequest = (juez) => axios.get(`/yourtournament/${juez}`)
