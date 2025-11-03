import { Role } from './role';
import { Permission } from './permission';

export interface RolePermission {
    id: number;
    roleId: number;
    permissionId: number;
    created_at: string;
    role?: Role;
    permission?: Permission;
}

export interface CreateRolePermissionDto {
    roleId: number;
    permissionId: number;
}

export interface UpdateRolePermissionDto {
    roleId?: number;
    permissionId?: number;
}

export interface RolePermissionQueryParams {
    roleId?: number;
    permissionId?: number;
}

