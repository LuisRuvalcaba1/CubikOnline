import axios from './axios';

export const registerRequest = user => axios.post(`/register`, user)

export const removeTokenRequest = () => axios.post(`/remove-token`)

export const renewTokenRequest = () => axios.get(`/renew-token`)

export const loginRequest = user => axios.post(`/login`, user)

export const getUserRequest = (id) => axios.get(`/users/${id}`)

export const verifyTokenRequest = () => axios.get(`/verify`)

export const updatePasswordRequest = (email, newPassword) => axios.put(`/account/password/`, email, newPassword)

export const updateUserRequest = (id, points) => axios.put(`/points/${id}` ,points);

export const getUsersRequest = () => axios.get(`/`);

export const statusChangeRequest = (email, status, role) => axios.put(`/`, email, status, role)

export const changeToJugdeRequest = (email, role) => axios.put(`/torneo`,{ email, role})

export const updateUserRankRequest = (rank,user) => axios.put(`/rankingusers`, rank,user)

export const isPrivateRequest = (email, isPrivate) => axios.put(`/isPrivate`,{ email, isPrivate});

export const getUserPrivateStatus = (email) => axios.get(`/user/private/${email}`);