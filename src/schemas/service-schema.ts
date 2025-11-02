import { z } from 'zod';

// Schema para crear Service
export const serviceSchema = z.object({
    name: z.string({
        required_error: 'El nombre es requerido',
    }).min(2, 'El nombre debe tener al menos 2 caracteres')
        .max(100, 'El nombre no puede exceder 100 caracteres'),
    description: z.string().max(500, 'La descripción no puede exceder 500 caracteres').optional(),
});

export type ServiceFormData = z.infer<typeof serviceSchema>;

// Schema para actualizar Service
export const updateServiceSchema = z.object({
    name: z.string()
        .min(2, 'El nombre debe tener al menos 2 caracteres')
        .max(100, 'El nombre no puede exceder 100 caracteres')
        .optional(),
    description: z.string().max(500, 'La descripción no puede exceder 500 caracteres').optional(),
});

export type UpdateServiceFormData = z.infer<typeof updateServiceSchema>;

// Schema para compatibilidad con formularios existentes
export const formSchema = updateServiceSchema;

