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
import { resourceSchema, ResourceFormData } from "@/schemas/resource-schema"
import { Resource } from "@/types/resource"
import { Checkbox } from "@/components/ui/checkbox"

interface ResourceFormProps {
    resource?: Resource | null
    onSubmit: (data: ResourceFormData) => void
    onCancel: () => void
}

export interface ResourceFormRef {
    submit: () => void
    isSubmitting: boolean
}

export const ResourceForm = forwardRef<ResourceFormRef, ResourceFormProps>(
    ({ resource, onSubmit, onCancel }, ref) => {
        const form = useForm<ResourceFormData>({
            resolver: zodResolver(resourceSchema),
            defaultValues: {
                routeCode: resource?.routeCode || "",
                name: resource?.name || "",
                description: resource?.description || "",
                isActive: resource?.isActive ?? true,
                orderIndex: resource?.orderIndex || 0,
            },
        })

        useEffect(() => {
            if (resource) {
                form.reset({
                    routeCode: resource.routeCode,
                    name: resource.name,
                    description: resource.description || "",
                    isActive: resource.isActive,
                    orderIndex: resource.orderIndex,
                })
            } else {
                form.reset({
                    routeCode: "",
                    name: "",
                    description: "",
                    isActive: true,
                    orderIndex: 0,
                })
            }
        }, [ resource, form ])

        useImperativeHandle(ref, () => ({
            submit: () => {
                form.handleSubmit(handleSubmit)()
            },
            isSubmitting: form.formState.isSubmitting,
        }))

        const handleSubmit = async (values: ResourceFormData) => {
            onSubmit(values)
        }

        return (
            <Form {...form}>
                <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
                    <FormField
                        control={form.control}
                        name="routeCode"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Código de Ruta *</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="ej: users, equipment, clients"
                                        {...field}
                                        disabled={!!resource}
                                    />
                                </FormControl>
                                <FormDescription>
                                    Solo letras minúsculas, números y guiones bajos. No se puede cambiar después de crear.
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
                                <FormLabel>Nombre del Módulo *</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="ej: Usuarios, Equipos, Clientes"
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
                                        placeholder="Descripción opcional del recurso..."
                                        rows={4}
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <div className="grid grid-cols-2 gap-4">
                        <FormField
                            control={form.control}
                            name="orderIndex"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Orden</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="number"
                                            min="0"
                                            {...field}
                                            onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="isActive"
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
                                            Activo
                                        </FormLabel>
                                        <FormDescription>
                                            El recurso estará disponible en el sistema
                                        </FormDescription>
                                    </div>
                                </FormItem>
                            )}
                        />
                    </div>
                </form>
            </Form>
        )
    }
)

ResourceForm.displayName = "ResourceForm"
