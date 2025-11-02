import api from '@/lib/axios';
import { Actor } from '@/types/user';

export interface CreateActorDto {
    kind: 'PERSON' | 'ORGANIZATION';
    displayName: string;
    personId?: number;
    organizationId?: number;
}

export const ActorAPI = {
    create: async (data: CreateActorDto): Promise<Actor> => {
        const response = await api.post<Actor>('/actor', data);
        return response.data;
    },

    update: async (id: number, data: Partial<CreateActorDto>): Promise<Actor> => {
        const response = await api.patch<Actor>(`/actor/${id}`, data);
        return response.data;
    },

    getById: async (id: number): Promise<Actor> => {
        const response = await api.get<Actor>(`/actor/${id}`);
        return response.data;
    },
};

