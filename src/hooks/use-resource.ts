import { useState, useCallback, useEffect } from 'react';
import { ResourceAPI } from '@/services/resource-api';
import { Resource, CreateResourceDto, UpdateResourceDto, ResourceQueryParams } from '@/types/resource';

export function useResource() {
    const [ resources, setResources ] = useState<Resource[]>([]);
    const [ isLoading, setIsLoading ] = useState(false);
    const [ error, setError ] = useState<Error | null>(null);

    const fetchResources = useCallback(async (params?: ResourceQueryParams) => {
        setIsLoading(true);
        setError(null);
        try {
            const data = await ResourceAPI.getAll(params);
            setResources(data);
            return data;
        } catch (err) {
            const error = err instanceof Error ? err : new Error('Error al cargar recursos');
            setError(error);
            throw error;
        } finally {
            setIsLoading(false);
        }
    }, []);

    // Cargar recursos al montar
    useEffect(() => {
        fetchResources();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const refreshResources = useCallback(async (params?: ResourceQueryParams) => {
        return await fetchResources(params);
    }, [ fetchResources ]);

    const createResource = useCallback(async (resourceData: CreateResourceDto) => {
        try {
            const newResource = await ResourceAPI.create(resourceData);
            await fetchResources();
            return newResource;
        } catch (err) {
            throw err;
        }
    }, [ fetchResources ]);

    const updateResource = useCallback(async (id: number, resourceData: UpdateResourceDto) => {
        try {
            const updatedResource = await ResourceAPI.update(id, resourceData);
            await fetchResources();
            return updatedResource;
        } catch (err) {
            throw err;
        }
    }, [ fetchResources ]);

    const deleteResource = useCallback(async (id: number) => {
        try {
            await ResourceAPI.delete(id);
            await fetchResources();
        } catch (err) {
            throw err;
        }
    }, [ fetchResources ]);

    return {
        resources,
        isLoading,
        error,
        fetchResources,
        refreshResources,
        createResource,
        updateResource,
        deleteResource,
    };
}

