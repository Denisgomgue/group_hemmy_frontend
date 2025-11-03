import api from '@/lib/axios';
import { Role, CreateRoleDto, UpdateRoleDto, RoleQueryParams } from '@/types/role';

export const RoleAPI = {
    getAll: async (params?: RoleQueryParams): Promise<Role[]> => {
        const response = await api.get<Role[]>('/role', { params });
        return response.data;
    },

    getById: async (id: number): Promise<Role> => {
        const response = await api.get<Role>(`/role/${id}`);
        return response.data;
    },

    create: async (data: CreateRoleDto): Promise<Role> => {
        const response = await api.post<Role>('/role', data);
        return response.data;
    },

    update: async (id: number, data: UpdateRoleDto): Promise<Role> => {
        const response = await api.patch<Role>(`/role/${id}`, data);
        return response.data;
    },

    delete: async (id: number): Promise<void> => {
        await api.delete(`/role/${id}`);
    },
};

// Mantener la exportación anterior para compatibilidad
export const rolesApi = RoleAPI;
