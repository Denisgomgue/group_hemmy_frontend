import { useState, useEffect, useCallback } from 'react';
import { InstallationsAPI } from '@/services/installations-api';
import { Installation, InstallationQueryParams } from '@/types/installation';
import { toast } from 'sonner';

export function useInstallations() {
    const [ installations, setInstallations ] = useState<Installation[]>([]);
    const [ isLoading, setIsLoading ] = useState(false);
    const [ error, setError ] = useState<Error | null>(null);

    const fetchInstallations = useCallback(async (params?: InstallationQueryParams) => {
        setIsLoading(true);
        setError(null);
        try {
            const data = await InstallationsAPI.getAll(params);
            setInstallations(data);
            return data;
        } catch (err) {
            const error = err instanceof Error ? err : new Error('Error al cargar instalaciones');
            setError(error);
            throw error;
        } finally {
            setIsLoading(false);
        }
    }, []);

    const refreshInstallations = useCallback(async (params?: InstallationQueryParams) => {
        return await fetchInstallations(params);
    }, [ fetchInstallations ]);

    const createInstallation = useCallback(async (installationData: Installation) => {
        try {
            const newInstallation = await InstallationsAPI.create(installationData);
            await fetchInstallations();
            toast.success('Instalación creada correctamente');
            return newInstallation;
        } catch (err) {
            toast.error('Error al crear la instalación');
            throw err;
        }
    }, [ fetchInstallations ]);

    const updateInstallation = useCallback(async (id: number, installationData: Partial<Installation>) => {
        try {
            const updatedInstallation = await InstallationsAPI.update(id, installationData);
            await fetchInstallations();
            toast.success('Instalación actualizada correctamente');
            return updatedInstallation;
        } catch (err) {
            toast.error('Error al actualizar la instalación');
            throw err;
        }
    }, [ fetchInstallations ]);

    const deleteInstallation = useCallback(async (id: number) => {
        try {
            await InstallationsAPI.delete(id);
            await fetchInstallations();
            toast.success('Instalación eliminada correctamente');
        } catch (err) {
            toast.error('Error al eliminar la instalación');
            throw err;
        }
    }, [ fetchInstallations ]);

    return {
        installations,
        isLoading,
        error,
        fetchInstallations,
        refreshInstallations,
        createInstallation,
        updateInstallation,
        deleteInstallation,
    };
}

