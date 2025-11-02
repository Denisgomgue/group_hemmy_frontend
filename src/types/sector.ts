// Tipos para sectores según backend
export interface Sector {
    id: number;
    name: string;
    description?: string;
    created_at: string;
    updated_at: string;
}

export interface CreateSectorDto {
    name: string;
    description?: string;
}

export interface UpdateSectorDto {
    name?: string;
    description?: string;
}

export interface SectorQueryParams {
    page?: number;
    limit?: number;
    search?: string;
}

