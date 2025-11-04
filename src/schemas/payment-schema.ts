import { z } from 'zod';
import { PaymentStatusCode, PaymentMethodCode } from '@/types/payment';

// Enum para tipos de pago (compatible con código existente)
// El código usa PaymentTypeEnum.Enum.TRANSFER, así que necesitamos exportarlo como objeto
export const PaymentTypeEnum = {
    Enum: PaymentMethodCode,
} as const;

// Schema base para pagos (compatible con código existente y backend)
export const PaymentSchema = z.object({
    id: z.number().optional(),
    code: z.string().optional(),
    clientId: z.number({
        required_error: 'El cliente es requerido',
    }).min(1, 'Debe seleccionar un cliente'),

    status: z.string().optional(), // Para compatibilidad con código existente
    statusCode: z.nativeEnum(PaymentStatusCode).optional(), // Para backend

    paymentDate: z.string().optional(),
    dueDate: z.string().optional(), // Para compatibilidad con código existente
    scheduledDueDate: z.string().optional(), // Para backend
    engagementDate: z.string().optional(), // Para aplazamientos

    amount: z.number().optional(), // Para compatibilidad con código existente
    baseAmount: z.number().optional(), // Monto base del plan
    amountTotal: z.number({
        required_error: 'El monto total es requerido',
    }).min(0.01, 'El monto debe ser mayor a 0'),
    reconnectionFee: z.number().optional().default(0),
    discount: z.number().optional().default(0),

    paymentType: z.nativeEnum(PaymentMethodCode).optional(), // Para compatibilidad con código existente
    methodCode: z.nativeEnum(PaymentMethodCode).optional().nullable(), // Para backend

    reference: z.string().max(255, 'La referencia no puede exceder los 255 caracteres').optional().nullable(),
    transfername: z.string().optional(),

    reconnection: z.boolean().optional().default(false),
    advancePayment: z.boolean().optional().default(false),

    createdByUserId: z.number().optional(),
    isVoid: z.boolean().optional().default(false),
    voidReason: z.string().max(500, 'El motivo de anulación no puede exceder los 500 caracteres').optional().nullable(),
    voidedAt: z.string().datetime().optional().nullable(),
    voidedByUserId: z.number().optional().nullable(),
});

// Alias con minúscula para compatibilidad
export const paymentSchema = PaymentSchema;

export type PaymentFormData = z.infer<typeof PaymentSchema>;

export const updatePaymentSchema = PaymentSchema.partial();

export type UpdatePaymentFormData = z.infer<typeof updatePaymentSchema>;

// Re-exportar enums para uso en formularios
export { PaymentStatusCode, PaymentMethodCode };

