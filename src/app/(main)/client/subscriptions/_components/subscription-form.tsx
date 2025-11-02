"use client";

import { useState, useEffect, forwardRef, useImperativeHandle, useMemo } from "react";
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
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Wifi, Zap } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { Subscription, SubscriptionStatus } from "@/types/subscription";
import { subscriptionSchema, SubscriptionFormData } from "@/schemas/subscription-schema";
import { SubscriptionsAPI } from "@/services/subscriptions-api";
import { InstallationSearchSelect } from "@/components/search-select/installation-search-select";
import { useServices } from "@/hooks/use-services";
import { usePlans } from "@/hooks/use-plans";
import { toast } from "sonner";
import { SearchSelectInput, SearchSelectOption } from "@/components/ui/search-select-input";

interface SubscriptionFormProps {
    subscription?: Subscription;
    onSubmit: (data: any) => void;
    onCancel: () => void;
}

export interface SubscriptionFormRef {
    submit: () => void;
    isSubmitting: boolean;
}

type ServiceType = "fiber" | "wireless" | null;

export const SubscriptionForm = forwardRef<SubscriptionFormRef, SubscriptionFormProps>(({ subscription, onSubmit, onCancel }, ref) => {
    const [ isSubmitting, setIsSubmitting ] = useState(false);
    const [ selectedServiceType, setSelectedServiceType ] = useState<ServiceType>(null);
    const { services, refreshServices } = useServices();
    const { plans, refreshPlans } = usePlans();

    // Cargar servicios y planes al montar
    useEffect(() => {
        refreshServices();
        refreshPlans();
    }, []);

    // Determinar el tipo de servicio basado en la suscripción o plan seleccionado
    useEffect(() => {
        if (subscription?.plan?.service) {
            const serviceName = subscription.plan.service.name.toLowerCase();
            if (serviceName.includes('fibra') || serviceName.includes('fiber')) {
                setSelectedServiceType('fiber');
            } else if (serviceName.includes('inalámbric') || serviceName.includes('wireless')) {
                setSelectedServiceType('wireless');
            }
        }
    }, [ subscription ]);

    // Filtrar servicios disponibles
    const availableServices = useMemo(() => {
        return services.filter(service => {
            const name = service.name.toLowerCase();
            return name.includes('fibra') || name.includes('fiber') ||
                name.includes('inalámbric') || name.includes('wireless');
        });
    }, [ services ]);

    // Obtener el servicio seleccionado basado en el tipo
    const selectedService = useMemo(() => {
        if (!selectedServiceType) return null;
        return availableServices.find(service => {
            const name = service.name.toLowerCase();
            if (selectedServiceType === 'fiber') {
                return name.includes('fibra') || name.includes('fiber');
            } else if (selectedServiceType === 'wireless') {
                return name.includes('inalámbric') || name.includes('wireless');
            }
            return false;
        });
    }, [ selectedServiceType, availableServices ]);

    // Filtrar planes basados en el servicio seleccionado
    const filteredPlans = useMemo(() => {
        if (!selectedService) return [];
        return plans.filter(plan => plan.serviceId === selectedService.id);
    }, [ plans, selectedService ]);

    const form = useForm<SubscriptionFormData>({
        resolver: zodResolver(subscriptionSchema),
        defaultValues: {
            startDate: subscription?.startDate || "",
            endDate: subscription?.endDate || undefined,
            billingDay: subscription?.billingDay || 1,
            status: subscription?.status || SubscriptionStatus.ACTIVE,
            advancePayment: subscription?.advancePayment || false,
            installationId: subscription?.installationId || 0,
            planId: subscription?.planId || 0,
        },
    });

    // Resetear formulario cuando cambie la suscripción
    useEffect(() => {
        if (subscription) {
            form.reset({
                startDate: subscription.startDate || "",
                endDate: subscription.endDate || undefined,
                billingDay: subscription.billingDay || 1,
                status: subscription.status || SubscriptionStatus.ACTIVE,
                advancePayment: subscription.advancePayment || false,
                installationId: subscription.installationId || 0,
                planId: subscription.planId || 0,
            });
        }
    }, [ subscription ]);

    useImperativeHandle(ref, () => ({
        submit: () => {
            form.handleSubmit(handleSubmit)();
        },
        isSubmitting,
    }));

    const handleServiceTypeChange = (type: ServiceType) => {
        setSelectedServiceType(type);
        // Limpiar el plan seleccionado cuando cambie el tipo de servicio
        form.setValue("planId", 0);
    };

    const handleSubmit = async (values: SubscriptionFormData) => {
        setIsSubmitting(true);
        try {
            // Limpiar valores vacíos antes de enviar
            const cleanedValues: any = {
                ...values,
                endDate: values.endDate?.trim() || undefined,
                advancePayment: values.advancePayment ?? false,
            };

            if (subscription) {
                // Actualizar
                await SubscriptionsAPI.update(subscription.id, cleanedValues);
                // El toast se mostrará en el componente que maneja onSubmit
            } else {
                // Crear
                await SubscriptionsAPI.create(cleanedValues);
                // El toast se mostrará en el componente que maneja onSubmit
            }
            onSubmit(cleanedValues);
        } catch (error: any) {
            const errorMessage = error?.response?.data?.message || error?.message || "Error al guardar la suscripción";
            toast.error(errorMessage);
            console.error("Error saving subscription:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    // Preparar opciones de planes filtrados para el SearchSelect
    const planOptions: SearchSelectOption[] = useMemo(() => {
        return filteredPlans.map(plan => ({
            value: plan.id,
            label: plan.name,
            description: `Velocidad: ${plan.speedMbps || 'N/A'} Mbps • Precio: S/. ${typeof plan.price === 'number' ? plan.price.toFixed(2) : plan.price}`,
            icon: <Wifi className="h-4 w-4" />
        }));
    }, [ filteredPlans ]);

    const handlePlanChange = (value: string | number) => {
        const numericValue = typeof value === 'string' ? parseInt(value, 10) : value;
        if (!isNaN(numericValue)) {
            form.setValue("planId", numericValue);
        }
    };

    const handlePlanSelect = (planId: number) => {
        form.setValue("planId", planId);
    };

    const renderPlanOption = (option: SearchSelectOption, isSelected: boolean) => (
        <div
            className={cn(
                "flex items-center justify-between px-3 py-2 cursor-pointer hover:bg-accent hover:text-accent-foreground transition-colors duration-150",
                isSelected && "bg-accent text-accent-foreground"
            )}
            onClick={() => handlePlanSelect(option.value as number)}
        >
            <div className="flex items-center gap-3">
                <Wifi className="h-4 w-4 text-muted-foreground" />
                <div>
                    <div className="font-medium">{option.label}</div>
                    {option.description && (
                        <div className="text-sm text-muted-foreground">{option.description}</div>
                    )}
                </div>
            </div>
        </div>
    );

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                    {/* Tipo de Servicio */}
                    {!subscription && (
                        <div className="space-y-4 xl:col-span-2">
                            <label className="text-sm font-medium text-foreground">
                                Tipo de Servicio <span className="text-red-500">*</span>
                            </label>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-3">
                                <Button
                                    type="button"
                                    variant={selectedServiceType === 'fiber' ? "default" : "outline"}
                                    className={cn(
                                        "h-auto p-4 flex flex-col items-center gap-2 transition-all duration-200",
                                        selectedServiceType === 'fiber'
                                            ? "bg-gradient-to-br from-purple-800 to-cyan-500 hover:from-purple-800 hover:to-cyan-600 text-white shadow-lg transform scale-105"
                                            : "hover:bg-accent hover:shadow-md"
                                    )}
                                    onClick={() => handleServiceTypeChange('fiber')}
                                    disabled={isSubmitting}
                                >
                                    <Zap className="h-6 w-6" />
                                    <span className="font-medium">Fibra Óptica</span>
                                </Button>
                                <Button
                                    type="button"
                                    variant={selectedServiceType === 'wireless' ? "default" : "outline"}
                                    className={cn(
                                        "h-auto p-4 flex flex-col items-center gap-2 transition-all duration-200",
                                        selectedServiceType === 'wireless'
                                            ? "bg-gradient-to-br from-purple-800 to-cyan-500 hover:from-purple-800 hover:to-cyan-600 text-white shadow-lg transform scale-105"
                                            : "hover:bg-accent hover:shadow-md"
                                    )}
                                    onClick={() => handleServiceTypeChange('wireless')}
                                    disabled={isSubmitting}
                                >
                                    <Wifi className="h-6 w-6" />
                                    <span className="font-medium">Inalámbrico</span>
                                </Button>
                            </div>
                        </div>
                    )}

                    {/* Mensaje cuando no hay servicio seleccionado (solo en modo creación) */}
                    {!subscription && !selectedServiceType && (
                        <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6 text-center animate-in fade-in-0 duration-300 xl:col-span-2">
                            <div className="flex flex-col items-center gap-3">
                                <div className="h-12 w-12 bg-blue-100 dark:bg-blue-900/50 rounded-full flex items-center justify-center">
                                    <Wifi className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-blue-800 dark:text-blue-200 mb-1">
                                        Seleccione un tipo de servicio
                                    </p>
                                    <p className="text-xs text-blue-600 dark:text-blue-300">
                                        Elija entre servicio inalámbrico o fibra óptica para continuar
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Contenedor de campos que aparecen solo cuando se selecciona un servicio o está en modo edición */}
                    {(selectedServiceType || subscription) && (
                        <div className="space-y-6 animate-in slide-in-from-top-2 fade-in-0 duration-500 xl:col-span-2">
                            {/* Instalación y Plan - Dos columnas */}
                            <div className="grid gap-4">
                                {/* Instalación */}
                                <FormField
                                    control={form.control}
                                    name="installationId"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Instalación *</FormLabel>
                                            <FormControl>
                                                <InstallationSearchSelect
                                                    value={field.value || undefined}
                                                    onChange={(value) => field.onChange(value)}
                                                    placeholder="Buscar instalación..."
                                                    disabled={isSubmitting || !!subscription}
                                                    error={!!form.formState.errors.installationId}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                {/* Plan */}
                                <FormField
                                    control={form.control}
                                    name="planId"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>
                                                Plan <span className="text-red-500">*</span>
                                            </FormLabel>
                                            <FormControl>
                                                <SearchSelectInput
                                                    value={field.value || undefined}
                                                    onChange={handlePlanChange}
                                                    placeholder={`Buscar plan ${selectedServiceType === 'wireless' ? 'inalámbrica' : 'fibra óptica'}...`}
                                                    disabled={isSubmitting}
                                                    error={!!form.formState.errors.planId}
                                                    options={planOptions}
                                                    isLoading={!plans.length}
                                                    emptyMessage="No hay planes disponibles"
                                                    noResultsMessage="No se encontraron planes"
                                                    renderOption={renderPlanOption}
                                                    minSearchLength={0}
                                                    debounceMs={300}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            {/* Fecha Inicio */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="startDate"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Fecha Inicio *</FormLabel>
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <FormControl>
                                                    <Button
                                                        type="button"
                                                        variant="outline"
                                                        className={cn(
                                                            "w-full pl-3 text-left font-normal",
                                                            !field.value && "text-muted-foreground"
                                                        )}
                                                        disabled={isSubmitting}
                                                    >
                                                        {field.value ? format(new Date(field.value), "PPP", { locale: es }) : "Selecciona fecha"}
                                                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                    </Button>
                                                </FormControl>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-auto p-0" align="start">
                                                <div className="relative pointer-events-auto">
                                                    <Calendar
                                                        mode="single"
                                                        selected={field.value ? new Date(field.value) : undefined}
                                                        onSelect={(date) => {
                                                            field.onChange(date ? date.toISOString() : undefined);
                                                        }}
                                                        disabled={isSubmitting}
                                                        initialFocus
                                                    />
                                                </div>
                                            </PopoverContent>
                                        </Popover>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Fecha Fin - Solo en modo edición */}
                            {subscription && (
                                <FormField
                                    control={form.control}
                                    name="endDate"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Fecha Fin</FormLabel>
                                            <Popover>
                                                <PopoverTrigger asChild>
                                                    <FormControl>
                                                        <Button
                                                            type="button"
                                                            variant="outline"
                                                            className={cn(
                                                                "w-full pl-3 text-left font-normal",
                                                                !field.value && "text-muted-foreground"
                                                            )}
                                                            disabled={isSubmitting}
                                                        >
                                                            {field.value ? format(new Date(field.value), "PPP", { locale: es }) : "Selecciona fecha"}
                                                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                        </Button>
                                                    </FormControl>
                                                </PopoverTrigger>
                                                <PopoverContent className="w-auto p-0" align="start">
                                                    <div className="relative pointer-events-auto">
                                                        <Calendar
                                                            mode="single"
                                                            selected={field.value ? new Date(field.value) : undefined}
                                                            onSelect={(date) => {
                                                                field.onChange(date ? date.toISOString() : undefined);
                                                            }}
                                                            disabled={isSubmitting}
                                                            initialFocus
                                                        />
                                                    </div>
                                                </PopoverContent>
                                            </Popover>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            )}

                            {/* Día de Facturación */}
                            <FormField
                                control={form.control}
                                name="billingDay"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Día de Facturación *</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="number"
                                                {...field}
                                                placeholder="Día del mes"
                                                disabled={isSubmitting}
                                                value={field.value || ''}
                                                onChange={(e) => field.onChange(parseInt(e.target.value) || 1)}
                                                min={1}
                                                max={28}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            </div>
                            {/* Anticipo */}
                            <FormField
                                control={form.control}
                                name="advancePayment"
                                render={({ field }) => (
                                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                                        <div className="space-y-0.5">
                                            <FormLabel className="text-base">Pago Adelantado</FormLabel>
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

                            {/* Estado - Solo en modo edición */}
                            {subscription && (
                                <FormField
                                    control={form.control}
                                    name="status"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Estado *</FormLabel>
                                            <Select
                                                onValueChange={(value) => field.onChange(value as SubscriptionStatus)}
                                                value={field.value}
                                                disabled={isSubmitting}
                                            >
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Seleccione un estado" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    <SelectItem value={SubscriptionStatus.ACTIVE}>Activa</SelectItem>
                                                    <SelectItem value={SubscriptionStatus.SUSPENDED}>Suspendida</SelectItem>
                                                    <SelectItem value={SubscriptionStatus.INACTIVE}>Inactiva</SelectItem>
                                                    <SelectItem value={SubscriptionStatus.CANCELLED}>Cancelada</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            )}
                        </div>
                    )}
                </div>
            </form>
        </Form>
    );
});

SubscriptionForm.displayName = "SubscriptionForm";
