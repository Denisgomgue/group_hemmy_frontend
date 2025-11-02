import api from '@/lib/axios';
import { User, CreateUserDto, UpdateUserDto, UserQueryParams } from '@/types/user';

export const UsersAPI = {
    getAll: async (params?: UserQueryParams): Promise<User[]> => {
        const response = await api.get<User[]>('/users', { params });
        return response.data;
    },

    getById: async (id: number): Promise<User> => {
        const response = await api.get<User>(`/users/${id}`);
        return response.data;
    },

    create: async (data: CreateUserDto): Promise<User> => {
        const response = await api.post<User>('/users', data);
        return response.data;
    },

    update: async (id: number, data: UpdateUserDto): Promise<User> => {
        const response = await api.patch<User>(`/users/${id}`, data);
        return response.data;
    },

    delete: async (id: number): Promise<void> => {
        await api.delete(`/users/${id}`);
    },
};
