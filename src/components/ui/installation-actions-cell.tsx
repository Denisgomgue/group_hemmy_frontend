"use client"

import type React from "react"
import { useState } from "react"
import { Pencil, Trash2, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { useSafeDelete } from "@/hooks/use-safe-delete"
import { DeleteConfirmationDialog } from "@/components/ui/delete-confirmation-dialog"

interface InstallationActionsCellProps {
    installationId: number
    installationReference: string
    clientName: string
    clientLastName: string
    onEdit?: (installationId: number) => void;
    onDelete?: (installationId: number) => void;
}

export const InstallationActionsCell: React.FC<InstallationActionsCellProps> = ({
    installationId,
    installationReference,
    clientName,
    clientLastName,
    onEdit,
    onDelete
}) => {
    const [ showDeleteDialog, setShowDeleteDialog ] = useState(false)
    const [ dependencies, setDependencies ] = useState<any>(null)
    const [ isCheckingDependencies, setIsCheckingDependencies ] = useState(false)

    const { checkCanDelete, deleteInstallation } = useSafeDelete()

    const handleDeleteClick = async () => {
        setIsCheckingDependencies(true)
        try {
            // Verificar dependencias antes de mostrar el diálogo
            const deps = await checkCanDelete('installation', installationId)
            setDependencies(deps)
            setShowDeleteDialog(true)
        } catch (error) {
            console.error('Error verificando dependencias:', error)
            toast.error('Error al verificar dependencias de la instalación')
        } finally {
            setIsCheckingDependencies(false)
        }
    }

    const handleConfirmDelete = async (forceDelete?: boolean) => {
        try {
            await deleteInstallation.mutateAsync({
                id: installationId,
                options: forceDelete ? { forceDelete: true } : undefined
            })
            setShowDeleteDialog(false)
            setDependencies(null)
            // Llamar al callback del padre para refrescar la lista
            onDelete?.(installationId)
        } catch (error) {
            console.error('Error eliminando instalación:', error)
        }
    }

    return (
        <div className="flex items-center gap-2">
            {onEdit && (
                <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 hover:bg-blue-50 hover:text-blue-600"
                    onClick={() => onEdit(installationId)}
                    title="Editar instalación"
                >
                    <Pencil className="h-4 w-4" />
                </Button>
            )}

            <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 hover:bg-red-50 hover:text-red-600"
                onClick={handleDeleteClick}
                disabled={isCheckingDependencies}
                title="Eliminar instalación"
            >
                {isCheckingDependencies ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600" />
                ) : (
                    <Trash2 className="h-4 w-4" />
                )}
            </Button>

            <DeleteConfirmationDialog
                isOpen={showDeleteDialog}
                onClose={() => {
                    setShowDeleteDialog(false)
                    setDependencies(null)
                }}
                onConfirm={handleConfirmDelete}
                title="Eliminar Instalación"
                description="Esta acción no se puede deshacer. Esto eliminará permanentemente la instalación y todos sus datos asociados."
                itemName={`${installationReference || `Instalación #${installationId}`} - ${clientName} ${clientLastName}`}
                dependencies={dependencies}
                isLoading={deleteInstallation.isPending}
            />
        </div>
    )
}
