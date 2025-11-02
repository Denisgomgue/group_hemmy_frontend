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
import { Trash2, Edit, Power } from "lucide-react"
import { InstallationForm, InstallationFormRef } from "./installation-form"
import { useInstallations } from "@/hooks/use-installations"
import Can from "@/components/permission/can"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { toast } from "sonner"
import { InstallationStatus } from "@/types/installation"
import type { Installation } from "@/types/installation"
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select"

interface ActionsCellProps {
    rowData: Installation
}

export const ActionsCell: React.FC<ActionsCellProps> = ({ rowData }) => {
    const [ isEditDialogOpen, setIsEditDialogOpen ] = useState(false)
    const [ showDeleteDialog, setShowDeleteDialog ] = useState(false)
    const [ showStatusDialog, setShowStatusDialog ] = useState(false)
    const [ loading, setLoading ] = useState(false)
    const [ selectedStatus, setSelectedStatus ] = useState<InstallationStatus | null>(rowData.status)
    const editInstallationFormRef = useRef<InstallationFormRef>(null)
    const { refreshInstallations } = useInstallations()

    const handleDelete = async () => {
        try {
            setLoading(true)
            await api.delete(`/installation/${rowData.id}`)
            toast.success(`Instalación eliminada exitosamente.`)
            await refreshInstallations()
        } catch (error) {
            console.error("Error eliminando instalación:", error)
            toast.error("No se pudo eliminar la instalación. Por favor, inténtalo de nuevo.")
        } finally {
            setLoading(false)
            setShowDeleteDialog(false)
        }
    }

    const handleToggleStatus = async () => {
        if (!selectedStatus) return;

        try {
            await api.patch(`/installation/${rowData.id}`, { status: selectedStatus })
            toast.success(`Instalación ${selectedStatus === InstallationStatus.ACTIVE ? 'activada' : 'desactivada'} exitosamente`)
            await refreshInstallations()
        } catch (error) {
            console.error("Error:", error)
            toast.error(`Error al cambiar el estado de la instalación`)
        } finally {
            setShowStatusDialog(false)
        }
    }

    const handleUpdateInstallation = async (result: any) => {
        try {
            toast.success("Instalación actualizada exitosamente")
            setIsEditDialogOpen(false)
            await refreshInstallations()
        } catch (error) {
            console.error("Error actualizando instalación:", error)
            toast.error("Error al actualizar instalación")
        }
    }

    const getStatusLabel = (status: InstallationStatus) => {
        switch (status) {
            case InstallationStatus.ACTIVE:
                return 'Activa';
            case InstallationStatus.INACTIVE:
                return 'Inactiva';
            default:
                return 'Desconocido';
        }
    }

    const clientName = rowData.client?.actor?.displayName ||
        (rowData.client?.actor?.person
            ? `${rowData.client.actor.person.firstName} ${rowData.client.actor.person.lastName}`.trim()
            : rowData.client?.actor?.organization?.legalName) ||
        'Instalación';

    return (
        <>
            <div className="flex items-center gap-2">
                <Can action="update" subject="Installation">
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
                            <p>Editar Instalación</p>
                        </TooltipContent>
                    </Tooltip>
                </Can>

                <Can action="delete" subject="Installation">
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
                            <p>Eliminar Instalación</p>
                        </TooltipContent>
                    </Tooltip>
                </Can>

                <Can action="update" subject="Installation">
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => setShowStatusDialog(true)}
                            >
                                <Power className="h-4 w-4" />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>Cambiar Estado</p>
                        </TooltipContent>
                    </Tooltip>
                </Can>
            </div>

            {/* Dialog para editar */}
            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                <DialogContent className="sm:max-w-[900px] lg:max-w-[1100px] max-h-[90vh] flex flex-col p-0">
                    <DialogHeader className="px-6 pt-6 pb-4 flex-shrink-0">
                        <DialogTitle>Editar Instalación</DialogTitle>
                    </DialogHeader>
                    <div className="flex-1 px-6 overflow-y-auto">
                        <InstallationForm
                            ref={editInstallationFormRef}
                            installation={rowData}
                            onSubmit={handleUpdateInstallation}
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
                                editInstallationFormRef.current?.submit();
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
                            Esta acción no se puede deshacer. Esto eliminará permanentemente la instalación para el cliente "{clientName}".
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

            {/* Dialog para cambiar estado */}
            <Dialog open={showStatusDialog} onOpenChange={setShowStatusDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Cambiar Estado de la Instalación</DialogTitle>
                    </DialogHeader>
                    <div className="py-6 space-y-4">
                        <Select
                            value={selectedStatus || ""}
                            onValueChange={(value) => setSelectedStatus(value as InstallationStatus)}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Seleccione un estado" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value={InstallationStatus.ACTIVE}>Activa</SelectItem>
                                <SelectItem value={InstallationStatus.INACTIVE}>Inactiva</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setShowStatusDialog(false)} disabled={loading}>
                            Cancelar
                        </Button>
                        <Button onClick={handleToggleStatus} disabled={loading}>
                            {loading ? "Guardando..." : "Guardar Cambios"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    )
}

