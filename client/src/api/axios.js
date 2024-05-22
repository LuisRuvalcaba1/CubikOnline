import axios from 'axios';

const URL = import.meta.env.VITE_BACKEND_URL;

const instance = axios.create({
    baseURL: `${URL}/api`,
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true, 
});

const getToken = () => {
    return localStorage.getItem('token');
};

// Middleware para agregar el token a las solicitudes autenticadas
instance.interceptors.request.use(
    config => {
        const token = getToken();
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    error => {
        return Promise.reject(error);
    }
);

export default instance;