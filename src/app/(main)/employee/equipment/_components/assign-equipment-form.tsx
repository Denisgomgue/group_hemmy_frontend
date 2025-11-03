"use client"

import { useState, useEffect, forwardRef, useImperativeHandle } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { z } from "zod";
import { Equipment } from "@/types/equipment";
import { EmployeeSearchSelect } from "@/components/search-select/employee-search-select";
import { EquipmentAPI } from "@/services/equipment-api";
import { toast } from "sonner";
import { EquipmentUseType } from "@/schemas/equipment-schema";

const assignEquipmentSchema = z.object({
    employeeId: z.number({
        required_error: 'El empleado es requerido',
    }).min(1, 'Debe seleccionar un empleado'),
});

type AssignEquipmentFormData = z.infer<typeof assignEquipmentSchema>;

interface AssignEquipmentFormProps {
    equipment: Equipment;
    onSubmit: (data: any) => void;
    onCancel: () => void;
}

export interface AssignEquipmentFormRef {
    submit: () => void;
    isSubmitting: boolean;
}

export const AssignEquipmentForm = forwardRef<AssignEquipmentFormRef, AssignEquipmentFormProps>(({ equipment, onSubmit, onCancel }, ref) => {
    const [ isSubmitting, setIsSubmitting ] = useState(false);

    const form = useForm<AssignEquipmentFormData>({
        resolver: zodResolver(assignEquipmentSchema),
        defaultValues: {
            employeeId: equipment?.employeeId || undefined,
        },
    });

    // Actualizar valores cuando cambie el equipment
    useEffect(() => {
        if (equipment) {
            form.reset({
                employeeId: equipment.employeeId || undefined,
            });
        }
    }, [ equipment, form ]);

    useImperativeHandle(ref, () => ({
        submit: () => {
            form.handleSubmit(handleSubmit)();
        },
        isSubmitting,
    }));

    const handleSubmit = async (values: AssignEquipmentFormData) => {
        setIsSubmitting(true);
        try {
            // Actualizar el equipo con el empleado y fecha automática
            const updateData = {
                employeeId: values.employeeId,
                useType: EquipmentUseType.EMPLOYEE,
                assignedDate: new Date().toISOString().split('T')[0], // Fecha actual
                status: equipment.status === 'STOCK' ? 'ASSIGNED' : equipment.status, // Cambiar a ASSIGNED si está en STOCK
            };

            await EquipmentAPI.update(equipment.id, updateData);
            onSubmit(updateData);
        } catch (error: any) {
            const errorMessage = error?.response?.data?.message || error?.message || "Error al asignar el equipo";
            toast.error(errorMessage);
            console.error("Error assigning equipment:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
                <FormField
                    control={form.control}
                    name="employeeId"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Empleado *</FormLabel>
                            <FormControl>
                                <EmployeeSearchSelect
                                    value={field.value}
                                    onChange={(value) => field.onChange(value || undefined)}
                                    placeholder="Buscar empleado..."
                                    disabled={isSubmitting}
                                    error={!!form.formState.errors.employeeId}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
            </form>
        </Form>
    );
});

AssignEquipmentForm.displayName = "AssignEquipmentForm";

