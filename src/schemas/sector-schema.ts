import { z } from 'zod';

// Schema para crear Sector
export const sectorSchema = z.object({
    name: z.string({
        required_error: 'El nombre es requerido',
    }).min(2, 'El nombre debe tener al menos 2 caracteres')
      .max(100, 'El nombre no puede exceder 100 caracteres'),
    description: z.string().max(500, 'La descripción no puede exceder 500 caracteres').optional(),
});

export type SectorFormData = z.infer<typeof sectorSchema>;

// Schema para actualizar Sector
export const updateSectorSchema = z.object({
    name: z.string()
        .min(2, 'El nombre debe tener al menos 2 caracteres')
        .max(100, 'El nombre no puede exceder 100 caracteres')
        .optional(),
    description: z.string().max(500, 'La descripción no puede exceder 500 caracteres').optional(),
});

export type UpdateSectorFormData = z.infer<typeof updateSectorSchema>;

// Schema para compatibilidad con formularios existentes
export const formSchema = updateSectorSchema;

