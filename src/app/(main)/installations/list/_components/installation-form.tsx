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
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Installation, InstallationStatus } from "@/types/installation";
import { installationSchema, InstallationFormData } from "@/schemas/installation-schema";
import { InstallationsAPI } from "@/services/installations-api";
import { ClientsAPI } from "@/services/clients-api";
import api from "@/lib/axios";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { SearchSelectInput, SearchSelectOption } from "@/components/ui/search-select-input";
import { Client } from "@/types/client";
import { Building2, User } from "lucide-react";
import { Sector } from "@/types/sector";
import { toast } from "sonner";
import { SectorSearchSelect } from "@/components/search-select/sector-search-select";
import { GenericImageUpload } from "@/components/ui/generic-image-upload";
import { IPAddressInput } from "@/components/ui/ip-address-input";

interface InstallationFormProps {
    installation?: Installation;
    onSubmit: (data: any) => void;
    onCancel: () => void;
}

export interface InstallationFormRef {
    submit: () => void;
    isSubmitting: boolean;
}

export const InstallationForm = forwardRef<InstallationFormRef, InstallationFormProps>(({ installation, onSubmit, onCancel }, ref) => {
    const [ isSubmitting, setIsSubmitting ] = useState(false);
    const [ clients, setClients ] = useState<Client[]>([]);
    const [ isLoadingClients, setIsLoadingClients ] = useState(false);
    const [ selectedClient, setSelectedClient ] = useState<Client | null>(null);
    const [ tempImageFile, setTempImageFile ] = useState<File | null>(null);

    const form = useForm<InstallationFormData>({
        resolver: zodResolver(installationSchema),
        defaultValues: {
            address: installation?.address || "",
            ipAddress: installation?.ipAddress || "",
            imagePath: installation?.imagePath || "",
            installedAt: installation?.installedAt || undefined,
            status: installation?.status || InstallationStatus.ACTIVE,
            clientId: installation?.clientId || 0,
            sectorId: installation?.sectorId || 0,
        },
    });

    // Cargar clientes
    useEffect(() => {
        const loadClients = async () => {
            setIsLoadingClients(true);
            try {
                const data = await ClientsAPI.getAll();
                setClients(data);
                if (installation?.clientId) {
                    const client = data.find(c => c.id === installation.clientId);
                    if (client) {
                        setSelectedClient(client);
                    }
                }
            } catch (error) {
                console.error("Error loading clients:", error);
            } finally {
                setIsLoadingClients(false);
            }
        };
        loadClients();
    }, [ installation ]);

    // Resetear formulario cuando cambie la instalación
    useEffect(() => {
        if (installation) {
            form.reset({
                address: installation.address || "",
                ipAddress: installation.ipAddress || "",
                imagePath: installation.imagePath || "",
                installedAt: installation.installedAt || undefined,
                status: installation.status || InstallationStatus.ACTIVE,
                clientId: installation.clientId || 0,
                sectorId: installation.sectorId || 0,
            });
        }
    }, [ installation ]);


    // Cargar clientes para el selector
    const loadClientOptions = async (searchQuery?: string): Promise<SearchSelectOption[]> => {
        try {
            const params = searchQuery ? { search: searchQuery } : {};
            const data = await ClientsAPI.getAll(params);
            return data.map(client => {
                const displayName = client.actor?.displayName ||
                    (client.actor?.person
                        ? `${client.actor.person.firstName} ${client.actor.person.lastName}`.trim()
                        : client.actor?.organization?.legalName) ||
                    'Sin nombre';
                const kind = client.actor?.kind;
                return {
                    value: client.id,
                    label: displayName,
                    description: kind === 'PERSON'
                        ? `Persona • ${client.actor?.person?.documentNumber || 'N/A'}`
                        : `Organización • ${client.actor?.organization?.documentNumber || 'N/A'}`,
                    icon: kind === 'PERSON' ? <User className="h-4 w-4" /> : <Building2 className="h-4 w-4" />
                };
            });
        } catch (error) {
            console.error("Error loading client options:", error);
            return [];
        }
    };

    useImperativeHandle(ref, () => ({
        submit: () => {
            form.handleSubmit(handleSubmit)();
        },
        isSubmitting,
    }));

    const handleSubmit = async (values: InstallationFormData) => {
        setIsSubmitting(true);
        try {
            // Limpiar valores vacíos antes de enviar
            const cleanedValues: any = {
                ...values,
                address: values.address?.trim() || undefined,
                ipAddress: values.ipAddress?.trim() || undefined,
                imagePath: values.imagePath?.trim() || undefined,
                installedAt: values.installedAt || undefined,
            };

            let createdInstallation = null;

            if (installation) {
                // Actualizar - NO incluir clientId ya que está bloqueado en modo edición
                const { clientId, ...updateValues } = cleanedValues;
                await InstallationsAPI.update(installation.id, updateValues);
                // El toast se mostrará en el componente que maneja onSubmit
            } else {
                // Crear
                createdInstallation = await InstallationsAPI.create(cleanedValues);
                // El toast se mostrará en el componente que maneja onSubmit

                // Si hay una imagen temporal, subirla después de crear la instalación
                if (tempImageFile && createdInstallation?.id) {
                    try {
                        const formData = new FormData();
                        formData.append('image', tempImageFile);

                        await api.post(`/installation/${createdInstallation.id}/upload-image`, formData, {
                            headers: {
                                'Content-Type': 'multipart/form-data',
                            },
                        });
                        // No mostrar toast adicional para la imagen, ya que el toast principal se muestra en la página
                    } catch (imgError: any) {
                        console.error("Error al subir imagen:", imgError);
                        toast.error("Instalación creada pero error al subir imagen");
                    }
                }
            }
            onSubmit(cleanedValues);
        } catch (error: any) {
            const errorMessage = error?.response?.data?.message || error?.message || "Error al guardar la instalación";
            toast.error(errorMessage);
            console.error("Error saving installation:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const clientId = form.watch("clientId");
    const installedAt = form.watch("installedAt");

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Cliente */}
                    <FormField
                        control={form.control}
                        name="clientId"
                        render={({ field }) => {
                            const handleClientSelect = (clientId: number) => {
                                field.onChange(clientId);
                                const client = clients.find(c => c.id === clientId);
                                setSelectedClient(client || null);
                            };

                            return (
                                <FormItem>
                                    <FormLabel>Cliente *</FormLabel>
                                    <FormControl>
                                        <SearchSelectInput
                                            value={field.value || undefined}
                                            onChange={(value) => handleClientSelect(value as number)}
                                            options={clients.map(client => ({
                                                value: client.id,
                                                label: client.actor?.displayName ||
                                                    (client.actor?.person
                                                        ? `${client.actor.person.firstName} ${client.actor.person.lastName}`.trim()
                                                        : client.actor?.organization?.legalName) ||
                                                    'Sin nombre',
                                                // description solo para búsqueda
                                                description: client.actor?.person?.documentNumber ||
                                                    client.actor?.organization?.documentNumber ||
                                                    '',
                                                icon: client.actor?.kind === 'PERSON' ? <User className="h-4 w-4" /> : <Building2 className="h-4 w-4" />
                                            }))}
                                            placeholder="Buscar cliente..."
                                            disabled={isSubmitting || !!installation}
                                            error={!!form.formState.errors.clientId}
                                            filterOptions={(options, query) => {
                                                // Filtrar opciones: label o description
                                                const lowerQuery = query.toLowerCase();
                                                return options.filter(option =>
                                                    option.label.toLowerCase().includes(lowerQuery) ||
                                                    (option.description && option.description.toLowerCase().includes(lowerQuery))
                                                );
                                            }}
                                            renderOption={(option, isSelected) => (
                                                <div
                                                    className={cn(
                                                        "flex items-center justify-between px-3 py-2 cursor-pointer hover:bg-accent hover:text-accent-foreground transition-colors duration-150",
                                                        isSelected && "bg-accent text-accent-foreground"
                                                    )}
                                                    onClick={() => handleClientSelect(option.value as number)}
                                                >
                                                    <div className="flex items-center gap-2">
                                                        {option.icon}
                                                        <span className="font-medium">{option.label}</span>
                                                    </div>
                                                </div>
                                            )}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            );
                        }}
                    />

                    {/* Fecha de Instalación */}
                    <FormField
                        control={form.control}
                        name="installedAt"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Fecha de Instalación</FormLabel>
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
                                                {field.value ? (
                                                    format(new Date(field.value), "PPP", { locale: es })
                                                ) : (
                                                    <span>Seleccionar fecha</span>
                                                )}
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

                    {/* Sector */}
                    <FormField
                        control={form.control}
                        name="sectorId"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Sector *</FormLabel>
                                <FormControl>
                                    <SectorSearchSelect
                                        value={field.value || undefined}
                                        onChange={(value) => field.onChange(value)}
                                        placeholder="Buscar sector..."
                                        disabled={isSubmitting}
                                        error={!!form.formState.errors.sectorId}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Dirección */}
                    <FormField
                        control={form.control}
                        name="address"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Dirección</FormLabel>
                                <FormControl>
                                    <Input {...field} placeholder="Ingrese la dirección" disabled={isSubmitting} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* IP Address */}
                    <FormField
                        control={form.control}
                        name="ipAddress"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Dirección IP</FormLabel>
                                <FormControl>
                                    <IPAddressInput
                                        value={field.value || ""}
                                        onChange={field.onChange}
                                        disabled={isSubmitting}
                                        error={!!form.formState.errors.ipAddress}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Estado - Solo en modo edición */}
                    {installation && (
                        <FormField
                            control={form.control}
                            name="status"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Estado *</FormLabel>
                                    <Select
                                        onValueChange={(value) => field.onChange(value as InstallationStatus)}
                                        value={field.value}
                                        disabled={isSubmitting}
                                    >
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Seleccione un estado" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value={InstallationStatus.ACTIVE}>Activa</SelectItem>
                                            <SelectItem value={InstallationStatus.INACTIVE}>Inactiva</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    )}

                    {/* Image Path */}
                    <FormField
                        control={form.control}
                        name="imagePath"
                        render={({ field }) => (
                            <FormItem className="md:col-span-2">
                                <FormLabel>Imagen de Instalación</FormLabel>
                                <FormControl>
                                    <GenericImageUpload
                                        id="installation-image"
                                        label=""
                                        value={field.value || ""}
                                        onChange={(value) => field.onChange(value)}
                                        onFileChange={!installation ? setTempImageFile : undefined}
                                        uploadEndpoint={`/installation/${installation?.id || 0}/upload-image`}
                                        disabled={isSubmitting}
                                        maxSize={10}
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

InstallationForm.displayName = "InstallationForm";

