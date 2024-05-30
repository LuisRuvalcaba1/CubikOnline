import axios from './axios';

export const getRankRequest = () => axios.get(`/rank`);

export const addRankRequest = (user, rank, avg_time) => axios.post(`/rank`, { user, rank, avg_time });

export const deleteRankRequest = (id) => axios.delete(`/rankDelete/${id}`);

export const updateRankRequest = (id, rank, avg_time) => axios.put(`/rankUpdate/${id}`, { rank, avg_time });

export const getRankByUserRequest = (id) => axios.get(`/rankUser/${id}`);