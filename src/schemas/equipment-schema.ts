import { z } from 'zod';
import { EquipmentStatus, EquipmentUseType } from '@/types/equipment';

// Re-exportar los enums para facilitar su uso
export { EquipmentStatus, EquipmentUseType };

export const equipmentSchema = z.object({
    serialNumber: z.string().optional(),
    macAddress: z.string().optional(),
    brand: z.string().optional(),
    model: z.string().optional(),
    status: z.nativeEnum(EquipmentStatus).optional().default(EquipmentStatus.STOCK),
    assignedDate: z.string().optional(),
    useType: z.nativeEnum(EquipmentUseType, {
        required_error: 'El tipo de uso es requerido',
    }),
    notes: z.string().optional(),
    installationId: z.number().optional(),
    employeeId: z.number().optional(),
    categoryId: z.number({
        required_error: 'La categoría es requerida',
    }).min(1, 'Debe seleccionar una categoría'),
});

export type EquipmentFormData = z.infer<typeof equipmentSchema>;

export const updateEquipmentSchema = equipmentSchema.partial();

export type UpdateEquipmentFormData = z.infer<typeof updateEquipmentSchema>;

