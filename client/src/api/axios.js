import axios from 'axios';

const instance = axios.create({
    baseURL: 'http://localhost:4000/api',
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true,
    credentials: 'include',
});

const handleAuthError = () => {
    console.log('Error de autenticación, redirigiendo al usuario a la página de inicio de sesión');
    window.location.href = '/login';

};

instance.interceptors.response.use(
    (response) => response,
    (error) => {
        const { status } = error.response || { status: null };

        if (status === 401 || status === 403) {
            // Errores de autenticación (token expirado, token inválido, etc.)
            handleAuthError(error);
            return Promise.reject(error);
        } else if (status >= 400 && status < 500) {
            // Errores de cliente (solicitud incorrecta, validación fallida, etc.)
            console.log('Error de cliente:', error.response.data);
            return Promise.reject(error);
        } else if (status === null) {
            // Errores de red (sin conexión a internet, servidor caído, etc.)
            console.log('Error de red');
            return Promise.reject(error);
        } else {
            // Otros errores
            console.log('Error inesperado:', error.response.data);
            return Promise.reject(error);
        }
    }
);
export default instance;