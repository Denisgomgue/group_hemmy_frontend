"use client"

import { useState, useEffect, useMemo, useRef } from "react"
import Can from "@/components/permission/can"
import { columns } from "./_components/columns"
import { ResponsiveTable } from "@/components/dataTable/responsive-table"
import { useRole } from "@/hooks/use-role"
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { RoleForm, RoleFormRef } from "./_components/role-form"
import { toast } from "sonner"
import { headers } from "./_components/headers"
import { ActionsCell } from "./_components/actions-cell"
import { Role } from "@/types/role"
import { ViewModeSwitcher } from "@/components/dataTable/view-mode-switcher"
import { PaginatedCards } from "@/components/dataTable/paginated-cards"
import { RoleCard } from "./_components/role-card"
import { List, LayoutGrid } from "lucide-react"
import { MainContainer } from "@/components/layout/main-container"
import { HeaderActions } from "@/components/layout/header-actions"
import { ReloadButton } from "@/components/layout/reload-button"
import { AddButton } from "@/components/layout/add-button"
import { TableToolbar } from "@/components/dataTable/table-toolbar"
import { Button } from "@/components/ui/button"
import { RoleAPI } from "@/services/roles-api"

export default function RolesPage() {
    const { roles, refreshRoles, isLoading } = useRole()
    const [ isDialogOpen, setIsDialogOpen ] = useState(false)
    const [ currentPage, setCurrentPage ] = useState(1)
    const [ pageSize, setPageSize ] = useState(10)
    const [ viewMode, setViewMode ] = useState<"table" | "grid">("table")
    const [ isSubmitting, setIsSubmitting ] = useState(false)
    const [ searchTerm, setSearchTerm ] = useState("")
    const roleFormRef = useRef<RoleFormRef>(null)

    // Filtrar roles según término de búsqueda
    const filteredRoles = useMemo(() => {
        if (!searchTerm.trim()) {
            return roles
        }

        const searchLower = searchTerm.toLowerCase().trim()
        return roles.filter(
            (role: Role) =>
                role.code.toLowerCase().includes(searchLower) ||
                role.name.toLowerCase().includes(searchLower) ||
                (role.description &&
                    role.description.toLowerCase().includes(searchLower))
        )
    }, [ roles, searchTerm ])

    // Paginar los datos filtrados
    const paginatedRoles = useMemo(() => {
        const start = (currentPage - 1) * pageSize
        const end = start + pageSize
        return filteredRoles.slice(start, end)
    }, [ filteredRoles, currentPage, pageSize ])

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

    const handleCreateRole = async (data: any) => {
        setIsSubmitting(true)
        try {
            await RoleAPI.create(data)
            toast.success("Rol creado correctamente")
            setIsDialogOpen(false)
            await refreshRoles()
        } catch (error: any) {
            const errorMessage =
                error?.response?.data?.message || error?.message || "Error al crear el rol"
            toast.error(errorMessage)
            console.error("Error creating role:", error)
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleReload = async () => {
        await refreshRoles()
        toast.success("Roles actualizados")
    }

    return (
        <MainContainer>
            <HeaderActions title="Gestión de Roles">
                <div className="flex items-center gap-4">
                    <ReloadButton onClick={handleReload} isLoading={isLoading} />
                    <Can action="create" subject="Role">
                        <AddButton onClick={() => setIsDialogOpen(true)}>
                            Nuevo Rol
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
                        data={paginatedRoles}
                        columns={columns}
                        headers={headers}
                        isLoading={isLoading}
                        pagination={{
                            totalRecords: filteredRoles.length,
                            pageSize: pageSize,
                            onPaginationChange: handlePaginationChange,
                            currentPage: currentPage
                        }}
                        actions={(row: Role) => <ActionsCell rowData={row} />}
                    />
                ) : (
                    <PaginatedCards
                        data={paginatedRoles}
                        totalRecords={filteredRoles.length}
                        pageSize={pageSize}
                        onPaginationChange={handlePaginationChange}
                        renderCard={(role: Role) => (
                            <RoleCard key={role.id} role={role} />
                        )}
                        isLoading={isLoading}
                    />
                )}

                {!isLoading && filteredRoles.length === 0 && (
                    <div className="text-center py-12">
                        <p className="text-muted-foreground">
                            {searchTerm ? "No se encontraron roles que coincidan con la búsqueda." : "No hay roles registrados."}
                        </p>
                    </div>
                )}
            </div>

            {/* Dialog para crear */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="sm:max-w-[600px]">
                    <DialogHeader>
                        <DialogTitle>Nuevo Rol</DialogTitle>
                    </DialogHeader>
                    <RoleForm
                        ref={roleFormRef}
                        role={null}
                        onSubmit={handleCreateRole}
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
                                roleFormRef.current?.submit()
                            }}
                            disabled={isSubmitting || roleFormRef.current?.isSubmitting}
                        >
                            {isSubmitting ? "Creando..." : "Crear"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </MainContainer>
    )
}
