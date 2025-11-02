import api from '../api';
import { User, LoginCredentials } from '@/types/auth';

export interface LoginResponse {
    message: string;
    user: User;
}

export interface RefreshResponse {
    message: string;
}

export const authApi = {
    login: async (credentials: LoginCredentials): Promise<LoginResponse> => {
        const response = await api.post<LoginResponse>('/auth/login', credentials);
        return response.data;
    },

    logout: async (): Promise<void> => {
        await api.post('/auth/logout');
    },

    refresh: async (): Promise<RefreshResponse> => {
        const response = await api.post<RefreshResponse>('/auth/refresh');
        return response.data;
    },

    getProfile: async (): Promise<User> => {
        const response = await api.post<User>('/auth/profile');
        return response.data;
    },
};
