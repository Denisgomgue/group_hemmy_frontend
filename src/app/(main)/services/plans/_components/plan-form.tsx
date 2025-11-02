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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Plan } from "@/types/plan";
import { planSchema, PlanFormData } from "@/schemas/plan-schema";
import { PlansAPI } from "@/services/plans-api";
import { useServices } from "@/hooks/use-services";
import { toast } from "sonner";

interface PlanFormProps {
    plan?: Plan;
    onSubmit: (data: any) => void;
    onCancel: () => void;
}

export interface PlanFormRef {
    submit: () => void;
    isSubmitting: boolean;
}

export const PlanForm = forwardRef<PlanFormRef, PlanFormProps>(({ plan, onSubmit, onCancel }, ref) => {
    const [ isSubmitting, setIsSubmitting ] = useState(false);
    const { services, refreshServices } = useServices();

    // Cargar servicios al montar
    useEffect(() => {
        refreshServices();
    }, []);

    const form = useForm<PlanFormData>({
        resolver: zodResolver(planSchema),
        defaultValues: {
            name: plan?.name || "",
            price: plan?.price || 0,
            serviceId: plan?.serviceId || plan?.service?.id || undefined,
            speedMbps: plan?.speedMbps || undefined,
            description: plan?.description || "",
            isActive: plan?.isActive ?? true,
            type: plan?.type ?? false,
        },
    });

    // Actualizar valores cuando cambie el plan (modo edición)
    useEffect(() => {
        if (plan) {
            form.reset({
                name: plan.name,
                price: plan.price,
                serviceId: plan.serviceId || plan.service?.id,
                speedMbps: plan.speedMbps,
                description: plan.description || "",
                isActive: plan.isActive ?? true,
                type: plan.type ?? false,
            });
        }
    }, [ plan, form ]);

    useImperativeHandle(ref, () => ({
        submit: () => {
            form.handleSubmit(handleSubmit)();
        },
        isSubmitting,
    }));

    const handleSubmit = async (values: PlanFormData) => {
        setIsSubmitting(true);
        try {
            // Limpiar valores vacíos antes de enviar
            const cleanedValues = {
                ...values,
                description: values.description?.trim() || undefined,
                speedMbps: values.speedMbps || undefined,
                type: values.type ?? false,
                isActive: values.isActive ?? true,
            };

            if (plan) {
                // Actualizar
                await PlansAPI.update(plan.id, cleanedValues);
                // El toast se mostrará en el componente que maneja onSubmit
            } else {
                // Crear
                await PlansAPI.create(cleanedValues);
                // El toast se mostrará en el componente que maneja onSubmit
            }
            onSubmit(cleanedValues);
        } catch (error: any) {
            const errorMessage = error?.response?.data?.message || error?.message || "Error al guardar el plan";
            toast.error(errorMessage);
            console.error("Error saving plan:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Nombre */}
                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Nombre del Plan *</FormLabel>
                                <FormControl>
                                    <Input {...field} placeholder="Ingrese el nombre del plan" disabled={isSubmitting} />
                                </FormControl>
                                <FormDescription>
                                    Nombre único que identifica al plan
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Servicio */}
                    <FormField
                        control={form.control}
                        name="serviceId"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Servicio</FormLabel>
                                <Select
                                    onValueChange={(value) => field.onChange(value ? parseInt(value, 10) : undefined)}
                                    value={field.value?.toString() || ""}
                                    disabled={isSubmitting}
                                >
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Seleccione un servicio" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {services.map((service) => (
                                            <SelectItem key={service.id} value={service.id.toString()}>
                                                {service.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <FormDescription>
                                    Servicio al que pertenece este plan
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Velocidad */}
                    <FormField
                        control={form.control}
                        name="speedMbps"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Velocidad (Mbps)</FormLabel>
                                <FormControl>
                                    <Input
                                        type="number"
                                        {...field}
                                        placeholder="Ingrese la velocidad"
                                        disabled={isSubmitting}
                                        value={field.value || ''}
                                        onChange={(e) => field.onChange(e.target.value ? parseFloat(e.target.value) : undefined)}
                                    />
                                </FormControl>
                                <FormDescription>
                                    Velocidad del plan en Mbps
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Precio */}
                    <FormField
                        control={form.control}
                        name="price"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Precio *</FormLabel>
                                <FormControl>
                                    <Input
                                        type="number"
                                        step="0.01"
                                        {...field}
                                        placeholder="Ingrese el precio"
                                        disabled={isSubmitting}
                                        value={field.value || ''}
                                        onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                                    />
                                </FormControl>
                                <FormDescription>
                                    Precio del plan en soles
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Tipo Web */}
                    <FormField
                        control={form.control}
                        name="type"
                        render={({ field }) => (
                            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                                <div className="space-y-0.5">
                                    <FormLabel className="text-base">Tipo Web</FormLabel>
                                </div>
                                <FormControl>
                                    <Switch
                                        checked={field.value ?? false}
                                        onCheckedChange={field.onChange}
                                        disabled={isSubmitting}
                                    />
                                </FormControl>
                            </FormItem>
                        )}
                    />

                    {/* Estado (solo en modo edición) */}
                    {plan && (
                        <FormField
                            control={form.control}
                            name="isActive"
                            render={({ field }) => (
                                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                                    <div className="space-y-0.5">
                                        <FormLabel className="text-base">Estado Activo</FormLabel>
                                    </div>
                                    <FormControl>
                                        <Switch
                                            checked={field.value ?? true}
                                            onCheckedChange={field.onChange}
                                            disabled={isSubmitting}
                                        />
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                    )}

                    {/* Descripción */}
                    <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                            <FormItem className="md:col-span-2">
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

PlanForm.displayName = "PlanForm";
