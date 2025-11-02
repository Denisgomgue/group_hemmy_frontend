import { z } from 'zod';

// Enum para EmployeeStatus
export enum EmployeeStatus {
    ACTIVE = 'ACTIVE',
    INACTIVE = 'INACTIVE',
}

// Schema para crear Empleado
export const employeeSchema = z.object({
    personId: z.number({
        required_error: 'La persona es requerida',
    }).min(1, 'Debe seleccionar una persona'),
    jobTitle: z.string().optional(),
    hireDate: z.string().optional(), // ISO date string
    status: z.nativeEnum(EmployeeStatus, {
        required_error: 'El estado es requerido',
    }),
});

export type EmployeeFormData = z.infer<typeof employeeSchema>;

export const updateEmployeeSchema = employeeSchema.partial();

export type UpdateEmployeeFormData = z.infer<typeof updateEmployeeSchema>;

// Schema combinado: Persona + Empleado + Usuario (opcional)
// Se usa cuando se crea un empleado completo desde cero
import { personSchema } from './person-schema';
import { createUserFormSchema } from './user-schema';

export const createEmployeeWithUserSchema = personSchema.extend({
    // Datos del empleado
    jobTitle: z.string().optional(),
    hireDate: z.string().optional(),
    status: z.nativeEnum(EmployeeStatus, {
        required_error: 'El estado es requerido',
    }),
    // Opción para crear usuario
    createUser: z.boolean().optional().default(false),
    // Si createUser es true, estos campos son requeridos
    passwordHash: z.string().optional(),
    confirmPassword: z.string().optional(),
    isActive: z.boolean().optional().default(true),
}).refine((data) => {
    // Si createUser es true, las contraseñas deben coincidir y estar presentes
    if (data.createUser) {
        if (!data.passwordHash || !data.confirmPassword) {
            return false;
        }
        return data.passwordHash === data.confirmPassword;
    }
    return true;
}, {
    message: 'Las contraseñas no coinciden o faltan campos',
    path: [ 'confirmPassword' ],
});

export type CreateEmployeeWithUserFormData = z.infer<typeof createEmployeeWithUserSchema>;

