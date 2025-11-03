"use client"

import { useState, useEffect, useMemo, useRef } from "react"
import Can from "@/components/permission/can"
import { columns } from "./_components/columns"
import { ResponsiveTable } from "@/components/dataTable/responsive-table"
import { useResource } from "@/hooks/use-resource"
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { ResourceForm, ResourceFormRef } from "./_components/resource-form"
import { toast } from "sonner"
import { headers } from "./_components/headers"
import { ActionsCell } from "./_components/actions-cell"
import { Resource } from "@/types/resource"
import { ViewModeSwitcher } from "@/components/dataTable/view-mode-switcher"
import { PaginatedCards } from "@/components/dataTable/paginated-cards"
import { ResourceCard } from "./_components/resource-card"
import { List, LayoutGrid } from "lucide-react"
import { MainContainer } from "@/components/layout/main-container"
import { HeaderActions } from "@/components/layout/header-actions"
import { ReloadButton } from "@/components/layout/reload-button"
import { AddButton } from "@/components/layout/add-button"
import { TableToolbar } from "@/components/dataTable/table-toolbar"
import { Button } from "@/components/ui/button"
import { ResourceAPI } from "@/services/resource-api"

export default function ResourcesPage() {
    const { resources, refreshResources, isLoading } = useResource()
    const [ isDialogOpen, setIsDialogOpen ] = useState(false)
    const [ currentPage, setCurrentPage ] = useState(1)
    const [ pageSize, setPageSize ] = useState(10)
    const [ viewMode, setViewMode ] = useState<"table" | "grid">("table")
    const [ isSubmitting, setIsSubmitting ] = useState(false)
    const [ searchTerm, setSearchTerm ] = useState("")
    const resourceFormRef = useRef<ResourceFormRef>(null)

    // Filtrar recursos según término de búsqueda
    const filteredResources = useMemo(() => {
        if (!searchTerm.trim()) {
            return resources
        }

        const searchLower = searchTerm.toLowerCase().trim()
        return resources.filter(
            (resource: Resource) =>
                resource.routeCode.toLowerCase().includes(searchLower) ||
                resource.name.toLowerCase().includes(searchLower) ||
                (resource.description &&
                    resource.description.toLowerCase().includes(searchLower))
        )
    }, [ resources, searchTerm ])

    // Paginar los datos filtrados
    const paginatedResources = useMemo(() => {
        const start = (currentPage - 1) * pageSize
        const end = start + pageSize
        return filteredResources.slice(start, end)
    }, [ filteredResources, currentPage, pageSize ])

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

    const handleCreateResource = async (data: any) => {
        setIsSubmitting(true)
        try {
            await ResourceAPI.create(data)
            toast.success("Recurso creado correctamente")
            setIsDialogOpen(false)
            await refreshResources()
        } catch (error: any) {
            const errorMessage =
                error?.response?.data?.message || error?.message || "Error al crear el recurso"
            toast.error(errorMessage)
            console.error("Error creating resource:", error)
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleReload = async () => {
        await refreshResources()
        toast.success("Recursos actualizados")
    }

    return (
        <MainContainer>
            <HeaderActions title="Gestión de Recursos">
                <div className="flex items-center gap-4">
                    <ReloadButton onClick={handleReload} isLoading={isLoading} />
                    <Can action="create" subject="Resource">
                        <AddButton onClick={() => setIsDialogOpen(true)}>
                            Nuevo Recurso
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
                        data={paginatedResources}
                        columns={columns}
                        headers={headers}
                        isLoading={isLoading}
                        pagination={{
                            totalRecords: filteredResources.length,
                            pageSize: pageSize,
                            onPaginationChange: handlePaginationChange,
                            currentPage: currentPage
                        }}
                        actions={(row: Resource) => <ActionsCell rowData={row} />}
                    />
                ) : (
                    <PaginatedCards
                        data={paginatedResources}
                        totalRecords={filteredResources.length}
                        pageSize={pageSize}
                        onPaginationChange={handlePaginationChange}
                        renderCard={(resource: Resource) => (
                            <ResourceCard key={resource.id} resource={resource} />
                        )}
                        isLoading={isLoading}
                    />
                )}

                {!isLoading && filteredResources.length === 0 && (
                    <div className="text-center py-12">
                        <p className="text-muted-foreground">
                            {searchTerm ? "No se encontraron recursos que coincidan con la búsqueda." : "No hay recursos registrados."}
                        </p>
                    </div>
                )}
            </div>

            {/* Dialog para crear */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="sm:max-w-[600px]">
                    <DialogHeader>
                        <DialogTitle>Nuevo Recurso</DialogTitle>
                    </DialogHeader>
                    <ResourceForm
                        ref={resourceFormRef}
                        resource={null}
                        onSubmit={handleCreateResource}
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
                                resourceFormRef.current?.submit()
                            }}
                            disabled={isSubmitting || resourceFormRef.current?.isSubmitting}
                        >
                            {isSubmitting ? "Creando..." : "Crear"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </MainContainer>
    )
}
