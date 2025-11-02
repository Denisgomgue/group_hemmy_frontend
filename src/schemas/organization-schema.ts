import { z } from 'zod';

// Enum para OrganizationDocumentType (solo RUC por ahora según el backend)
export enum OrganizationDocumentType {
    RUC = 'RUC',
}

// Schema para crear Organización
export const organizationSchema = z.object({
    legalName: z.string({
        required_error: 'La razón social es requerida',
    }).min(2, 'La razón social debe tener al menos 2 caracteres'),
    documentType: z.nativeEnum(OrganizationDocumentType, {
        required_error: 'El tipo de documento es requerido',
    }),
    documentNumber: z.string({
        required_error: 'El número de documento es requerido',
    })
        .min(1, 'El número de documento es requerido')
        .refine((val) => /^\d+$/.test(val), 'El RUC solo debe contener números')
        .refine((val: string) => {
            if (val.length === 0) return true; // Permitir campo vacío inicialmente
            return val.length === 11;
        }, (val: string) => {
            if (val.length < 11) {
                return { message: 'El RUC debe tener exactamente 11 dígitos. Faltan ' + (11 - val.length) + ' dígito(s)' };
            }
            return { message: 'El RUC debe tener exactamente 11 dígitos. Tiene ' + val.length + ' dígito(s)' };
        }),
    email: z.string({
        required_error: 'El email es requerido',
    }).email('El email no es válido'),
    phone: z.string()
        .optional()
        .refine((val) => {
            if (!val || val.length === 0) return true; // Permitir campo vacío
            return /^\d+$/.test(val);
        }, 'El teléfono solo debe contener números')
        .refine((val) => {
            if (!val || val.length === 0) return true; // Permitir campo vacío
            return val.length === 9;
        }, (val) => {
            if (!val) return { message: '' };
            if (val.length < 9) {
                return { message: 'El teléfono debe tener exactamente 9 dígitos. Faltan ' + (9 - val.length) + ' dígito(s)' };
            }
            return { message: 'El teléfono debe tener exactamente 9 dígitos. Tiene ' + val.length + ' dígito(s)' };
        }),
    address: z.string().optional(),
    representativePersonId: z.number().optional(), // ID de la persona representante (opcional)
});

export type OrganizationFormData = z.infer<typeof organizationSchema>;

