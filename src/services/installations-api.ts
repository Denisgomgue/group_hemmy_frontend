import api from '@/lib/axios';
import { Installation, CreateInstallationDto, UpdateInstallationDto, InstallationQueryParams } from '@/types/installation';

export const InstallationsAPI = {
    getAll: async (params?: InstallationQueryParams): Promise<Installation[]> => {
        const response = await api.get<Installation[]>('/installation', { params });
        return response.data;
    },

    getById: async (id: number): Promise<Installation> => {
        const response = await api.get<Installation>(`/installation/${id}`);
        return response.data;
    },

    create: async (data: CreateInstallationDto): Promise<Installation> => {
        const response = await api.post<Installation>('/installation', data);
        return response.data;
    },

    update: async (id: number, data: UpdateInstallationDto): Promise<Installation> => {
        const response = await api.patch<Installation>(`/installation/${id}`, data);
        return response.data;
    },

    delete: async (id: number): Promise<void> => {
        await api.delete(`/installation/${id}`);
    },
};

