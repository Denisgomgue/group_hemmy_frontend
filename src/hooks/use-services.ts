import { useState, useEffect, useCallback } from 'react';
import { ServicesAPI } from '@/services/services-api';
import { Service, ServiceQueryParams, CreateServiceDto, UpdateServiceDto } from '@/types/service';
import { toast } from 'sonner';

export function useServices() {
    const [ services, setServices ] = useState<Service[]>([]);
    const [ isLoading, setIsLoading ] = useState(false);
    const [ error, setError ] = useState<Error | null>(null);

    const fetchServices = useCallback(async (params?: ServiceQueryParams) => {
        setIsLoading(true);
        setError(null);
        try {
            const data = await ServicesAPI.getAll(params);
            setServices(data);
            return data;
        } catch (err) {
            const error = err instanceof Error ? err : new Error('Error al cargar servicios');
            setError(error);
            throw error;
        } finally {
            setIsLoading(false);
        }
    }, []);

    const refreshServices = useCallback(async (params?: ServiceQueryParams) => {
        return await fetchServices(params);
    }, [ fetchServices ]);

    const createService = useCallback(async (serviceData: CreateServiceDto) => {
        try {
            const newService = await ServicesAPI.create(serviceData);
            await fetchServices();
            toast.success('Servicio creado correctamente');
            return newService;
        } catch (err) {
            toast.error('Error al crear el servicio');
            throw err;
        }
    }, [ fetchServices ]);

    const updateService = useCallback(async (id: number, serviceData: UpdateServiceDto) => {
        try {
            const updatedService = await ServicesAPI.update(id, serviceData);
            await fetchServices();
            toast.success('Servicio actualizado correctamente');
            return updatedService;
        } catch (err) {
            toast.error('Error al actualizar el servicio');
            throw err;
        }
    }, [ fetchServices ]);

    const deleteService = useCallback(async (id: number) => {
        try {
            await ServicesAPI.delete(id);
            await fetchServices();
            toast.success('Servicio eliminado correctamente');
        } catch (err) {
            toast.error('Error al eliminar el servicio');
            throw err;
        }
    }, [ fetchServices ]);

    return {
        services,
        isLoading,
        error,
        fetchServices,
        refreshServices,
        createService,
        updateService,
        deleteService,
    };
}

