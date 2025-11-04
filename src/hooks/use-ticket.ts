import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { TicketAPI } from '@/services/ticket-api';
import { Ticket, CreateTicketDto, UpdateTicketDto, TicketQueryParams } from '@/types/ticket';
import { toast } from 'sonner';

export function useTicket() {
    const queryClient = useQueryClient();

    const { data: tickets = [], isLoading, refetch: refreshTickets } = useQuery<Ticket[]>({
        queryKey: [ 'tickets' ],
        queryFn: () => TicketAPI.getAll(),
    });


    const createTicketMutation = useMutation({
        mutationFn: TicketAPI.create,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [ 'tickets' ] });
            toast.success('Ticket creado correctamente.');
        },
        onError: (error: any) => {
            const errorMessage = error?.response?.data?.message || 'Error al crear el ticket.';
            toast.error(errorMessage);
        },
    });

    const updateTicketMutation = useMutation({
        mutationFn: ({ id, data }: { id: number; data: UpdateTicketDto }) =>
            TicketAPI.update(id, data),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: [ 'tickets' ] });
            queryClient.invalidateQueries({ queryKey: [ 'ticket', variables.id ] });
            toast.success('Ticket actualizado correctamente.');
        },
        onError: (error: any) => {
            const errorMessage = error?.response?.data?.message || 'Error al actualizar el ticket.';
            toast.error(errorMessage);
        },
    });

    const deleteTicketMutation = useMutation({
        mutationFn: TicketAPI.delete,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [ 'tickets' ] });
            toast.success('Ticket eliminado correctamente.');
        },
        onError: (error: any) => {
            const errorMessage = error?.response?.data?.message || 'Error al eliminar el ticket.';
            toast.error(errorMessage);
        },
    });

    return {
        tickets,
        isLoading,
        refreshTickets,
        createTicket: createTicketMutation.mutateAsync,
        updateTicket: updateTicketMutation.mutateAsync,
        deleteTicket: deleteTicketMutation.mutateAsync,
        isCreating: createTicketMutation.isPending,
        isUpdating: updateTicketMutation.isPending,
        isDeleting: deleteTicketMutation.isPending,
    };
}

// Hook plural para compatibilidad con componentes existentes
export function useTickets() {
    const { tickets, isLoading, refreshTickets, createTicket, isCreating } = useTicket();

    // Calcular estadísticas básicas
    const stats = {
        total: tickets.length,
        open: tickets.filter(t => t.statusCode === 'OPEN').length,
        inProgress: tickets.filter(t => t.statusCode === 'IN_PROGRESS').length,
        resolved: tickets.filter(t => t.statusCode === 'RESOLVED').length,
        closed: tickets.filter(t => t.statusCode === 'CLOSED').length,
        // Compatibilidad con nombres antiguos
        pendiente: tickets.filter(t => t.statusCode === 'PENDING').length,
        enProceso: tickets.filter(t => t.statusCode === 'IN_PROGRESS').length,
        completado: tickets.filter(t => t.statusCode === 'RESOLVED' || t.statusCode === 'CLOSED').length,
        urgente: tickets.filter(t => t.priorityCode === 'URGENT').length,
        alta: tickets.filter(t => t.priorityCode === 'HIGH').length,
        programado: tickets.filter(t => t.scheduledStart !== null && t.scheduledStart !== undefined).length,
        cancelado: tickets.filter(t => t.statusCode === 'CANCELLED').length,
    };

    return {
        tickets,
        totalTickets: tickets.length,
        isLoading,
        stats,
        filters: {}, // Filtros básicos
        updateFilters: (_filters?: any) => { }, // Placeholder - acepta argumentos pero no hace nada aún
        clearFilters: () => { }, // Placeholder
        refetch: refreshTickets,
        createTicket,
        isCreating,
    };
}

