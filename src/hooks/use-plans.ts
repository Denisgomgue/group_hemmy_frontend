import { useState, useEffect, useCallback } from 'react';
import { PlansAPI } from '@/services/plans-api';
import { Plan, PlanQueryParams, CreatePlanDto, UpdatePlanDto } from '@/types/plan';
import { toast } from 'sonner';

export function usePlans() {
    const [ plans, setPlans ] = useState<Plan[]>([]);
    const [ isLoading, setIsLoading ] = useState(false);
    const [ error, setError ] = useState<Error | null>(null);

    const fetchPlans = useCallback(async (params?: PlanQueryParams) => {
        setIsLoading(true);
        setError(null);
        try {
            const data = await PlansAPI.getAll(params);
            setPlans(data);
            return data;
        } catch (err) {
            const error = err instanceof Error ? err : new Error('Error al cargar planes');
            setError(error);
            throw error;
        } finally {
            setIsLoading(false);
        }
    }, []);

    const refreshPlans = useCallback(async (params?: PlanQueryParams) => {
        return await fetchPlans(params);
    }, [ fetchPlans ]);

    const createPlan = useCallback(async (planData: CreatePlanDto) => {
        try {
            const newPlan = await PlansAPI.create(planData);
            await fetchPlans();
            toast.success('Plan creado correctamente');
            return newPlan;
        } catch (err) {
            toast.error('Error al crear el plan');
            throw err;
        }
    }, [ fetchPlans ]);

    const updatePlan = useCallback(async (id: number, planData: UpdatePlanDto) => {
        try {
            const updatedPlan = await PlansAPI.update(id, planData);
            await fetchPlans();
            toast.success('Plan actualizado correctamente');
            return updatedPlan;
        } catch (err) {
            toast.error('Error al actualizar el plan');
            throw err;
        }
    }, [ fetchPlans ]);

    const deletePlan = useCallback(async (id: number) => {
        try {
            await PlansAPI.delete(id);
            await fetchPlans();
            toast.success('Plan eliminado correctamente');
        } catch (err) {
            toast.error('Error al eliminar el plan');
            throw err;
        }
    }, [ fetchPlans ]);

    return {
        plans,
        isLoading,
        error,
        fetchPlans,
        refreshPlans,
        createPlan,
        updatePlan,
        deletePlan,
    };
}

