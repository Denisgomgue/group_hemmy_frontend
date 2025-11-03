import { z } from 'zod';

export const roleSchema = z.object({
    code: z.string({
        required_error: 'El código es requerido',
    })
        .min(2, 'El código debe tener al menos 2 caracteres')
        .max(50, 'El código no puede tener más de 50 caracteres')
        .regex(/^[A-Z0-9_]+$/, 'El código solo puede contener letras mayúsculas, números y guiones bajos'),
    name: z.string({
        required_error: 'El nombre es requerido',
    })
        .min(2, 'El nombre debe tener al menos 2 caracteres')
        .max(100, 'El nombre no puede tener más de 100 caracteres'),
    description: z.string()
        .max(500, 'La descripción no puede tener más de 500 caracteres')
        .optional(),
    isSystem: z.boolean().optional().default(false),
});

export type RoleFormData = z.infer<typeof roleSchema>;

export const updateRoleSchema = roleSchema.partial();

export type UpdateRoleFormData = z.infer<typeof updateRoleSchema>;

