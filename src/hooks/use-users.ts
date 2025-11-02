import { useState, useEffect, useCallback } from 'react';
import { UsersAPI } from '@/services/users-api';
import { User, UserQueryParams, CreateUserDto, UpdateUserDto } from '@/types/user';
import { toast } from 'sonner';

export function useUsers() {
    const [ users, setUsers ] = useState<User[]>([]);
    const [ isLoading, setIsLoading ] = useState(false);
    const [ error, setError ] = useState<Error | null>(null);

    const fetchUsers = useCallback(async (params?: UserQueryParams) => {
        setIsLoading(true);
        setError(null);
        try {
            const data = await UsersAPI.getAll(params);
            setUsers(data);
            return data;
        } catch (err) {
            const error = err instanceof Error ? err : new Error('Error al cargar usuarios');
            setError(error);
            throw error;
        } finally {
            setIsLoading(false);
        }
    }, []);

    const refreshUsers = useCallback(async (params?: UserQueryParams) => {
        return await fetchUsers(params);
    }, [ fetchUsers ]);

    const createUser = useCallback(async (userData: CreateUserDto) => {
        try {
            const newUser = await UsersAPI.create(userData);
            await fetchUsers();
            toast.success('Usuario creado correctamente');
            return newUser;
        } catch (err) {
            toast.error('Error al crear el usuario');
            throw err;
        }
    }, [ fetchUsers ]);

    const updateUser = useCallback(async (id: number, userData: UpdateUserDto) => {
        try {
            const updatedUser = await UsersAPI.update(id, userData);
            await fetchUsers();
            toast.success('Usuario actualizado correctamente');
            return updatedUser;
        } catch (err) {
            toast.error('Error al actualizar el usuario');
            throw err;
        }
    }, [ fetchUsers ]);

    const deleteUser = useCallback(async (id: number) => {
        try {
            await UsersAPI.delete(id);
            await fetchUsers();
            toast.success('Usuario eliminado correctamente');
        } catch (err) {
            toast.error('Error al eliminar el usuario');
            throw err;
        }
    }, [ fetchUsers ]);

    return {
        users,
        isLoading,
        error,
        fetchUsers,
        refreshUsers,
        createUser,
        updateUser,
        deleteUser,
    };
}
