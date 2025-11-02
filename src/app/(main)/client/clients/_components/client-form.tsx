"use client";

import { useState, useEffect, forwardRef, useImperativeHandle } from "react";
import { useResponsiveTable } from "@/hooks/use-responsive-view";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { Client, ClientStatus } from "@/types/client";
import {
    createClientPersonWithUserSchema,
    createClientOrganizationWithUserSchema,
    CreateClientPersonWithUserFormData,
    CreateClientOrganizationWithUserFormData
} from "@/schemas/client-schema";
import { DocumentType } from "@/schemas/person-schema";
import { OrganizationDocumentType } from "@/schemas/organization-schema";
import { PersonAPI } from "@/services/person-api";
import { OrganizationAPI } from "@/services/organization-api";
import { ActorAPI } from "@/services/actor-api";
import { ClientsAPI } from "@/services/clients-api";
import { UsersAPI } from "@/services/users-api";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { cn, formatDateForBackend, createDateFromString } from "@/lib/utils";
import { PersonSearchSelect } from "@/components/search-select/person-search-select";

interface ClientFormProps {
    client?: Client;
    onSubmit: (data: any) => void;
    onCancel: () => void;
}

export interface ClientFormRef {
    submit: () => void;
    isSubmitting: boolean;
}

type ClientType = "person" | "organization";

