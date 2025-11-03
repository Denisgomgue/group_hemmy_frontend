"use client"

import { useState, useEffect, useMemo } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { X, UserCog } from "lucide-react"
import { RoleSearchSelect } from "@/components/search-select/role-search-select"
import { RolePermissionAPI } from "@/services/role-permission-api"
import { RoleAPI } from "@/services/roles-api"
import { toast } from "sonner"
import { Role } from "@/types/role"
import { Permission } from "@/types/permission"
import { RolePermission } from "@/types/role-permission"

interface AssignRolesModalProps {
    permission: Permission | null
    isOpen: boolean
    onClose: () => void
    onSuccess: () => void
}

export const AssignRolesModal = ({ permission, isOpen, onClose, onSuccess }: AssignRolesModalProps) => {
    const [ selectedRoleId, setSelectedRoleId ] = useState<number | undefined>()
    const [ assignedRoles, setAssignedRoles ] = useState<RolePermission[]>([])
    const [ allRoles, setAllRoles ] = useState<Role[]>([])
    const [ isLoading, setIsLoading ] = useState(false)
    const [ isAssigning, setIsAssigning ] = useState(false)

    // Cargar roles asignados al permiso
    useEffect(() => {
        if (permission && isOpen) {
            loadAssignedRoles()
            loadAllRoles()
        }
    }, [ permission, isOpen ])

    const loadAssignedRoles = async () => {
        if (!permission) return
        setIsLoading(true)
        try {
            const data = await RolePermissionAPI.getByPermissionId(permission.id)
            setAssignedRoles(data)
        } catch (error) {
            console.error('Error loading assigned roles:', error)
        } finally {
            setIsLoading(false)
        }
    }

    const loadAllRoles = async () => {
        try {
            const data = await RoleAPI.getAll()
            setAllRoles(data)
        } catch (error) {
            console.error('Error loading roles:', error)
        }
    }

    const assignedRoleIds = useMemo(() =>
        assignedRoles.map(rp => rp.roleId || rp.role?.id || 0),
        [ assignedRoles ]
    )

    const handleAssign = async () => {
        if (!permission || !selectedRoleId) return

        // Prevenir asignar permiso '*' a roles que no sean SUPERADMIN
        if (permission.code === '*') {
            const selectedRole = allRoles.find(r => r.id === selectedRoleId)
            if (selectedRole?.code !== 'SUPERADMIN') {
                toast.error('El permiso "*" solo puede asignarse al rol SUPERADMIN')
                return
            }
        }

        setIsAssigning(true)
        try {
            await RolePermissionAPI.create({
                roleId: selectedRoleId,
                permissionId: permission.id
            })
            toast.success('Rol asignado correctamente')
            setSelectedRoleId(undefined)
            await loadAssignedRoles()
            onSuccess()
        } catch (error: any) {
            const errorMessage = error?.response?.data?.message || error?.message || 'Error al asignar el rol'
            toast.error(errorMessage)
        } finally {
            setIsAssigning(false)
        }
    }

    const handleRemove = async (rolePermissionId: number) => {
        if (!permission) return

        const rolePermission = assignedRoles.find(rp => rp.id === rolePermissionId)
        if (!rolePermission) return

        // Prevenir eliminar permisos de roles del sistema
        const role = rolePermission.role || allRoles.find(r => r.id === rolePermission.roleId)
        if (role && (role.isSystem || role.code === 'SUPERADMIN')) {
            toast.error('No se pueden eliminar permisos de roles del sistema')
            return
        }

        setIsAssigning(true)
        try {
            await RolePermissionAPI.delete(rolePermissionId)
            toast.success('Rol eliminado correctamente')
            await loadAssignedRoles()
            onSuccess()
        } catch (error: any) {
            const errorMessage = error?.response?.data?.message || error?.message || 'Error al eliminar el rol'
            toast.error(errorMessage)
        } finally {
            setIsAssigning(false)
        }
    }

    const getRoleName = (roleId: number) => {
        const role = allRoles.find(r => r.id === roleId)
        return role?.name || 'Rol desconocido'
    }

    const getRoleCode = (roleId: number) => {
        const role = allRoles.find(r => r.id === roleId)
        return role?.code || ''
    }

    if (!permission) return null

    const isSuperAdminPermission = permission.code === '*'

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[700px] max-h-[90vh] flex flex-col">
                <DialogHeader>
                    <DialogTitle>Gestionar Roles - {permission.name}</DialogTitle>
                </DialogHeader>

                <div className="flex-1 overflow-y-auto space-y-4">
                    {/* Formulario para asignar nuevo rol */}
                    {!isSuperAdminPermission && (
                        <div className="space-y-2 p-4 border rounded-lg">
                            <label className="text-sm font-medium">Asignar nuevo rol</label>
                            <div className="flex gap-2">
                                <div className="flex-1">
                                    <RoleSearchSelect
                                        value={selectedRoleId}
                                        onChange={(id) => setSelectedRoleId(id)}
                                        placeholder="Seleccionar rol..."
                                        excludeRoleIds={assignedRoleIds}
                                        disabled={isAssigning}
                                    />
                                </div>
                                <Button
                                    onClick={handleAssign}
                                    disabled={!selectedRoleId || isAssigning}
                                >
                                    Asignar
                                </Button>
                            </div>
                        </div>
                    )}

                    {isSuperAdminPermission && (
                        <div className="p-3 bg-muted rounded-md text-sm text-muted-foreground">
                            Este es el permiso Super Administrador. Solo puede asignarse al rol SUPERADMIN.
                        </div>
                    )}

                    {/* Lista de roles asignados */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Roles asignados ({assignedRoles.length})</label>
                        {isLoading ? (
                            <div className="text-sm text-muted-foreground">Cargando...</div>
                        ) : assignedRoles.length === 0 ? (
                            <div className="text-sm text-muted-foreground">No hay roles asignados</div>
                        ) : (
                            <div className="space-y-2">
                                {assignedRoles.map((rp) => {
                                    const role = rp.role || allRoles.find(r => r.id === rp.roleId)
                                    const isSystemRole = role?.isSystem || role?.code === 'SUPERADMIN'

                                    return (
                                        <div
                                            key={rp.id}
                                            className="flex items-center justify-between p-3 border rounded-lg"
                                        >
                                            <div className="flex items-center gap-2">
                                                <UserCog className="h-4 w-4 text-muted-foreground" />
                                                <div>
                                                    <div className="flex items-center gap-2">
                                                        <span className="font-medium">
                                                            {role?.name || getRoleName(rp.roleId)}
                                                        </span>
                                                        {isSystemRole && (
                                                            <Badge variant="outline" className="text-xs">
                                                                Sistema
                                                            </Badge>
                                                        )}
                                                    </div>
                                                    <div className="text-sm text-muted-foreground">
                                                        {role?.code || getRoleCode(rp.roleId)}
                                                    </div>
                                                </div>
                                            </div>
                                            {!isSystemRole && (
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
                                    )
                                })}
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

