import api from '@/lib/axios';
import { Permission, CreatePermissionDto, UpdatePermissionDto, PermissionQueryParams } from '@/types/permission';

export const PermissionAPI = {
    getAll: async (params?: PermissionQueryParams): Promise<Permission[]> => {
        const response = await api.get<Permission[]>('/permission', { params });
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

// Mantener la exportación anterior para compatibilidad
export const permissionsApi = PermissionAPI;
