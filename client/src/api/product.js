import axios from "../api/axios";

export const createProductRequest = product => axios.post(`/product`, product)

export const getProductsRequest = () => axios.get(`/product`)

export const getProductRequest = id => axios.get(`/product/`, id)

export const updateProductRequest = (id, product) => axios.put(`/product/`, id, product)

export const deleteProductRequest = id => axios.delete(`/product/`,id)

