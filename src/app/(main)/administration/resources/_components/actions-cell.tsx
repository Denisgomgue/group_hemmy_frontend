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
import { Trash2, Edit } from "lucide-react"
import { ResourceForm, ResourceFormRef } from "./resource-form"
import { useResource } from "@/hooks/use-resource"
import Can from "@/components/permission/can"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { toast } from "sonner"
import type { Resource } from "@/types/resource"
import { ResourceAPI } from "@/services/resource-api"

interface ActionsCellProps {
    rowData: Resource
}

export const ActionsCell: React.FC<ActionsCellProps> = ({ rowData }) => {
    const [ isEditDialogOpen, setIsEditDialogOpen ] = useState(false)
    const [ showDeleteDialog, setShowDeleteDialog ] = useState(false)
    const [ loading, setLoading ] = useState(false)
    const resourceFormRef = useRef<ResourceFormRef>(null)
    const { refreshResources } = useResource()

    const handleDelete = async () => {
        setLoading(true)
        try {
            await ResourceAPI.delete(rowData.id)
            toast.success("Recurso eliminado correctamente")
            setShowDeleteDialog(false)
            await refreshResources()
        } catch (error: any) {
            const errorMessage =
                error?.response?.data?.message || error?.message || "Error al eliminar el recurso"
            toast.error(errorMessage)
            console.error("Error deleting resource:", error)
        } finally {
            setLoading(false)
        }
    }

    const handleUpdateResource = async (result: any) => {
        try {
            await ResourceAPI.update(rowData.id, result)
            toast.success("Recurso actualizado correctamente")
            setIsEditDialogOpen(false)
            await refreshResources()
        } catch (error: any) {
            const errorMessage =
                error?.response?.data?.message || error?.message || "Error al actualizar el recurso"
            toast.error(errorMessage)
            console.error("Error updating resource:", error)
        }
    }

    return (
        <>
            <div className="flex items-center gap-2">
                <Can action="update" subject="Resource">
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => setIsEditDialogOpen(true)}
                            >
                                <Edit className="h-4 w-4" />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>Editar</p>
                        </TooltipContent>
                    </Tooltip>
                </Can>

                <Can action="delete" subject="Resource">
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => setShowDeleteDialog(true)}
                            >
                                <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>Eliminar</p>
                        </TooltipContent>
                    </Tooltip>
                </Can>
            </div>

            {/* Dialog para editar */}
            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                <DialogContent className="sm:max-w-[600px]">
                    <DialogHeader>
                        <DialogTitle>Editar Recurso</DialogTitle>
                    </DialogHeader>
                    <ResourceForm
                        ref={resourceFormRef}
                        resource={rowData}
                        onSubmit={handleUpdateResource}
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
                                resourceFormRef.current?.submit()
                            }}
                            disabled={resourceFormRef.current?.isSubmitting}
                        >
                            {resourceFormRef.current?.isSubmitting ? "Guardando..." : "Guardar"}
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
                            recurso <strong>{rowData.name}</strong> ({rowData.routeCode}).
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={loading}>Cancelar</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleDelete}
                            disabled={loading}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                            {loading ? "Eliminando..." : "Eliminar"}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    )
}

