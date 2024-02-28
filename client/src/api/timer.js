import axios from "./axios.js";

export const timerRequest = timer => axios.post(`/timerul`, timer)

export const getTimersRequest = () => axios.get(`/timerul`)
export const getTimerByIdRequest = id => axios.get(`/timerul/${id}`)

export const deleteTimerByIdRequest = id => axios.delete(`/timerul/${id}`)