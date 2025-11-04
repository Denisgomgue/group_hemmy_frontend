"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { RoleAPI } from "@/services/roles-api"
import { UserRoleAPI } from "@/services/user-role-api"
import { Role } from "@/types/role"
import { UserRole } from "@/services/user-role-api"
import { User } from "@/types/user"
import { toast } from "sonner"
import { Loader2 } from "lucide-react"

interface AssignRolesModalProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    user: User
    onSuccess?: () => void
}

export function AssignRolesModal({ open, onOpenChange, user, onSuccess }: AssignRolesModalProps) {
    const [ allRoles, setAllRoles ] = useState<Role[]>([])
    const [ userRoles, setUserRoles ] = useState<UserRole[]>([])
    const [ selectedRoleIds, setSelectedRoleIds ] = useState<Set<number>>(new Set())
    const [ isLoadingRoles, setIsLoadingRoles ] = useState(false)
    const [ isLoadingUserRoles, setIsLoadingUserRoles ] = useState(false)
    const [ isSaving, setIsSaving ] = useState(false)

    // Cargar todos los roles disponibles
    useEffect(() => {
        if (open) {
            loadRoles()
            loadUserRoles()
        }
    }, [ open, user.id ])

    // Actualizar selección cuando cambian los roles del usuario
    useEffect(() => {
        // Asegurar que extraemos roleId correctamente (puede venir de role.id o directamente)
        const currentRoleIds = userRoles
            .map(ur => ur.roleId || ur.role?.id)
            .filter((id): id is number => id !== undefined && id !== null)

        setSelectedRoleIds(new Set(currentRoleIds))
    }, [ userRoles ])

    const loadRoles = async () => {
        setIsLoadingRoles(true)
        try {
            const roles = await RoleAPI.getAll()
            // Filtrar el rol SUPERADMIN si no debe ser asignable
            const filteredRoles = roles.filter(role => role.code !== 'SUPERADMIN')
            setAllRoles(filteredRoles)
        } catch (error) {
            console.error("Error cargando roles:", error)
            toast.error("Error al cargar los roles")
        } finally {
            setIsLoadingRoles(false)
        }
    }

    const loadUserRoles = async () => {
        setIsLoadingUserRoles(true)
        try {
            const userRolesData = await UserRoleAPI.getAll(user.id)
            setUserRoles(userRolesData)
        } catch (error) {
            console.error("Error cargando roles del usuario:", error)
            toast.error("Error al cargar los roles del usuario")
        } finally {
            setIsLoadingUserRoles(false)
        }
    }

    const handleRoleToggle = (roleId: number) => {
        const newSelected = new Set(selectedRoleIds)
        if (newSelected.has(roleId)) {
            newSelected.delete(roleId)
        } else {
            newSelected.add(roleId)
        }
        setSelectedRoleIds(newSelected)
    }

    const handleSave = async () => {
        setIsSaving(true)
        try {
            const currentRoleIds = new Set(userRoles.map(ur => ur.roleId))
            const rolesToAdd: number[] = []
            const rolesToRemove: UserRole[] = []

            // Identificar roles a agregar
            selectedRoleIds.forEach(roleId => {
                if (!currentRoleIds.has(roleId)) {
                    rolesToAdd.push(roleId)
                }
            })

            // Identificar roles a quitar
            userRoles.forEach(userRole => {
                if (!selectedRoleIds.has(userRole.roleId)) {
                    rolesToRemove.push(userRole)
                }
            })

            // Agregar nuevos roles
            for (const roleId of rolesToAdd) {
                try {
                    await UserRoleAPI.create({
                        UserId: user.id,
                        roleId: roleId,
                    })
                } catch (error: any) {
                    // Si el error es porque ya tiene el rol, lo ignoramos
                    if (error?.response?.status !== 403) {
                        throw error
                    }
                }
            }

            // Quitar roles desmarcados
            for (const userRole of rolesToRemove) {
                try {
                    await UserRoleAPI.delete(userRole.id)
                } catch (error: any) {
                    // Si no se puede eliminar (por ejemplo, SUPERADMIN), continuamos
                    if (error?.response?.status === 403) {
                        console.warn(`No se pudo eliminar el rol ${userRole.roleId}:`, error.response?.data?.message)
                    } else {
                        throw error
                    }
                }
            }

            const displayName = user.actor?.displayName ||
                (user.actor?.person
                    ? `${user.actor.person.firstName} ${user.actor.person.lastName}`.trim()
                    : user.actor?.organization?.name) ||
                'Usuario'

            toast.success(`Roles asignados correctamente al usuario ${displayName}`)
            onOpenChange(false)
            if (onSuccess) {
                onSuccess()
            }
        } catch (error: any) {
            console.error("Error asignando roles:", error)
            const errorMessage = error?.response?.data?.message || "No se pudieron asignar los roles. Por favor, inténtalo de nuevo."
            toast.error(errorMessage)
        } finally {
            setIsSaving(false)
        }
    }

    const displayName = user.actor?.displayName ||
        (user.actor?.person
            ? `${user.actor.person.firstName} ${user.actor.person.lastName}`.trim()
            : user.actor?.organization?.name) ||
        'Usuario'

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Asignar Roles a {displayName}</DialogTitle>
                </DialogHeader>

                {(isLoadingRoles || isLoadingUserRoles) ? (
                    <div className="flex items-center justify-center py-8">
                        <Loader2 className="h-6 w-6 animate-spin" />
                        <span className="ml-2">Cargando roles...</span>
                    </div>
                ) : (
                    <div className="space-y-4 py-4">
                        {allRoles.length === 0 ? (
                            <p className="text-sm text-muted-foreground text-center py-4">
                                No hay roles disponibles
                            </p>
                        ) : (
                            <div className="space-y-3">
                                {allRoles.map((role) => {
                                    const isSelected = selectedRoleIds.has(role.id)
                                    return (
                                        <div
                                            key={role.id}
                                            className="flex items-start space-x-3 p-3 rounded-lg border hover:bg-accent/50 transition-colors"
                                        >
                                            <Checkbox
                                                id={`role-${role.id}`}
                                                checked={isSelected}
                                                onCheckedChange={() => handleRoleToggle(role.id)}
                                                className="mt-1"
                                            />
                                            <div className="flex-1 space-y-1">
                                                <label
                                                    htmlFor={`role-${role.id}`}
                                                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                                                >
                                                    {role.name}
                                                </label>
                                                <div className="flex items-center gap-2">
                                                    <Badge variant="outline" className="text-xs">
                                                        {role.code}
                                                    </Badge>
                                                    {role.isSystem && (
                                                        <Badge variant="secondary" className="text-xs">
                                                            Sistema
                                                        </Badge>
                                                    )}
                                                    {role.description && (
                                                        <span className="text-xs text-muted-foreground">
                                                            {role.description}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        )}
                    </div>
                )}

                <DialogFooter>
                    <Button
                        variant="outline"
                        onClick={() => onOpenChange(false)}
                        disabled={isSaving}
                    >
                        Cancelar
                    </Button>
                    <Button
                        onClick={handleSave}
                        disabled={isSaving || isLoadingRoles || isLoadingUserRoles}
                    >
                        {isSaving ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Guardando...
                            </>
                        ) : (
                            "Guardar Cambios"
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

