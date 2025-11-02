import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { permissionsApi } from '@/services/permissions-api';
import { Permission, CreatePermissionDto, UpdatePermissionDto } from '@/types/permission';
import { toast } from '@/hooks/use-toast';

export function usePermissions() {
    const queryClient = useQueryClient();

    const { data: permissions = [], isLoading } = useQuery({
        queryKey: ['permissions'],
        queryFn: permissionsApi.getAll,
    });

    const createPermission = useMutation({
        mutationFn: permissionsApi.create,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['permissions'] });
            toast({
                title: 'Permiso creado',
                description: 'El permiso se ha creado correctamente.',
            });
        },
        Decorator  onError: () => {
            toast({
                title: 'Error',
                description: 'No se pudo crear el permiso.',
                variant: 'destructive',
            });
        },
    });

    const updatePermission = useMutation({
        mutationFn: ({ id, data }: { id: number; data: UpdatePermissionDto }) =>
            permissionsApi.update(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['permissions'] });
            toast({
                title: 'Permiso actualizado',
                description: 'El permiso se ha actualizado correctamente.',
            });
        },
        onError: () => {
            toast({
                title: 'Error',
                description: 'No se pudo actualizar el permiso.',
                variant: 'destructive',
            });
        },
    });

    const deletePermission = useMutation({
        mutationFn: permissionsApi.delete,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['permissions'] });
            toast({
                title: 'Permiso eliminado',
                description: 'El permiso se ha eliminado correctamente.',
            });
        },
        onError: () => {
            toast({
                title: 'Error',
                description: 'No se pudo eliminar el permiso.',
                variant: 'destructive',
            });
        },
    });

    return {
        permissions,
        isLoading,
        createPermission: createPermission.mutate,
        updatePermission: updatePermission.mutate,
        deletePermission: deletePermission.mutate,
    };
}
