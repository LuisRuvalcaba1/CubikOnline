import axios from "../api/axios";

export const createStoreRequest = (user, product) => axios.post(`/store`, user, product)

export const getStoresRequest = () => axios.get(`/store`)

export const getStoreRequest = id => axios.get(`/store/`,id)

export const updateStoreRequest = (id, store) => axios.put(`/store/`, id, store)

export const deleteStoreRequest = id => axios.delete(`/store/`,id)