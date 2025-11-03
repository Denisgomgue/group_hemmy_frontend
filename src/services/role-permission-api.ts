import api from '@/lib/axios';
import { RolePermission, CreateRolePermissionDto, UpdateRolePermissionDto, RolePermissionQueryParams } from '@/types/role-permission';

export const RolePermissionAPI = {
    getAll: async (params?: RolePermissionQueryParams): Promise<RolePermission[]> => {
        const response = await api.get<RolePermission[]>('/role-permission', { params });
        return response.data;
    },

    getById: async (id: number): Promise<RolePermission> => {
        const response = await api.get<RolePermission>(`/role-permission/${id}`);
        return response.data;
    },

    getByRoleId: async (roleId: number): Promise<RolePermission[]> => {
        const response = await api.get<RolePermission[]>('/role-permission', { params: { roleId } });
        return response.data;
    },

    getByPermissionId: async (permissionId: number): Promise<RolePermission[]> => {
        const response = await api.get<RolePermission[]>('/role-permission', { params: { permissionId } });
        return response.data;
    },

    create: async (data: CreateRolePermissionDto): Promise<RolePermission> => {
        const response = await api.post<RolePermission>('/role-permission', data);
        return response.data;
    },

    update: async (id: number, data: UpdateRolePermissionDto): Promise<RolePermission> => {
        const response = await api.patch<RolePermission>(`/role-permission/${id}`, data);
        return response.data;
    },

    delete: async (id: number): Promise<void> => {
        await api.delete(`/role-permission/${id}`);
    },
};

