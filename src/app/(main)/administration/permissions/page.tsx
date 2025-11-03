"use client"

import { useState, useEffect, useMemo, useRef } from "react"
import Can from "@/components/permission/can"
import { columns } from "./_components/columns"
import { ResponsiveTable } from "@/components/dataTable/responsive-table"
import { usePermission } from "@/hooks/use-permission"
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { PermissionForm, PermissionFormRef } from "./_components/permission-form"
import { toast } from "sonner"
import { headers } from "./_components/headers"
import { ActionsCell } from "./_components/actions-cell"
import { Permission } from "@/types/permission"
import { ViewModeSwitcher } from "@/components/dataTable/view-mode-switcher"
import { PaginatedCards } from "@/components/dataTable/paginated-cards"
import { PermissionCard } from "./_components/permission-card"
import { List, LayoutGrid } from "lucide-react"
import { MainContainer } from "@/components/layout/main-container"
import { HeaderActions } from "@/components/layout/header-actions"
import { ReloadButton } from "@/components/layout/reload-button"
import { AddButton } from "@/components/layout/add-button"
import { TableToolbar } from "@/components/dataTable/table-toolbar"
import { Button } from "@/components/ui/button"
import { PermissionAPI } from "@/services/permissions-api"

export default function PermissionsPage() {
    const { permissions, refreshPermissions, isLoading } = usePermission()
    const [ isDialogOpen, setIsDialogOpen ] = useState(false)
    const [ currentPage, setCurrentPage ] = useState(1)
    const [ pageSize, setPageSize ] = useState(10)
    const [ viewMode, setViewMode ] = useState<"table" | "grid">("table")
    const [ isSubmitting, setIsSubmitting ] = useState(false)
    const [ searchTerm, setSearchTerm ] = useState("")
    const permissionFormRef = useRef<PermissionFormRef>(null)

    // Filtrar permisos según término de búsqueda y ocultar permiso superadmin (*)
    const filteredPermissions = useMemo(() => {
        // Filtrar primero el permiso superadmin
        let filtered = permissions.filter((permission: Permission) => permission.code !== '*')

        // Luego aplicar el filtro de búsqueda si existe
        if (searchTerm.trim()) {
            const searchLower = searchTerm.toLowerCase().trim()
            filtered = filtered.filter(
                (permission: Permission) =>
                    permission.code.toLowerCase().includes(searchLower) ||
                    permission.name.toLowerCase().includes(searchLower) ||
                    (permission.description &&
                        permission.description.toLowerCase().includes(searchLower))
            )
        }

        return filtered
    }, [ permissions, searchTerm ])

    // Paginar los datos filtrados
    const paginatedPermissions = useMemo(() => {
        const start = (currentPage - 1) * pageSize
        const end = start + pageSize
        return filteredPermissions.slice(start, end)
    }, [ filteredPermissions, currentPage, pageSize ])

    // Resetear a página 1 cuando cambia el término de búsqueda
    useEffect(() => {
        setCurrentPage(1)
    }, [ searchTerm ])

    const handlePaginationChange = (page: number, newPageSize: number) => {
        setCurrentPage(page)
        if (newPageSize !== pageSize) {
            setPageSize(newPageSize)
            setCurrentPage(1)
        }
    }

    const handleCreatePermission = async (data: any) => {
        setIsSubmitting(true)
        try {
            await PermissionAPI.create(data)
            toast.success("Permiso creado correctamente")
            setIsDialogOpen(false)
            await refreshPermissions()
        } catch (error: any) {
            const errorMessage =
                error?.response?.data?.message || error?.message || "Error al crear el permiso"
            toast.error(errorMessage)
            console.error("Error creating permission:", error)
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleReload = async () => {
        await refreshPermissions()
        toast.success("Permisos actualizados")
    }

    return (
        <MainContainer>
            <HeaderActions title="Gestión de Permisos">
                <div className="flex items-center gap-4">
                    <ReloadButton onClick={handleReload} isLoading={isLoading} />
                    <Can action="create" subject="Permission">
                        <AddButton onClick={() => setIsDialogOpen(true)}>
                            Nuevo Permiso
                        </AddButton>
                    </Can>
                    <ViewModeSwitcher
                        viewMode={viewMode}
                        setViewMode={(mode: string) => setViewMode(mode as "table" | "grid")}
                        modes={[
                            { value: "table", icon: <List className="h-4 w-4" />, label: "Tabla" },
                            { value: "grid", icon: <LayoutGrid className="h-4 w-4" />, label: "Cuadrícula" },
                        ]}
                    />
                </div>
            </HeaderActions>

            <div className="space-y-4">
                <TableToolbar
                    value={searchTerm}
                    onValueChange={setSearchTerm}
                    searchPlaceholder="Buscar por código, nombre o descripción..."
                    onSearch={(value) => setSearchTerm(value)}
                />

                {viewMode === "table" ? (
                    <ResponsiveTable
                        data={paginatedPermissions}
                        columns={columns}
                        headers={headers}
                        isLoading={isLoading}
                        pagination={{
                            totalRecords: filteredPermissions.length,
                            pageSize: pageSize,
                            onPaginationChange: handlePaginationChange,
                            currentPage: currentPage
                        }}
                        actions={(row: Permission) => <ActionsCell rowData={row} />}
                    />
                ) : (
                    <PaginatedCards
                        data={paginatedPermissions}
                        totalRecords={filteredPermissions.length}
                        pageSize={pageSize}
                        onPaginationChange={handlePaginationChange}
                        renderCard={(permission: Permission) => (
                            <PermissionCard key={permission.id} permission={permission} />
                        )}
                        isLoading={isLoading}
                    />
                )}

                {!isLoading && filteredPermissions.length === 0 && (
                    <div className="text-center py-12">
                        <p className="text-muted-foreground">
                            {searchTerm ? "No se encontraron permisos que coincidan con la búsqueda." : "No hay permisos registrados."}
                        </p>
                    </div>
                )}
            </div>

            {/* Dialog para crear */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="sm:max-w-[600px]">
                    <DialogHeader>
                        <DialogTitle>Nuevo Permiso</DialogTitle>
                    </DialogHeader>
                    <PermissionForm
                        ref={permissionFormRef}
                        permission={null}
                        onSubmit={handleCreatePermission}
                        onCancel={() => setIsDialogOpen(false)}
                    />
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setIsDialogOpen(false)}
                            disabled={isSubmitting}
                        >
                            Cancelar
                        </Button>
                        <Button
                            variant="default"
                            onClick={() => {
                                permissionFormRef.current?.submit()
                            }}
                            disabled={isSubmitting || permissionFormRef.current?.isSubmitting}
                        >
                            {isSubmitting ? "Creando..." : "Crear"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </MainContainer>
    )
}