export const ClientForm = forwardRef<ClientFormRef, ClientFormProps>(({ client, onSubmit, onCancel }, ref) => {
    const [ clientType, setClientType ] = useState<ClientType>("person");
    const [ isSubmitting, setIsSubmitting ] = useState(false);
    const { isMobile, isTablet, isLaptop } = useResponsiveTable();

    // Grid responsivo: 1 columna en móvil/tablet, 2 columnas en desktop
    const gridCols = isTablet || isLaptop ? "grid-cols-1" : "grid-cols-2";

    // Formulario para Persona
    const personForm = useForm<CreateClientPersonWithUserFormData>({
        resolver: zodResolver(createClientPersonWithUserSchema),
        mode: 'onBlur', // Validar cuando el usuario salga del campo
        defaultValues: {
            documentType: DocumentType.DNI,
            documentNumber: "",
            firstName: "",
            lastName: "",
            birthdate: undefined,
            email: "",
            phone: "",
            address: "",
            status: ClientStatus.ACTIVE,
            createUser: false,
            passwordHash: "",
            confirmPassword: "",
            isActive: true,
        },
    });

    // Formulario para Organización
    const organizationForm = useForm<CreateClientOrganizationWithUserFormData>({
        resolver: zodResolver(createClientOrganizationWithUserSchema),
        mode: 'onBlur', // Validar cuando el usuario salga del campo
        defaultValues: {
            legalName: "",
            documentType: OrganizationDocumentType.RUC,
            documentNumber: "",
            email: "",
            phone: "",
            address: "",
            status: ClientStatus.ACTIVE,
            createUser: false,
            passwordHash: "",
            confirmPassword: "",
            isActive: true,
        },
    });

    const handlePersonSubmit = async (values: CreateClientPersonWithUserFormData) => {
        setIsSubmitting(true);
        try {
            // Si estamos en modo edición, actualizar en lugar de crear
            if (client && client.actor && client.actor.person) {
                // Actualizar Persona
                const personData = {
                    documentType: values.documentType,
                    documentNumber: values.documentNumber,
                    firstName: values.firstName,
                    lastName: values.lastName,
                    birthdate: values.birthdate,
                    email: values.email,
                    phone: values.phone,
                    address: values.address,
                };

                console.log("Actualizando Persona...", personData);
                await PersonAPI.update(client.actor.person.id, personData);

                // Actualizar Actor
                const displayName = `${values.firstName} ${values.lastName}`.trim();
                await ActorAPI.update(client.actor.id, { displayName });

                // Actualizar Cliente
                await ClientsAPI.update(client.id, { status: values.status });

                console.log("Cliente actualizado exitosamente");
            } else {
                // Modo creación
                // 1. Crear Persona
                const personData = {
                    documentType: values.documentType,
                    documentNumber: values.documentNumber,
                    firstName: values.firstName,
                    lastName: values.lastName,
                    birthdate: values.birthdate,
                    email: values.email,
                    phone: values.phone,
                    address: values.address,
                };

                console.log("Creando Persona...", personData);
                const person = await PersonAPI.create(personData);
                console.log("Persona creada:", person);

                if (!person || !person.id) {
                    throw new Error("Error: No se pudo obtener el ID de la persona creada");
                }

                // 2. Crear Actor vinculado a la Persona
                const displayName = `${values.firstName} ${values.lastName}`.trim();
                const actorData = {
                    kind: 'PERSON' as const,
                    displayName,
                    personId: person.id,
                };
                console.log("Creando Actor...", actorData);
                const actor = await ActorAPI.create(actorData);
                console.log("Actor creado:", actor);

                if (!actor || !actor.id) {
                    throw new Error("Error: No se pudo obtener el ID del actor creado");
                }

                // 3. Crear Cliente
                const clientData = {
                    actorId: actor.id,
                    status: values.status,
                };
                console.log("Creando Cliente...", clientData);
                const newClient = await ClientsAPI.create(clientData);
                console.log("Cliente creado:", newClient);

                if (!newClient || !newClient.id) {
                    throw new Error("Error: No se pudo crear el cliente");
                }

                // 4. [OPCIONAL] Crear Usuario si está marcado
                if (values.createUser && values.passwordHash) {
                    console.log("Creando Usuario...");
                    // Hash de contraseña (temporal, debería hacerlo el backend)
                    const encoder = new TextEncoder();
                    const data = encoder.encode(values.passwordHash);
                    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
                    const hashArray = Array.from(new Uint8Array(hashBuffer));
                    const passwordHash = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

                    await UsersAPI.create({
                        actorId: actor.id,
                        passwordHash,
                        isActive: values.isActive ?? true,
                    });
                    console.log("Usuario creado");
                }
            }

            if (onSubmit) {
                onSubmit({ success: true });
            }

            if (!client) {
                personForm.reset();
                onCancel();
            }
        } catch (error: any) {
            console.error("Error completo al procesar cliente (person):", error);
            console.error("Error response:", error?.response?.data);
            // Mostrar error detallado
            const errorMessage = error?.response?.data?.message || error?.message || "Error al procesar el cliente";
            throw new Error(errorMessage);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleOrganizationSubmit = async (values: CreateClientOrganizationWithUserFormData) => {
        setIsSubmitting(true);
        try {
            // Si estamos en modo edición, actualizar en lugar de crear
            if (client && client.actor && client.actor.organization) {
                // Actualizar Organización
                const organizationData = {
                    legalName: values.legalName,
                    documentType: values.documentType,
                    documentNumber: values.documentNumber,
                    email: values.email,
                    phone: values.phone,
                    address: values.address,
                    representativePersonId: values.representativePersonId,
                };

                console.log("Actualizando Organización...", organizationData);
                await OrganizationAPI.update(client.actor.organization.id, organizationData);

                // Actualizar Actor
                await ActorAPI.update(client.actor.id, { displayName: values.legalName });

                // Actualizar Cliente
                await ClientsAPI.update(client.id, { status: values.status });

                console.log("Cliente actualizado exitosamente");
            } else {
                // Modo creación
                // 1. Crear Organización
                const organizationData = {
                    legalName: values.legalName,
                    documentType: values.documentType,
                    documentNumber: values.documentNumber,
                    email: values.email,
                    phone: values.phone,
                    address: values.address,
                    representativePersonId: values.representativePersonId,
                };

                console.log("Creando Organización...", organizationData);
                const organization = await OrganizationAPI.create(organizationData);
                console.log("Organización creada:", organization);

                if (!organization || !organization.id) {
                    throw new Error("Error: No se pudo obtener el ID de la organización creada");
                }

                // 2. Crear Actor vinculado a la Organización
                const actorData = {
                    kind: 'ORGANIZATION' as const,
                    displayName: values.legalName,
                    organizationId: organization.id,
                };
                console.log("Creando Actor...", actorData);
                const actor = await ActorAPI.create(actorData);
                console.log("Actor creado:", actor);

                if (!actor || !actor.id) {
                    throw new Error("Error: No se pudo obtener el ID del actor creado");
                }

                // 3. Crear Cliente
                const newClientData = {
                    actorId: actor.id,
                    status: values.status,
                };
                console.log("Creando Cliente...", newClientData);
                const newClient = await ClientsAPI.create(newClientData);
                console.log("Cliente creado:", newClient);

                if (!newClient || !newClient.id) {
                    throw new Error("Error: No se pudo crear el cliente");
                }

                // 4. [OPCIONAL] Crear Usuario si está marcado
                if (values.createUser && values.passwordHash) {
                    console.log("Creando Usuario...");
                    // Hash de contraseña (temporal, debería hacerlo el backend)
                    const encoder = new TextEncoder();
                    const data = encoder.encode(values.passwordHash);
                    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
                    const hashArray = Array.from(new Uint8Array(hashBuffer));
                    const passwordHash = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

                    await UsersAPI.create({
                        actorId: actor.id,
                        passwordHash,
                        isActive: values.isActive ?? true,
                    });
                    console.log("Usuario creado");
                }
            }

            if (onSubmit) {
                onSubmit({ success: true });
            }

            if (!client) {
                organizationForm.reset();
                onCancel();
            }
        } catch (error: any) {
            console.error("Error completo al procesar cliente (organization):", error);
            console.error("Error response:", error?.response?.data);
            // Mostrar error detallado
            const errorMessage = error?.response?.data?.message || error?.message || "Error al procesar el cliente";
            throw new Error(errorMessage);
        } finally {
            setIsSubmitting(false);
        }
    };

    // Cargar datos del cliente cuando se recibe el prop client (modo edición)
    useEffect(() => {
        if (client && client.actor) {
            const actor = client.actor;

            // Determinar el tipo de cliente basándose en el actor
            if (actor.kind === 'PERSON' && actor.person) {
                setClientType('person');
                // Cargar datos de persona
                personForm.reset({
                    documentType: actor.person.documentType as DocumentType || DocumentType.DNI,
                    documentNumber: actor.person.documentNumber || "",
                    firstName: actor.person.firstName || "",
                    lastName: actor.person.lastName || "",
                    birthdate: actor.person.birthdate || undefined,
                    email: actor.person.email || "",
                    phone: actor.person.phone || "",
                    address: actor.person.address || "",
                    status: client.status,
                    createUser: false,
                    passwordHash: "",
                    confirmPassword: "",
                    isActive: true,
                });
            } else if (actor.kind === 'ORGANIZATION' && actor.organization) {
                setClientType('organization');
                // Cargar datos de organización
                organizationForm.reset({
                    legalName: actor.organization.legalName || "",
                    documentType: actor.organization.documentType as OrganizationDocumentType || OrganizationDocumentType.RUC,
                    documentNumber: actor.organization.documentNumber || "",
                    email: actor.organization.email || "",
                    phone: actor.organization.phone || "",
                    address: actor.organization.address || "",
                    status: client.status,
                    createUser: false,
                    passwordHash: "",
                    confirmPassword: "",
                    isActive: true,
                    representativePersonId: actor.organization.representativePersonId,
                });
            }
        }
    }, [ client ]);

    // Exponer métodos al padre mediante ref
    useImperativeHandle(ref, () => ({
        submit: () => {
            if (clientType === 'person') {
                personForm.handleSubmit(handlePersonSubmit)();
            } else {
                organizationForm.handleSubmit(handleOrganizationSubmit)();
            }
        },
        isSubmitting
    }));

    return (
        <div className="space-y-6 max-h-[50vh]">
            {/* Selector de Tipo de Cliente */}
            <Tabs value={clientType} onValueChange={(value) => !client && setClientType(value as ClientType)}>
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="person">Persona</TabsTrigger>
                    <TabsTrigger value="organization">Organización</TabsTrigger>
                </TabsList>

                {/* Formulario para Cliente Persona */}
                <TabsContent value="person" className="max-h-[40vh] overflow-scroll p-2">
                    <Form {...personForm}>
                        <form onSubmit={personForm.handleSubmit(handlePersonSubmit)} className="space-y-6">
                            {/* Información de Documento */}
                            <div className={`grid ${gridCols} gap-4`}>
                                <FormField
                                    control={personForm.control}
                                    name="documentType"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Tipo de Documento</FormLabel>
                                            <Select
                                                onValueChange={field.onChange}
                                                defaultValue={field.value}
                                                value={field.value}
                                            >
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Seleccione tipo" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    <SelectItem value={DocumentType.DNI}>DNI</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={personForm.control}
                                    name="documentNumber"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Número de Documento</FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="12345678"
                                                    {...field}
                                                    maxLength={8}
                                                    onChange={(e) => {
                                                        // Solo permitir números
                                                        const value = e.target.value.replace(/\D/g, '');
                                                        field.onChange(value);
                                                    }}
                                                    onBlur={() => {
                                                        // Validar cuando el usuario salga del campo
                                                        field.onBlur();
                                                        personForm.trigger('documentNumber');
                                                    }}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            {/* Nombres */}
                            <div className={`grid ${gridCols} gap-4`}>
                                <FormField
                                    control={personForm.control}
                                    name="firstName"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Nombres</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Juan" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={personForm.control}
                                    name="lastName"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Apellidos</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Pérez" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            {/* Email y Teléfono */}
                            <div className={`grid ${gridCols} gap-4`}>
                                <FormField
                                    control={personForm.control}
                                    name="email"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Correo Electrónico</FormLabel>
                                            <FormControl>
                                                <Input type="email" placeholder="juan@example.com" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={personForm.control}
                                    name="phone"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Teléfono</FormLabel>
                                            <FormControl>
                                                <Input placeholder="+51 999999999" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            {/* Fecha de Nacimiento y Dirección */}
                            <div className={`grid ${gridCols} gap-4`}>
                                <FormField
                                    control={personForm.control}
                                    name="birthdate"
                                    render={({ field }) => (
                                        <FormItem className="flex flex-col">
                                            <FormLabel>Fecha de Nacimiento</FormLabel>
                                            <Popover>
                                                <PopoverTrigger asChild>
                                                    <FormControl>
                                                        <Button
                                                            variant={"outline"}
                                                            className={cn(
                                                                "w-full pl-3 text-left font-normal",
                                                                !field.value && "text-muted-foreground"
                                                            )}
                                                        >
                                                            {field.value ? (
                                                                format(createDateFromString(field.value), "PPP", { locale: es })
                                                            ) : (
                                                                <span>Seleccione una fecha</span>
                                                            )}
                                                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                        </Button>
                                                    </FormControl>
                                                </PopoverTrigger>
                                                <PopoverContent className="w-auto p-0" align="start">
                                                    <div className="relative pointer-events-auto">
                                                        <Calendar
                                                            variant="birthdate"
                                                            mode="single"
                                                            selected={field.value ? createDateFromString(field.value) : undefined}
                                                            onSelect={(date) => field.onChange(formatDateForBackend(date))}
                                                            disabled={(date) =>
                                                                date > new Date() || date < new Date("1900-01-01")
                                                            }
                                                            initialFocus
                                                            locale={es}
                                                        />
                                                    </div>
                                                </PopoverContent>
                                            </Popover>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={personForm.control}
                                    name="address"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Dirección</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Av. Principal 123" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            {/* Estado del Cliente - Solo visible en modo edición */}
                            {client && (
                                <FormField
                                    control={personForm.control}
                                    name="status"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Estado del Cliente</FormLabel>
                                            <Select
                                                onValueChange={(value) => field.onChange(value as ClientStatus)}
                                                defaultValue={field.value}
                                                value={field.value}
                                            >
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Seleccione un estado" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    <SelectItem value={ClientStatus.ACTIVE}>Activo</SelectItem>
                                                    <SelectItem value={ClientStatus.INACTIVE}>Inactivo</SelectItem>
                                                    <SelectItem value={ClientStatus.SUSPENDED}>Suspendido</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <FormDescription>
                                                El estado del cliente determinará si puede recibir servicios.
                                            </FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            )}

                            {/* Checkbox para crear usuario */}
                            <FormField
                                control={personForm.control}
                                name="createUser"
                                render={({ field }) => (
                                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                                        <FormControl>
                                            <Checkbox
                                                checked={field.value}
                                                onCheckedChange={field.onChange}
                                            />
                                        </FormControl>
                                        <div className="space-y-1 leading-none">
                                            <FormLabel>
                                                Crear cuenta de usuario para este cliente
                                            </FormLabel>
                                            <FormDescription>
                                                Si está marcado, se creará un usuario con acceso al sistema.
                                            </FormDescription>
                                        </div>
                                    </FormItem>
                                )}
                            />

                            {/* Campos de usuario (solo si createUser está marcado) */}
                            {personForm.watch("createUser") && (
                                <div className="space-y-4 p-4 border rounded-md bg-muted/50">
                                    <h4 className="text-sm font-medium">Datos de Usuario</h4>

                                    <div className={`grid ${gridCols} gap-4`}>
                                        <FormField
                                            control={personForm.control}
                                            name="passwordHash"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Contraseña</FormLabel>
                                                    <FormControl>
                                                        <Input type="password" placeholder="Mínimo 8 caracteres" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={personForm.control}
                                            name="confirmPassword"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Confirmar Contraseña</FormLabel>
                                                    <FormControl>
                                                        <Input type="password" placeholder="Confirme la contraseña" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>

                                    <FormField
                                        control={personForm.control}
                                        name="isActive"
                                        render={({ field }) => (
                                            <FormItem className="flex flex-row items-center space-x-2">
                                                <FormControl>
                                                    <Checkbox
                                                        checked={field.value}
                                                        onCheckedChange={field.onChange}
                                                    />
                                                </FormControl>
                                                <FormLabel className="!mt-0">Usuario activo</FormLabel>
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            )}
                        </form>
                    </Form>
                </TabsContent>

                {/* Formulario para Cliente Organización */}
                <TabsContent value="organization" className="max-h-[40vh] overflow-scroll p-2">
                    <Form {...organizationForm}>
                        <form onSubmit={organizationForm.handleSubmit(handleOrganizationSubmit)} className="space-y-6">
                            {/* Información de Organización */}
                            <FormField
                                control={organizationForm.control}
                                name="legalName"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Razón Social</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Empresa S.A.C." {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <div className={`grid ${gridCols} gap-4`}>
                                <FormField
                                    control={organizationForm.control}
                                    name="documentType"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Tipo de Documento</FormLabel>
                                            <Select
                                                onValueChange={field.onChange}
                                                defaultValue={field.value}
                                                value={field.value}
                                            >
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Seleccione tipo" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    <SelectItem value={OrganizationDocumentType.RUC}>RUC</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={organizationForm.control}
                                    name="documentNumber"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Número de RUC</FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="20123456789"
                                                    {...field}
                                                    maxLength={11}
                                                    onChange={(e) => {
                                                        // Solo permitir números
                                                        const value = e.target.value.replace(/\D/g, '');
                                                        field.onChange(value);
                                                    }}
                                                    onBlur={() => {
                                                        // Validar cuando el usuario salga del campo
                                                        field.onBlur();
                                                        organizationForm.trigger('documentNumber');
                                                    }}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            {/* Email y Teléfono */}
                            <div className={`grid ${gridCols} gap-4`}>
                                <FormField
                                    control={organizationForm.control}
                                    name="email"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Correo Electrónico</FormLabel>
                                            <FormControl>
                                                <Input type="email" placeholder="contacto@empresa.com" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={organizationForm.control}
                                    name="phone"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Teléfono</FormLabel>
                                            <FormControl>
                                                <Input placeholder="+51 999999999" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            {/* Dirección */}
                            <FormField
                                control={organizationForm.control}
                                name="address"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Dirección</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Av. Principal 123" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Persona Representante */}
                            <FormField
                                control={organizationForm.control}
                                name="representativePersonId"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Persona Representante (Opcional)</FormLabel>
                                        <FormControl>
                                            <PersonSearchSelect
                                                value={field.value}
                                                onChange={(personId) => field.onChange(personId)}
                                                placeholder="Buscar persona representante..."
                                                error={!!organizationForm.formState.errors.representativePersonId}
                                            />
                                        </FormControl>
                                        <FormDescription>
                                            Seleccione la persona que representa legalmente a esta organización.
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Estado del Cliente - Solo visible en modo edición */}
                            {client && (
                                <FormField
                                    control={organizationForm.control}
                                    name="status"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Estado del Cliente</FormLabel>
                                            <Select
                                                onValueChange={(value) => field.onChange(value as ClientStatus)}
                                                defaultValue={field.value}
                                                value={field.value}
                                            >
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Seleccione un estado" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    <SelectItem value={ClientStatus.ACTIVE}>Activo</SelectItem>
                                                    <SelectItem value={ClientStatus.INACTIVE}>Inactivo</SelectItem>
                                                    <SelectItem value={ClientStatus.SUSPENDED}>Suspendido</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <FormDescription>
                                                El estado del cliente determinará si puede recibir servicios.
                                            </FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            )}

                            {/* Checkbox para crear usuario */}
                            <FormField
                                control={organizationForm.control}
                                name="createUser"
                                render={({ field }) => (
                                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                                        <FormControl>
                                            <Checkbox
                                                checked={field.value}
                                                onCheckedChange={field.onChange}
                                            />
                                        </FormControl>
                                        <div className="space-y-1 leading-none">
                                            <FormLabel>
                                                Crear cuenta de usuario para esta organización
                                            </FormLabel>
                                            <FormDescription>
                                                Si está marcado, se creará un usuario con acceso al sistema.
                                            </FormDescription>
                                        </div>
                                    </FormItem>
                                )}
                            />

                            {/* Campos de usuario (solo si createUser está marcado) */}
                            {organizationForm.watch("createUser") && (
                                <div className="space-y-4 p-4 border rounded-md bg-muted/50">
                                    <h4 className="text-sm font-medium">Datos de Usuario</h4>

                                    <div className={`grid ${gridCols} gap-4`}>
                                        <FormField
                                            control={organizationForm.control}
                                            name="passwordHash"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Contraseña</FormLabel>
                                                    <FormControl>
                                                        <Input type="password" placeholder="Mínimo 8 caracteres" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={organizationForm.control}
                                            name="confirmPassword"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Confirmar Contraseña</FormLabel>
                                                    <FormControl>
                                                        <Input type="password" placeholder="Confirme la contraseña" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>

                                    <FormField
                                        control={organizationForm.control}
                                        name="isActive"
                                        render={({ field }) => (
                                            <FormItem className="flex flex-row items-center space-x-2">
                                                <FormControl>
                                                    <Checkbox
                                                        checked={field.value}
                                                        onCheckedChange={field.onChange}
                                                    />
                                                </FormControl>
                                                <FormLabel className="!mt-0">Usuario activo</FormLabel>
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            )}
                        </form>
                    </Form>
                </TabsContent>
            </Tabs>
        </div>
    );
});

ClientForm.displayName = "ClientForm";
