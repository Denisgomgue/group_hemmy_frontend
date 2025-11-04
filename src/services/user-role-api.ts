import api from '@/lib/axios';

export interface UserRole {
    id: number;
    UserId: number;
    roleId: number;
    assignedAt: string;
    role?: {
        id: number;
        code: string;
        name: string;
        isSystem: boolean;
    };
    user?: {
        id: number;
    };
}

export interface CreateUserRoleDto {
    UserId: number;
    roleId: number;
    assignedAt?: Date;
}

export const UserRoleAPI = {
    getAll: async (userId?: number): Promise<UserRole[]> => {
        const response = await api.get<UserRole[]>('/user-role');
        const data = response.data;
        // Normalizar los datos para asegurar que tenemos roleId y UserId
        const normalized = data.map(ur => ({
            ...ur,
            // Asegurar que roleId exista (puede venir de role.id o directamente como roleId)
            roleId: ur.roleId || (ur.role?.id),
            // Asegurar que UserId exista (puede venir de user.id o directamente como UserId)
            UserId: ur.UserId || (ur.user?.id),
        }));
        // Filtrar por userId si se proporciona
        if (userId) {
            return normalized.filter(ur => ur.UserId === userId);
        }
        return normalized;
    },

    getById: async (id: number): Promise<UserRole> => {
        const response = await api.get<UserRole>(`/user-role/${id}`);
        return response.data;
    },

    create: async (data: CreateUserRoleDto): Promise<UserRole> => {
        const response = await api.post<UserRole>('/user-role', data);
        return response.data;
    },

    delete: async (id: number): Promise<void> => {
        await api.delete(`/user-role/${id}`);
    },
};

