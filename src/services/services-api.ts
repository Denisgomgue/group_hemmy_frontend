import api from '@/lib/axios';
import { Service, CreateServiceDto, UpdateServiceDto, ServiceQueryParams } from '@/types/service';

export const ServicesAPI = {
    getAll: async (params?: ServiceQueryParams): Promise<Service[]> => {
        const response = await api.get<Service[]>('/service', { params });
        return response.data;
    },

    getById: async (id: number): Promise<Service> => {
        const response = await api.get<Service>(`/service/${id}`);
        return response.data;
    },

    create: async (data: CreateServiceDto): Promise<Service> => {
        const response = await api.post<Service>('/service', data);
        return response.data;
    },

    update: async (id: number, data: UpdateServiceDto): Promise<Service> => {
        const response = await api.patch<Service>(`/service/${id}`, data);
        return response.data;
    },

    delete: async (id: number): Promise<void> => {
        await api.delete(`/service/${id}`);
    },
};

