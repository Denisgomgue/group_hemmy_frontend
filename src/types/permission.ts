// Tipos para permisos según backend
import { Resource } from './resource';

export interface Permission {
    id: number;
    code: string;
    name: string;
    description?: string;
    resourceId?: number;
    resource?: Resource;
    created_at: string;
    updated_at: string;
}

export interface CreatePermissionDto {
    code: string;
    name: string;
    description?: string;
    resourceId?: number;
}

export interface UpdatePermissionDto {
    code?: string;
    name?: string;
    description?: string;
    resourceId?: number;
}

export interface PermissionQueryParams {
    page?: number;
    limit?: number;
    search?: string;
}
