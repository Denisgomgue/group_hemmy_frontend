import { useState, useEffect, useCallback } from 'react';
import { ClientsAPI } from '@/services/clients-api';
import { Client, ClientQueryParams } from '@/types/client';
import { toast } from 'sonner';

export function useClients() {
    const [ clients, setClients ] = useState<Client[]>([]);
    const [ isLoading, setIsLoading ] = useState(false);
    const [ error, setError ] = useState<Error | null>(null);

    const fetchClients = useCallback(async (params?: ClientQueryParams) => {
        setIsLoading(true);
        setError(null);
        try {
            const data = await ClientsAPI.getAll(params);
            setClients(data);
            return data;
        } catch (err) {
            const error = err instanceof Error ? err : new Error('Error al cargar clientes');
            setError(error);
            throw error;
        } finally {
            setIsLoading(false);
        }
    }, []);

    const refreshClients = useCallback(async (params?: ClientQueryParams) => {
        return await fetchClients(params);
    }, [ fetchClients ]);

    const createClient = useCallback(async (clientData: Client) => {
        try {
            const newClient = await ClientsAPI.create(clientData);
            await fetchClients();
            toast.success('Cliente creado correctamente');
            return newClient;
        } catch (err) {
            toast.error('Error al crear el cliente');
            throw err;
        }
    }, [ fetchClients ]);

    const updateClient = useCallback(async (id: number, clientData: Partial<Client>) => {
        try {
            const updatedClient = await ClientsAPI.update(id, clientData);
            await fetchClients();
            toast.success('Cliente actualizado correctamente');
            return updatedClient;
        } catch (err) {
            toast.error('Error al actualizar el cliente');
            throw err;
        }
    }, [ fetchClients ]);

    const deleteClient = useCallback(async (id: number) => {
        try {
            await ClientsAPI.delete(id);
            await fetchClients();
            toast.success('Cliente eliminado correctamente');
        } catch (err) {
            toast.error('Error al eliminar el cliente');
            throw err;
        }
    }, [ fetchClients ]);

    return {
        clients,
        isLoading,
        error,
        fetchClients,
        refreshClients,
        createClient,
        updateClient,
        deleteClient,
    };
}

