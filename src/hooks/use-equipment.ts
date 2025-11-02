import { useState, useCallback } from 'react';
import { EquipmentAPI } from '@/services/equipment-api';
import { Equipment, CreateEquipmentDto, UpdateEquipmentDto, EquipmentQueryParams } from '@/types/equipment';

export function useEquipment() {
    const [ equipment, setEquipment ] = useState<Equipment[]>([]);
    const [ isLoading, setIsLoading ] = useState(false);
    const [ error, setError ] = useState<Error | null>(null);

    const fetchEquipment = useCallback(async (params?: EquipmentQueryParams) => {
        setIsLoading(true);
        setError(null);
        try {
            const data = await EquipmentAPI.getAll(params);
            setEquipment(data);
            return data;
        } catch (err) {
            const error = err instanceof Error ? err : new Error('Error al cargar equipos');
            setError(error);
            throw error;
        } finally {
            setIsLoading(false);
        }
    }, []);

    const refreshEquipment = useCallback(async (params?: EquipmentQueryParams) => {
        return await fetchEquipment(params);
    }, [ fetchEquipment ]);

    const createEquipment = useCallback(async (equipmentData: CreateEquipmentDto) => {
        try {
            const newEquipment = await EquipmentAPI.create(equipmentData);
            await fetchEquipment();
            return newEquipment;
        } catch (err) {
            throw err;
        }
    }, [ fetchEquipment ]);

    const updateEquipment = useCallback(async (id: number, equipmentData: UpdateEquipmentDto) => {
        try {
            const updatedEquipment = await EquipmentAPI.update(id, equipmentData);
            await fetchEquipment();
            return updatedEquipment;
        } catch (err) {
            throw err;
        }
    }, [ fetchEquipment ]);

    const deleteEquipment = useCallback(async (id: number) => {
        try {
            await EquipmentAPI.delete(id);
            await fetchEquipment();
        } catch (err) {
            throw err;
        }
    }, [ fetchEquipment ]);

    return {
        equipment,
        isLoading,
        error,
        fetchEquipment,
        refreshEquipment,
        createEquipment,
        updateEquipment,
        deleteEquipment,
    };
}

