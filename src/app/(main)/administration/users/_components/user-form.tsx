"use client"

import { useState, useEffect } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon } from "lucide-react"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { cn } from "@/lib/utils"
import { createUserFormSchema, CreateUserFormData } from "@/schemas/user-schema"
import { DocumentType } from "@/schemas/person-schema"
import api from "@/lib/axios"
import { PersonAPI } from "@/services/person-api"
import { ActorAPI } from "@/services/actor-api"
import { UsersAPI } from "@/services/users-api"

interface UserFormProps {
    onSubmit?: (values: CreateUserFormData) => void
    onCancel: () => void
}

export function UserForm({ onSubmit, onCancel }: UserFormProps) {
    const [ isSubmitting, setIsSubmitting ] = useState(false)

    const form = useForm<CreateUserFormData>({
        resolver: zodResolver(createUserFormSchema),
        defaultValues: {
            documentType: DocumentType.DNI,
            documentNumber: "",
            firstName: "",
            lastName: "",
            birthdate: undefined,
            email: "",
            phone: "",
            address: "",
            passwordHash: "",
            confirmPassword: "",
            isActive: true,
        },
    })

    const handleSubmit = async (values: CreateUserFormData) => {
        setIsSubmitting(true)
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
            }

            const person = await PersonAPI.create(personData)

            // 2. Crear Actor vinculado a la Persona
            const displayName = `${values.firstName} ${values.lastName}`.trim()
            const actor = await ActorAPI.create({
                kind: 'PERSON',
                displayName,
                personId: person.id,
            })

            // 3. Crear Usuario vinculado al Actor
            // Nota: El backend espera passwordHash. Idealmente el backend debería recibir 'password'
            // y hashearlo con bcrypt. Por ahora, usamos SHA-256 como hash temporal.
            // TODO: Modificar el backend para que reciba 'password' y lo hashee con bcrypt
            const encoder = new TextEncoder()
            const data = encoder.encode(values.passwordHash)
            const hashBuffer = await crypto.subtle.digest('SHA-256', data)
            const hashArray = Array.from(new Uint8Array(hashBuffer))
            const passwordHash = hashArray.map(b => b.toString(16).padStart(2, '0')).join('')

            await UsersAPI.create({
                actorId: actor.id,
                passwordHash,
                isActive: values.isActive ?? true,
            })

            // Si hay onSubmit personalizado, llamarlo
            if (onSubmit) {
                onSubmit(values)
            }

            // Éxito - el toast se mostrará desde el componente padre
            form.reset()
            onCancel()
        } catch (error: any) {
            console.error("Error creating user:", error)
            // Si hay onSubmit, también lanzar el error para que lo maneje
            if (onSubmit) {
                throw error
            }
            // Si no hay onSubmit, mostrar error directamente
            throw error
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
                {/* Información de Documento */}
                <div className="grid grid-cols-2 gap-4">
                    <FormField
                        control={form.control}
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
                        control={form.control}
                        name="documentNumber"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Número de Documento</FormLabel>
                                <FormControl>
                                    <Input placeholder="12345678" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                {/* Nombres */}
                <div className="grid grid-cols-2 gap-4">
                    <FormField
                        control={form.control}
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
                        control={form.control}
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
                <div className="grid grid-cols-2 gap-4">
                    <FormField
                        control={form.control}
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
                        control={form.control}
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
                <div className="grid grid-cols-2 gap-4">
                    <FormField
                        control={form.control}
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
                                                    format(new Date(field.value), "PPP", { locale: es })
                                                ) : (
                                                    <span>Seleccione una fecha</span>
                                                )}
                                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                            </Button>
                                        </FormControl>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0" align="start">
                                        <Calendar
                                            mode="single"
                                            selected={field.value ? new Date(field.value) : undefined}
                                            onSelect={(date) => field.onChange(date ? format(date, "yyyy-MM-dd") : undefined)}
                                            disabled={(date) =>
                                                date > new Date() || date < new Date("1900-01-01")
                                            }
                                            initialFocus
                                            locale={es}
                                        />
                                    </PopoverContent>
                                </Popover>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
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

                {/* Contraseñas */}
                <div className="grid grid-cols-2 gap-4">
                    <FormField
                        control={form.control}
                        name="passwordHash"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Contraseña</FormLabel>
                                <FormControl>
                                    <Input type="password" placeholder="Mínimo 8 caracteres" {...field} />
                                </FormControl>
                                <FormDescription>
                                    La contraseña debe tener al menos 8 caracteres
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
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

                {/* Estado */}
                <FormField
                    control={form.control}
                    name="isActive"
                    render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5">
                                <FormLabel className="text-base">Estado del Usuario</FormLabel>
                                <FormDescription>
                                    Si está activo, el usuario podrá acceder al sistema
                                </FormDescription>
                            </div>
                            <FormControl>
                                <div className="flex items-center space-x-2">
                                    <input
                                        type="checkbox"
                                        checked={field.value}
                                        onChange={field.onChange}
                                        className="h-4 w-4 rounded border-gray-300"
                                    />
                                </div>
                            </FormControl>
                        </FormItem>
                    )}
                />

                <div className="flex justify-end gap-4 pt-4">
                    <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
                        Cancelar
                    </Button>
                    <Button type="submit" disabled={isSubmitting}>
                        {isSubmitting ? "Creando..." : "Crear Usuario"}
                    </Button>
                </div>
            </form>
        </Form>
    )
}
