"use client"

import { useState, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { PermissionFormModal } from "./permission-form-modal"
import { DeleteConfirmationModal } from "./delete-confirmation-modal"
import { Trash2, Edit, Plus, ChevronDown, ChevronUp } from "lucide-react"
import { Permission } from "@/types/permission"

interface PermissionsSectionProps {
    permissions: Permission[]
    onAdd: (permission: { code: string; name: string; description?: string; resourceId?: number }) => void
    onUpdate: (
        id: number,
        permission: { code: string; name: string; description?: string; resourceId?: number }
    ) => void
    onDelete: (id: number) => void
}

export function PermissionsSection({
    permissions,
    onAdd,
    onUpdate,
    onDelete,
}: PermissionsSectionProps) {
    const [ formOpen, setFormOpen ] = useState(false)
    const [ deleteOpen, setDeleteOpen ] = useState(false)
    const [ editingPermission, setEditingPermission ] = useState<Permission | null>(null)
    const [ deletingPermission, setDeletingPermission ] = useState<Permission | null>(null)

    // Filtrar el permiso wildcard del sistema
    const visiblePermissions = permissions.filter((p) => p.code !== "*")

    // Agrupar permisos por recurso
    const groupedPermissions = useMemo(() => {
        return visiblePermissions.reduce(
            (acc, perm) => {
                const resourceName = perm.resource?.name || "Sin Recurso"
                if (!acc[ resourceName ]) acc[ resourceName ] = []
                acc[ resourceName ].push(perm)
                return acc
            },
            {} as Record<string, Permission[]>
        )
    }, [ visiblePermissions ])

    // Estado para controlar qué recursos están expandidos (todos colapsados por defecto)
    const [ expandedResources, setExpandedResources ] = useState<Set<string>>(new Set())

    const toggleExpanded = (resourceName: string) => {
        const newExpanded = new Set(expandedResources)
        if (newExpanded.has(resourceName)) {
            newExpanded.delete(resourceName)
        } else {
            newExpanded.add(resourceName)
        }
        setExpandedResources(newExpanded)
    }

    const handleOpenCreate = () => {
        setEditingPermission(null)
        setFormOpen(true)
    }

    const handleOpenEdit = (permission: Permission) => {
        setEditingPermission(permission)
        setFormOpen(true)
    }

    const handleFormSubmit = (data: { code: string; name: string; description?: string; resourceId?: number }) => {
        if (editingPermission) {
            onUpdate(editingPermission.id, data)
        } else {
            onAdd(data)
        }
    }

    const handleOpenDelete = (permission: Permission) => {
        setDeletingPermission(permission)
        setDeleteOpen(true)
    }

    const handleConfirmDelete = () => {
        if (deletingPermission) {
            onDelete(deletingPermission.id)
            setDeleteOpen(false)
            setDeletingPermission(null)
        }
    }

    // Ordenar recursos por nombre
    const sortedResourceNames = Object.keys(groupedPermissions).sort()

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-foreground">Gestión de Permisos</h2>
                <Button onClick={handleOpenCreate} className="gap-2">
                    <Plus size={16} /> Nuevo Permiso
                </Button>
            </div>

            {sortedResourceNames.length === 0 ? (
                <Card className="p-8 text-center">
                    <p className="text-muted-foreground">
                        No hay permisos definidos. Crea uno nuevo para empezar.
                    </p>
                </Card>
            ) : (
                <div className="grid grid-cols-1 gap-4">
                    {sortedResourceNames.map((resourceName) => {
                        const resourcePermissions = groupedPermissions[ resourceName ]
                        const isExpanded = expandedResources.has(resourceName)

                        return (
                            <Card key={resourceName} className="overflow-hidden border">
                                <button
                                    onClick={() => toggleExpanded(resourceName)}
                                    className="w-full p-4 flex items-center justify-between hover:bg-muted/50 transition-colors text-left"
                                >
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-3">
                                            <div>
                                                <h3 className="font-semibold text-foreground text-lg">{resourceName}</h3>
                                                <p className="text-sm text-muted-foreground">
                                                    {resourcePermissions.length} permiso{resourcePermissions.length !== 1 ? "s" : ""}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4 ml-4">
                                        <Badge variant="outline" className="text-sm">
                                            {resourcePermissions.length}
                                        </Badge>
                                        {isExpanded ? (
                                            <ChevronUp size={20} className="text-muted-foreground" />
                                        ) : (
                                            <ChevronDown size={20} className="text-muted-foreground" />
                                        )}
                                    </div>
                                </button>

                                {isExpanded && (
                                    <div className="border-t border-border p-4 bg-muted/30">
                                        <div className="space-y-2">
                                            {resourcePermissions.map((permission) => (
                                                <div
                                                    key={permission.id}
                                                    className="flex items-start justify-between p-3 rounded-lg bg-background border border-border hover:border-primary/50 transition-colors group"
                                                >
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-center gap-2 mb-1">
                                                            <span className="font-mono text-sm font-medium text-foreground">
                                                                {permission.code}
                                                            </span>
                                                            {permission.resource && (
                                                                <Badge variant="outline" className="text-xs">
                                                                    {permission.resource.name}
                                                                </Badge>
                                                            )}
                                                        </div>
                                                        <h4 className="font-semibold text-foreground mb-1">{permission.name}</h4>
                                                        {permission.description && (
                                                            <p className="text-sm text-muted-foreground">{permission.description}</p>
                                                        )}
                                                    </div>
                                                    <div className="flex items-center gap-2 ml-4">
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => handleOpenEdit(permission)}
                                                            className="opacity-0 group-hover:opacity-100 transition-opacity"
                                                        >
                                                            <Edit size={16} />
                                                        </Button>
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => handleOpenDelete(permission)}
                                                            className="text-destructive hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                                                        >
                                                            <Trash2 size={16} />
                                                        </Button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </Card>
                        )
                    })}
                </div>
            )}

            <PermissionFormModal
                open={formOpen}
                onOpenChange={setFormOpen}
                mode={editingPermission ? "edit" : "create"}
                initialData={editingPermission || undefined}
                onSubmit={handleFormSubmit}
            />

            <DeleteConfirmationModal
                open={deleteOpen}
                onOpenChange={setDeleteOpen}
                title="Eliminar Permiso"
                description="Confirma que deseas eliminar este permiso del sistema"
                itemName={deletingPermission?.name || ""}
                onConfirm={handleConfirmDelete}
            />
        </div>
    )
}
