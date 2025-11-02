import api from '@/lib/axios';

export interface CreatePersonDto {
    documentType: 'DNI';
    documentNumber: string;
    firstName: string;
    lastName: string;
    birthdate?: string;
    email: string;
    phone?: string;
    address?: string;
}

export interface Person {
    id: number;
    documentType: 'DNI';
    documentNumber: string;
    firstName: string;
    lastName: string;
    birthdate?: string;
    email: string;
    phone?: string;
    address?: string;
    created_at: string;
    updated_at: string;
}

export const PersonAPI = {
    create: async (data: CreatePersonDto): Promise<Person> => {
        const response = await api.post<Person>('/person', data);
        return response.data;
    },

    update: async (id: number, data: Partial<CreatePersonDto>): Promise<Person> => {
        const response = await api.patch<Person>(`/person/${id}`, data);
        return response.data;
    },

    getById: async (id: number): Promise<Person> => {
        const response = await api.get<Person>(`/person/${id}`);
        return response.data;
    },
};

