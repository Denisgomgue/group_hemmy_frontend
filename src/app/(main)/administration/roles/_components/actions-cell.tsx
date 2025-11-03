"use client"

import type React from "react"
import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Trash2, Edit, ShieldCheck } from "lucide-react"
import { RoleForm, RoleFormRef } from "./role-form"
import { useRole } from "@/hooks/use-role"
import Can from "@/components/permission/can"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { toast } from "sonner"
import type { Role } from "@/types/role"
import { RoleAPI } from "@/services/roles-api"
import { AssignPermissionsModal } from "./assign-permissions-modal"

interface ActionsCellProps {
    rowData: Role
}

export const ActionsCell: React.FC<ActionsCellProps> = ({ rowData }) => {
    const [ isEditDialogOpen, setIsEditDialogOpen ] = useState(false)
    const [ showDeleteDialog, setShowDeleteDialog ] = useState(false)
    const [ isPermissionsModalOpen, setIsPermissionsModalOpen ] = useState(false)
    const [ loading, setLoading ] = useState(false)
    const roleFormRef = useRef<RoleFormRef>(null)
    const { refreshRoles } = useRole()

    const isSystemRole = rowData.isSystem
    const canEdit = !isSystemRole
    const canDelete = !isSystemRole

    const handleDelete = async () => {
        setLoading(true)
        try {
            await RoleAPI.delete(rowData.id)
            toast.success("Rol eliminado correctamente")
            setShowDeleteDialog(false)
            await refreshRoles()
        } catch (error: any) {
            const errorMessage =
                error?.response?.data?.message || error?.message || "Error al eliminar el rol"
            toast.error(errorMessage)
            console.error("Error deleting role:", error)
        } finally {
            setLoading(false)
        }
    }

    const handleUpdateRole = async (result: any) => {
        try {
            await RoleAPI.update(rowData.id, result)
            toast.success("Rol actualizado correctamente")
            setIsEditDialogOpen(false)
            await refreshRoles()
        } catch (error: any) {
            const errorMessage =
                error?.response?.data?.message || error?.message || "Error al actualizar el rol"
            toast.error(errorMessage)
            console.error("Error updating role:", error)
        }
    }

    return (
        <>
            <div className="flex items-center gap-2">
                <Can action="update" subject="Role">
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => setIsPermissionsModalOpen(true)}
                            >
                                <ShieldCheck className="h-4 w-4" />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>Gestionar Permisos</p>
                        </TooltipContent>
                    </Tooltip>
                </Can>

                <Can action="update" subject="Role">
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => setIsEditDialogOpen(true)}
                                disabled={!canEdit}
                            >
                                <Edit className="h-4 w-4" />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>{canEdit ? "Editar" : "No se puede editar rol del sistema"}</p>
                        </TooltipContent>
                    </Tooltip>
                </Can>

                <Can action="delete" subject="Role">
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => setShowDeleteDialog(true)}
                                disabled={!canDelete}
                            >
                                <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>{canDelete ? "Eliminar" : "No se puede eliminar rol del sistema"}</p>
                        </TooltipContent>
                    </Tooltip>
                </Can>
            </div>

            {/* Dialog para editar */}
            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                <DialogContent className="sm:max-w-[600px]">
                    <DialogHeader>
                        <DialogTitle>Editar Rol</DialogTitle>
                    </DialogHeader>
                    <RoleForm
                        ref={roleFormRef}
                        role={rowData}
                        onSubmit={handleUpdateRole}
                        onCancel={() => setIsEditDialogOpen(false)}
                    />
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setIsEditDialogOpen(false)}
                        >
                            Cancelar
                        </Button>
                        <Button
                            variant="default"
                            onClick={() => {
                                roleFormRef.current?.submit()
                            }}
                            disabled={roleFormRef.current?.isSubmitting || !canEdit}
                        >
                            {roleFormRef.current?.isSubmitting ? "Guardando..." : "Guardar"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Dialog para eliminar */}
            <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Esta acción no se puede deshacer. Esto eliminará permanentemente el
                            rol <strong>{rowData.name}</strong> ({rowData.code}).
                            {isSystemRole && (
                                <span className="block mt-2 text-destructive font-semibold">
                                    ⚠️ Este es un rol del sistema y no debería ser eliminado.
                                </span>
                            )}
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={loading}>Cancelar</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleDelete}
                            disabled={loading || !canDelete}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                            {loading ? "Eliminando..." : "Eliminar"}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            {/* Modal para gestionar permisos */}
            <AssignPermissionsModal
                role={rowData}
                isOpen={isPermissionsModalOpen}
                onClose={() => setIsPermissionsModalOpen(false)}
                onSuccess={async () => {
                    await refreshRoles()
                }}
            />
        </>
    )
}

