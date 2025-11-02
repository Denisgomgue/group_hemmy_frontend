import { z } from 'zod';

// Enum para DocumentType (solo DNI por ahora según el backend)
export enum DocumentType {
    DNI = 'DNI',
}

// Schema para crear Persona
export const personSchema = z.object({
    documentType: z.nativeEnum(DocumentType, {
        required_error: 'El tipo de documento es requerido',
    }),
    documentNumber: z.string({
        required_error: 'El número de documento es requerido',
    })
        .min(1, 'El número de documento es requerido')
        .refine((val) => /^\d+$/.test(val), 'El DNI solo debe contener números')
        .refine((val: string) => {
            if (val.length === 0) return true; // Permitir campo vacío inicialmente
            return val.length === 8;
        }, (val: string) => {
            if (val.length < 8) {
                return { message: 'El DNI debe tener exactamente 8 dígitos. Faltan ' + (8 - val.length) + ' dígito(s)' };
            }
            return { message: 'El DNI debe tener exactamente 8 dígitos. Tiene ' + val.length + ' dígito(s)' };
        }),
    firstName: z.string({
        required_error: 'El nombre es requerido',
    }).min(2, 'El nombre debe tener al menos 2 caracteres'),
    lastName: z.string({
        required_error: 'El apellido es requerido',
    }).min(2, 'El apellido debe tener al menos 2 caracteres'),
    birthdate: z.string().optional(),
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
});

export type PersonFormData = z.infer<typeof personSchema>;

