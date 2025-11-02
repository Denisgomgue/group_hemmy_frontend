import { z } from 'zod';

// Schema para crear Plan
export const planSchema = z.object({
    name: z.string({
        required_error: 'El nombre es requerido',
    }).min(2, 'El nombre debe tener al menos 2 caracteres')
        .max(100, 'El nombre no puede exceder 100 caracteres'),
    price: z.number({
        required_error: 'El precio es requerido',
    }).min(0, 'El precio debe ser mayor o igual a 0'),
    serviceId: z.number().min(1, 'Debe seleccionar un servicio').optional(),
    speedMbps: z.number().min(0, 'La velocidad debe ser mayor o igual a 0').optional(),
    description: z.string().max(500, 'La descripción no puede exceder 500 caracteres').optional(),
    isActive: z.boolean().optional().default(true),
    type: z.boolean().optional().default(false),
});

export type PlanFormData = z.infer<typeof planSchema>;

// Schema para actualizar Plan
export const updatePlanSchema = z.object({
    name: z.string()
        .min(2, 'El nombre debe tener al menos 2 caracteres')
        .max(100, 'El nombre no puede exceder 100 caracteres')
        .optional(),
    price: z.number().min(0, 'El precio debe ser mayor o igual a 0').optional(),
    serviceId: z.number().min(1).optional(),
    speedMbps: z.number().min(0, 'La velocidad debe ser mayor o igual a 0').optional(),
    description: z.string().max(500, 'La descripción no puede exceder 500 caracteres').optional(),
    isActive: z.boolean().optional(),
    type: z.boolean().optional(),
});

export type UpdatePlanFormData = z.infer<typeof updatePlanSchema>;

// Alias para compatibilidad
export const PlanSchema = planSchema;

