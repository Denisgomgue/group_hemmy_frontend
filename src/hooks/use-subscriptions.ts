import { useState, useCallback } from 'react';
import { SubscriptionsAPI } from '@/services/subscriptions-api';
import {
    Subscription,
    CreateSubscriptionDto,
    UpdateSubscriptionDto
} from '@/types/subscription';

export function useSubscriptions() {
    const [ subscriptions, setSubscriptions ] = useState<Subscription[]>([]);
    const [ isLoading, setIsLoading ] = useState(false);
    const [ error, setError ] = useState<Error | null>(null);

    const fetchSubscriptions = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const data = await SubscriptionsAPI.getAll();
            setSubscriptions(data);
            return data;
        } catch (err) {
            const error = err instanceof Error ? err : new Error('Error al cargar suscripciones');
            setError(error);
            console.error('Error fetching subscriptions:', err);
            throw error;
        } finally {
            setIsLoading(false);
        }
    }, []);

    const refreshSubscriptions = useCallback(async () => {
        return await fetchSubscriptions();
    }, [ fetchSubscriptions ]);

    const createSubscription = useCallback(async (data: CreateSubscriptionDto): Promise<Subscription> => {
        try {
            const newSubscription = await SubscriptionsAPI.create(data);
            await fetchSubscriptions();
            return newSubscription;
        } catch (err) {
            console.error('Error creating subscription:', err);
            throw err;
        }
    }, [ fetchSubscriptions ]);

    const updateSubscription = useCallback(async (id: number, data: UpdateSubscriptionDto): Promise<Subscription> => {
        try {
            const updatedSubscription = await SubscriptionsAPI.update(id, data);
            await fetchSubscriptions();
            return updatedSubscription;
        } catch (err) {
            console.error('Error updating subscription:', err);
            throw err;
        }
    }, [ fetchSubscriptions ]);

    const deleteSubscription = useCallback(async (id: number): Promise<void> => {
        try {
            await SubscriptionsAPI.delete(id);
            await fetchSubscriptions();
        } catch (err) {
            console.error('Error deleting subscription:', err);
            throw err;
        }
    }, [ fetchSubscriptions ]);

    return {
        subscriptions,
        isLoading,
        error,
        fetchSubscriptions,
        refreshSubscriptions,
        createSubscription,
        updateSubscription,
        deleteSubscription,
    };
}

