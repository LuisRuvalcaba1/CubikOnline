import axios from "./axios.js";

export const timerPvPRequest = timerpvp => axios.post(`/timerpvp`, timerpvp);

export const getTimerPvPByIdRequest = (id) => axios.get(`/timerpvp/${id}`);

export const getTimerPvPRequest = () => axios.get(`/getTimerpvp`);

export const deleteTimerPvPByIdRequest = (id) => axios.delete(`/timerpvp/${id}`);

export const updateTimerPvPByIdRequest = (id, timerpvp) => axios.put(`/timerpvp/${id}`, timerpvp);

