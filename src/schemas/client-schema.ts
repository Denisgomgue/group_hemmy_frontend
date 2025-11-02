import { z } from 'zod';
import { ClientStatus } from '@/types/client';

// Schema para crear Cliente
export const clientSchema = z.object({
    status: z.nativeEnum(ClientStatus, {
        required_error: 'El estado es requerido',
    }),
    actorId: z.number({
        required_error: 'El actor es requerido',
    }).min(1, 'Debe seleccionar un actor'),
});

export type ClientFormData = z.infer<typeof clientSchema>;

// Schema para actualizar Cliente
export const updateClientSchema = z.object({
    status: z.nativeEnum(ClientStatus).optional(),
    actorId: z.number().min(1).optional(),
});

export type UpdateClientFormData = z.infer<typeof updateClientSchema>;

// Schema combinado: Persona + Cliente + Usuario (opcional)
// Se usa cuando se crea un cliente persona desde cero
import { personSchema } from './person-schema';
import { createUserFormSchema } from './user-schema';

export const createClientPersonWithUserSchema = personSchema.extend({
    // Datos del cliente
    status: z.nativeEnum(ClientStatus, {
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

export type CreateClientPersonWithUserFormData = z.infer<typeof createClientPersonWithUserSchema>;

// Schema combinado: Organización + Cliente + Usuario (opcional)
// Se usa cuando se crea un cliente organización desde cero
import { organizationSchema } from './organization-schema';

export const createClientOrganizationWithUserSchema = organizationSchema.extend({
    // Datos del cliente
    status: z.nativeEnum(ClientStatus, {
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

export type CreateClientOrganizationWithUserFormData = z.infer<typeof createClientOrganizationWithUserSchema>;

// Schema para compatibilidad con formularios existentes
// Este se usa cuando solo se necesita actualizar un cliente existente
export const formSchema = updateClientSchema;
