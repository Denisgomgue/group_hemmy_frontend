// Tipos para recursos según backend
export interface Resource {
    id: number;
    routeCode: string;
    name: string;
    description?: string;
    isActive: boolean;
    orderIndex: number;
    created_at: string;
    updated_at: string;
}

export interface CreateResourceDto {
    routeCode: string;
    name: string;
    description?: string;
    isActive?: boolean;
    orderIndex?: number;
}

export interface UpdateResourceDto {
    routeCode?: string;
    name?: string;
    description?: string;
    isActive?: boolean;
    orderIndex?: number;
}

export interface ResourceQueryParams {
    page?: number;
    limit?: number;
    search?: string;
}

