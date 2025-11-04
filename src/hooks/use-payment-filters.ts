import { useState, useCallback } from 'react';

export interface PaymentFilters {
    status?: string;
    clientId?: number;
    createdByUserId?: number;
    search?: string;
}

export function usePaymentFilters(initialFilters: PaymentFilters = {}) {
    const [ filters, setFilters ] = useState<PaymentFilters>(initialFilters);

    const updateFilters = useCallback((newFilters: Partial<PaymentFilters>) => {
        setFilters(prev => ({ ...prev, ...newFilters }));
    }, []);

    const clearFilters = useCallback(() => {
        setFilters(initialFilters);
    }, [ initialFilters ]);

    return {
        filters,
        updateFilters,
        clearFilters,
    };
}

