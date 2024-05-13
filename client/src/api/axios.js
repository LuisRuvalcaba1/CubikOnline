import axios from 'axios';
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:4000";

const instance = axios.create({
    baseURL: 'http://localhost:4000/api',
    withCredentials: true,
});

export default instance;