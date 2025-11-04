"use client"

import type React from "react"
import { useState } from "react"
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
import { Trash2, UserCog, Edit, Power } from "lucide-react"
import { UserForm } from "./edituser-from"
import { useUsers } from "@/hooks/use-users"
import Can from "@/components/permission/can"
import { toast } from "sonner"
import type { User } from "@/types/user"
import { useAuth } from "@/contexts/AuthContext"
import { formSchema } from "@/schemas/user-schema"
import * as z from "zod"
import { AssignRolesModal } from "./assign-roles-modal"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
interface ActionsCellProps {
    rowData: User
}

export const ActionsCell: React.FC<ActionsCellProps> = ({ rowData }) => {
    const [ isProfileDialogOpen, setIsProfileDialogOpen ] = useState(false)
    const [ isEditDialogOpen, setIsEditDialogOpen ] = useState(false)
    const [ showDeleteDialog, setShowDeleteDialog ] = useState(false)
    const [ loading, setLoading ] = useState(false)
    const { user } = useAuth()
    const [ showStatusDialog, setShowStatusDialog ] = useState(false)

    const { refreshUsers } = useUsers()

    const handleOpenProfileDialog = () => {
        setIsProfileDialogOpen(true)
    }

    const handleRolesAssigned = async () => {
        await refreshUsers()
    }

    const handleDelete = async () => {
        try {
            setLoading(true)
            await api.delete(`/users/${rowData.id}`)
            const displayName = rowData.actor?.displayName ||
                (rowData.actor?.person
                    ? `${rowData.actor.person.firstName} ${rowData.actor.person.lastName}`.trim()
                    : rowData.actor?.organization?.name) ||
                'Usuario';
            toast.success(`Usuario ${displayName} eliminado exitosamente.`)
            await refreshUsers()
        } catch (error) {
            console.error("Error eliminando usuario:", error)
            toast.error("No se pudo eliminar al usuario. Por favor, inténtalo de nuevo.")
        } finally {
            setLoading(false)
            setShowDeleteDialog(false)
        }
    }

    const handleToggleStatus = async () => {
        const userEmail = rowData.actor?.person?.email || rowData.actor?.organization?.email;
        if (userEmail === user?.actor?.person?.email && rowData.isActive) {
            toast.error("No puedes desactivar tu propia cuenta")
            return
        }
        try {
            const updatedStatus = !rowData.isActive;
            await api.patch(`/users/${rowData.id}`, { isActive: updatedStatus })
            toast.success(`Usuario ${updatedStatus ? 'activado' : 'desactivado'} exitosamente`)
            await refreshUsers()
        } catch (error) {
            console.error("Error:", error)
            toast.error(`Error al ${rowData.isActive ? 'desactivar' : 'activar'} el usuario`)
        } finally {
            setShowStatusDialog(false)
        }
    }

    const handleUpdateUser = async (values: z.infer<typeof formSchema>) => {
        try {
            await api.patch(`/users/${rowData.id}`, values)
            toast.success("Usuario actualizado exitosamente")
            setIsEditDialogOpen(false)
            await refreshUsers()
        } catch (error) {
            console.error("Error actualizando usuario:", error)
            toast.error("Error al actualizar usuario")
        }
    }

    return (
        <>
            <div className="flex items-center gap-2">
                <Can action="editar-usuario" subject="configuracion-usuario">
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
                            <p>Editar Usuario</p>
                        </TooltipContent>
                    </Tooltip>
                </Can>
                <Can action="asignar-perfil" subject="configuracion-usuario">
                    <Tooltip>
                        <TooltipTrigger>
                            <Button variant="outline" size="icon" onClick={handleOpenProfileDialog}>
                                <UserCog />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>Asignar Perfil</p>
                        </TooltipContent>
                    </Tooltip>
                </Can>
                <Can action="eliminar-usuario" subject="configuracion-usuario">
                    {(rowData.actor?.person?.email || rowData.actor?.organization?.email) !== (user?.actor?.person?.email || user?.actor?.organization?.email) && (
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
                                <p>Eliminar Usuario</p>
                            </TooltipContent>
                        </Tooltip>
                    )}
                </Can>
                <Can action="estado-usuario" subject="configuracion-usuario">
                    {(rowData.actor?.person?.email || rowData.actor?.organization?.email) !== (user?.actor?.person?.email || user?.actor?.organization?.email) && (
                        <Tooltip>
                            <TooltipTrigger>
                                <Button
                                    variant="outline"
                                    size="icon"
                                    onClick={() => setShowStatusDialog(true)}
                                    className={rowData.isActive ? 'bg-green-100' : 'bg-red-100'}
                                    disabled={(rowData.actor?.person?.email || rowData.actor?.organization?.email) === (user?.actor?.person?.email || user?.actor?.organization?.email)}
                                >
                                    <Power className={`h-4 w-4 ${rowData.isActive ? 'text-green-600' : 'text-red-600'}`} />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>{rowData.isActive ? 'Desactivar' : 'Activar'} Usuario</p>
                            </TooltipContent>
                        </Tooltip>
                    )}
                </Can>
            </div>

            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                <DialogContent className="sm:max-w-[625px]">
                    <DialogHeader>
                        <DialogTitle>Editar Usuario</DialogTitle>
                    </DialogHeader>
                    <UserForm
                        user={rowData}
                        onSubmit={handleUpdateUser}
                        onCancel={() => setIsEditDialogOpen(false)}
                    />
                </DialogContent>
            </Dialog>

            <AssignRolesModal
                open={isProfileDialogOpen}
                onOpenChange={setIsProfileDialogOpen}
                user={rowData}
                onSuccess={handleRolesAssigned}
            />

            <AlertDialog open={showStatusDialog} onOpenChange={setShowStatusDialog}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                        <AlertDialogDescription>
                            {(() => {
                                const displayName = rowData.actor?.displayName ||
                                    (rowData.actor?.person
                                        ? `${rowData.actor.person.firstName} ${rowData.actor.person.lastName}`.trim()
                                        : rowData.actor?.organization?.name) ||
                                    'Usuario';
                                return rowData.isActive
                                    ? `¿Deseas desactivar al usuario ${displayName}? El usuario no podrá acceder al sistema.`
                                    : `¿Deseas activar al usuario ${displayName}? El usuario podrá volver a acceder al sistema.`;
                            })()}
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleToggleStatus}
                            className={rowData.isActive ? 'bg-destructive hover:bg-destructive/90' : 'bg-green-600 hover:bg-green-700'}
                        >
                            {rowData.isActive ? 'Sí, desactivar' : 'Sí, activar'}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Esta acción no se puede deshacer. Esto eliminará permanentemente al usuario.
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
