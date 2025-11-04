import { Ticket, TicketType, TicketPriority, TicketStatus } from '@/types/ticket';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';

// Obtener el nombre del cliente desde el ticket
export function getClientName(ticket: Ticket): string {
    if (!ticket.client) return 'Sin cliente';

    return ticket.client.actor?.displayName ||
        (ticket.client.actor?.person
            ? `${ticket.client.actor.person.firstName} ${ticket.client.actor.person.lastName}`.trim()
            : ticket.client.actor?.organization?.legalName) ||
        'Sin cliente';
}

// Obtener el teléfono del cliente
export function getClientPhone(ticket: Ticket): string {
    if (!ticket.client?.actor) return '';

    return ticket.client.actor.person?.phone ||
        ticket.client.actor.organization?.phone ||
        '';
}

// Obtener el nombre del empleado asignado
export function getEmployeeName(ticket: Ticket): string {
    if (!ticket.employee?.person) return '';

    return `${ticket.employee.person.firstName} ${ticket.employee.person.lastName}`.trim();
}

// Labels para tipos
export const ticketTypeLabels: Record<TicketType, string> = {
    TECHNICAL: 'Técnico',
    BILLING: 'Facturación',
    COMPLAINT: 'Queja',
    REQUEST: 'Solicitud',
    OTHER: 'Otro'
};

// Labels para prioridades
export const ticketPriorityLabels: Record<TicketPriority, string> = {
    LOW: 'Baja',
    MEDIUM: 'Media',
    HIGH: 'Alta',
    URGENT: 'Urgente'
};

// Labels para estados
export const ticketStatusLabels: Record<TicketStatus, string> = {
    OPEN: 'Abierto',
    IN_PROGRESS: 'En Proceso',
    PENDING: 'Pendiente',
    RESOLVED: 'Resuelto',
    CLOSED: 'Cerrado',
    CANCELLED: 'Cancelado'
};

// Colores para prioridades
export function getPriorityColor(priority: TicketPriority): string {
    const colors: Record<TicketPriority, string> = {
        LOW: 'bg-blue-100 text-blue-800 border-blue-200',
        MEDIUM: 'bg-yellow-100 text-yellow-800 border-yellow-200',
        HIGH: 'bg-orange-100 text-orange-800 border-orange-200',
        URGENT: 'bg-red-100 text-red-800 border-red-200'
    };
    return colors[ priority ] || colors.MEDIUM;
}

// Colores para estados
export function getStatusColor(status: TicketStatus): string {
    const colors: Record<TicketStatus, string> = {
        OPEN: 'bg-blue-100 text-blue-800 border-blue-200',
        IN_PROGRESS: 'bg-yellow-100 text-yellow-800 border-yellow-200',
        PENDING: 'bg-gray-100 text-gray-800 border-gray-200',
        RESOLVED: 'bg-green-100 text-green-800 border-green-200',
        CLOSED: 'bg-gray-100 text-gray-800 border-gray-200',
        CANCELLED: 'bg-red-100 text-red-800 border-red-200'
    };
    return colors[ status ] || colors.OPEN;
}

// Formatear fecha corta
export function formatShortDate(dateString: string): string {
    try {
        const date = new Date(dateString);
        return date.toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    } catch {
        return '';
    }
}

// Formatear tiempo desde creación
export function getTimeSinceCreation(dateString: string): string {
    try {
        const date = new Date(dateString);
        return formatDistanceToNow(date, { addSuffix: true, locale: es });
    } catch {
        return '';
    }
}

