import { useState, useEffect, useCallback } from 'react';
import { SectorsAPI } from '@/services/sectors-api';
import { Sector, SectorQueryParams } from '@/types/sector';
import { toast } from 'sonner';

export function useSectors() {
    const [ sectors, setSectors ] = useState<Sector[]>([]);
    const [ isLoading, setIsLoading ] = useState(false);
    const [ error, setError ] = useState<Error | null>(null);

    const fetchSectors = useCallback(async (params?: SectorQueryParams) => {
        setIsLoading(true);
        setError(null);
        try {
            const data = await SectorsAPI.getAll(params);
            setSectors(data);
            return data;
        } catch (err) {
            const error = err instanceof Error ? err : new Error('Error al cargar sectores');
            setError(error);
            throw error;
        } finally {
            setIsLoading(false);
        }
    }, []);

    const refreshSectors = useCallback(async (params?: SectorQueryParams) => {
        return await fetchSectors(params);
    }, [ fetchSectors ]);

    const createSector = useCallback(async (sectorData: Sector) => {
        try {
            const newSector = await SectorsAPI.create(sectorData);
            await fetchSectors();
            toast.success('Sector creado correctamente');
            return newSector;
        } catch (err) {
            toast.error('Error al crear el sector');
            throw err;
        }
    }, [ fetchSectors ]);

    const updateSector = useCallback(async (id: number, sectorData: Partial<Sector>) => {
        try {
            const updatedSector = await SectorsAPI.update(id, sectorData);
            await fetchSectors();
            toast.success('Sector actualizado correctamente');
            return updatedSector;
        } catch (err) {
            toast.error('Error al actualizar el sector');
            throw err;
        }
    }, [ fetchSectors ]);

    const deleteSector = useCallback(async (id: number) => {
        try {
            await SectorsAPI.delete(id);
            await fetchSectors();
            toast.success('Sector eliminado correctamente');
        } catch (err) {
            toast.error('Error al eliminar el sector');
            throw err;
        }
    }, [ fetchSectors ]);

    return {
        sectors,
        isLoading,
        error,
        fetchSectors,
        refreshSectors,
        createSector,
        updateSector,
        deleteSector,
    };
}

