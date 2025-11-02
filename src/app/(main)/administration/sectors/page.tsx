"use client"

import { useState, useEffect, useMemo, useRef } from "react"
import Can from "@/components/permission/can"
import { columns } from "./_components/columns"
import { ResponsiveTable } from "@/components/dataTable/responsive-table"
import { useSectors } from "@/hooks/use-sectors"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { SectorForm, SectorFormRef } from "./_components/sector-form"
import { toast } from "sonner"
import { headers } from "./_components/headers"
import { ActionsCell } from "./_components/actions-cell"
import { Sector } from "@/types/sector"
import { ViewModeSwitcher } from "@/components/dataTable/view-mode-switcher"
import { PaginatedCards } from "@/components/dataTable/paginated-cards"
import { SectorCard } from "./_components/sector-card"
import { List, LayoutGrid } from "lucide-react"
import { MainContainer } from "@/components/layout/main-container"
import { HeaderActions } from "@/components/layout/header-actions"
import { ReloadButton } from "@/components/layout/reload-button"
import { AddButton } from "@/components/layout/add-button"
import { TableToolbar } from "@/components/dataTable/table-toolbar"
import { Button } from "@/components/ui/button"

export default function SectorsPage() {
    const { sectors, refreshSectors, isLoading } = useSectors()
    const [ isDialogOpen, setIsDialogOpen ] = useState(false)
    const [ currentPage, setCurrentPage ] = useState(1)
    const [ pageSize, setPageSize ] = useState(10)
    const [ viewMode, setViewMode ] = useState<"table" | "grid">("table")
    const [ isSubmitting, setIsSubmitting ] = useState(false)
    const [ searchTerm, setSearchTerm ] = useState("")
    const sectorFormRef = useRef<SectorFormRef>(null)

    // Filtrar sectores según término de búsqueda
    const filteredSectors = useMemo(() => {
        let filtered = sectors

        // Filtrar por búsqueda
        if (searchTerm.trim()) {
            const searchLower = searchTerm.toLowerCase().trim()
            filtered = filtered.filter(sector => {
                const name = sector.name?.toLowerCase() || '';
                const description = sector.description?.toLowerCase() || '';
                return name.includes(searchLower) || description.includes(searchLower);
            })
        }

        return filtered
    }, [ sectors, searchTerm ])

    const paginatedData = useMemo(() => {
        const start = (currentPage - 1) * pageSize
        const end = start + pageSize
        return filteredSectors.slice(start, end)
    }, [ filteredSectors, currentPage, pageSize ])

    const handlePaginationChange = (page: number, newPageSize: number) => {
        setCurrentPage(page)
        if (newPageSize !== pageSize) {
            setPageSize(newPageSize)
            setCurrentPage(1)
        }
    }

    const handleSearch = (value: string) => {
        setSearchTerm(value)
        setCurrentPage(1) // Reset a la primera página
    }

    const fetchSectors = async () => {
        try {
            await refreshSectors()
        } catch (error) {
            console.error("Error fetching sectors:", error)
            toast.error("Error al cargar los sectores")
        }
    }

    useEffect(() => {
        fetchSectors()
    }, [])

    const handleCreateSector = async (result: any) => {
        try {
            // El formulario maneja la creación completa
            // Esperar un poco para asegurar que la creación se completó
            await new Promise((resolve) => setTimeout(resolve, 500));

            // Refrescar la lista de sectores
            const sectorsData = await refreshSectors();
            console.log("Sectores refrescados:", sectorsData);

            toast.success("Sector creado correctamente")
            setIsDialogOpen(false)
            setIsSubmitting(false)
        } catch (error: any) {
            const errorMessage = error?.response?.data?.message || error?.message || "Error al crear el sector"
            toast.error(errorMessage)
            console.error("Error creating sector:", error)
            console.error("Error details:", error?.response?.data)
            setIsSubmitting(false)
        }
    }

    return (
        <Can action="read" subject="Sector" redirectOnFail={true}>
            <MainContainer>
                <HeaderActions title="Gestión de Sectores">
                    <div className="flex items-center gap-2">
                        <ReloadButton
                            onClick={fetchSectors}
                            isLoading={isLoading}
                        />
                        <Can action="create" subject="Sector">
                            <Dialog open={isDialogOpen} onOpenChange={(open) => {
                                setIsDialogOpen(open);
                                if (!open) {
                                    setIsSubmitting(false);
                                }
                            }}>
                                <DialogTrigger asChild>
                                    <AddButton text="Agregar Sector" />
                                </DialogTrigger>
                                <DialogContent className="sm:max-w-[600px] max-h-[50vh] flex flex-col p-0">
                                    <DialogHeader className="px-6 pt-6 flex-shrink-0">
                                        <DialogTitle>Agregar Nuevo Sector</DialogTitle>
                                        <DialogDescription>
                                            Ingrese los detalles del nuevo sector aquí.
                                        </DialogDescription>
                                    </DialogHeader>
                                    <div className="flex-1 px-6 overflow-y-auto">
                                        <SectorForm ref={sectorFormRef} onSubmit={handleCreateSector} onCancel={() => setIsDialogOpen(false)} />
                                    </div>
                                    <DialogFooter className="px-6 py-6 border-t">
                                        <Button variant="outline" onClick={() => setIsDialogOpen(false)} disabled={isSubmitting}>
                                            Cancelar
                                        </Button>
                                        <Button
                                            variant="default"
                                            onClick={() => {
                                                setIsSubmitting(true);
                                                sectorFormRef.current?.submit();
                                            }}
                                            disabled={isSubmitting}
                                        >
                                            {isSubmitting ? "Creando..." : "Crear Sector"}
                                        </Button>
                                    </DialogFooter>
                                </DialogContent>
                            </Dialog>
                        </Can>
                    </div>
                </HeaderActions>

                <div className="flex items-center gap-4">
                    <div className="flex-1">
                        <TableToolbar
                            value={searchTerm}
                            onValueChange={setSearchTerm}
                            onSearch={handleSearch}
                            searchPlaceholder="Buscar por nombre o descripción..."
                        />
                    </div>
                    <ViewModeSwitcher
                        viewMode={viewMode}
                        setViewMode={(mode: string) => setViewMode(mode as "table" | "grid")}
                        modes={[
                            { value: "table", icon: <List className="h-4 w-4" />, label: "Tabla" },
                            { value: "grid", icon: <LayoutGrid className="h-4 w-4" />, label: "Cuadrícula" },
                        ]}
                    />
                </div>

                {viewMode === "table" ? (
                    <ResponsiveTable
                        columns={columns}
                        headers={headers}
                        data={paginatedData}
                        isLoading={isLoading}
                        pagination={{
                            totalRecords: filteredSectors.length,
                            pageSize: pageSize,
                            onPaginationChange: handlePaginationChange,
                            currentPage: currentPage
                        }}
                        actions={(row: Sector) => <ActionsCell rowData={row} />}
                    />
                ) : (
                    <PaginatedCards<Sector>
                        data={paginatedData}
                        isLoading={isLoading}
                        totalRecords={filteredSectors.length}
                        pageSize={pageSize}
                        onPaginationChange={handlePaginationChange}
                        renderCard={(sector: Sector) => <SectorCard sector={sector} />}
                    />
                )}
            </MainContainer>
        </Can>
    )
}
