"use client"

import { useEffect, forwardRef, useImperativeHandle } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
    FormDescription,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { permissionSchema, PermissionFormData } from "@/schemas/permission-schema"
import { Permission } from "@/types/permission"
import { ResourceSearchSelect } from "@/components/search-select/resource-search-select"

interface PermissionFormProps {
    permission?: Permission | null
    onSubmit: (data: PermissionFormData) => void
    onCancel: () => void
}

export interface PermissionFormRef {
    submit: () => void
    isSubmitting: boolean
}

export const PermissionForm = forwardRef<PermissionFormRef, PermissionFormProps>(
    ({ permission, onSubmit, onCancel }, ref) => {
        const isSuperAdminPermission = permission?.code === '*'

        const form = useForm<PermissionFormData>({
            resolver: zodResolver(permissionSchema),
            defaultValues: {
                code: permission?.code || "",
                name: permission?.name || "",
                description: permission?.description || "",
                resourceId: permission?.resourceId || undefined,
            },
        })

        useEffect(() => {
            if (permission) {
                form.reset({
                    code: permission.code,
                    name: permission.name,
                    description: permission.description || "",
                    resourceId: permission.resourceId || undefined,
                })
            } else {
                form.reset({
                    code: "",
                    name: "",
                    description: "",
                    resourceId: undefined,
                })
            }
        }, [ permission, form ])

        useImperativeHandle(ref, () => ({
            submit: () => {
                form.handleSubmit(handleSubmit)()
            },
            isSubmitting: form.formState.isSubmitting,
        }))

        const handleSubmit = async (values: PermissionFormData) => {
            onSubmit(values)
        }

        return (
            <Form {...form}>
                <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
                    <FormField
                        control={form.control}
                        name="code"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Código *</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="ej: users_read, equipment_create"
                                        {...field}
                                        disabled={!!permission || isSuperAdminPermission}
                                    />
                                </FormControl>
                                <FormDescription>
                                    Solo letras minúsculas, números y guiones bajos. {isSuperAdminPermission ? 'Este permiso es del sistema y no puede modificarse.' : 'No se puede cambiar después de crear.'}
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Nombre *</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="ej: Leer Usuarios, Crear Equipos"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Descripción</FormLabel>
                                <FormControl>
                                    <Textarea
                                        placeholder="Descripción opcional del permiso..."
                                        rows={4}
                                        {...field}
                                        disabled={isSuperAdminPermission}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="resourceId"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Recurso</FormLabel>
                                <FormControl>
                                    <ResourceSearchSelect
                                        value={field.value || undefined}
                                        onChange={(value) => field.onChange(value || undefined)}
                                        placeholder="Seleccionar recurso..."
                                        disabled={isSuperAdminPermission}
                                    />
                                </FormControl>
                                <FormDescription>
                                    Asigna este permiso a un recurso específico (ej: "Usuarios", "Equipos").
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {isSuperAdminPermission && (
                        <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-md text-sm text-destructive">
                            ⚠️ Este es el permiso Super Administrador y es inmutable por seguridad del sistema.
                        </div>
                    )}
                </form>
            </Form>
        )
    }
)

PermissionForm.displayName = "PermissionForm"

