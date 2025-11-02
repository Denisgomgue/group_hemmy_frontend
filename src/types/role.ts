// Tipos para roles según backend
export interface Role {
    id: number;
    code: string;
    name: string;
    description?: string;
    isActive: boolean;
    created_at: string;
    updated_at: string;
}

export interface CreateRoleDto {
    code: string;
    name: string;
    description?: string;
    isActive?: boolean;
}

export interface UpdateRoleDto {
    code?: string;
    name?: string;
    description?: string;
    isActive?: boolean;
}
