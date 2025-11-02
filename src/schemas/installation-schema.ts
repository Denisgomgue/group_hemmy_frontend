import { z } from 'zod';
import { InstallationStatus } from '@/types/installation';

// Schema para crear Instalación
export const installationSchema = z.object({
    address: z.string().optional(),
    ipAddress: z.union([
        z.string().ip('IP inválida'),
        z.literal(''),
        z.undefined()
    ]).optional(),
    imagePath: z.string().optional(),
    installedAt: z.union([
        z.string().datetime('Fecha inválida'),
        z.literal(''),
        z.undefined()
    ]).optional(),
    status: z.nativeEnum(InstallationStatus, {
        required_error: 'El estado es requerido',
    }),
    clientId: z.number({
        required_error: 'El cliente es requerido',
    }).min(1, 'Debe seleccionar un cliente'),
    sectorId: z.number({
        required_error: 'El sector es requerido',
    }).min(1, 'Debe seleccionar un sector'),
});

export type InstallationFormData = z.infer<typeof installationSchema>;

// Schema para actualizar Instalación
export const updateInstallationSchema = z.object({
    address: z.string().optional(),
    ipAddress: z.union([
        z.string().ip('IP inválida'),
        z.literal(''),
        z.undefined()
    ]).optional(),
    imagePath: z.string().optional(),
    installedAt: z.union([
        z.string().datetime('Fecha inválida'),
        z.literal(''),
        z.undefined()
    ]).optional(),
    status: z.nativeEnum(InstallationStatus).optional(),
    clientId: z.number().min(1).optional(),
    sectorId: z.number().min(1).optional(),
});

export type UpdateInstallationFormData = z.infer<typeof updateInstallationSchema>;

// Schema para compatibilidad con formularios existentes
export const formSchema = updateInstallationSchema;

