import { z } from 'zod';

export const resourceSchema = z.object({
    routeCode: z.string({
        required_error: 'El código de ruta es requerido',
    })
        .min(2, 'El código de ruta debe tener al menos 2 caracteres')
        .max(100, 'El código de ruta no puede tener más de 100 caracteres')
        .regex(/^[a-z0-9_]+$/, 'El código de ruta solo puede contener letras minúsculas, números y guiones bajos'),
    name: z.string({
        required_error: 'El nombre es requerido',
    })
        .min(2, 'El nombre debe tener al menos 2 caracteres')
        .max(255, 'El nombre no puede tener más de 255 caracteres'),
    description: z.string()
        .max(500, 'La descripción no puede tener más de 500 caracteres')
        .optional(),
    isActive: z.boolean().optional().default(true),
    orderIndex: z.number().int().min(0).optional().default(0),
});

export type ResourceFormData = z.infer<typeof resourceSchema>;

export const updateResourceSchema = resourceSchema.partial();

export type UpdateResourceFormData = z.infer<typeof updateResourceSchema>;

