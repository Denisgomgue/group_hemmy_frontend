// Tipos para servicios según backend
export interface Service {
    id: number;
    name: string;
    description?: string;
    created_at: string;
    updated_at: string;
}

export interface CreateServiceDto {
    name: string;
    description?: string;
}

export interface UpdateServiceDto {
    name?: string;
    description?: string;
}

export interface ServiceQueryParams {
    page?: number;
    limit?: number;
    search?: string;
}

