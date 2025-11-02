import api from '@/lib/axios';
import { Sector, CreateSectorDto, UpdateSectorDto, SectorQueryParams } from '@/types/sector';

export const SectorsAPI = {
    getAll: async (params?: SectorQueryParams): Promise<Sector[]> => {
        const response = await api.get<Sector[]>('/sector', { params });
        return response.data;
    },

    getById: async (id: number): Promise<Sector> => {
        const response = await api.get<Sector>(`/sector/${id}`);
        return response.data;
    },

    create: async (data: CreateSectorDto): Promise<Sector> => {
        const response = await api.post<Sector>('/sector', data);
        return response.data;
    },

    update: async (id: number, data: UpdateSectorDto): Promise<Sector> => {
        const response = await api.patch<Sector>(`/sector/${id}`, data);
        return response.data;
    },

    delete: async (id: number): Promise<void> => {
        await api.delete(`/sector/${id}`);
    },
};

