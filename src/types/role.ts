// Tipos para roles según backend
export interface Role {
    id: number;
    code: string;
    name: string;
    description?: string;
    isSystem: boolean;
    created_at: string;
    updated_at: string;
}

export interface CreateRoleDto {
    code: string;
    name: string;
    description?: string;
    isSystem?: boolean;
}

export interface UpdateRoleDto {
    code?: string;
    name?: string;
    description?: string;
    isSystem?: boolean;
}

export interface RoleQueryParams {
    page?: number;
    limit?: number;
    search?: string;
}
