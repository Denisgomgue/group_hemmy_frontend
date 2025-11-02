import api from '@/lib/axios';
import {
    Subscription,
    CreateSubscriptionDto,
    UpdateSubscriptionDto,
    SubscriptionQueryParams
} from '@/types/subscription';

export const SubscriptionsAPI = {
    getAll: async (params?: SubscriptionQueryParams): Promise<Subscription[]> => {
        const response = await api.get('/subscription', { params });
        return response.data;
    },

    getById: async (id: number): Promise<Subscription> => {
        const response = await api.get(`/subscription/${id}`);
        return response.data;
    },

    create: async (data: CreateSubscriptionDto): Promise<Subscription> => {
        const response = await api.post('/subscription', data);
        return response.data;
    },

    update: async (id: number, data: UpdateSubscriptionDto): Promise<Subscription> => {
        const response = await api.patch(`/subscription/${id}`, data);
        return response.data;
    },

    delete: async (id: number): Promise<void> => {
        await api.delete(`/subscription/${id}`);
    },
};

