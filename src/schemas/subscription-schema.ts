import { z } from 'zod';
import { SubscriptionStatus } from '@/types/subscription';

// Schema para crear Subscription
export const subscriptionSchema = z.object({
    startDate: z.string({
        required_error: 'La fecha de inicio es requerida',
    }),
    endDate: z.string().optional(),
    billingDay: z.number({
        required_error: 'El día de facturación es requerido',
    }).min(1, 'El día de facturación debe ser mayor o igual a 1')
        .max(28, 'El día de facturación debe ser menor o igual a 28'),
    status: z.nativeEnum(SubscriptionStatus, {
        required_error: 'El estado es requerido',
    }),
    advancePayment: z.boolean().optional().default(false),
    installationId: z.number({
        required_error: 'La instalación es requerida',
    }).min(1, 'Debe seleccionar una instalación'),
    planId: z.number({
        required_error: 'El plan es requerido',
    }).min(1, 'Debe seleccionar un plan'),
});

export type SubscriptionFormData = z.infer<typeof subscriptionSchema>;

// Schema para actualizar Subscription
export const updateSubscriptionSchema = z.object({
    startDate: z.string().optional(),
    endDate: z.string().optional(),
    billingDay: z.number().min(1).max(28).optional(),
    status: z.nativeEnum(SubscriptionStatus).optional(),
    advancePayment: z.boolean().optional(),
    installationId: z.number().min(1).optional(),
    planId: z.number().min(1).optional(),
});

export type UpdateSubscriptionFormData = z.infer<typeof updateSubscriptionSchema>;

