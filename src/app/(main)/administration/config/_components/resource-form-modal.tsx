"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Resource } from "@/types/resource"

interface ResourceFormModalProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    mode: "create" | "edit"
    initialData?: Resource
    onSubmit: (data: { routeCode: string; name: string; description?: string; isActive: boolean; orderIndex: number }) => void
}

export function ResourceFormModal({ open, onOpenChange, mode, initialData, onSubmit }: ResourceFormModalProps) {
    const [ formData, setFormData ] = useState({
        routeCode: "",
        name: "",
        description: "",
        isActive: true,
        orderIndex: 0,
    })
    const [ errors, setErrors ] = useState<Record<string, string>>({})

    useEffect(() => {
        if (initialData && mode === "edit") {
            setFormData({
                routeCode: initialData.routeCode,
                name: initialData.name,
                description: initialData.description || "",
                isActive: initialData.isActive,
                orderIndex: initialData.orderIndex,
            })
        } else {
            setFormData({
                routeCode: "",
                name: "",
                description: "",
                isActive: true,
                orderIndex: 0,
            })
        }
        setErrors({})
    }, [ open, initialData, mode ])

    const validateForm = () => {
        const newErrors: Record<string, string> = {}
        if (!formData.routeCode.trim()) {
            newErrors.routeCode = "El código de ruta es requerido"
        } else if (!/^[a-z0-9_]+$/.test(formData.routeCode)) {
            newErrors.routeCode = "Solo letras minúsculas, números y guiones bajos"
        }
        if (!formData.name.trim()) {
            newErrors.name = "El nombre del recurso es requerido"
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

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>{mode === "create" ? "Crear Nuevo Recurso" : "Editar Recurso"}</DialogTitle>
                    <DialogDescription>
                        {mode === "create" ? "Crea un nuevo recurso en el sistema" : "Actualiza los detalles del recurso"}
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-4">
                    <div className="space-y-2">
                        <Label htmlFor="resource-routeCode">Código de Ruta *</Label>
                        <Input
                            id="resource-routeCode"
                            value={formData.routeCode}
                            onChange={(e) => {
                                setFormData({ ...formData, routeCode: e.target.value.toLowerCase() })
                                if (errors.routeCode) setErrors({ ...errors, routeCode: "" })
                            }}
                            placeholder="ej: users, equipment"
                            className={errors.routeCode ? "border-destructive" : ""}
                            disabled={mode === "edit"}
                        />
                        {errors.routeCode && <p className="text-sm text-destructive">{errors.routeCode}</p>}
                        <p className="text-xs text-muted-foreground">Solo letras minúsculas, números y guiones bajos</p>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="resource-name">Nombre del Recurso *</Label>
                        <Input
                            id="resource-name"
                            value={formData.name}
                            onChange={(e) => {
                                setFormData({ ...formData, name: e.target.value })
                                if (errors.name) setErrors({ ...errors, name: "" })
                            }}
                            placeholder="ej: Usuarios, Equipos"
                            className={errors.name ? "border-destructive" : ""}
                        />
                        {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="resource-description">Descripción</Label>
                        <Textarea
                            id="resource-description"
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            placeholder="Descripción opcional del recurso..."
                            rows={3}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="resource-orderIndex">Orden</Label>
                            <Input
                                id="resource-orderIndex"
                                type="number"
                                min="0"
                                value={formData.orderIndex}
                                onChange={(e) => setFormData({ ...formData, orderIndex: parseInt(e.target.value) || 0 })}
                            />
                        </div>

                        <div className="flex items-center space-x-2 pt-8">
                            <Checkbox
                                id="resource-isActive"
                                checked={formData.isActive}
                                onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked === true })}
                            />
                            <Label htmlFor="resource-isActive" className="cursor-pointer">
                                Activo
                            </Label>
                        </div>
                    </div>
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)}>
                        Cancelar
                    </Button>
                    <Button onClick={handleSubmit}>{mode === "create" ? "Crear" : "Actualizar"}</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

