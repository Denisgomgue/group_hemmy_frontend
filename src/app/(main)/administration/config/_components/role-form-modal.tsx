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
import { Role } from "@/types/role"

interface RoleFormModalProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    mode: "create" | "edit"
    initialData?: Role
    onSubmit: (data: { code: string; name: string; description?: string }) => void
}

export function RoleFormModal({ open, onOpenChange, mode, initialData, onSubmit }: RoleFormModalProps) {
    const [ formData, setFormData ] = useState({ code: "", name: "", description: "" })
    const [ errors, setErrors ] = useState<Record<string, string>>({})

    useEffect(() => {
        if (initialData && mode === "edit") {
            setFormData({
                code: initialData.code,
                name: initialData.name,
                description: initialData.description || "",
            })
        } else {
            setFormData({ code: "", name: "", description: "" })
        }
        setErrors({})
    }, [ open, initialData, mode ])

    const validateForm = () => {
        const newErrors: Record<string, string> = {}
        if (!formData.code.trim()) {
            newErrors.code = "El código del rol es requerido"
        } else if (!/^[A-Z0-9_]+$/.test(formData.code)) {
            newErrors.code = "Solo letras mayúsculas, números y guiones bajos"
        }
        if (!formData.name.trim()) {
            newErrors.name = "El nombre del rol es requerido"
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

    const isSystemRole = initialData?.isSystem
    const canEdit = !isSystemRole

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>{mode === "create" ? "Crear Nuevo Rol" : "Editar Rol"}</DialogTitle>
                    <DialogDescription>
                        {mode === "create" ? "Crea un nuevo rol en el sistema" : "Actualiza los detalles del rol"}
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-4">
                    <div className="space-y-2">
                        <Label htmlFor="role-code">Código *</Label>
                        <Input
                            id="role-code"
                            value={formData.code}
                            onChange={(e) => {
                                setFormData({ ...formData, code: e.target.value.toUpperCase() })
                                if (errors.code) setErrors({ ...errors, code: "" })
                            }}
                            placeholder="ej: EDITOR, ADMINISTRADOR"
                            className={errors.code ? "border-destructive" : ""}
                            disabled={mode === "edit" || isSystemRole}
                        />
                        {errors.code && <p className="text-sm text-destructive">{errors.code}</p>}
                        <p className="text-xs text-muted-foreground">
                            Solo letras mayúsculas, números y guiones bajos. No se puede cambiar después de crear.
                        </p>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="role-name">Nombre *</Label>
                        <Input
                            id="role-name"
                            value={formData.name}
                            onChange={(e) => {
                                setFormData({ ...formData, name: e.target.value })
                                if (errors.name) setErrors({ ...errors, name: "" })
                            }}
                            placeholder="ej: Editor, Administrador"
                            className={errors.name ? "border-destructive" : ""}
                            disabled={isSystemRole}
                        />
                        {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="role-description">Descripción</Label>
                        <Textarea
                            id="role-description"
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            placeholder="Descripción opcional del rol..."
                            rows={3}
                            disabled={isSystemRole}
                        />
                    </div>

                    {isSystemRole && (
                        <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-md text-sm text-destructive">
                            ⚠️ Este es un rol del sistema y no puede ser modificado.
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

