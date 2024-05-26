import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

const root = ReactDOM.createRoot(document.getElementById('root'));

// Función para manejar el evento beforeunload
const handleBeforeUnload = (event) => {
  // Obtener el token del localStorage
  const token = localStorage.getItem('token');

  // Si hay un token, se impide la recarga de la página
  if (token) {
    event.preventDefault();
    event.returnValue = '';
  }
};

root.render(
    <App />
);

// Agregar el evento beforeunload al objeto window
window.addEventListener('beforeunload', handleBeforeUnload);

// Limpiar el evento al desmontar el componente
window.removeEventListener('beforeunload', handleBeforeUnload);