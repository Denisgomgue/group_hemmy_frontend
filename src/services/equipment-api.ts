import api from '@/lib/axios';
import { Equipment, CreateEquipmentDto, UpdateEquipmentDto, EquipmentQueryParams, EquipmentCategory } from '@/types/equipment';

export const EquipmentAPI = {
    getAll: async (params?: EquipmentQueryParams): Promise<Equipment[]> => {
        const response = await api.get('/equipment', { params });
        return response.data;
    },

    getById: async (id: number): Promise<Equipment> => {
        const response = await api.get(`/equipment/${id}`);
        return response.data;
    },

    create: async (data: CreateEquipmentDto): Promise<Equipment> => {
        const response = await api.post('/equipment', data);
        return response.data;
    },

    update: async (id: number, data: UpdateEquipmentDto): Promise<Equipment> => {
        const response = await api.patch(`/equipment/${id}`, data);
        return response.data;
    },

    delete: async (id: number): Promise<void> => {
        await api.delete(`/equipment/${id}`);
    },
};

export const EquipmentCategoriesAPI = {
    getAll: async (): Promise<EquipmentCategory[]> => {
        const response = await api.get('/equipment-categories');
        return response.data;
    },
};

