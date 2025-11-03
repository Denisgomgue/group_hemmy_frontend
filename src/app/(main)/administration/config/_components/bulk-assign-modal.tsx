"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Role } from "@/types/role"
import { Permission } from "@/types/permission"

interface BulkAssignModalProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    role: Role | null
    permissions: Permission[]
    assignedPermissions: number[]
    onSubmit: (permissionIds: number[]) => void
}

export function BulkAssignModal({
    open,
    onOpenChange,
    role,
    permissions,
    assignedPermissions,
    onSubmit,
}: BulkAssignModalProps) {
    const [ selected, setSelected ] = useState<Set<number>>(new Set())

    // Filtrar permiso wildcard
    const visiblePermissions = permissions.filter((p) => p.code !== "*")

    useEffect(() => {
        setSelected(new Set(assignedPermissions))
    }, [ assignedPermissions, open ])

    const handleToggle = (permissionId: number) => {
        const newSelected = new Set(selected)
        if (newSelected.has(permissionId)) {
            newSelected.delete(permissionId)
        } else {
            newSelected.add(permissionId)
        }
        setSelected(newSelected)
    }

    const handleSelectAll = () => {
        setSelected(new Set(visiblePermissions.map((p) => p.id)))
    }

    const handleSelectNone = () => {
        setSelected(new Set())
    }

    const handleSubmit = () => {
        onSubmit(Array.from(selected))
        onOpenChange(false)
    }

    // Agrupar permisos por recurso
    const groupedPermissions = visiblePermissions.reduce(
        (acc, perm) => {
            const resourceName = perm.resource?.name || "Global"
            if (!acc[ resourceName ]) acc[ resourceName ] = []
            acc[ resourceName ].push(perm)
            return acc
        },
        {} as Record<string, Permission[]>
    )

    if (!role) return null

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl max-h-[80vh]">
                <DialogHeader>
                    <DialogTitle>Asignar Permisos a Rol</DialogTitle>
                    <DialogDescription>
                        Gestiona los permisos para el rol: <strong>{role.name}</strong>
                    </DialogDescription>
                </DialogHeader>

                <div className="flex items-center justify-between gap-2 p-3 bg-muted/50 rounded-lg text-sm">
                    <span className="text-foreground">
                        {selected.size} de {visiblePermissions.length} permisos seleccionados
                    </span>
                    <div className="flex gap-2">
                        <Button size="sm" variant="outline" onClick={handleSelectAll} className="text-xs bg-transparent">
                            Todos
                        </Button>
                        <Button size="sm" variant="outline" onClick={handleSelectNone} className="text-xs bg-transparent">
                            Ninguno
                        </Button>
                    </div>
                </div>

                <div className="h-[400px] border rounded-lg p-4 overflow-y-auto">
                    <Tabs defaultValue={Object.keys(groupedPermissions)[ 0 ]} className="w-full">
                        <TabsList className="grid w-full grid-cols-4">
                            {Object.entries(groupedPermissions).map(([ resourceName, perms ]) => (
                                <TabsTrigger key={resourceName} value={resourceName} className="text-xs">
                                    <span>{resourceName}</span>
                                    <Badge variant="outline" className="ml-1 text-xs">
                                        {perms.filter((p) => selected.has(p.id)).length}/{perms.length}
                                    </Badge>
                                </TabsTrigger>
                            ))}
                        </TabsList>

                        {Object.entries(groupedPermissions).map(([ resourceName, categoryPerms ]) => (
                            <TabsContent key={resourceName} value={resourceName} className="space-y-3">
                                {categoryPerms.map((permission) => (
                                    <div
                                        key={permission.id}
                                        className="flex items-start space-x-2 p-2 rounded hover:bg-muted/50 transition-colors"
                                    >
                                        <Checkbox
                                            id={`bulk-${permission.id}`}
                                            checked={selected.has(permission.id)}
                                            onCheckedChange={() => handleToggle(permission.id)}
                                            className="mt-1"
                                        />
                                        <div className="flex-1">
                                            <Label htmlFor={`bulk-${permission.id}`} className="text-sm font-medium cursor-pointer">
                                                {permission.name}
                                            </Label>
                                            <p className="text-xs text-muted-foreground">{permission.description || permission.code}</p>
                                        </div>
                                    </div>
                                ))}
                            </TabsContent>
                        ))}
                    </Tabs>
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)}>
                        Cancelar
                    </Button>
                    <Button onClick={handleSubmit}>Guardar Permisos</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

