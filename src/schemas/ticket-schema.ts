import { z } from 'zod';
import { TicketType, TicketPriority, TicketStatus, TicketOutcome, CreatedAsRole } from '@/types/ticket';

export const ticketSchema = z.object({
    clientId: z.number({
        required_error: 'El cliente es requerido',
    }).min(1, 'Debe seleccionar un cliente'),

    installationId: z.number().optional().nullable(),

    typeCode: z.nativeEnum(TicketType, {
        required_error: 'El tipo de ticket es requerido',
    }),

    priorityCode: z.nativeEnum(TicketPriority).optional().default(TicketPriority.MEDIUM),

    statusCode: z.nativeEnum(TicketStatus).optional().default(TicketStatus.OPEN),

    subject: z.string({
        required_error: 'El asunto es requerido',
    }).min(3, 'El asunto debe tener al menos 3 caracteres')
        .max(255, 'El asunto no puede exceder los 255 caracteres'),

    description: z.string().max(2000, 'La descripción no puede exceder los 2000 caracteres').optional().nullable(),

    employeeId: z.number().optional().nullable(),

    scheduledStart: z.string().datetime().optional().nullable(),

    outcome: z.nativeEnum(TicketOutcome).optional().nullable(),

    openedAt: z.string().datetime().optional(), // Se auto-genera si no se proporciona

    closedAt: z.string().datetime().optional().nullable(),

    createdByUserId: z.number().optional(), // Se obtiene del usuario actual

    createdAsRole: z.nativeEnum(CreatedAsRole).optional().default(CreatedAsRole.CUSTOMER),
});

export type TicketFormData = z.infer<typeof ticketSchema>;

export const updateTicketSchema = ticketSchema.partial();

export type UpdateTicketFormData = z.infer<typeof updateTicketSchema>;

// Re-exportar enums para uso en formularios
export { TicketType, TicketPriority, TicketStatus, TicketOutcome, CreatedAsRole };

