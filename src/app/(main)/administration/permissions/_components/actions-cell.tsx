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
import { Trash2, Edit, UserCog } from "lucide-react"
import { PermissionForm, PermissionFormRef } from "./permission-form"
import { usePermission } from "@/hooks/use-permission"
import Can from "@/components/permission/can"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { toast } from "sonner"
import type { Permission } from "@/types/permission"
import { PermissionAPI } from "@/services/permissions-api"
import { AssignRolesModal } from "./assign-roles-modal"

interface ActionsCellProps {
    rowData: Permission
}

export const ActionsCell: React.FC<ActionsCellProps> = ({ rowData }) => {
    const [ isEditDialogOpen, setIsEditDialogOpen ] = useState(false)
    const [ showDeleteDialog, setShowDeleteDialog ] = useState(false)
    const [ isRolesModalOpen, setIsRolesModalOpen ] = useState(false)
    const [ loading, setLoading ] = useState(false)
    const permissionFormRef = useRef<PermissionFormRef>(null)
    const { refreshPermissions } = usePermission()

    const isSuperAdminPermission = rowData.code === '*'
    const canEdit = !isSuperAdminPermission
    const canDelete = !isSuperAdminPermission

    const handleDelete = async () => {
        setLoading(true)
        try {
            await PermissionAPI.delete(rowData.id)
            toast.success("Permiso eliminado correctamente")
            setShowDeleteDialog(false)
            await refreshPermissions()
        } catch (error: any) {
            const errorMessage =
                error?.response?.data?.message || error?.message || "Error al eliminar el permiso"
            toast.error(errorMessage)
            console.error("Error deleting permission:", error)
        } finally {
            setLoading(false)
        }
    }

    const handleUpdatePermission = async (result: any) => {
        try {
            await PermissionAPI.update(rowData.id, result)
            toast.success("Permiso actualizado correctamente")
            setIsEditDialogOpen(false)
            await refreshPermissions()
        } catch (error: any) {
            const errorMessage =
                error?.response?.data?.message || error?.message || "Error al actualizar el permiso"
            toast.error(errorMessage)
            console.error("Error updating permission:", error)
        }
    }

    return (
        <>
            <div className="flex items-center gap-2">
                <Can action="update" subject="Permission">
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => setIsRolesModalOpen(true)}
                            >
                                <UserCog className="h-4 w-4" />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>Gestionar Roles</p>
                        </TooltipContent>
                    </Tooltip>
                </Can>

                <Can action="update" subject="Permission">
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
                            <p>{canEdit ? "Editar" : "No se puede editar permiso del sistema"}</p>
                        </TooltipContent>
                    </Tooltip>
                </Can>

                <Can action="delete" subject="Permission">
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
                            <p>{canDelete ? "Eliminar" : "No se puede eliminar permiso del sistema"}</p>
                        </TooltipContent>
                    </Tooltip>
                </Can>
            </div>

            {/* Dialog para editar */}
            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                <DialogContent className="sm:max-w-[600px]">
                    <DialogHeader>
                        <DialogTitle>Editar Permiso</DialogTitle>
                    </DialogHeader>
                    <PermissionForm
                        ref={permissionFormRef}
                        permission={rowData}
                        onSubmit={handleUpdatePermission}
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
                                permissionFormRef.current?.submit()
                            }}
                            disabled={permissionFormRef.current?.isSubmitting || !canEdit}
                        >
                            {permissionFormRef.current?.isSubmitting ? "Guardando..." : "Guardar"}
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
                            permiso <strong>{rowData.name}</strong> ({rowData.code}).
                            {isSuperAdminPermission && (
                                <span className="block mt-2 text-destructive font-semibold">
                                    ⚠️ Este es un permiso del sistema y no debería ser eliminado.
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

            {/* Modal para gestionar roles */}
            <AssignRolesModal
                permission={rowData}
                isOpen={isRolesModalOpen}
                onClose={() => setIsRolesModalOpen(false)}
                onSuccess={async () => {
                    await refreshPermissions()
                }}
            />
        </>
    )
}

