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
import { EmployeeForm, EmployeeFormRef } from "./employee-form"
import { useEmployees } from "@/hooks/use-employees"
import Can from "@/components/permission/can"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { toast } from "sonner"
import type { Employee } from "@/types/employee"

interface ActionsCellProps {
    rowData: Employee
}

export const ActionsCell: React.FC<ActionsCellProps> = ({ rowData }) => {
    const [ isEditDialogOpen, setIsEditDialogOpen ] = useState(false)
    const [ showDeleteDialog, setShowDeleteDialog ] = useState(false)
    const [ loading, setLoading ] = useState(false)
    const editEmployeeFormRef = useRef<EmployeeFormRef>(null)
    const { refreshEmployees } = useEmployees()

    const handleDelete = async () => {
        try {
            setLoading(true)
            await api.delete(`/employee/${rowData.id}`)
            const personName = rowData.person ? `${rowData.person.firstName} ${rowData.person.lastName}` : 'Empleado'
            toast.success(`Empleado "${personName}" eliminado exitosamente.`)
            await refreshEmployees()
        } catch (error) {
            console.error("Error eliminando empleado:", error)
            toast.error("No se pudo eliminar el empleado. Por favor, inténtalo de nuevo.")
        } finally {
            setLoading(false)
            setShowDeleteDialog(false)
        }
    }

    const handleUpdateEmployee = async (result: any) => {
        try {
            toast.success("Empleado actualizado exitosamente")
            setIsEditDialogOpen(false)
            await refreshEmployees()
        } catch (error) {
            console.error("Error actualizando empleado:", error)
            toast.error("Error al actualizar empleado")
        }
    }

    return (
        <>
            <div className="flex items-center gap-2">
                <Can action="update" subject="Employee">
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
                            <p>Editar Empleado</p>
                        </TooltipContent>
                    </Tooltip>
                </Can>

                <Can action="delete" subject="Employee">
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
                            <p>Eliminar Empleado</p>
                        </TooltipContent>
                    </Tooltip>
                </Can>
            </div>

            {/* Dialog para editar */}
            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                <DialogContent className="md:max-w-[1100px] max-h-[90vh] flex flex-col p-0">
                    <DialogHeader className="px-6 pt-6 pb-4 flex-shrink-0">
                        <DialogTitle>Editar Empleado</DialogTitle>
                    </DialogHeader>
                    <div className="flex-1 px-6 overflow-y-auto">
                        <EmployeeForm
                            ref={editEmployeeFormRef}
                            employee={rowData}
                            onSubmit={handleUpdateEmployee}
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
                                editEmployeeFormRef.current?.submit();
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
                            Esta acción no se puede deshacer. Esto eliminará permanentemente el empleado.
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

