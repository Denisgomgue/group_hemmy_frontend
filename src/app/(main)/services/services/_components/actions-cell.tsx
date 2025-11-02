"use client"

import type React from "react"
import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import api from "@/lib/axios"
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
import { ServiceForm, ServiceFormRef } from "./service-form"
import { useServices } from "@/hooks/use-services"
import Can from "@/components/permission/can"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { toast } from "sonner"
import type { Service } from "@/types/service"

interface ActionsCellProps {
    rowData: Service
}

export const ActionsCell: React.FC<ActionsCellProps> = ({ rowData }) => {
    const [ isEditDialogOpen, setIsEditDialogOpen ] = useState(false)
    const [ showDeleteDialog, setShowDeleteDialog ] = useState(false)
    const [ loading, setLoading ] = useState(false)
    const editServiceFormRef = useRef<ServiceFormRef>(null)
    const { refreshServices } = useServices()

    const handleDelete = async () => {
        try {
            setLoading(true)
            await api.delete(`/service/${rowData.id}`)
            toast.success(`Servicio "${rowData.name}" eliminado exitosamente.`)
            await refreshServices()
        } catch (error) {
            console.error("Error eliminando servicio:", error)
            toast.error("No se pudo eliminar el servicio. Por favor, inténtalo de nuevo.")
        } finally {
            setLoading(false)
            setShowDeleteDialog(false)
        }
    }

    const handleUpdateService = async (result: any) => {
        try {
            toast.success("Servicio actualizado exitosamente")
            setIsEditDialogOpen(false)
            await refreshServices()
        } catch (error) {
            console.error("Error actualizando servicio:", error)
            toast.error("Error al actualizar servicio")
        }
    }

    return (
        <>
            <div className="flex items-center gap-2">
                <Can action="update" subject="Service">
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
                            <p>Editar Servicio</p>
                        </TooltipContent>
                    </Tooltip>
                </Can>

                <Can action="delete" subject="Service">
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
                            <p>Eliminar Servicio</p>
                        </TooltipContent>
                    </Tooltip>
                </Can>
            </div>

            {/* Dialog para editar */}
            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                <DialogContent className="sm:max-w-[700px] lg:max-w-[900px] max-h-[90vh] flex flex-col p-0">
                    <DialogHeader className="px-6 pt-6 pb-4 flex-shrink-0">
                        <DialogTitle>Editar Servicio</DialogTitle>
                    </DialogHeader>
                    <div className="flex-1 px-6 overflow-y-auto">
                        <ServiceForm
                            ref={editServiceFormRef}
                            service={rowData}
                            onSubmit={handleUpdateService}
                            onCancel={() => setIsEditDialogOpen(false)}
                        />
                    </div>
                    <DialogFooter className="px-6 pb-6 pt-4 border-t">
                        <Button variant="outline" onClick={() => setIsEditDialogOpen(false)} disabled={loading}>
                            Cancelar
                        </Button>
                        <Button
                            variant="default"
                            onClick={() => {
                                editServiceFormRef.current?.submit();
                            }}
                            disabled={loading}
                        >
                            {loading ? "Guardando..." : "Guardar Cambios"}
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
                            Esta acción no se puede deshacer. Esto eliminará permanentemente el servicio "{rowData.name}".
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={loading}>Cancelar</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDelete} disabled={loading} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                            {loading ? "Eliminando..." : "Eliminar"}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    )
}
