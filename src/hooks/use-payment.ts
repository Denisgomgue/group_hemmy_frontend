import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { PaymentAPI } from '@/services/payment-api';
import { Payment, CreatePaymentDto, UpdatePaymentDto, PaymentQueryParams } from '@/types/payment';
import { toast } from 'sonner';

export function usePayment() {
    const queryClient = useQueryClient();

    const { data: payments = [], isLoading, refetch: refreshPayments } = useQuery<Payment[]>({
        queryKey: [ 'payments' ],
        queryFn: () => PaymentAPI.getAll().then(res => res.data),
    });

    const createPaymentMutation = useMutation({
        mutationFn: PaymentAPI.create,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [ 'payments' ] });
            queryClient.invalidateQueries({ queryKey: [ 'paymentSummary' ] });
            toast.success('Pago creado correctamente.');
        },
        onError: (error: any) => {
            const errorMessage = error?.response?.data?.message || 'Error al crear el pago.';
            toast.error(errorMessage);
        },
    });

    const updatePaymentMutation = useMutation({
        mutationFn: ({ id, data }: { id: number; data: UpdatePaymentDto }) =>
            PaymentAPI.update(id, data),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: [ 'payments' ] });
            queryClient.invalidateQueries({ queryKey: [ 'payment', variables.id ] });
            queryClient.invalidateQueries({ queryKey: [ 'paymentSummary' ] });
            toast.success('Pago actualizado correctamente.');
        },
        onError: (error: any) => {
            const errorMessage = error?.response?.data?.message || 'Error al actualizar el pago.';
            toast.error(errorMessage);
        },
    });

    const deletePaymentMutation = useMutation({
        mutationFn: PaymentAPI.delete,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [ 'payments' ] });
            queryClient.invalidateQueries({ queryKey: [ 'paymentSummary' ] });
            toast.success('Pago eliminado correctamente.');
        },
        onError: (error: any) => {
            const errorMessage = error?.response?.data?.message || 'Error al eliminar el pago.';
            toast.error(errorMessage);
        },
    });

    return {
        payments,
        isLoading,
        refreshPayments,
        createPayment: createPaymentMutation.mutateAsync,
        updatePayment: updatePaymentMutation.mutateAsync,
        deletePayment: deletePaymentMutation.mutateAsync,
        isCreating: createPaymentMutation.isPending,
        isUpdating: updatePaymentMutation.isPending,
        isDeleting: deletePaymentMutation.isPending,
    };
}

export function usePaymentById(id: string) {
    return useQuery<Payment>({
        queryKey: [ 'payment', id ],
        queryFn: () => PaymentAPI.getById(Number(id)),
        enabled: !!id && !isNaN(Number(id)),
    });
}

export function usePaymentQuery() {
    const queryClient = useQueryClient();

    const refreshPayments = async (
        page: number = 1,
        pageSize: number = 10,
        status?: string,
        search?: string
    ): Promise<{ data: Payment[]; total: number }> => {
        const params: PaymentQueryParams = {
            page,
            limit: pageSize,
            ...(status && status !== 'all' && { statusCode: status as any }),
            ...(search && { search }),
        };
        return PaymentAPI.getAll(params);
    };

    const getPaymentSummary = async (period?: string) => {
        return PaymentAPI.getSummary(period);
    };

    const createPayment = async (data: CreatePaymentDto): Promise<Payment> => {
        return PaymentAPI.create(data);
    };

    const updatePayment = async (id: number, data: UpdatePaymentDto): Promise<Payment> => {
        return PaymentAPI.update(id, data);
    };

    const deletePayment = async (id: number): Promise<void> => {
        return PaymentAPI.delete(id);
    };

    const recalculateStates = async (): Promise<{ message: string }> => {
        return PaymentAPI.recalculateStates();
    };

    const regeneratePaymentCodes = async (): Promise<{ total: number; updated: number }> => {
        return PaymentAPI.regenerateCodes();
    };

    return {
        refreshPayments,
        getPaymentSummary,
        createPayment,
        updatePayment,
        deletePayment,
        recalculateStates,
        regeneratePaymentCodes,
    };
}

