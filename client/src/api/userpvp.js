import axios from "./axios.js";

export const createUserPvPRequest = userpvp => axios.post(`/userpvp`, userpvp);

export const getUserPvPRequest = () => axios.get(`/userpvp`);

export const deleteUserPvPByIdRequest = (id) => axios.delete(`/userpvp/${id}`);

export const updateUserPvPByIdRequest = (id, userpvp) => axios.put(`/userpvp/${id}`, userpvp);

export const getUserPvPByUserRequest = (user) => axios.get(`/userpvp/${user}`);