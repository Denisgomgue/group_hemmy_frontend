import api from '@/lib/axios';
import { Permission, CreatePermissionDto, UpdatePermissionDto } from '@/types/permission';

export const permissionsApi = {
    getAll: async (): Promise<Permission[]> => {
        const response = await api.get<Permission[]>('/permission');
        return response.data;
    },

    getById: async (id: number): Promise<Permission> => {
        const response = await api.get<Permission>(`/permission/${id}`);
        return response.data;
    },

    create: async (data: CreatePermissionDto): Promise<Permission> => {
        const response = await api.post<Permission>('/permission', data);
        return response.data;
    },

    update: async (id: number, data: UpdatePermissionDto): Promise<Permission> => {
        const response = await api.patch<Permission>(`/permission/${id}`, data);
        return response.data;
    },

    delete: async (id: number): Promise<void> => {
        await api.delete(`/permission/${id}`);
    },
};
