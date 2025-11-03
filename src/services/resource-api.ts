import api from '@/lib/axios';
import { Resource, CreateResourceDto, UpdateResourceDto, ResourceQueryParams } from '@/types/resource';

export const ResourceAPI = {
    getAll: async (params?: ResourceQueryParams): Promise<Resource[]> => {
        const response = await api.get<Resource[]>('/resource', { params });
        return response.data;
    },

    getById: async (id: number): Promise<Resource> => {
        const response = await api.get<Resource>(`/resource/${id}`);
        return response.data;
    },

    create: async (data: CreateResourceDto): Promise<Resource> => {
        const response = await api.post<Resource>('/resource', data);
        return response.data;
    },

    update: async (id: number, data: UpdateResourceDto): Promise<Resource> => {
        const response = await api.patch<Resource>(`/resource/${id}`, data);
        return response.data;
    },

    delete: async (id: number): Promise<void> => {
        await api.delete(`/resource/${id}`);
    },
};

