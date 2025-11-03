"use client"

import { useState, useEffect, useMemo } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { X, Shield } from "lucide-react"
import { PermissionSearchSelect } from "@/components/search-select/permission-search-select"
import { RolePermissionAPI } from "@/services/role-permission-api"
import { PermissionAPI } from "@/services/permissions-api"
import { toast } from "sonner"
import { Role } from "@/types/role"
import { Permission } from "@/types/permission"
import { RolePermission } from "@/types/role-permission"

interface AssignPermissionsModalProps {
    role: Role | null
    isOpen: boolean
    onClose: () => void
    onSuccess: () => void
}

export const AssignPermissionsModal = ({ role, isOpen, onClose, onSuccess }: AssignPermissionsModalProps) => {
    const [ selectedPermissionId, setSelectedPermissionId ] = useState<number | undefined>()
    const [ assignedPermissions, setAssignedPermissions ] = useState<RolePermission[]>([])
    const [ allPermissions, setAllPermissions ] = useState<Permission[]>([])
    const [ isLoading, setIsLoading ] = useState(false)
    const [ isAssigning, setIsAssigning ] = useState(false)

    // Cargar permisos asignados al rol
    useEffect(() => {
        if (role && isOpen) {
            loadAssignedPermissions()
            loadAllPermissions()
        }
    }, [ role, isOpen ])

    const loadAssignedPermissions = async () => {
        if (!role) return
        setIsLoading(true)
        try {
            const data = await RolePermissionAPI.getByRoleId(role.id)
            setAssignedPermissions(data)
        } catch (error) {
            console.error('Error loading assigned permissions:', error)
        } finally {
            setIsLoading(false)
        }
    }

    const loadAllPermissions = async () => {
        try {
            const data = await PermissionAPI.getAll()
            // Filtrar permiso superadmin
            const filtered = data.filter(p => p.code !== '*')
            setAllPermissions(filtered)
        } catch (error) {
            console.error('Error loading permissions:', error)
        }
    }

    const assignedPermissionIds = useMemo(() =>
        assignedPermissions.map(rp => rp.permissionId || rp.permission?.id || 0),
        [ assignedPermissions ]
    )

    const handleAssign = async () => {
        if (!role || !selectedPermissionId) return

        // Prevenir asignar a roles del sistema excepto si es SUPERADMIN
        if (role.isSystem && role.code !== 'SUPERADMIN') {
            toast.error('No se pueden asignar permisos a roles del sistema')
            return
        }

        setIsAssigning(true)
        try {
            await RolePermissionAPI.create({
                roleId: role.id,
                permissionId: selectedPermissionId
            })
            toast.success('Permiso asignado correctamente')
            setSelectedPermissionId(undefined)
            await loadAssignedPermissions()
            onSuccess()
        } catch (error: any) {
            const errorMessage = error?.response?.data?.message || error?.message || 'Error al asignar el permiso'
            toast.error(errorMessage)
        } finally {
            setIsAssigning(false)
        }
    }

    const handleRemove = async (rolePermissionId: number) => {
        if (!role) return

        // Prevenir eliminar permisos de roles del sistema
        if (role.isSystem || role.code === 'SUPERADMIN') {
            toast.error('No se pueden eliminar permisos de roles del sistema')
            return
        }

        setIsAssigning(true)
        try {
            await RolePermissionAPI.delete(rolePermissionId)
            toast.success('Permiso eliminado correctamente')
            await loadAssignedPermissions()
            onSuccess()
        } catch (error: any) {
            const errorMessage = error?.response?.data?.message || error?.message || 'Error al eliminar el permiso'
            toast.error(errorMessage)
        } finally {
            setIsAssigning(false)
        }
    }

    const getPermissionName = (permissionId: number) => {
        const permission = allPermissions.find(p => p.id === permissionId)
        return permission?.name || 'Permiso desconocido'
    }

    const getPermissionCode = (permissionId: number) => {
        const permission = allPermissions.find(p => p.id === permissionId)
        return permission?.code || ''
    }

    if (!role) return null

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[700px] max-h-[90vh] flex flex-col">
                <DialogHeader>
                    <DialogTitle>Gestionar Permisos - {role.name}</DialogTitle>
                </DialogHeader>

                <div className="flex-1 overflow-y-auto space-y-4">
                    {/* Formulario para asignar nuevo permiso */}
                    {(role.code !== 'SUPERADMIN' && !role.isSystem) && (
                        <div className="space-y-2 p-4 border rounded-lg">
                            <label className="text-sm font-medium">Asignar nuevo permiso</label>
                            <div className="flex gap-2">
                                <div className="flex-1">
                                    <PermissionSearchSelect
                                        value={selectedPermissionId}
                                        onChange={(id) => setSelectedPermissionId(id)}
                                        placeholder="Seleccionar permiso..."
                                        excludePermissionIds={assignedPermissionIds}
                                        disabled={isAssigning}
                                    />
                                </div>
                                <Button
                                    onClick={handleAssign}
                                    disabled={!selectedPermissionId || isAssigning}
                                >
                                    Asignar
                                </Button>
                            </div>
                        </div>
                    )}

                    {(role.code === 'SUPERADMIN' || role.isSystem) && (
                        <div className="p-3 bg-muted rounded-md text-sm text-muted-foreground">
                            Este es un rol del sistema. Los permisos no pueden modificarse manualmente.
                        </div>
                    )}

                    {/* Lista de permisos asignados */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Permisos asignados ({assignedPermissions.length})</label>
                        {isLoading ? (
                            <div className="text-sm text-muted-foreground">Cargando...</div>
                        ) : assignedPermissions.length === 0 ? (
                            <div className="text-sm text-muted-foreground">No hay permisos asignados</div>
                        ) : (
                            <div className="space-y-2">
                                {assignedPermissions.map((rp) => (
                                    <div
                                        key={rp.id}
                                        className="flex items-center justify-between p-3 border rounded-lg"
                                    >
                                        <div className="flex items-center gap-2">
                                            <Shield className="h-4 w-4 text-muted-foreground" />
                                            <div>
                                                <div className="font-medium">
                                                    {rp.permission?.name || getPermissionName(rp.permissionId)}
                                                </div>
                                                <div className="text-sm text-muted-foreground">
                                                    {rp.permission?.code || getPermissionCode(rp.permissionId)}
                                                </div>
                                            </div>
                                        </div>
                                        {(role.code !== 'SUPERADMIN' && !role.isSystem) && (
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => handleRemove(rp.id)}
                                                disabled={isAssigning}
                                            >
                                                <X className="h-4 w-4" />
                                            </Button>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={onClose} disabled={isAssigning}>
                        Cerrar
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

