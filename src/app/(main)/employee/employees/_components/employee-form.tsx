"use client"

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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Employee } from "@/types/employee";
import {
    employeeSchema,
    EmployeeFormData,
    EmployeeStatus,
    createEmployeeWithUserSchema,
    CreateEmployeeWithUserFormData
} from "@/schemas/employee-schema";
import { DocumentType } from "@/schemas/person-schema";
import { EmployeesAPI } from "@/services/employees-api";
import { PersonAPI } from "@/services/person-api";
import { ActorAPI } from "@/services/actor-api";
import { UsersAPI } from "@/services/users-api";
import { PersonSearchSelect } from "@/components/search-select/person-search-select";
import { toast } from "sonner";

interface EmployeeFormProps {
    employee?: Employee;
    onSubmit: (data: any) => void;
    onCancel: () => void;
}

export interface EmployeeFormRef {
    submit: () => void;
    isSubmitting: boolean;
}

type EmployeeMode = "existing" | "new";

export const EmployeeForm = forwardRef<EmployeeFormRef, EmployeeFormProps>(({ employee, onSubmit, onCancel }, ref) => {
    const [ isSubmitting, setIsSubmitting ] = useState(false);
    const [ mode, setMode ] = useState<EmployeeMode>("existing");

    // Formulario para Persona Existente
    const existingForm = useForm<EmployeeFormData>({
        resolver: zodResolver(employeeSchema),
        defaultValues: {
            personId: employee?.personId || undefined,
            jobTitle: employee?.jobTitle || "",
            hireDate: employee?.hireDate || undefined,
            status: employee?.status || EmployeeStatus.ACTIVE,
        },
    });

    // Formulario para Nueva Persona + Empleado + Usuario
    const newForm = useForm<CreateEmployeeWithUserFormData>({
        resolver: zodResolver(createEmployeeWithUserSchema),
        mode: 'onBlur',
        defaultValues: {
            documentType: DocumentType.DNI,
            documentNumber: "",
            firstName: "",
            lastName: "",
            birthdate: undefined,
            email: "",
            phone: "",
            address: "",
            jobTitle: "",
            hireDate: undefined,
            status: EmployeeStatus.ACTIVE,
            createUser: false,
            passwordHash: "",
            confirmPassword: "",
            isActive: true,
        },
    });

    // Actualizar valores cuando cambie el employee (modo edición)
    useEffect(() => {
        if (employee) {
            setMode("existing");
            existingForm.reset({
                personId: employee.personId,
                jobTitle: employee.jobTitle || "",
                hireDate: employee.hireDate || undefined,
                status: employee.status,
            });
        }
    }, [ employee, existingForm ]);

    useImperativeHandle(ref, () => ({
        submit: () => {
            if (employee) {
                // Modo edición: solo formulario de persona existente
                existingForm.handleSubmit(handleExistingSubmit)();
            } else {
                // Modo creación: depende del tab seleccionado
                if (mode === "existing") {
                    existingForm.handleSubmit(handleExistingSubmit)();
                } else {
                    newForm.handleSubmit(handleNewSubmit)();
                }
            }
        },
        isSubmitting,
    }));

    const handleExistingSubmit = async (values: EmployeeFormData) => {
        setIsSubmitting(true);
        try {
            const cleanedValues: any = {
                personId: values.personId,
                status: values.status,
            };

            if (values.jobTitle?.trim()) {
                cleanedValues.jobTitle = values.jobTitle.trim();
            }

            if (values.hireDate) {
                cleanedValues.hireDate = values.hireDate;
            }

            if (employee) {
                await EmployeesAPI.update(employee.id, cleanedValues);
        } else {
                await EmployeesAPI.create(cleanedValues);
            }
            onSubmit({ success: true });
        } catch (error: any) {
            const errorMessage = error?.response?.data?.message || error?.message || "Error al guardar el empleado";
            toast.error(errorMessage);
            console.error("Error saving employee:", error);
            throw error;
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleNewSubmit = async (values: CreateEmployeeWithUserFormData) => {
        setIsSubmitting(true);
        try {
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

            // 3. Crear Empleado
            const employeeData: any = {
                personId: person.id,
                status: values.status,
            };

            if (values.jobTitle?.trim()) {
                employeeData.jobTitle = values.jobTitle.trim();
            }

            if (values.hireDate) {
                employeeData.hireDate = values.hireDate;
            }

            console.log("Creando Empleado...", employeeData);
            const newEmployee = await EmployeesAPI.create(employeeData);
            console.log("Empleado creado:", newEmployee);

            if (!newEmployee || !newEmployee.id) {
                throw new Error("Error: No se pudo crear el empleado");
            }

            // 4. [OPCIONAL] Crear Usuario si está marcado
            if (values.createUser && values.passwordHash) {
                console.log("Creando Usuario...");
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

            onSubmit({ success: true });
            if (!employee) {
                newForm.reset();
            }
        } catch (error: any) {
            console.error("Error completo al procesar empleado:", error);
            const errorMessage = error?.response?.data?.message || error?.message || "Error al procesar el empleado";
            toast.error(errorMessage);
            throw new Error(errorMessage);
        } finally {
            setIsSubmitting(false);
        }
    };

    // Si estamos en modo edición, solo mostrar formulario de persona existente
    if (employee) {
    return (
            <Form {...existingForm}>
                <form onSubmit={existingForm.handleSubmit(handleExistingSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Persona - Solo lectura */}
                    <FormField
                            control={existingForm.control}
                            name="personId"
                        render={({ field }) => (
                                <FormItem className="md:col-span-2">
                                    <FormLabel>Persona *</FormLabel>
                                <FormControl>
                                        <PersonSearchSelect
                                            value={field.value}
                                            onChange={(value) => field.onChange(value)}
                                            placeholder="Buscar persona..."
                                            disabled={true}
                                            error={!!existingForm.formState.errors.personId}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                        {/* Cargo */}
                    <FormField
                            control={existingForm.control}
                            name="jobTitle"
                        render={({ field }) => (
                            <FormItem>
                                    <FormLabel>Cargo</FormLabel>
                                <FormControl>
                                    <Input
                                            {...field}
                                            placeholder="Ej: Técnico, Secretario, Administrador"
                                            disabled={isSubmitting}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                        {/* Fecha de Contratación */}
                    <FormField
                            control={existingForm.control}
                            name="hireDate"
                        render={({ field }) => (
                            <FormItem>
                                    <FormLabel>Fecha de Contratación</FormLabel>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <FormControl>
                                                <Button
                                                    variant="outline"
                                                    type="button"
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

                        {/* Estado */}
                        <FormField
                            control={existingForm.control}
                            name="status"
                            render={({ field }) => (
                                <FormItem className="md:col-span-2">
                                    <FormLabel>Estado *</FormLabel>
                                    <Select
                                        onValueChange={(value) => field.onChange(value as EmployeeStatus)}
                                        value={field.value}
                                        disabled={isSubmitting}
                                    >
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Seleccione un estado" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value={EmployeeStatus.ACTIVE}>Activo</SelectItem>
                                            <SelectItem value={EmployeeStatus.INACTIVE}>Inactivo</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                </form>
            </Form>
        );
    }

    // Modo creación: mostrar tabs para elegir entre persona existente o nueva
    return (
        <div className="space-y-6">
            <Tabs value={mode} onValueChange={(value) => setMode(value as EmployeeMode)}>
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="existing">Persona Existente</TabsTrigger>
                    <TabsTrigger value="new">Nueva Persona</TabsTrigger>
                </TabsList>

                {/* Persona Existente */}
                <TabsContent value="existing" className="space-y-6">
                    <Form {...existingForm}>
                        <form onSubmit={existingForm.handleSubmit(handleExistingSubmit)} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Persona */}
                                <FormField
                                    control={existingForm.control}
                                    name="personId"
                                    render={({ field }) => (
                                        <FormItem className="md:col-span-2">
                                            <FormLabel>Persona *</FormLabel>
                                <FormControl>
                                                <PersonSearchSelect
                                                    value={field.value}
                                                    onChange={(value) => field.onChange(value)}
                                                    placeholder="Buscar persona..."
                                                    disabled={isSubmitting}
                                                    error={!!existingForm.formState.errors.personId}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                                {/* Cargo */}
                    <FormField
                                    control={existingForm.control}
                                    name="jobTitle"
                        render={({ field }) => (
                            <FormItem>
                                            <FormLabel>Cargo</FormLabel>
                                <FormControl>
                                    <Input
                                                    {...field}
                                                    placeholder="Ej: Técnico, Secretario, Administrador"
                                                    disabled={isSubmitting}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                                {/* Fecha de Contratación */}
                    <FormField
                                    control={existingForm.control}
                                    name="hireDate"
                        render={({ field }) => (
                            <FormItem>
                                            <FormLabel>Fecha de Contratación</FormLabel>
                                            <Popover>
                                                <PopoverTrigger asChild>
                                                    <FormControl>
                                                        <Button
                                                            variant="outline"
                                                            type="button"
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

                                {/* Estado */}
                                <FormField
                                    control={existingForm.control}
                                    name="status"
                                    render={({ field }) => (
                                        <FormItem className="md:col-span-2">
                                            <FormLabel>Estado *</FormLabel>
                                <Select
                                                onValueChange={(value) => field.onChange(value as EmployeeStatus)}
                                                value={field.value}
                                                disabled={isSubmitting}
                                >
                                    <FormControl>
                                        <SelectTrigger>
                                                        <SelectValue placeholder="Seleccione un estado" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                                    <SelectItem value={EmployeeStatus.ACTIVE}>Activo</SelectItem>
                                                    <SelectItem value={EmployeeStatus.INACTIVE}>Inactivo</SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
            </form>
        </Form>
                </TabsContent>

                {/* Nueva Persona */}
                <TabsContent value="new" className="space-y-6">
                    <Form {...newForm}>
                        <form onSubmit={newForm.handleSubmit(handleNewSubmit)} className="space-y-6">
                            {/* Información de Documento */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <FormField
                                    control={newForm.control}
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
                                    control={newForm.control}
                                    name="documentNumber"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Número de Documento *</FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="12345678"
                                                    {...field}
                                                    maxLength={8}
                                                    onChange={(e) => {
                                                        const value = e.target.value.replace(/\D/g, '');
                                                        field.onChange(value);
                                                    }}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            {/* Nombres */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <FormField
                                    control={newForm.control}
                                    name="firstName"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Nombres *</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Juan" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={newForm.control}
                                    name="lastName"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Apellidos *</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Pérez" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            {/* Email y Teléfono */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <FormField
                                    control={newForm.control}
                                    name="email"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Correo Electrónico *</FormLabel>
                                            <FormControl>
                                                <Input type="email" placeholder="juan@example.com" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={newForm.control}
                                    name="phone"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Teléfono</FormLabel>
                                            <FormControl>
                                                <Input placeholder="912345678" {...field} maxLength={9} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            {/* Fecha de Nacimiento y Dirección */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <FormField
                                    control={newForm.control}
                                    name="birthdate"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Fecha de Nacimiento</FormLabel>
                                            <Popover>
                                                <PopoverTrigger asChild>
                                                    <FormControl>
                                                        <Button
                                                            variant="outline"
                                                            type="button"
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
                                <FormField
                                    control={newForm.control}
                                    name="address"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Dirección</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Dirección completa" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            {/* Cargo y Fecha de Contratación */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <FormField
                                    control={newForm.control}
                                    name="jobTitle"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Cargo</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Ej: Técnico, Secretario" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={newForm.control}
                                    name="hireDate"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Fecha de Contratación</FormLabel>
                                            <Popover>
                                                <PopoverTrigger asChild>
                                                    <FormControl>
                                                        <Button
                                                            variant="outline"
                                                            type="button"
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
                            </div>

                            {/* Estado */}
                            <FormField
                                control={newForm.control}
                                name="status"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Estado *</FormLabel>
                                        <Select
                                            onValueChange={(value) => field.onChange(value as EmployeeStatus)}
                                            value={field.value}
                                            disabled={isSubmitting}
                                        >
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Seleccione un estado" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value={EmployeeStatus.ACTIVE}>Activo</SelectItem>
                                                <SelectItem value={EmployeeStatus.INACTIVE}>Inactivo</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Checkbox para crear usuario */}
                            <FormField
                                control={newForm.control}
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
                                                Crear cuenta de usuario para este empleado
                                            </FormLabel>
                                            <FormDescription>
                                                Si está marcado, se creará un usuario con acceso al sistema.
                                            </FormDescription>
                                        </div>
                                    </FormItem>
                                )}
                            />

                            {/* Campos de usuario (solo si createUser está marcado) */}
                            {newForm.watch("createUser") && (
                                <div className="space-y-4 p-4 border rounded-md bg-muted/50">
                                    <h4 className="text-sm font-medium">Datos de Usuario</h4>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <FormField
                                            control={newForm.control}
                                            name="passwordHash"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Contraseña *</FormLabel>
                                                    <FormControl>
                                                        <Input type="password" placeholder="Mínimo 8 caracteres" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={newForm.control}
                                            name="confirmPassword"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Confirmar Contraseña *</FormLabel>
                                                    <FormControl>
                                                        <Input type="password" placeholder="Confirme la contraseña" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>

                                    <FormField
                                        control={newForm.control}
                                        name="isActive"
                                        render={({ field }) => (
                                            <FormItem className="flex flex-row items-center space-x-2">
                                                <FormControl>
                                                    <Checkbox
                                                        checked={field.value}
                                                        onCheckedChange={field.onChange}
                                                    />
                                                </FormControl>
                                                <div className="leading-none">
                                                    <FormLabel>Usuario activo</FormLabel>
                                                    <FormDescription>
                                                        Permite al usuario iniciar sesión en el sistema.
                                                    </FormDescription>
                                                </div>
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

EmployeeForm.displayName = "EmployeeForm";
