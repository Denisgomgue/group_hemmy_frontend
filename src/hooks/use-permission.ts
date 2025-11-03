import { useState, useCallback, useEffect } from 'react';
import { PermissionAPI } from '@/services/permissions-api';
import { Permission, CreatePermissionDto, UpdatePermissionDto, PermissionQueryParams } from '@/types/permission';

export function usePermission() {
    const [ permissions, setPermissions ] = useState<Permission[]>([]);
    const [ isLoading, setIsLoading ] = useState(false);
    const [ error, setError ] = useState<Error | null>(null);

    const fetchPermissions = useCallback(async (params?: PermissionQueryParams) => {
        setIsLoading(true);
        setError(null);
        try {
            const data = await PermissionAPI.getAll(params);
            setPermissions(data);
            return data;
        } catch (err) {
            const error = err instanceof Error ? err : new Error('Error al cargar permisos');
            setError(error);
            throw error;
        } finally {
            setIsLoading(false);
        }
    }, []);

    // Cargar permisos al montar
    useEffect(() => {
        fetchPermissions();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const refreshPermissions = useCallback(async (params?: PermissionQueryParams) => {
        return await fetchPermissions(params);
    }, [ fetchPermissions ]);

    const createPermission = useCallback(async (permissionData: CreatePermissionDto) => {
        try {
            const newPermission = await PermissionAPI.create(permissionData);
            await fetchPermissions();
            return newPermission;
        } catch (err) {
            throw err;
        }
    }, [ fetchPermissions ]);

    const updatePermission = useCallback(async (id: number, permissionData: UpdatePermissionDto) => {
        try {
            const updatedPermission = await PermissionAPI.update(id, permissionData);
            await fetchPermissions();
            return updatedPermission;
        } catch (err) {
            throw err;
        }
    }, [ fetchPermissions ]);

    const deletePermission = useCallback(async (id: number) => {
        try {
            await PermissionAPI.delete(id);
            await fetchPermissions();
        } catch (err) {
            throw err;
        }
    }, [ fetchPermissions ]);

    return {
        permissions,
        isLoading,
        error,
        fetchPermissions,
        refreshPermissions,
        createPermission,
        updatePermission,
        deletePermission,
    };
}

