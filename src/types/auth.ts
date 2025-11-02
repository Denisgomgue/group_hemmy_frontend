// Tipos para autenticación
export interface LoginCredentials {
    email: string;
    password: string;
}

export interface User {
    id: number;
    email: string;
    actorId: number;
    actor?: {
        id: number;
        displayName: string;
        person?: {
            id: number;
            firstName: string;
            lastName: string;
            email: string;
        };
    };
}

export interface LoginResponse {
    message: string;
    user: User;
}
