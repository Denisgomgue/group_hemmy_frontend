"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { ResourceFormModal } from "./resource-form-modal"
import { DeleteConfirmationModal } from "./delete-confirmation-modal"
import { Trash2, Edit, Plus } from "lucide-react"
import { Resource } from "@/types/resource"

interface ResourcesSectionProps {
    resources: Resource[]
    onAdd: (resource: {
        routeCode: string
        name: string
        description?: string
        isActive: boolean
        orderIndex: number
    }) => void
    onUpdate: (
        id: number,
        resource: {
            routeCode: string
            name: string
            description?: string
            isActive: boolean
            orderIndex: number
        }
    ) => void
    onDelete: (id: number) => void
}

export function ResourcesSection({ resources, onAdd, onUpdate, onDelete }: ResourcesSectionProps) {
    const [ formOpen, setFormOpen ] = useState(false)
    const [ deleteOpen, setDeleteOpen ] = useState(false)
    const [ editingResource, setEditingResource ] = useState<Resource | null>(null)
    const [ deletingResource, setDeletingResource ] = useState<Resource | null>(null)

    const handleOpenCreate = () => {
        setEditingResource(null)
        setFormOpen(true)
    }

    const handleOpenEdit = (resource: Resource) => {
        setEditingResource(resource)
        setFormOpen(true)
    }

    const handleFormSubmit = (data: {
        routeCode: string
        name: string
        description?: string
        isActive: boolean
        orderIndex: number
    }) => {
        if (editingResource) {
            onUpdate(editingResource.id, data)
        } else {
            onAdd(data)
        }
    }

    const handleOpenDelete = (resource: Resource) => {
        setDeletingResource(resource)
        setDeleteOpen(true)
    }

    const handleConfirmDelete = () => {
        if (deletingResource) {
            onDelete(deletingResource.id)
            setDeleteOpen(false)
            setDeletingResource(null)
        }
    }

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-foreground">Gestión de Recursos</h2>
                <Button onClick={handleOpenCreate} className="gap-2">
                    <Plus size={16} /> Nuevo Recurso
                </Button>
            </div>

            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Código</TableHead>
                        <TableHead>Nombre</TableHead>
                        <TableHead>Descripción</TableHead>
                        <TableHead>Orden</TableHead>
                        <TableHead>Estado</TableHead>
                        <TableHead className="w-24">Acciones</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {resources.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                                No hay recursos definidos. Crea uno nuevo para empezar.
                            </TableCell>
                        </TableRow>
                    ) : (
                        resources
                            .sort((a, b) => a.orderIndex - b.orderIndex)
                            .map((resource) => (
                                <TableRow key={resource.id}>
                                    <TableCell className="font-mono text-sm">{resource.routeCode}</TableCell>
                                    <TableCell className="font-semibold">{resource.name}</TableCell>
                                    <TableCell className="text-muted-foreground max-w-md truncate">
                                        {resource.description || "-"}
                                    </TableCell>
                                    <TableCell>{resource.orderIndex}</TableCell>
                                    <TableCell>
                                        <Badge variant={resource.isActive ? "default" : "secondary"}>
                                            {resource.isActive ? "Activo" : "Inactivo"}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex gap-2">
                                            <Button variant="ghost" size="sm" onClick={() => handleOpenEdit(resource)}>
                                                <Edit size={16} />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => handleOpenDelete(resource)}
                                                className="text-destructive hover:text-destructive"
                                            >
                                                <Trash2 size={16} />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                    )}
                </TableBody>
            </Table>

            <ResourceFormModal
                open={formOpen}
                onOpenChange={setFormOpen}
                mode={editingResource ? "edit" : "create"}
                initialData={editingResource || undefined}
                onSubmit={handleFormSubmit}
            />

            <DeleteConfirmationModal
                open={deleteOpen}
                onOpenChange={setDeleteOpen}
                title="Eliminar Recurso"
                description="Confirma que deseas eliminar este recurso del sistema"
                itemName={deletingResource?.name || ""}
                onConfirm={handleConfirmDelete}
            />
        </div>
    )
}

