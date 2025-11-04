import api from '@/lib/axios';
import { Payment, CreatePaymentDto, UpdatePaymentDto, PaymentQueryParams } from '@/types/payment';

export const PaymentAPI = {
    getAll: async (params?: PaymentQueryParams): Promise<{ data: Payment[]; total: number }> => {
        const response = await api.get<{ data: Payment[]; total: number }>('/payment', { params });
        return response.data;
    },

    getById: async (id: number): Promise<Payment> => {
        const response = await api.get<Payment>(`/payment/${id}`);
        return response.data;
    },

    create: async (data: CreatePaymentDto): Promise<Payment> => {
        const response = await api.post<Payment>('/payment', data);
        return response.data;
    },

    update: async (id: number, data: UpdatePaymentDto): Promise<Payment> => {
        const response = await api.patch<Payment>(`/payment/${id}`, data);
        return response.data;
    },

    delete: async (id: number): Promise<void> => {
        await api.delete(`/payment/${id}`);
    },

    // Métodos adicionales específicos de payments
    getSummary: async (period?: string): Promise<{
        totalRecaudado: number;
        pagosPagados: number;
        pagosPendientes: number;
        pagosAtrasados: number;
        pagosAnulados: number;
        periodoUtilizado: string;
    }> => {
        const response = await api.get('/payment/summary', { params: { period } });
        return response.data;
    },

    recalculateStates: async (): Promise<{ message: string }> => {
        const response = await api.post('/payment/recalculate-states');
        return response.data;
    },

    regenerateCodes: async (): Promise<{ total: number; updated: number }> => {
        const response = await api.post('/payment/regenerate-codes');
        return response.data;
    },
};

