import { useQuery } from '@tanstack/react-query';
import { TicketAPI } from '@/services/ticket-api';
import { Ticket } from '@/types/ticket';

export function useTicketById(id: number | string) {
    return useQuery<Ticket>({
        queryKey: [ 'ticket', id ],
        queryFn: () => TicketAPI.getById(Number(id)),
        enabled: !!id && !isNaN(Number(id)),
    });
}

