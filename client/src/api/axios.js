import axios from 'axios';
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const instance = axios.create({
    baseURL: `${BACKEND_URL}/api`,
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true,
    credentials: 'include',
});

export default instance;