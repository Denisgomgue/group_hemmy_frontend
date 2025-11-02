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
import { Service } from "@/types/service";
import { serviceSchema, ServiceFormData } from "@/schemas/service-schema";
import { ServicesAPI } from "@/services/services-api";
import { toast } from "sonner";

interface ServiceFormProps {
    service?: Service;
    onSubmit: (data: any) => void;
    onCancel: () => void;
}

export interface ServiceFormRef {
    submit: () => void;
    isSubmitting: boolean;
}

export const ServiceForm = forwardRef<ServiceFormRef, ServiceFormProps>(({ service, onSubmit, onCancel }, ref) => {
    const [ isSubmitting, setIsSubmitting ] = useState(false);

    const form = useForm<ServiceFormData>({
        resolver: zodResolver(serviceSchema),
        defaultValues: {
            name: service?.name || "",
            description: service?.description || "",
        },
    });

    // Actualizar valores cuando cambie el service (modo edición)
    useEffect(() => {
        if (service) {
            form.reset({
                name: service.name,
                description: service.description || "",
            });
        }
    }, [ service, form ]);

    useImperativeHandle(ref, () => ({
        submit: () => {
            form.handleSubmit(handleSubmit)();
        },
        isSubmitting,
    }));

    const handleSubmit = async (values: ServiceFormData) => {
        setIsSubmitting(true);
        try {
            // Limpiar valores vacíos antes de enviar
            const cleanedValues = {
                ...values,
                description: values.description?.trim() || undefined,
            };

            if (service) {
                // Actualizar
                await ServicesAPI.update(service.id, cleanedValues);
                // El toast se mostrará en la página que maneja onSubmit
            } else {
                // Crear
                await ServicesAPI.create(cleanedValues);
                // El toast se mostrará en la página que maneja onSubmit
            }
            onSubmit(cleanedValues);
        } catch (error: any) {
            const errorMessage = error?.response?.data?.message || error?.message || "Error al guardar el servicio";
            toast.error(errorMessage);
            console.error("Error saving service:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 gap-4">
                    {/* Nombre */}
                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Nombre del Servicio *</FormLabel>
                                <FormControl>
                                    <Input {...field} placeholder="Ingrese el nombre del servicio" disabled={isSubmitting} />
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

ServiceForm.displayName = "ServiceForm";
