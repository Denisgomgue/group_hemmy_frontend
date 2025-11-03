"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { RoleFormModal } from "./role-form-modal"
import { DeleteConfirmationModal } from "./delete-confirmation-modal"
import { Trash2, Edit, Plus } from "lucide-react"
import { Role } from "@/types/role"

interface RolesSectionProps {
    roles: Role[]
    onAdd: (role: { code: string; name: string; description?: string }) => void
    onUpdate: (id: number, role: { code: string; name: string; description?: string }) => void
    onDelete: (id: number) => void
}

export function RolesSection({ roles, onAdd, onUpdate, onDelete }: RolesSectionProps) {
    const [ formOpen, setFormOpen ] = useState(false)
    const [ deleteOpen, setDeleteOpen ] = useState(false)
    const [ editingRole, setEditingRole ] = useState<Role | null>(null)
    const [ deletingRole, setDeletingRole ] = useState<Role | null>(null)

    // Filtrar roles del sistema (solo mostrar los personalizados)
    const visibleRoles = roles.filter((r) => !r.isSystem)

    const handleOpenCreate = () => {
        setEditingRole(null)
        setFormOpen(true)
    }

    const handleOpenEdit = (role: Role) => {
        setEditingRole(role)
        setFormOpen(true)
    }

    const handleFormSubmit = (data: { code: string; name: string; description?: string }) => {
        if (editingRole) {
            onUpdate(editingRole.id, data)
        } else {
            onAdd(data)
        }
    }

    const handleOpenDelete = (role: Role) => {
        setDeletingRole(role)
        setDeleteOpen(true)
    }

    const handleConfirmDelete = () => {
        if (deletingRole) {
            onDelete(deletingRole.id)
            setDeleteOpen(false)
            setDeletingRole(null)
        }
    }

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-foreground">Gestión de Roles</h2>
                <Button onClick={handleOpenCreate} className="gap-2">
                    <Plus size={16} /> Nuevo Rol
                </Button>
            </div>

            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Código</TableHead>
                        <TableHead>Nombre</TableHead>
                        <TableHead>Descripción</TableHead>
                        <TableHead>Tipo</TableHead>
                        <TableHead className="w-24">Acciones</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {roles.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                                No hay roles definidos. Crea uno nuevo para empezar.
                            </TableCell>
                        </TableRow>
                    ) : (
                        roles.map((role) => (
                            <TableRow key={role.id}>
                                <TableCell className="font-mono text-sm">{role.code}</TableCell>
                                <TableCell className="font-semibold">{role.name}</TableCell>
                                <TableCell className="text-muted-foreground max-w-md truncate">
                                    {role.description || "-"}
                                </TableCell>
                                <TableCell>
                                    <Badge variant={role.isSystem ? "default" : "outline"}>
                                        {role.isSystem ? "Sistema" : "Personalizado"}
                                    </Badge>
                                </TableCell>
                                <TableCell>
                                    <div className="flex gap-2">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => handleOpenEdit(role)}
                                            disabled={role.isSystem}
                                        >
                                            <Edit size={16} />
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => handleOpenDelete(role)}
                                            disabled={role.isSystem}
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

            <RoleFormModal
                open={formOpen}
                onOpenChange={setFormOpen}
                mode={editingRole ? "edit" : "create"}
                initialData={editingRole || undefined}
                onSubmit={handleFormSubmit}
            />

            <DeleteConfirmationModal
                open={deleteOpen}
                onOpenChange={setDeleteOpen}
                title="Eliminar Rol"
                description="Confirma que deseas eliminar este rol del sistema"
                itemName={deletingRole?.name || ""}
                onConfirm={handleConfirmDelete}
            />
        </div>
    )
}

