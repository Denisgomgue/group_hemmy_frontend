import { TicketType, TicketPriority, TicketStatus } from '@/types/ticket';

export interface FilterOption {
    value: string;
    label: string;
}

// Opciones de filtro para prioridades
export const priorityFilterOptions: FilterOption[] = [
    { value: TicketPriority.LOW, label: 'Baja' },
    { value: TicketPriority.MEDIUM, label: 'Media' },
    { value: TicketPriority.HIGH, label: 'Alta' },
    { value: TicketPriority.URGENT, label: 'Urgente' }
];

// Opciones de filtro para estados
export const statusFilterOptions: FilterOption[] = [
    { value: TicketStatus.OPEN, label: 'Abierto' },
    { value: TicketStatus.IN_PROGRESS, label: 'En Proceso' },
    { value: TicketStatus.PENDING, label: 'Pendiente' },
    { value: TicketStatus.RESOLVED, label: 'Resuelto' },
    { value: TicketStatus.CLOSED, label: 'Cerrado' },
    { value: TicketStatus.CANCELLED, label: 'Cancelado' }
];

// Opciones de filtro para categorías (tipos)
export const categoryFilterOptions: FilterOption[] = [
    { value: TicketType.TECHNICAL, label: 'Técnico' },
    { value: TicketType.BILLING, label: 'Facturación' },
    { value: TicketType.COMPLAINT, label: 'Queja' },
    { value: TicketType.REQUEST, label: 'Solicitud' },
    { value: TicketType.OTHER, label: 'Otro' }
];

