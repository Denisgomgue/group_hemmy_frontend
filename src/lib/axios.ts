import axios from 'axios';
import { toast } from 'sonner';

// El backend usa cookies HTTP-only para manejar la autenticación
// Las cookies se envían automáticamente con withCredentials: true
export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Las cookies HTTP-only se envían automáticamente
});

// Interceptor para manejar errores de respuesta
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response) {
      // Error de autenticación
      if (error.response.status === 401) {
        // Limpiar localStorage
        if (typeof window !== 'undefined') {
          localStorage.removeItem('userProfile');
          localStorage.removeItem('passwordHash');
          window.location.href = '/login';
        }
      }

      // Mostrar mensaje de error
      const errorMessage = error.response.data?.message || 'Ha ocurrido un error';
      toast.error(errorMessage);
    } else {
      toast.error('Error de conexión con el servidor');
    }
    return Promise.reject(error);
  }
);

export default api;
