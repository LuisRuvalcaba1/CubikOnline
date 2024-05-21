import axios from 'axios';

const URL = import.meta.env.VITE_BACKEND_URL;

const instance = axios.create({
    baseURL: "http://localhost:4000/api",
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true, 
});

export default instance;