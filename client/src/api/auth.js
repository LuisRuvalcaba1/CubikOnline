import axios from './axios';

export const registerRequest = user => axios.post(`/register`, user)

export const removeTokenRequest = () => axios.post(`/remove-token`)

export const renewTokenRequest = () => axios.get(`/renew-token`)

export const loginRequest = user => axios.post(`/login`, user)

export const verifyTokenRequest = () => axios.get(`/verify`)

export const getUserByEmailRequest = email => axios.get(`/getUserByEmail`, email)

export const updatePasswordRequest = (email, newPassword) => axios.put(`/account/password/`, email, newPassword)

export const updateUserRequest = (email, points) => axios.put(`/profile/`, email ,points);

export const getUsersRequest = () => axios.get(`/`)

export const statusChangeRequest = (email, status, role) => axios.put(`/`, email, status, role)

export const changeToJugdeRequest = (email, role) => axios.put(`/torneo`,{ email, role})

export const updateUserRankRequest = (rank,user) => axios.put(`/rankingusers`, rank,user)