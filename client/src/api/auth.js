import axios from './axios';

export const registerRequest = user => axios.post(`/register`, user)

export const loginRequest = user => axios.post(`/login`, user)

export const verifyTokenRequest = () => axios.get(`/verify`)

export const updatePasswordRequest = (email, newPassword) => axios.put(`/account/password/`, email, newPassword)

