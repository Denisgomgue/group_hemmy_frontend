"use client"

import { Card } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ChevronDown, ChevronUp, Check, Settings2, Save } from "lucide-react"
import { useState, useMemo, useCallback, useEffect } from "react"
import { Role } from "@/types/role"
import { Permission } from "@/types/permission"

interface MatrixProps {
    roles: Role[]
    permissions: Permission[]
    rolePermissions: Record<number, number[]>
    onToggle: (roleId: number, permissionId: number) => void
    onSave?: (roleId: number, permissionIds: number[]) => Promise<void>
    onBulkAssign?: (role: Role) => void
    savingRoles?: Set<number>
}

export function RolePermissionsMatrix({
    roles,
    permissions,
    rolePermissions,
    onToggle,
    onSave,
    onBulkAssign,
    savingRoles = new Set(),
}: MatrixProps) {
    // Inicializar con roles colapsados por defecto
    const [ expandedRoles, setExpandedRoles ] = useState<Set<number>>(new Set())
    // Estado para expands de recursos dentro de cada rol
    const [ expandedResources, setExpandedResources ] = useState<Record<number, Set<string>>>({})
    // Estado local para cambios pendientes (no guardados)
    const [ pendingChanges, setPendingChanges ] = useState<Record<number, number[]>>({})

    // Sincronizar pendingChanges cuando cambien rolePermissions desde el servidor
    useEffect(() => {
        setPendingChanges(prev => {
            // Solo actualizar si no hay cambios pendientes para ese rol
            const updated = { ...prev }
            Object.keys(rolePermissions).forEach(roleIdStr => {
                const roleId = Number(roleIdStr)
                // Si no hay cambios pendientes, usar los del servidor
                if (!prev[ roleId ]) {
                    updated[ roleId ] = [ ...(rolePermissions[ roleId ] || []) ]
                }
            })
            return updated
        })
    }, [ rolePermissions ])

    // Filtrar roles del sistema (solo mostrar personalizados)
    const visibleRoles = roles.filter((r) => !r.isSystem)

    // Filtrar permiso wildcard
    const visiblePermissions = permissions.filter((p) => p.code !== "*")

    // Usar useCallback para mantener la referencia estable
    const toggleExpanded = useCallback((roleId: number) => {
        setExpandedRoles(prev => {
            const newExpanded = new Set(prev)
            if (newExpanded.has(roleId)) {
                newExpanded.delete(roleId)
            } else {
                newExpanded.add(roleId)
            }
            return newExpanded
        })
    }, [])

    // Toggle para recursos dentro de cada rol
    const toggleResourceExpanded = useCallback((roleId: number, resourceName: string) => {
        setExpandedResources(prev => {
            const roleResources = prev[ roleId ] || new Set<string>()
            const newRoleResources = new Set(roleResources)
            if (newRoleResources.has(resourceName)) {
                newRoleResources.delete(resourceName)
            } else {
                newRoleResources.add(resourceName)
            }
            return {
                ...prev,
                [ roleId ]: newRoleResources
            }
        })
    }, [])

    // Cuando se hace toggle en un permiso, mantener el rol expandido y actualizar estado local
    const handlePermissionToggle = useCallback((roleId: number, permissionId: number) => {
        // Asegurar que el rol y recurso estén expandidos
        setExpandedRoles(prev => {
            if (!prev.has(roleId)) {
                const newExpanded = new Set(prev)
                newExpanded.add(roleId)
                return newExpanded
            }
            return prev
        })

        // Actualizar solo el estado local (no guardar aún)
        setPendingChanges(prev => {
            const currentPerms = prev[ roleId ] || rolePermissions[ roleId ] || []
            const newPerms = currentPerms.includes(permissionId)
                ? currentPerms.filter(id => id !== permissionId)
                : [ ...currentPerms, permissionId ]

            return {
                ...prev,
                [ roleId ]: newPerms
            }
        })
    }, [ rolePermissions ])

    // Guardar cambios para un rol específico
    const handleSaveChanges = useCallback(async (roleId: number) => {
        if (!onSave) return

        const permissionIds = pendingChanges[ roleId ] || rolePermissions[ roleId ] || []
        await onSave(roleId, permissionIds)

        // Limpiar cambios pendientes para este rol después de guardar
        setPendingChanges(prev => {
            const updated = { ...prev }
            delete updated[ roleId ]
            return updated
        })
    }, [ onSave, pendingChanges, rolePermissions ])

    // Verificar si hay cambios pendientes para un rol
    const hasPendingChanges = useCallback((roleId: number) => {
        const current = rolePermissions[ roleId ] || []
        const pending = pendingChanges[ roleId ]
        if (!pending) return false

        if (current.length !== pending.length) return true
        return !current.every(id => pending.includes(id)) || !pending.every(id => current.includes(id))
    }, [ rolePermissions, pendingChanges ])

    // Agrupar permisos por recurso
    const groupedPermissions = useMemo(() => {
        return visiblePermissions.reduce(
            (acc, perm) => {
                const resourceName = perm.resource?.name || "Global"
                if (!acc[ resourceName ]) acc[ resourceName ] = []
                acc[ resourceName ].push(perm)
                return acc
            },
            {} as Record<string, Permission[]>
        )
    }, [ visiblePermissions ])

    const handleSelectAll = useCallback((roleId: number) => {
        // Asegurar que el rol esté expandido
        setExpandedRoles(prev => {
            if (!prev.has(roleId)) {
                const newExpanded = new Set(prev)
                newExpanded.add(roleId)
                return newExpanded
            }
            return prev
        })

        const currentPerms = pendingChanges[ roleId ] !== undefined
            ? (pendingChanges[ roleId ] || [])
            : (rolePermissions[ roleId ] || [])
        const allPermIds = visiblePermissions.map((p) => p.id)

        // Actualizar estado local
        setPendingChanges(prev => ({
            ...prev,
            [ roleId ]: allPermIds
        }))
    }, [ rolePermissions, pendingChanges, visiblePermissions ])

    const handleSelectNone = useCallback((roleId: number) => {
        // Asegurar que el rol esté expandido
        setExpandedRoles(prev => {
            if (!prev.has(roleId)) {
                const newExpanded = new Set(prev)
                newExpanded.add(roleId)
                return newExpanded
            }
            return prev
        })

        // Actualizar estado local
        setPendingChanges(prev => ({
            ...prev,
            [ roleId ]: []
        }))
    }, [])

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center p-4 bg-muted/50 rounded-lg">
                <div>
                    <h3 className="font-semibold text-foreground">Matriz de Asignación de Permisos</h3>
                    <p className="text-sm text-muted-foreground">Gestiona qué permisos tiene cada rol</p>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-4">
                {visibleRoles.length === 0 ? (
                    <Card className="p-8 text-center">
                        <p className="text-muted-foreground">No hay roles personalizados. Crea uno nuevo para empezar.</p>
                    </Card>
                ) : (
                    visibleRoles.map((role) => {
                        // Usar cambios pendientes si existen, sino usar los del servidor
                        const rolePerms = pendingChanges[ role.id ] !== undefined
                            ? (pendingChanges[ role.id ] || [])
                            : (rolePermissions[ role.id ] || [])
                        const totalPerms = visiblePermissions.length
                        const assignedCount = rolePerms.length
                        const percentageAssigned = totalPerms > 0 ? Math.round((assignedCount / totalPerms) * 100) : 0
                        const hasChanges = hasPendingChanges(role.id)
                        const isSaving = savingRoles.has(role.id)

                        return (
                            <Card key={role.id} className="overflow-hidden border">
                                <button
                                    onClick={() => toggleExpanded(role.id)}
                                    className="w-full p-4 flex items-center justify-between hover:bg-muted/50 transition-colors text-left"
                                >
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-3">
                                            <div>
                                                <h3 className="font-semibold text-foreground">{role.name}</h3>
                                                <p className="text-sm text-muted-foreground">{role.description || role.code}</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4 ml-4">
                                        <div className="text-right">
                                            <div className="flex items-center gap-2">
                                                <Badge variant="secondary">
                                                    {assignedCount} / {totalPerms}
                                                </Badge>
                                                <div className="w-24 bg-muted rounded-full h-2">
                                                    <div
                                                        className="bg-primary h-2 rounded-full transition-all"
                                                        style={{ width: `${percentageAssigned}%` }}
                                                    ></div>
                                                </div>
                                            </div>
                                        </div>
                                        {expandedRoles.has(role.id) ? (
                                            <ChevronUp size={20} className="text-muted-foreground" />
                                        ) : (
                                            <ChevronDown size={20} className="text-muted-foreground" />
                                        )}
                                    </div>
                                </button>

                                {expandedRoles.has(role.id) && (
                                    <div className="border-t border-border p-4 bg-muted/30">
                                        <div className="flex gap-2 mb-4 pb-4 border-b border-border">
                                            <Button size="sm" variant="outline" onClick={() => handleSelectAll(role.id)} className="text-xs">
                                                <Check size={14} className="mr-1" />
                                                Seleccionar todo
                                            </Button>
                                            <Button size="sm" variant="outline" onClick={() => handleSelectNone(role.id)} className="text-xs">
                                                Limpiar
                                            </Button>
                                            {onSave && (
                                                <Button
                                                    size="sm"
                                                    variant={hasChanges ? "default" : "outline"}
                                                    onClick={() => handleSaveChanges(role.id)}
                                                    disabled={isSaving || !hasChanges}
                                                    className="text-xs"
                                                >
                                                    <Save size={14} className="mr-1" />
                                                    {isSaving ? "Guardando..." : "Guardar cambios"}
                                                </Button>
                                            )}
                                            {onBulkAssign && (
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={() => onBulkAssign(role)}
                                                    className="text-xs ml-auto"
                                                >
                                                    <Settings2 size={14} className="mr-1" />
                                                    Asignación masiva
                                                </Button>
                                            )}
                                            {hasChanges && (
                                                <Badge variant="outline" className="text-xs bg-yellow-100 text-yellow-800 border-yellow-200 ml-auto">
                                                    Cambios sin guardar
                                                </Badge>
                                            )}
                                        </div>

                                        <div className="space-y-4">
                                            {Object.entries(groupedPermissions).map(([ resourceName, categoryPermissions ]) => {
                                                const roleResourceExpanded = expandedResources[ role.id ] || new Set<string>()
                                                const isResourceExpanded = roleResourceExpanded.has(resourceName)
                                                const assignedCount = categoryPermissions.filter((p) => rolePerms.includes(p.id)).length

                                                return (
                                                    <div key={resourceName} className="border border-border rounded-lg overflow-hidden">
                                                        <button
                                                            onClick={() => toggleResourceExpanded(role.id, resourceName)}
                                                            className="w-full p-3 flex items-center justify-between hover:bg-muted/50 transition-colors text-left bg-muted/30"
                                                        >
                                                            <div className="flex items-center gap-2">
                                                                <span className="font-medium text-foreground">{resourceName}</span>
                                                                <Badge variant="outline" className="text-xs">
                                                                    {assignedCount} / {categoryPermissions.length}
                                                                </Badge>
                                                            </div>
                                                            {isResourceExpanded ? (
                                                                <ChevronUp size={16} className="text-muted-foreground" />
                                                            ) : (
                                                                <ChevronDown size={16} className="text-muted-foreground" />
                                                            )}
                                                        </button>
                                                        {isResourceExpanded && (
                                                            <div className="p-3 bg-background">
                                                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                                                                    {categoryPermissions.map((permission) => {
                                                                        const isChecked = rolePerms.includes(permission.id)
                                                                        return (
                                                                            <div
                                                                                key={permission.id}
                                                                                className="flex items-start space-x-2 p-2 rounded hover:bg-muted/50 transition-colors group"
                                                                            >
                                                                                <Checkbox
                                                                                    id={`${role.id}-${permission.id}`}
                                                                                    checked={isChecked}
                                                                                    onCheckedChange={() => handlePermissionToggle(role.id, permission.id)}
                                                                                    className="mt-1"
                                                                                />
                                                                                <div className="flex-1 min-w-0">
                                                                                    <Label
                                                                                        htmlFor={`${role.id}-${permission.id}`}
                                                                                        className="text-sm font-medium cursor-pointer block"
                                                                                    >
                                                                                        {permission.name}
                                                                                    </Label>
                                                                                    <p className="text-xs text-muted-foreground group-hover:text-foreground transition-colors">
                                                                                        {permission.description || permission.code}
                                                                                    </p>
                                                                                </div>
                                                                            </div>
                                                                        )
                                                                    })}
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                )
                                            })}
                                        </div>
                                    </div>
                                )}
                            </Card>
                        )
                    })
                )}
            </div>
        </div>
    )
}

