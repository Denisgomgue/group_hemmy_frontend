import { useState, useEffect, useCallback } from 'react';
import { PermissionAPI } from '@/services/permissions-api';
import { Permission } from '@/types/permission';
import { useRoles } from './use-roles';
import { rolesApi } from '@/services/roles-api';
import { toast } from 'sonner';
import { Role } from '@/types/role';

export function usePermissionsAPI() {
    const { roles: rolesData, isLoading: isLoadingRoles } = useRoles();
    const [ permissions, setPermissions ] = useState<Permission[]>([]);
    const [ isLoadingPermissions, setIsLoadingPermissions ] = useState(false);
    const [ permissionMatrix, setPermissionMatrix ] = useState<any>({});
    const [ hasChanges, setHasChanges ] = useState(false);
    const [ isSaving, setIsSaving ] = useState(false);
    const [ permissionsByResource, setPermissionsByResource ] = useState<Record<string, Permission[]>>({});

    // Cargar permisos
    const loadPermissions = useCallback(async () => {
        setIsLoadingPermissions(true);
        try {
            const data = await PermissionAPI.getAll();
            setPermissions(data);
            return data;
        } catch (error) {
            console.error('Error loading permissions:', error);
            toast.error('Error al cargar permisos');
            return [];
        } finally {
            setIsLoadingPermissions(false);
        }
    }, []);

    // Cargar permisos por recurso
    const loadPermissionsByResource = useCallback(async (resource: string) => {
        try {
            // Siempre cargar permisos frescos desde el backend
            const allPermissions = await PermissionAPI.getAll();
            setPermissions(allPermissions);

            // Filtrar permisos por recurso si el código tiene formato "recurso:accion"
            // Si no hay recurso o es 'all', devolver todos los permisos
            const filteredPermissions = !resource || resource === 'all'
                ? allPermissions
                : allPermissions.filter(p => {
                    // El código puede tener formato "recurso:accion" o solo "recurso"
                    const codeParts = p.code.split(':');
                    const permissionResource = codeParts.length > 1 ? codeParts[ 0 ] : p.code.split('_')[ 0 ];
                    return permissionResource.toLowerCase() === resource.toLowerCase() ||
                        p.code.toLowerCase().includes(resource.toLowerCase());
                });

            setPermissionsByResource(prev => ({
                ...prev,
                [ resource ]: filteredPermissions
            }));
            return filteredPermissions;
        } catch (error) {
            console.error('Error loading permissions by resource:', error);
            toast.error('Error al cargar permisos');
            return [];
        }
    }, []);

    // Cargar todo
    const loadAllData = useCallback(async () => {
        await Promise.all([
            loadPermissions()
        ]);
    }, [ loadPermissions ]);

    // Funciones de roles
    const createRole = useCallback(async (roleData: any) => {
        try {
            const newRole = await rolesApi.create(roleData);
            toast.success('Rol creado exitosamente');
            return newRole;
        } catch (error: any) {
            const errorMessage = error?.response?.data?.message || 'Error al crear el rol';
            toast.error(errorMessage);
            throw error;
        }
    }, []);

    const updateRole = useCallback(async (id: number, roleData: any) => {
        try {
            const updatedRole = await rolesApi.update(id, roleData);
            toast.success('Rol actualizado exitosamente');
            return updatedRole;
        } catch (error: any) {
            const errorMessage = error?.response?.data?.message || 'Error al actualizar el rol';
            toast.error(errorMessage);
            throw error;
        }
    }, []);

    const deleteRole = useCallback(async (id: number) => {
        try {
            await rolesApi.delete(id);
            toast.success('Rol eliminado exitosamente');
        } catch (error: any) {
            const errorMessage = error?.response?.data?.message || 'Error al eliminar el rol';
            toast.error(errorMessage);
            throw error;
        }
    }, []);

    const loadRoles = useCallback(async () => {
        // El hook useRoles ya maneja esto automáticamente
        // Esta función es solo para compatibilidad
        return rolesData;
    }, [ rolesData ]);

    // Funciones de matriz de permisos (stubs por ahora)
    const updateMatrixPermission = useCallback((roleName: string, module: string, permission: string, granted: boolean) => {
        setPermissionMatrix((prev: any) => ({
            ...prev,
            [ roleName ]: {
                ...prev[ roleName ],
                [ module ]: {
                    ...prev[ roleName ]?.[ module ],
                    [ permission ]: granted
                }
            }
        }));
        setHasChanges(true);
    }, []);

    const getMatrixPermissionStatus = useCallback((roleName: string, module: string, permission: string) => {
        return permissionMatrix[ roleName ]?.[ module ]?.[ permission ] || false;
    }, [ permissionMatrix ]);

    const updatePermissionMatrix = useCallback(async (matrix: any) => {
        setIsSaving(true);
        try {
            // TODO: Implementar guardado de matriz de permisos cuando el backend lo soporte
            console.log('Guardando matriz de permisos:', matrix);
            toast.success('Permisos guardados correctamente');
            setHasChanges(false);
        } catch (error) {
            toast.error('Error al guardar permisos');
            throw error;
        } finally {
            setIsSaving(false);
        }
    }, []);

    // Funciones de allowAll
    // Nota: El backend no tiene allowAll, así que lo determinamos por el código o nombre del rol
    const isRoleAllowAll = useCallback((roleName: string) => {
        const role = (rolesData as Role[])?.find((r: Role) => r.name === roleName);
        // Consideramos Super Admin si el código es 'SUPERADMIN' o 'SUPER_ADMIN' o el nombre contiene 'Super Admin'
        return role?.code === 'SUPERADMIN' || role?.code === 'SUPER_ADMIN' || role?.name.toLowerCase().includes('super admin') || false;
    }, [ rolesData ]);

    const isRoleEditable = useCallback((roleName: string) => {
        return !isRoleAllowAll(roleName);
    }, [ isRoleAllowAll ]);

    const isRoleDeletable = useCallback((roleName: string) => {
        return !isRoleAllowAll(roleName);
    }, [ isRoleAllowAll ]);

    const getMatrixPermissionStatusWithAllowAll = useCallback((roleName: string, module: string, permission: string) => {
        if (isRoleAllowAll(roleName)) {
            return true;
        }
        return getMatrixPermissionStatus(roleName, module, permission);
    }, [ isRoleAllowAll, getMatrixPermissionStatus ]);

    const updateMatrixPermissionWithAllowAll = useCallback((roleName: string, module: string, permission: string, granted: boolean) => {
        if (isRoleAllowAll(roleName)) {
            toast.warning('No se pueden modificar permisos del Super Administrador');
            return;
        }
        updateMatrixPermission(roleName, module, permission, granted);
    }, [ isRoleAllowAll, updateMatrixPermission ]);

    // Funciones de módulos (stubs)
    const createModule = useCallback(async (moduleData: any) => {
        toast.info('Función de crear módulo en desarrollo');
        return null;
    }, []);

    // Cargar permisos al montar
    useEffect(() => {
        loadPermissions();
    }, [ loadPermissions ]);

    return {
        // Datos
        roles: rolesData || [],
        permissions,
        modules: [], // Por ahora vacío, se puede implementar cuando haya módulos en el backend
        permissionMatrix,
        permissionsByResource,

        // Estados de carga
        isLoadingRoles,
        isLoadingModules: false,
        isLoadingMatrix: false,
        isLoadingResourcePermissions: isLoadingPermissions,

        // Funciones de roles
        createRole,
        updateRole,
        deleteRole,
        loadRoles,

        // Funciones de permisos
        loadPermissions,
        loadPermissionsByResource,
        loadAllData,

        // Funciones de matriz
        updateMatrixPermission,
        getMatrixPermissionStatus,
        updatePermissionMatrix,
        getMatrixPermissionStatusWithAllowAll,
        updateMatrixPermissionWithAllowAll,

        // Funciones de allowAll
        isRoleAllowAll,
        isRoleEditable,
        isRoleDeletable,

        // Funciones de módulos
        createModule,

        // Estado de cambios
        hasChanges,
        setHasChanges,
        isSaving,
    };
}

