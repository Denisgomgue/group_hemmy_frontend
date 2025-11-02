import { z } from 'zod';
import { personSchema } from './person-schema';

// Schema para crear Usuario (solo password e isActive)
// El usuario se crea vinculado a un Actor que ya existe
export const userSchema = z.object({
    actorId: z.number({
        required_error: 'El actor es requerido',
    }).min(1, 'Debe seleccionar un actor'),
    passwordHash: z.string({
        required_error: 'La contraseña es requerida',
    }).min(8, 'La contraseña debe tener al menos 8 caracteres'),
    isActive: z.boolean().optional().default(true),
});

// Schema para actualizar Usuario (solo isActive y passwordHash opcionales)
export const updateUserSchema = z.object({
    passwordHash: z.string().min(8, 'La contraseña debe tener al menos 8 caracteres').optional(),
    isActive: z.boolean().optional(),
});

// Schema para crear Usuario desde formulario (con confirmación de contraseña)
export const createUserFormSchema = z.object({
    passwordHash: z.string({
        required_error: 'La contraseña es requerida',
    }).min(8, 'La contraseña debe tener al menos 8 caracteres'),
    confirmPassword: z.string({
        required_error: 'Debe confirmar la contraseña',
    }),
    isActive: z.boolean().optional().default(true),
}).refine((data) => data.passwordHash === data.confirmPassword, {
    message: 'Las contraseñas no coinciden',
    path: [ 'confirmPassword' ],
});

// Schema para formulario completo: Persona + Usuario
// Este se usa cuando se crea un usuario desde cero (ej: desde cliente/empleado)
export const createPersonWithUserSchema = personSchema.extend({
    passwordHash: z.string({
        required_error: 'La contraseña es requerida',
    }).min(8, 'La contraseña debe tener al menos 8 caracteres'),
    confirmPassword: z.string({
        required_error: 'Debe confirmar la contraseña',
    }),
    isActive: z.boolean().optional().default(true),
    createUser: z.boolean().optional().default(false), // Checkbox para decidir si crear usuario
}).refine((data) => {
    // Si createUser es true, las contraseñas deben coincidir
    if (data.createUser) {
        return data.passwordHash === data.confirmPassword;
    }
    return true;
}, {
    message: 'Las contraseñas no coinciden',
    path: [ 'confirmPassword' ],
});

export type UserFormData = z.infer<typeof userSchema>;
export type UpdateUserFormData = z.infer<typeof updateUserSchema>;
export type CreateUserFormData = z.infer<typeof createUserFormSchema>;
export type CreatePersonWithUserFormData = z.infer<typeof createPersonWithUserSchema>;

// Schema para el formulario (exportado como formSchema para compatibilidad con componentes existentes)
// Nota: Este ya no se usa para crear usuarios directamente
export const formSchema = updateUserSchema;

export type UserFormInput = z.infer<typeof formSchema>;
