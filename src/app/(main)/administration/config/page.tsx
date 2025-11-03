"use client"

import { useState, useEffect, useMemo } from "react"
import { useRole } from "@/hooks/use-role"
import { usePermission } from "@/hooks/use-permission"
import { useResource } from "@/hooks/use-resource"
import { ResourcesSection } from "./_components/resources-section"
import { PermissionsSection } from "./_components/permissions-section"
import { RolesSection } from "./_components/roles-section"
import { RolePermissionsMatrix } from "./_components/role-permissions-matrix"
import { BulkAssignModal } from "./_components/bulk-assign-modal"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card } from "@/components/ui/card"
import { MainContainer } from "@/components/layout/main-container"
import { HeaderActions } from "@/components/layout/header-actions"
import { ShieldCheck, UserCog, Package } from "lucide-react"
import { ResourceAPI } from "@/services/resource-api"
import { PermissionAPI } from "@/services/permissions-api"
import { RoleAPI } from "@/services/roles-api"
import { RolePermissionAPI } from "@/services/role-permission-api"
import { toast } from "sonner"

export default function ConfigPage() {
    const { resources, refreshResources, isLoading: isLoadingResources } = useResource()
    const { permissions, refreshPermissions, isLoading: isLoadingPermissions } = usePermission()
    const { roles, refreshRoles, isLoading: isLoadingRoles } = useRole()

    const [ rolePermissionsMap, setRolePermissionsMap ] = useState<Record<number, number[]>>({})
    const [ isLoadingRolePermissions, setIsLoadingRolePermissions ] = useState(false)

    const [ bulkEditRole, setBulkEditRole ] = useState<typeof roles[ 0 ] | null>(null)
    const [ bulkEditOpen, setBulkEditOpen ] = useState(false)
    const [ savingRoles, setSavingRoles ] = useState<Set<number>>(new Set())

    const isLoading = isLoadingResources || isLoadingPermissions || isLoadingRoles || isLoadingRolePermissions

    // Función para cargar role-permissions
    const loadRolePermissions = async () => {
        setIsLoadingRolePermissions(true)
        try {
            const allRolePermissions = await RolePermissionAPI.getAll()
            console.log("RolePermissions cargados desde API:", allRolePermissions)

            const map: Record<number, number[]> = {}
            allRolePermissions.forEach((rp) => {
                // Manejar tanto si viene roleId/permissionId directo como si viene en las relaciones
                const roleId = rp.roleId || rp.role?.id
                const permissionId = rp.permissionId || rp.permission?.id

                if (roleId && permissionId) {
                    if (!map[ roleId ]) map[ roleId ] = []
                    if (!map[ roleId ].includes(permissionId)) {
                        map[ roleId ].push(permissionId)
                    }
                }
            })
            console.log("Mapa de role-permissions construido:", map)
            setRolePermissionsMap(map)
        } catch (error) {
            console.error("Error loading role permissions:", error)
            toast.error("Error al cargar asignaciones de permisos")
        } finally {
            setIsLoadingRolePermissions(false)
        }
    }

    // Cargar role-permissions al montar y cuando cambien roles o permisos
    useEffect(() => {
        if (roles.length > 0 && permissions.length > 0) {
            loadRolePermissions()
        }
    }, [ roles.length, permissions.length ])

    // Handlers para recursos
    const handleAddResource = async (data: {
        routeCode: string
        name: string
        description?: string
        isActive: boolean
        orderIndex: number
    }) => {
        try {
            await ResourceAPI.create(data)
            toast.success("Recurso creado correctamente")
            await refreshResources()
        } catch (error: any) {
            toast.error(error?.response?.data?.message || "Error al crear el recurso")
        }
    }

    const handleUpdateResource = async (
        id: number,
        data: { routeCode: string; name: string; description?: string; isActive: boolean; orderIndex: number }
    ) => {
        try {
            await ResourceAPI.update(id, data)
            toast.success("Recurso actualizado correctamente")
            await refreshResources()
        } catch (error: any) {
            toast.error(error?.response?.data?.message || "Error al actualizar el recurso")
        }
    }

    const handleDeleteResource = async (id: number) => {
        try {
            await ResourceAPI.delete(id)
            toast.success("Recurso eliminado correctamente")
            await refreshResources()
        } catch (error: any) {
            toast.error(error?.response?.data?.message || "Error al eliminar el recurso")
        }
    }

    // Handlers para permisos
    const handleAddPermission = async (data: {
        code: string
        name: string
        description?: string
        resourceId?: number
    }) => {
        try {
            await PermissionAPI.create(data)
            toast.success("Permiso creado correctamente")
            await refreshPermissions()
            // Recargar role-permissions por si hay cambios
            if (roles.length > 0) {
                await loadRolePermissions()
            }
        } catch (error: any) {
            toast.error(error?.response?.data?.message || "Error al crear el permiso")
        }
    }

    const handleUpdatePermission = async (
        id: number,
        data: { code: string; name: string; description?: string; resourceId?: number }
    ) => {
        try {
            await PermissionAPI.update(id, data)
            toast.success("Permiso actualizado correctamente")
            await refreshPermissions()
            // Recargar role-permissions por si hay cambios
            if (roles.length > 0) {
                await loadRolePermissions()
            }
        } catch (error: any) {
            toast.error(error?.response?.data?.message || "Error al actualizar el permiso")
        }
    }

    const handleDeletePermission = async (id: number) => {
        try {
            await PermissionAPI.delete(id)
            toast.success("Permiso eliminado correctamente")
            await refreshPermissions()
            // Recargar role-permissions para actualizar referencias
            if (roles.length > 0) {
                await loadRolePermissions()
            }
        } catch (error: any) {
            toast.error(error?.response?.data?.message || "Error al eliminar el permiso")
        }
    }

    // Handlers para roles
    const handleAddRole = async (data: { code: string; name: string; description?: string }) => {
        try {
            await RoleAPI.create(data)
            toast.success("Rol creado correctamente")
            await refreshRoles()
            // Recargar role-permissions para actualizar referencias
            if (permissions.length > 0) {
                await loadRolePermissions()
            }
        } catch (error: any) {
            toast.error(error?.response?.data?.message || "Error al crear el rol")
        }
    }

    const handleUpdateRole = async (id: number, data: { code: string; name: string; description?: string }) => {
        try {
            await RoleAPI.update(id, data)
            toast.success("Rol actualizado correctamente")
            await refreshRoles()
            // Recargar role-permissions por si hay cambios
            if (permissions.length > 0) {
                await loadRolePermissions()
            }
        } catch (error: any) {
            toast.error(error?.response?.data?.message || "Error al actualizar el rol")
        }
    }

    const handleDeleteRole = async (id: number) => {
        try {
            await RoleAPI.delete(id)
            toast.success("Rol eliminado correctamente")
            await refreshRoles()
            // Recargar role-permissions para actualizar referencias
            if (permissions.length > 0) {
                await loadRolePermissions()
            }
        } catch (error: any) {
            toast.error(error?.response?.data?.message || "Error al eliminar el rol")
        }
    }

    // Función para recargar role-permissions
    const reloadRolePermissions = async () => {
        setIsLoadingRolePermissions(true)
        try {
            const allRolePermissions = await RolePermissionAPI.getAll()
            const map: Record<number, number[]> = {}
            allRolePermissions.forEach((rp) => {
                if (!map[ rp.roleId ]) map[ rp.roleId ] = []
                map[ rp.roleId ].push(rp.permissionId)
            })
            setRolePermissionsMap(map)
        } catch (error) {
            console.error("Error loading role permissions:", error)
            toast.error("Error al cargar asignaciones de permisos")
        } finally {
            setIsLoadingRolePermissions(false)
        }
    }

    // Handler para toggle de permisos en matriz (ya no se usa, mantenido por compatibilidad)
    const handleToggleRolePermission = async (roleId: number, permissionId: number) => {
        // Esta función ya no hace nada, los cambios se guardan con handleSaveRolePermissions
    }

    // Handler para guardar cambios de un rol específico
    const handleSaveRolePermissions = async (roleId: number, permissionIds: number[]) => {
        setSavingRoles(prev => new Set(prev).add(roleId))
        try {
            // Obtener permisos actuales del servidor
            const currentRolePermissions = await RolePermissionAPI.getByRoleId(roleId)
            const currentPermissionIds = currentRolePermissions.map((rp) => rp.permissionId)

            // Permisos a agregar
            const toAdd = permissionIds.filter((id) => !currentPermissionIds.includes(id))
            // Permisos a eliminar
            const toRemove = currentPermissionIds.filter((id) => !permissionIds.includes(id))

            // Agregar nuevos
            for (const permId of toAdd) {
                try {
                    await RolePermissionAPI.create({ roleId, permissionId: permId })
                } catch (error: any) {
                    // Si ya existe, ignorar el error
                    if (!error?.response?.data?.message?.includes("ya está asignado")) {
                        throw error
                    }
                }
            }

            // Eliminar removidos
            for (const permId of toRemove) {
                const toDelete = currentRolePermissions.find((rp) => rp.permissionId === permId)
                if (toDelete) {
                    await RolePermissionAPI.delete(toDelete.id)
                }
            }

            // Recargar desde el servidor para asegurar sincronización
            await loadRolePermissions()
            toast.success(`Permisos del rol guardados correctamente`)
        } catch (error: any) {
            const errorMessage = error?.response?.data?.message || "Error al guardar los permisos"
            toast.error(errorMessage)
            // Recargar estado en caso de error
            await loadRolePermissions()
        } finally {
            setSavingRoles(prev => {
                const newSet = new Set(prev)
                newSet.delete(roleId)
                return newSet
            })
        }
    }

    // Handler para asignación masiva
    const handleBulkAssignPermissions = async (roleId: number, permissionIds: number[]) => {
        try {
            // Obtener permisos actuales
            const currentRolePermissions = await RolePermissionAPI.getByRoleId(roleId)
            const currentPermissionIds = currentRolePermissions.map((rp) => rp.permissionId)

            // Permisos a agregar
            const toAdd = permissionIds.filter((id) => !currentPermissionIds.includes(id))
            // Permisos a eliminar
            const toRemove = currentPermissionIds.filter((id) => !permissionIds.includes(id))

            // Agregar nuevos
            for (const permId of toAdd) {
                try {
                    await RolePermissionAPI.create({ roleId, permissionId: permId })
                } catch (error: any) {
                    // Si ya existe, ignorar el error
                    if (!error?.response?.data?.message?.includes("ya está asignado")) {
                        throw error
                    }
                }
            }

            // Eliminar removidos
            for (const permId of toRemove) {
                const toDelete = currentRolePermissions.find((rp) => rp.permissionId === permId)
                if (toDelete) {
                    await RolePermissionAPI.delete(toDelete.id)
                }
            }

            // Recargar desde el servidor para asegurar sincronización
            await loadRolePermissions()
            toast.success("Permisos actualizados correctamente")
        } catch (error: any) {
            toast.error(error?.response?.data?.message || "Error al actualizar permisos")
            // Recargar estado en caso de error
            await loadRolePermissions()
        }
    }

    if (isLoading) {
        return (
            <MainContainer>
                <div className="min-h-screen bg-gradient-to-br from-background to-muted p-6 flex items-center justify-center">
                    <div className="text-center">
                        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                        <p className="text-foreground mt-4">Cargando datos...</p>
                    </div>
                </div>
            </MainContainer>
        )
    }

    return (
        <MainContainer>
            <HeaderActions title="Configuración del Sistema">
                <div className="text-sm text-muted-foreground">
                    Gestiona recursos, permisos y roles del sistema
                </div>
            </HeaderActions>

            <div className="min-h-screen bg-gradient-to-br from-background to-muted">
                <div className="mx-auto">
                    <Tabs defaultValue="matrix" className="w-full">
                        <TabsList className="grid w-full grid-cols-4 mb-6">
                            <TabsTrigger value="matrix" className="gap-2">
                                <ShieldCheck className="h-4 w-4" />
                                Matriz
                            </TabsTrigger>
                            <TabsTrigger value="resources" className="gap-2">
                                <Package className="h-4 w-4" />
                                Recursos
                            </TabsTrigger>
                            <TabsTrigger value="permissions" className="gap-2">
                                <ShieldCheck className="h-4 w-4" />
                                Permisos
                            </TabsTrigger>
                            <TabsTrigger value="roles" className="gap-2">
                                <UserCog className="h-4 w-4" />
                                Roles
                            </TabsTrigger>
                        </TabsList>

                        <TabsContent value="matrix">
                            <Card className="p-6">
                                <RolePermissionsMatrix
                                    roles={roles}
                                    permissions={permissions}
                                    rolePermissions={rolePermissionsMap}
                                    onToggle={handleToggleRolePermission}
                                    onSave={handleSaveRolePermissions}
                                    savingRoles={savingRoles}
                                    onBulkAssign={(role) => {
                                        setBulkEditRole(role)
                                        setBulkEditOpen(true)
                                    }}
                                />
                            </Card>
                        </TabsContent>

                        <TabsContent value="resources">
                            <ResourcesSection
                                resources={resources}
                                onAdd={handleAddResource}
                                onUpdate={handleUpdateResource}
                                onDelete={handleDeleteResource}
                            />
                        </TabsContent>

                        <TabsContent value="permissions">
                            <PermissionsSection
                                permissions={permissions}
                                onAdd={handleAddPermission}
                                onUpdate={handleUpdatePermission}
                                onDelete={handleDeletePermission}
                            />
                        </TabsContent>

                        <TabsContent value="roles">
                            <RolesSection
                                roles={roles}
                                onAdd={handleAddRole}
                                onUpdate={handleUpdateRole}
                                onDelete={handleDeleteRole}
                            />
                        </TabsContent>
                    </Tabs>
                </div>
            </div>

            <BulkAssignModal
                open={bulkEditOpen}
                onOpenChange={setBulkEditOpen}
                role={bulkEditRole}
                permissions={permissions}
                assignedPermissions={bulkEditRole ? rolePermissionsMap[ bulkEditRole.id ] || [] : []}
                onSubmit={(permIds) => {
                    if (bulkEditRole) {
                        handleBulkAssignPermissions(bulkEditRole.id, permIds)
                        setBulkEditOpen(false)
                    }
                }}
            />
        </MainContainer>
    )
}

