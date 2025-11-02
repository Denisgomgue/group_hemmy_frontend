// Configuración de la API
export const API_CONFIG = {
    // URL del backend
    BASE_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000',

    // Endpoints específicos
    ENDPOINTS: {
        COMPANY: {
            BASE: '/company',
            LOGO: (id: number, type: string) => `/company/${id}/logo/${type}`,
            UPDATE: (id: number) => `/company/${id}`,
            INFO: '/company/info',
            ACTIVE: '/company'
        },
        AUTH: {
            PROFILE: '/auth/profile',
            LOGIN: '/auth/login',
            LOGOUT: '/auth/logout'
        }
    }
};

// Función helper para construir URLs completas
export function buildApiUrl(endpoint: string): string {
    return `${API_CONFIG.BASE_URL}${endpoint}`;
}
