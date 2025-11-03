import { z } from 'zod';

export const permissionSchema = z.object({
    code: z.string({
        required_error: 'El código es requerido',
    }).min(1, 'El código no puede estar vacío')
        .regex(/^[a-z0-9_:]+$/, 'El código solo puede contener letras minúsculas, números, guiones bajos y dos puntos'),
    name: z.string({
        required_error: 'El nombre es requerido',
    }).min(1, 'El nombre no puede estar vacío'),
    description: z.string().optional(),
    resourceId: z.number().optional().nullable(),
});

export type PermissionFormData = z.infer<typeof permissionSchema>;

export const updatePermissionSchema = permissionSchema.partial();

export type UpdatePermissionFormData = z.infer<typeof updatePermissionSchema>;

