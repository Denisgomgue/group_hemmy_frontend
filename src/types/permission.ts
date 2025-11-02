// Tipos para permisos según backend
export interface Permission {
    id: number;
    code: string;
    name: string;
    description?: string;
    resource?: string;
    action?: string;
}

export interface CreatePermissionDto {
    code: string;
    name: string;
    description?: string;
    resource?: string;
    action?: string;
}

export interface UpdatePermissionDto {
    code?: string;
    name?: string;
    description?: string;
    resource?: string;
    action?: string;
}
