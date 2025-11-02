import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { rolesApi } from '@/services/roles-api';
import { Role, CreateRoleDto, UpdateRoleDto } from '@/types/role';
import { toast } from '@/hooks/use-toast';

export function useRoles() {
    const queryClient = useQueryClient();

    const { data: roles = [], isLoading } = useQuery({
        queryKey: [ 'roles' ],
        queryFn: rolesApi.getAll,
    });

    const createRole = useMutation({
        mutationFn: rolesApi.create,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [ 'roles' ] });
            toast({
                title: 'Rol creado',
                description: 'El rol se ha creado correctamente.',
            });
        },
        onError: () => {
            toast({
                title: 'Error',
                description: 'No se pudo crear el rol.',
                variant: 'destructive',
            });
        },
    });

    const updateRole = useMutation({
        mutationFn: ({ id, data }: { id: number; data: UpdateRoleDto }) =>
            rolesApi.update(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [ 'roles' ] });
            toast({
                title: 'Rol actualizado',
                description: 'El rol se ha actualizado correctamente.',
            });
        },
        onError: () => {
            toast({
                title: 'Error',
                description: 'No se pudo actualizar el rol.',
                variant: 'destructive',
            });
        },
    });

    const deleteRole = useMutation({
        mutationFn: rolesApi.delete,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [ 'roles' ] });
            toast({
                title: 'Rol eliminado',
                description: 'El rol se ha eliminado correctamente.',
            });
        },
        onError: () => {
            toast({
                title: 'Error',
                description: 'No se pudo eliminar el rol.',
                variant: 'destructive',
            });
        },
    });

    return {
        roles,
        isLoading,
        createRole: createRole.mutate,
        updateRole: updateRole.mutate,
        deleteRole: deleteRole.mutate,
    };
}