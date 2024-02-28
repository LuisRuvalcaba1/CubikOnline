import axios from './axios';

export const registerRequest = user => axios.post(`/register`, user)

export const loginRequest = user => axios.post(`/login`, user)

export const verifyTokenRequest = () => axios.get(`/verify`)

export const timerRequest = (time, scramble, session) => axios.post(`/timerul`, time, scramble, session)