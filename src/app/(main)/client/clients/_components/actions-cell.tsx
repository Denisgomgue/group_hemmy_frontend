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
import { ClientForm, ClientFormRef } from "./client-form"
import { useClients } from "@/hooks/use-clients"
import Can from "@/components/permission/can"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { toast } from "sonner"
import { ClientStatus } from "@/types/client"
import type { Client } from "@/types/client"
import { Select, SelectTrigger, SelectContent, SelectItem } from "@/components/ui/select"
import { formSchema } from "@/schemas/client-schema"
import * as z from "zod"

interface ActionsCellProps {
    rowData: Client
}

export const ActionsCell: React.FC<ActionsCellProps> = ({ rowData }) => {
    const [ isEditDialogOpen, setIsEditDialogOpen ] = useState(false)
    const [ showDeleteDialog, setShowDeleteDialog ] = useState(false)
    const [ showStatusDialog, setShowStatusDialog ] = useState(false)
    const [ loading, setLoading ] = useState(false)
    const [ selectedStatus, setSelectedStatus ] = useState<ClientStatus | null>(rowData.status)
    const editClientFormRef = useRef<ClientFormRef>(null)
    const { refreshClients } = useClients()

    const handleDelete = async () => {
        try {
            setLoading(true)
            await api.delete(`/client/${rowData.id}`)
            toast.success(`Cliente ${rowData.actor?.displayName || ""} eliminado exitosamente.`)
            await refreshClients()
        } catch (error) {
            console.error("Error eliminando cliente:", error)
            toast.error("No se pudo eliminar al cliente. Por favor, inténtalo de nuevo.")
        } finally {
            setLoading(false)
            setShowDeleteDialog(false)
        }
    }

    const handleToggleStatus = async () => {
        if (!selectedStatus) return;

        try {
            await api.patch(`/client/${rowData.id}`, { status: selectedStatus })
            toast.success(`Cliente ${selectedStatus === ClientStatus.ACTIVE ? 'activado' : selectedStatus === ClientStatus.SUSPENDED ? 'suspendido' : 'desactivado'} exitosamente`)
            await refreshClients()
        } catch (error) {
            console.error("Error:", error)
            toast.error(`Error al cambiar el estado del cliente`)
        } finally {
            setShowStatusDialog(false)
        }
    }

    const handleUpdateClient = async (result: any) => {
        try {
            // El formulario maneja la actualización de datos
            toast.success("Cliente actualizado exitosamente")
            setIsEditDialogOpen(false)
            await refreshClients()
        } catch (error) {
            console.error("Error actualizando cliente:", error)
            toast.error("Error al actualizar cliente")
        }
    }

    const getStatusLabel = (status: ClientStatus) => {
        switch (status) {
            case ClientStatus.ACTIVE:
                return 'Activo';
            case ClientStatus.INACTIVE:
                return 'Inactivo';
            case ClientStatus.SUSPENDED:
                return 'Suspendido';
            default:
                return 'Desconocido';
        }
    }

    return (
        <>
            <div className="flex items-center gap-2">
                <Can action="editar-cliente" subject="clientes">
                    <Tooltip>
                        <TooltipTrigger>
                            <Button
                                variant="outline"
                                size="icon"
                                onClick={() => setIsEditDialogOpen(true)}
                            >
                                <Edit className="h-4 w-4" />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>Editar Cliente</p>
                        </TooltipContent>
                    </Tooltip>
                </Can>
                <Can action="estado-cliente" subject="clientes">
                    <Tooltip>
                        <TooltipTrigger>
                            <Button
                                variant="outline"
                                size="icon"
                                onClick={() => setShowStatusDialog(true)}
                                className={
                                    rowData.status === ClientStatus.ACTIVE
                                        ? 'bg-green-100'
                                        : rowData.status === ClientStatus.SUSPENDED
                                            ? 'bg-red-100'
                                            : 'bg-gray-100'
                                }
                            >
                                <Power className={`h-4 w-4 ${rowData.status === ClientStatus.ACTIVE
                                    ? 'text-green-600'
                                    : rowData.status === ClientStatus.SUSPENDED
                                        ? 'text-red-600'
                                        : 'text-gray-600'
                                    }`} />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>Cambiar Estado</p>
                        </TooltipContent>
                    </Tooltip>
                </Can>
                <Can action="eliminar-cliente" subject="clientes">
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button
                                variant="outline"
                                size="icon"
                                className="rounded-full"
                                onClick={() => setShowDeleteDialog(true)}
                            >
                                <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>Eliminar Cliente</p>
                        </TooltipContent>
                    </Tooltip>
                </Can>
            </div>

            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                <DialogContent className="sm:max-w-[900px] lg:max-w-[1100px] max-h-[90vh]">
                    <DialogHeader>
                        <DialogTitle>Editar Cliente</DialogTitle>
                    </DialogHeader>
                    <div className="max-h-[calc(90vh-120px)] overflow-y-auto">
                        <ClientForm
                            ref={editClientFormRef}
                            client={rowData}
                            onSubmit={handleUpdateClient}
                            onCancel={() => setIsEditDialogOpen(false)}
                        />
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsEditDialogOpen(false)} disabled={editClientFormRef.current?.isSubmitting}>
                            Cancelar
                        </Button>
                        <Button
                            onClick={() => editClientFormRef.current?.submit()}
                            disabled={editClientFormRef.current?.isSubmitting}
                        >
                            {editClientFormRef.current?.isSubmitting ? "Guardando..." : "Guardar Cambios"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <Dialog open={showStatusDialog} onOpenChange={setShowStatusDialog}>
                <DialogContent className="sm:max-w-[400px]">
                    <DialogHeader>
                        <DialogTitle>Cambiar Estado del Cliente</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                        <Select
                            value={selectedStatus || undefined}
                            onValueChange={(value) => setSelectedStatus(value as ClientStatus)}
                        >
                            <SelectTrigger>
                                {selectedStatus ? getStatusLabel(selectedStatus) : "Selecciona un estado"}
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value={ClientStatus.ACTIVE}>Activo</SelectItem>
                                <SelectItem value={ClientStatus.INACTIVE}>Inactivo</SelectItem>
                                <SelectItem value={ClientStatus.SUSPENDED}>Suspendido</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="flex justify-end Fgap-2 mt-4">
                        <Button variant="outline" onClick={() => setShowStatusDialog(false)}>
                            Cancelar
                        </Button>
                        <Button onClick={handleToggleStatus}>
                            Confirmar
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>

            <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Esta acción no se puede deshacer. Esto eliminará permanentemente al cliente.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleDelete}
                            disabled={loading}
                            className="bg-destructive dark:bg-destructive dark:hover:bg-destructive/90 text-destructive-foreground hover:bg-destructive/90"
                        >
                            {loading ? "Eliminando..." : "Eliminar"}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    )
}

