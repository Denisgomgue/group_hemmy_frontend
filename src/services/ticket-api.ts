import api from '@/lib/axios';
import { Ticket, CreateTicketDto, UpdateTicketDto, TicketQueryParams } from '@/types/ticket';

export const TicketAPI = {
    getAll: async (params?: TicketQueryParams): Promise<Ticket[]> => {
        const response = await api.get<Ticket[]>('/ticket', { params });
        return response.data;
    },

    getById: async (id: number): Promise<Ticket> => {
        const response = await api.get<Ticket>(`/ticket/${id}`);
        return response.data;
    },

    create: async (data: CreateTicketDto): Promise<Ticket> => {
        const response = await api.post<Ticket>('/ticket', data);
        return response.data;
    },

    update: async (id: number, data: UpdateTicketDto): Promise<Ticket> => {
        const response = await api.patch<Ticket>(`/ticket/${id}`, data);
        return response.data;
    },

    delete: async (id: number): Promise<void> => {
        await api.delete(`/ticket/${id}`);
    },
};

