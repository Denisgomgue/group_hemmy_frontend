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
import { Trash2, Edit, Link } from "lucide-react"
import { EquipmentForm, EquipmentFormRef } from "./equipment-form"
import { AssignEquipmentForm, AssignEquipmentFormRef } from "./assign-equipment-form"
import { useEquipment } from "@/hooks/use-equipment"
import Can from "@/components/permission/can"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { toast } from "sonner"
import type { Equipment } from "@/types/equipment"

interface ActionsCellProps {
    rowData: Equipment
}

export const ActionsCell: React.FC<ActionsCellProps> = ({ rowData }) => {
    const [ isEditDialogOpen, setIsEditDialogOpen ] = useState(false)
    const [ isAssignDialogOpen, setIsAssignDialogOpen ] = useState(false)
    const [ showDeleteDialog, setShowDeleteDialog ] = useState(false)
    const [ loading, setLoading ] = useState(false)
    const [ isAssigning, setIsAssigning ] = useState(false)
    const editEquipmentFormRef = useRef<EquipmentFormRef>(null)
    const assignEquipmentFormRef = useRef<AssignEquipmentFormRef>(null)
    const { refreshEquipment } = useEquipment()

    const handleDelete = async () => {
        try {
            setLoading(true)
            await api.delete(`/equipment/${rowData.id}`)
            const equipmentName = rowData.brand && rowData.model
                ? `${rowData.brand} ${rowData.model}`
                : rowData.serialNumber || 'Equipo'
            toast.success(`Equipo "${equipmentName}" eliminado exitosamente.`)
            await refreshEquipment()
        } catch (error) {
            console.error("Error eliminando equipo:", error)
            toast.error("No se pudo eliminar el equipo. Por favor, inténtalo de nuevo.")
        } finally {
            setLoading(false)
            setShowDeleteDialog(false)
        }
    }

    const handleUpdateEquipment = async (result: any) => {
        try {
            toast.success("Equipo actualizado exitosamente")
            setIsEditDialogOpen(false)
            await refreshEquipment()
        } catch (error) {
            console.error("Error actualizando equipo:", error)
            toast.error("Error al actualizar equipo")
        }
    }

    const handleAssignEquipment = async (result: any) => {
        setIsAssigning(true)
        try {
            toast.success("Equipo asignado exitosamente a la instalación")
            setIsAssignDialogOpen(false)
            await refreshEquipment()
        } catch (error) {
            console.error("Error asignando equipo:", error)
            toast.error("Error al asignar equipo")
        } finally {
            setIsAssigning(false)
        }
    }

    return (
        <>
            <div className="flex items-center">
                <Can action="update" subject="Equipment">
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => setIsAssignDialogOpen(true)}
                            >
                                <Link className="h-4 w-4" />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>Asignar a Instalación</p>
                        </TooltipContent>
                    </Tooltip>
                </Can>

                <Can action="update" subject="Equipment">
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
                            <p>Editar Equipo</p>
                        </TooltipContent>
                    </Tooltip>
                </Can>

                <Can action="delete" subject="Equipment">
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
                            <p>Eliminar Equipo</p>
                        </TooltipContent>
                    </Tooltip>
                </Can>
            </div>

            {/* Dialog para editar */}
            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                <DialogContent className="sm:max-w-[900px] lg:max-w-[1100px] max-h-[90vh] flex flex-col p-0">
                    <DialogHeader className="px-6 pt-6 pb-4 flex-shrink-0">
                        <DialogTitle>Editar Equipo</DialogTitle>
                    </DialogHeader>
                    <div className="flex-1 px-6 overflow-y-auto">
                        <EquipmentForm
                            ref={editEquipmentFormRef}
                            equipment={rowData}
                            onSubmit={handleUpdateEquipment}
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
                                editEquipmentFormRef.current?.submit();
                            }}
                            disabled={loading}
                        >
                            {loading ? "Guardando..." : "Guardar Cambios"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Dialog para asignar */}
            <Dialog open={isAssignDialogOpen} onOpenChange={setIsAssignDialogOpen}>
                <DialogContent className="sm:max-w-[600px] min-h-[400px] max-h-[90vh] flex flex-col p-0">
                    <DialogHeader className="px-6 pt-6 pb-4 flex-shrink-0">
                        <DialogTitle>Asignar Equipo a Instalación</DialogTitle>
                    </DialogHeader>
                    <div className="flex-1 px-6 py-4 overflow-y-auto min-h-[400px]">
                        <AssignEquipmentForm
                            ref={assignEquipmentFormRef}
                            equipment={rowData}
                            onSubmit={handleAssignEquipment}
                            onCancel={() => setIsAssignDialogOpen(false)}
                        />
                    </div>
                    <DialogFooter className="px-6 pb-6 pt-4 border-t">
                        <Button variant="outline" onClick={() => setIsAssignDialogOpen(false)} disabled={isAssigning}>
                            Cancelar
                        </Button>
                        <Button
                            variant="default"
                            onClick={() => {
                                setIsAssigning(true)
                                assignEquipmentFormRef.current?.submit();
                            }}
                            disabled={isAssigning}
                        >
                            {isAssigning ? "Asignando..." : "Asignar"}
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
                            Esta acción no se puede deshacer. Esto eliminará permanentemente el equipo.
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

