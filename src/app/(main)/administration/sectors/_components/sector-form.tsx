"use client";

import { useState, useEffect, forwardRef, useImperativeHandle } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Sector } from "@/types/sector";
import { sectorSchema, SectorFormData } from "@/schemas/sector-schema";
import { SectorsAPI } from "@/services/sectors-api";
import { toast } from "sonner";

interface SectorFormProps {
    sector?: Sector;
    onSubmit: (data: any) => void;
    onCancel: () => void;
}

export interface SectorFormRef {
    submit: () => void;
    isSubmitting: boolean;
}

export const SectorForm = forwardRef<SectorFormRef, SectorFormProps>(({ sector, onSubmit, onCancel }, ref) => {
    const [ isSubmitting, setIsSubmitting ] = useState(false);

    const form = useForm<SectorFormData>({
        resolver: zodResolver(sectorSchema),
        defaultValues: {
            name: sector?.name || "",
            description: sector?.description || "",
        },
    });

    // Actualizar valores cuando cambie el sector (modo edición)
    useEffect(() => {
        if (sector) {
            form.reset({
                name: sector.name,
                description: sector.description || "",
            });
        }
    }, [ sector, form ]);

    useImperativeHandle(ref, () => ({
        submit: () => {
            form.handleSubmit(handleSubmit)();
        },
        isSubmitting,
    }));

    const handleSubmit = async (values: SectorFormData) => {
        setIsSubmitting(true);
        try {
            // Limpiar valores vacíos antes de enviar
            const cleanedValues = {
                ...values,
                description: values.description?.trim() || undefined,
            };

            if (sector) {
                // Actualizar
                await SectorsAPI.update(sector.id, cleanedValues);
                toast.success("Sector actualizado exitosamente");
            } else {
                // Crear
                await SectorsAPI.create(cleanedValues);
                toast.success("Sector creado exitosamente");
            }
            onSubmit(cleanedValues);
        } catch (error: any) {
            const errorMessage = error?.response?.data?.message || error?.message || "Error al guardar el sector";
            toast.error(errorMessage);
            console.error("Error saving sector:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
                <div className="grid grid-cols-1 gap-4 mb-4">
                    {/* Nombre */}
                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Nombre del Sector *</FormLabel>
                                <FormControl>
                                    <Input {...field} placeholder="Ingrese el nombre del sector" disabled={isSubmitting} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Descripción */}
                    <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Descripción</FormLabel>
                                <FormControl>
                                    <Textarea
                                        {...field}
                                        placeholder="Ingrese una descripción (opcional)"
                                        className="resize-none"
                                        disabled={isSubmitting}
                                        rows={4}
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

SectorForm.displayName = "SectorForm";
