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
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Equipment } from "@/types/equipment";
import {
    equipmentSchema,
    EquipmentFormData,
    EquipmentStatus,
    EquipmentUseType
} from "@/schemas/equipment-schema";
import { EquipmentAPI, EquipmentCategoriesAPI } from "@/services/equipment-api";
import { toast } from "sonner";
import { EquipmentCategory } from "@/types/equipment";

interface EquipmentFormProps {
    equipment?: Equipment;
    onSubmit: (data: any) => void;
    onCancel: () => void;
}

export interface EquipmentFormRef {
    submit: () => void;
    isSubmitting: boolean;
}

export const EquipmentForm = forwardRef<EquipmentFormRef, EquipmentFormProps>(({ equipment, onSubmit, onCancel }, ref) => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [categories, setCategories] = useState<EquipmentCategory[]>([]);

    const form = useForm<EquipmentFormData>({
        resolver: zodResolver(equipmentSchema),
        defaultValues: {
            serialNumber: equipment?.serialNumber || "",
            macAddress: equipment?.macAddress || "",
            brand: equipment?.brand || "",
            model: equipment?.model || "",
            status: equipment?.status || EquipmentStatus.STOCK,
            assignedDate: equipment?.assignedDate || undefined,
            useType: equipment?.useType || EquipmentUseType.CLIENT,
            notes: equipment?.notes || "",
            installationId: equipment?.installationId || undefined,
            employeeId: equipment?.employeeId || undefined,
            categoryId: equipment?.categoryId || undefined,
        },
    });

    // Cargar categorías al montar
    useEffect(() => {
        const loadCategories = async () => {
            try {
                const categoriesData = await EquipmentCategoriesAPI.getAll();
                setCategories(categoriesData);
            } catch (error) {
                console.error("Error loading categories:", error);
            }
        };
        loadCategories();
    }, []);

    // Actualizar valores cuando cambie el equipment (modo edición)
    useEffect(() => {
        if (equipment) {
            form.reset({
                serialNumber: equipment.serialNumber || "",
                macAddress: equipment.macAddress || "",
                brand: equipment.brand || "",
                model: equipment.model || "",
                status: equipment.status,
                assignedDate: equipment.assignedDate || undefined,
                useType: equipment.useType,
                notes: equipment.notes || "",
                installationId: equipment.installationId || undefined,
                employeeId: equipment.employeeId || undefined,
                categoryId: equipment.categoryId || undefined,
            });
        }
    }, [equipment, form]);

    useImperativeHandle(ref, () => ({
        submit: () => {
            form.handleSubmit(handleSubmit)();
        },
        isSubmitting,
    }));

    const handleSubmit = async (values: EquipmentFormData) => {
        setIsSubmitting(true);
        try {
            // Limpiar valores vacíos antes de enviar
            const cleanedValues: any = {
                useType: values.useType,
                categoryId: values.categoryId,
            };

            // Campos opcionales básicos
            if (values.serialNumber?.trim()) cleanedValues.serialNumber = values.serialNumber.trim();
            if (values.macAddress?.trim()) cleanedValues.macAddress = values.macAddress.trim();
            if (values.brand?.trim()) cleanedValues.brand = values.brand.trim();
            if (values.model?.trim()) cleanedValues.model = values.model.trim();
            if (values.notes?.trim()) cleanedValues.notes = values.notes.trim();

            // Estado y fecha de asignación
            cleanedValues.status = values.status;
            
            // Si se asigna a una instalación o empleado, establecer fecha automáticamente
            if (values.installationId || values.employeeId) {
                cleanedValues.assignedDate = new Date().toISOString().split('T')[0];
            }

            // Asignación según tipo de uso
            if (values.useType === EquipmentUseType.CLIENT && values.installationId) {
                cleanedValues.installationId = values.installationId;
                cleanedValues.employeeId = undefined;
            } else if (values.useType === EquipmentUseType.EMPLOYEE && values.employeeId) {
                cleanedValues.employeeId = values.employeeId;
                cleanedValues.installationId = undefined;
            }

            if (equipment) {
                await EquipmentAPI.update(equipment.id, cleanedValues);
            } else {
                await EquipmentAPI.create(cleanedValues);
            }
            onSubmit(cleanedValues);
        } catch (error: any) {
            const errorMessage = error?.response?.data?.message || error?.message || "Error al guardar el equipo";
            toast.error(errorMessage);
            console.error("Error saving equipment:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Marca */}
                    <FormField
                        control={form.control}
                        name="brand"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Marca</FormLabel>
                                <FormControl>
                                    <Input
                                        {...field}
                                        placeholder="Ej: TP-Link, Ubiquiti"
                                        disabled={isSubmitting}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Modelo */}
                    <FormField
                        control={form.control}
                        name="model"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Modelo</FormLabel>
                                <FormControl>
                                    <Input
                                        {...field}
                                        placeholder="Ej: Archer C50, UAP-AC-Lite"
                                        disabled={isSubmitting}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Número de Serie */}
                    <FormField
                        control={form.control}
                        name="serialNumber"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Número de Serie</FormLabel>
                                <FormControl>
                                    <Input
                                        {...field}
                                        placeholder="SN123456789"
                                        disabled={isSubmitting}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* MAC Address */}
                    <FormField
                        control={form.control}
                        name="macAddress"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>MAC Address</FormLabel>
                                <FormControl>
                                    <Input
                                        {...field}
                                        placeholder="00:11:22:33:44:55"
                                        disabled={isSubmitting}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Estado */}
                    <FormField
                        control={form.control}
                        name="status"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Estado</FormLabel>
                                <Select
                                    onValueChange={(value) => field.onChange(value as EquipmentStatus)}
                                    value={field.value}
                                    disabled={isSubmitting}
                                >
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Seleccione un estado" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value={EquipmentStatus.STOCK}>En Stock</SelectItem>
                                        <SelectItem value={EquipmentStatus.ASSIGNED}>Asignado</SelectItem>
                                        <SelectItem value={EquipmentStatus.USED}>En Uso</SelectItem>
                                        <SelectItem value={EquipmentStatus.MAINTENANCE}>Mantenimiento</SelectItem>
                                        <SelectItem value={EquipmentStatus.SOLD}>Vendido</SelectItem>
                                        <SelectItem value={EquipmentStatus.LOST}>Perdido</SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Categoría - Requerido */}
                    <FormField
                        control={form.control}
                        name="categoryId"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Categoría *</FormLabel>
                                <Select
                                    onValueChange={(value) => field.onChange(parseInt(value))}
                                    value={field.value?.toString()}
                                    disabled={isSubmitting || !!equipment}
                                >
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Seleccione una categoría" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {categories.map((category) => (
                                            <SelectItem key={category.id} value={category.id.toString()}>
                                                {category.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Notas */}
                    <FormField
                        control={form.control}
                        name="notes"
                        render={({ field }) => (
                            <FormItem className="md:col-span-2">
                                <FormLabel>Notas</FormLabel>
                                <FormControl>
                                    <Textarea
                                        {...field}
                                        placeholder="Observaciones adicionales..."
                                        disabled={isSubmitting}
                                        rows={3}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
            </form>
        </Form>
    );
});

EquipmentForm.displayName = "EquipmentForm";
