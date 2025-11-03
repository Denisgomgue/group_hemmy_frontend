"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { ResourceSearchSelect } from "@/components/search-select/resource-search-select"
import { Permission } from "@/types/permission"

interface PermissionFormModalProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    mode: "create" | "edit"
    initialData?: Permission
    onSubmit: (data: { code: string; name: string; description?: string; resourceId?: number }) => void
}

export function PermissionFormModal({
    open,
    onOpenChange,
    mode,
    initialData,
    onSubmit,
}: PermissionFormModalProps) {
    const [ formData, setFormData ] = useState({
        code: "",
        name: "",
        description: "",
        resourceId: undefined as number | undefined,
    })
    const [ errors, setErrors ] = useState<Record<string, string>>({})

    useEffect(() => {
        if (initialData && mode === "edit") {
            setFormData({
                code: initialData.code,
                name: initialData.name,
                description: initialData.description || "",
                resourceId: initialData.resourceId || undefined,
            })
        } else {
            setFormData({
                code: "",
                name: "",
                description: "",
                resourceId: undefined,
            })
        }
        setErrors({})
    }, [ open, initialData, mode ])

    const validateForm = () => {
        const newErrors: Record<string, string> = {}
        if (!formData.code.trim()) {
            newErrors.code = "El código del permiso es requerido"
        } else if (!/^[a-z0-9_:]+$/.test(formData.code)) {
            newErrors.code = "Solo letras minúsculas, números, guiones bajos y dos puntos"
        }
        if (!formData.name.trim()) {
            newErrors.name = "El nombre del permiso es requerido"
        }
        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSubmit = () => {
        if (validateForm()) {
            onSubmit(formData)
            onOpenChange(false)
        }
    }

    const isSuperAdminPermission = initialData?.code === "*"
    const canEdit = !isSuperAdminPermission

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>{mode === "create" ? "Crear Nuevo Permiso" : "Editar Permiso"}</DialogTitle>
                    <DialogDescription>
                        {mode === "create" ? "Crea un nuevo permiso en el sistema" : "Actualiza los detalles del permiso"}
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-4">
                    <div className="space-y-2">
                        <Label htmlFor="perm-code">Código *</Label>
                        <Input
                            id="perm-code"
                            value={formData.code}
                            onChange={(e) => {
                                setFormData({ ...formData, code: e.target.value.toLowerCase() })
                                if (errors.code) setErrors({ ...errors, code: "" })
                            }}
                            placeholder="ej: users:read, equipment:create"
                            className={errors.code ? "border-destructive" : ""}
                            disabled={mode === "edit" || isSuperAdminPermission}
                        />
                        {errors.code && <p className="text-sm text-destructive">{errors.code}</p>}
                        <p className="text-xs text-muted-foreground">
                            Solo letras minúsculas, números, guiones bajos y dos puntos. No se puede cambiar después de crear.
                        </p>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="perm-name">Nombre *</Label>
                        <Input
                            id="perm-name"
                            value={formData.name}
                            onChange={(e) => {
                                setFormData({ ...formData, name: e.target.value })
                                if (errors.name) setErrors({ ...errors, name: "" })
                            }}
                            placeholder="ej: Ver Usuarios, Crear Equipos"
                            className={errors.name ? "border-destructive" : ""}
                            disabled={isSuperAdminPermission}
                        />
                        {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="perm-description">Descripción</Label>
                        <Textarea
                            id="perm-description"
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            placeholder="Descripción opcional del permiso..."
                            rows={3}
                            disabled={isSuperAdminPermission}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label>Recurso</Label>
                        <ResourceSearchSelect
                            value={formData.resourceId}
                            onChange={(value) => setFormData({ ...formData, resourceId: value })}
                            placeholder="Seleccionar recurso..."
                            disabled={isSuperAdminPermission}
                        />
                        <p className="text-xs text-muted-foreground">Asigna este permiso a un recurso específico</p>
                    </div>

                    {isSuperAdminPermission && (
                        <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-md text-sm text-destructive">
                            ⚠️ Este es el permiso Super Administrador y es inmutable por seguridad del sistema.
                        </div>
                    )}
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)}>
                        Cancelar
                    </Button>
                    <Button onClick={handleSubmit} disabled={!canEdit && mode === "edit"}>
                        {mode === "create" ? "Crear" : "Actualizar"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

