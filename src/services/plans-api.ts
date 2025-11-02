import api from '@/lib/axios';
import { Plan, CreatePlanDto, UpdatePlanDto, PlanQueryParams } from '@/types/plan';

export const PlansAPI = {
    getAll: async (params?: PlanQueryParams): Promise<Plan[]> => {
        const response = await api.get<Plan[]>('/plan', { params });
        return response.data;
    },

    getById: async (id: number): Promise<Plan> => {
        const response = await api.get<Plan>(`/plan/${id}`);
        return response.data;
    },

    create: async (data: CreatePlanDto): Promise<Plan> => {
        const response = await api.post<Plan>('/plan', data);
        return response.data;
    },

    update: async (id: number, data: UpdatePlanDto): Promise<Plan> => {
        const response = await api.patch<Plan>(`/plan/${id}`, data);
        return response.data;
    },

    delete: async (id: number): Promise<void> => {
        await api.delete(`/plan/${id}`);
    },
};

