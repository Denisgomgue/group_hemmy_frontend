import api from '@/lib/axios';

export interface CreateOrganizationDto {
    legalName: string;
    documentType: 'RUC';
    documentNumber: string;
    email: string;
    phone?: string;
    address?: string;
    representativePersonId?: number;
}

export interface Organization {
    id: number;
    legalName: string;
    documentType: 'RUC';
    documentNumber: string;
    email: string;
    phone?: string;
    address?: string;
    representativePersonId?: number;
    created_at: string;
    updated_at: string;
}

export const OrganizationAPI = {
    create: async (data: CreateOrganizationDto): Promise<Organization> => {
        const response = await api.post<Organization>('/organization', data);
        return response.data;
    },

    update: async (id: number, data: Partial<CreateOrganizationDto>): Promise<Organization> => {
        const response = await api.patch<Organization>(`/organization/${id}`, data);
        return response.data;
    },

    getById: async (id: number): Promise<Organization> => {
        const response = await api.get<Organization>(`/organization/${id}`);
        return response.data;
    },

    getAll: async (): Promise<Organization[]> => {
        const response = await api.get<Organization[]>('/organization');
        return response.data;
    },
};

