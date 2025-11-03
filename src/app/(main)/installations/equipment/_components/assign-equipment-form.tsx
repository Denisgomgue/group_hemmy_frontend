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
import { InstallationSearchSelect } from "@/components/search-select/installation-search-select";
import { EquipmentAPI } from "@/services/equipment-api";
import { toast } from "sonner";
import { EquipmentUseType } from "@/schemas/equipment-schema";

const assignEquipmentSchema = z.object({
    installationId: z.number({
        required_error: 'La instalación es requerida',
    }).min(1, 'Debe seleccionar una instalación'),
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
            installationId: equipment?.installationId || undefined,
        },
    });

    // Actualizar valores cuando cambie el equipment
    useEffect(() => {
        if (equipment) {
            form.reset({
                installationId: equipment.installationId || undefined,
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
            // Actualizar el equipo con la instalación y fecha automática
            const updateData = {
                installationId: values.installationId,
                useType: EquipmentUseType.CLIENT,
                assignedDate: new Date().toISOString().split('T')[ 0 ], // Fecha actual
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
                    name="installationId"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Instalación *</FormLabel>
                            <FormControl>
                                <InstallationSearchSelect
                                    value={field.value}
                                    onChange={(value) => field.onChange(value || undefined)}
                                    placeholder="Buscar instalación..."
                                    disabled={isSubmitting}
                                    error={!!form.formState.errors.installationId}
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

