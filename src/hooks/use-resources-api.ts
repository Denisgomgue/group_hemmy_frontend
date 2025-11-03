import { useState, useCallback } from 'react';

export interface Resource {
    id: number;
    routeCode: string;
    displayName: string;
    description?: string;
    isActive: boolean;
    orderIndex?: number;
    created_at?: string;
    updated_at?: string;
}

export interface CreateResourceData {
    routeCode: string;
    displayName: string;
    description?: string;
    isActive: boolean;
    orderIndex?: number;
}

export function useResourcesAPI() {
    const [ resources, setResources ] = useState<Resource[]>([]);
    const [ isLoading, setIsLoading ] = useState(false);

    const loadResources = useCallback(async () => {
        setIsLoading(true);
        try {
            // TODO: Implementar cuando haya endpoint de recursos
            // Por ahora devolvemos array vacío
            setResources([]);
            return [];
        } catch (error) {
            console.error('Error loading resources:', error);
            return [];
        } finally {
            setIsLoading(false);
        }
    }, []);

    const refreshResources = useCallback(async () => {
        return await loadResources();
    }, [ loadResources ]);

    const createResource = useCallback(async (data: CreateResourceData) => {
        // TODO: Implementar cuando haya endpoint
        throw new Error('Not implemented');
    }, []);

    const updateResource = useCallback(async (id: number, data: Partial<CreateResourceData>) => {
        // TODO: Implementar cuando haya endpoint
        throw new Error('Not implemented');
    }, []);

    const deleteResource = useCallback(async (id: number) => {
        // TODO: Implementar cuando haya endpoint
        throw new Error('Not implemented');
    }, []);

    const toggleResourceActive = useCallback(async (id: number) => {
        // TODO: Implementar cuando haya endpoint
        throw new Error('Not implemented');
    }, []);

    const checkRouteCodeExists = useCallback((routeCode: string, excludeId?: number) => {
        return resources.some(r => r.routeCode === routeCode && r.id !== excludeId);
    }, [ resources ]);

    const checkDisplayNameExists = useCallback((displayName: string, excludeId?: number) => {
        return resources.some(r => r.displayName === displayName && r.id !== excludeId);
    }, [ resources ]);

    return {
        resources,
        isLoading,
        loadResources,
        refreshResources,
        createResource,
        updateResource,
        deleteResource,
        toggleResourceActive,
        checkRouteCodeExists,
        checkDisplayNameExists,
    };
}

