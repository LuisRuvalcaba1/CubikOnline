import axios from 'axios';

const URL = import.meta.env.VITE_BACKEND_URL;

const instance = axios.create({
    baseURL: `${URL}/api`,
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true, // Permite el envío de cookies
});

export default instance;