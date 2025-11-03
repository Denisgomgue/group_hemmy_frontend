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
import { roleSchema, RoleFormData } from "@/schemas/role-schema"
import { Role } from "@/types/role"

interface RoleFormProps {
    role?: Role | null
    onSubmit: (data: RoleFormData) => void
    onCancel: () => void
}

export interface RoleFormRef {
    submit: () => void
    isSubmitting: boolean
}

export const RoleForm = forwardRef<RoleFormRef, RoleFormProps>(
    ({ role, onSubmit, onCancel }, ref) => {
        const form = useForm<RoleFormData>({
            resolver: zodResolver(roleSchema),
            defaultValues: {
                code: role?.code || "",
                name: role?.name || "",
                description: role?.description || "",
                isSystem: role?.isSystem || false,
            },
        })

        useEffect(() => {
            if (role) {
                form.reset({
                    code: role.code,
                    name: role.name,
                    description: role.description || "",
                    isSystem: role.isSystem,
                })
            } else {
                form.reset({
                    code: "",
                    name: "",
                    description: "",
                    isSystem: false,
                })
            }
        }, [ role, form ])

        useImperativeHandle(ref, () => ({
            submit: () => {
                form.handleSubmit(handleSubmit)()
            },
            isSubmitting: form.formState.isSubmitting,
        }))

        const handleSubmit = async (values: RoleFormData) => {
            // No permitir crear o editar con isSystem = true
            const submitData = {
                ...values,
                isSystem: false, // Siempre forzar a false en el frontend
            }
            onSubmit(submitData)
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
                                        placeholder="ej: ADMIN, MANAGER, OPERATOR"
                                        {...field}
                                        disabled={!!role?.isSystem || (!!role && role.code === 'SUPERADMIN')}
                                    />
                                </FormControl>
                                <FormDescription>
                                    Solo letras mayúsculas, números y guiones bajos. {role?.isSystem ? 'No se puede cambiar en roles del sistema.' : 'No se puede cambiar después de crear.'}
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
                                        placeholder="ej: Administrador, Gerente, Operador"
                                        {...field}
                                        disabled={!!role?.isSystem || (!!role && role.code === 'SUPERADMIN')}
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
                                        placeholder="Descripción opcional del rol..."
                                        rows={4}
                                        {...field}
                                        disabled={!!role?.isSystem || (!!role && role.code === 'SUPERADMIN')}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {role?.isSystem && (
                        <div className="p-3 bg-muted rounded-md text-sm text-muted-foreground">
                            Este es un rol del sistema y no puede ser modificado. Los roles del sistema son esenciales para el funcionamiento de la aplicación.
                        </div>
                    )}

                    {role?.code === 'SUPERADMIN' && (
                        <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-md text-sm text-destructive">
                            ⚠️ Este es el rol Super Administrador y es inmutable por seguridad del sistema.
                        </div>
                    )}
                </form>
            </Form>
        )
    }
)

RoleForm.displayName = "RoleForm"

