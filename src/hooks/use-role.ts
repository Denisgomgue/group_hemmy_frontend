import { useState, useCallback, useEffect } from 'react';
import { RoleAPI } from '@/services/roles-api';
import { Role, CreateRoleDto, UpdateRoleDto, RoleQueryParams } from '@/types/role';

export function useRole() {
    const [ roles, setRoles ] = useState<Role[]>([]);
    const [ isLoading, setIsLoading ] = useState(false);
    const [ error, setError ] = useState<Error | null>(null);

    const fetchRoles = useCallback(async (params?: RoleQueryParams) => {
        setIsLoading(true);
        setError(null);
        try {
            const data = await RoleAPI.getAll(params);
            setRoles(data);
            return data;
        } catch (err) {
            const error = err instanceof Error ? err : new Error('Error al cargar roles');
            setError(error);
            throw error;
        } finally {
            setIsLoading(false);
        }
    }, []);

    // Cargar roles al montar
    useEffect(() => {
        fetchRoles();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const refreshRoles = useCallback(async (params?: RoleQueryParams) => {
        return await fetchRoles(params);
    }, [ fetchRoles ]);

    const createRole = useCallback(async (roleData: CreateRoleDto) => {
        try {
            const newRole = await RoleAPI.create(roleData);
            await fetchRoles();
            return newRole;
        } catch (err) {
            throw err;
        }
    }, [ fetchRoles ]);

    const updateRole = useCallback(async (id: number, roleData: UpdateRoleDto) => {
        try {
            const updatedRole = await RoleAPI.update(id, roleData);
            await fetchRoles();
            return updatedRole;
        } catch (err) {
            throw err;
        }
    }, [ fetchRoles ]);

    const deleteRole = useCallback(async (id: number) => {
        try {
            await RoleAPI.delete(id);
            await fetchRoles();
        } catch (err) {
            throw err;
        }
    }, [ fetchRoles ]);

    return {
        roles,
        isLoading,
        error,
        fetchRoles,
        refreshRoles,
        createRole,
        updateRole,
        deleteRole,
    };
}

