import api from '@/lib/axios';
import { Client, CreateClientDto, UpdateClientDto, ClientQueryParams } from '@/types/client';

export const ClientsAPI = {
    getAll: async (params?: ClientQueryParams): Promise<Client[]> => {
        const response = await api.get<Client[]>('/client', { params });
        return response.data;
    },

    getById: async (id: number): Promise<Client> => {
        const response = await api.get<Client>(`/client/${id}`);
        return response.data;
    },

    create: async (data: CreateClientDto): Promise<Client> => {
        const response = await api.post<Client>('/client', data);
        return response.data;
    },

    update: async (id: number, data: UpdateClientDto): Promise<Client> => {
        const response = await api.patch<Client>(`/client/${id}`, data);
        return response.data;
    },

    delete: async (id: number): Promise<void> => {
        await api.delete(`/client/${id}`);
    },
};

