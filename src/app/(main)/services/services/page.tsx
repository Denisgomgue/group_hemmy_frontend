"use client"

import { useState, useEffect, useMemo, useRef } from "react"
import Can from "@/components/permission/can"
import { columns } from "./_components/columns"
import { ResponsiveTable } from "@/components/dataTable/responsive-table"
import { useServices } from "@/hooks/use-services"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { ServiceForm, ServiceFormRef } from "./_components/service-form"
import { toast } from "sonner"
import { headers } from "./_components/headers"
import { ActionsCell } from "./_components/actions-cell"
import { Service } from "@/types/service"
import { ViewModeSwitcher } from "@/components/dataTable/view-mode-switcher"
import { PaginatedCards } from "@/components/dataTable/paginated-cards"
import { ServiceCard } from "./_components/service-card"
import { List, LayoutGrid } from "lucide-react"
import { MainContainer } from "@/components/layout/main-container"
import { HeaderActions } from "@/components/layout/header-actions"
import { ReloadButton } from "@/components/layout/reload-button"
import { AddButton } from "@/components/layout/add-button"
import { TableToolbar } from "@/components/dataTable/table-toolbar"
import { Button } from "@/components/ui/button"

export default function ServicesPage() {
    const { services, refreshServices, isLoading } = useServices()
    const [ isDialogOpen, setIsDialogOpen ] = useState(false)
    const [ currentPage, setCurrentPage ] = useState(1)
    const [ pageSize, setPageSize ] = useState(10)
    const [ viewMode, setViewMode ] = useState<"table" | "grid">("table")
    const [ isSubmitting, setIsSubmitting ] = useState(false)
    const [ searchTerm, setSearchTerm ] = useState("")
    const serviceFormRef = useRef<ServiceFormRef>(null)

    // Filtrar servicios según término de búsqueda
    const filteredServices = useMemo(() => {
        let filtered = services

        // Filtrar por búsqueda
        if (searchTerm.trim()) {
            const searchLower = searchTerm.toLowerCase().trim()
            filtered = filtered.filter(service => {
                const name = service.name?.toLowerCase() || '';
                const description = service.description?.toLowerCase() || '';
                return name.includes(searchLower) || description.includes(searchLower);
            })
        }

        return filtered
    }, [ services, searchTerm ])

    const paginatedData = useMemo(() => {
        const start = (currentPage - 1) * pageSize
        const end = start + pageSize
        return filteredServices.slice(start, end)
    }, [ filteredServices, currentPage, pageSize ])

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

    const fetchServices = async () => {
        try {
            await refreshServices()
        } catch (error) {
            console.error("Error fetching services:", error)
            toast.error("Error al cargar los servicios")
        }
    }

    useEffect(() => {
        fetchServices()
    }, [])

    const handleCreateService = async (result: any) => {
        try {
            // El formulario maneja la creación completa
            // Esperar un poco para asegurar que la creación se completó
            await new Promise((resolve) => setTimeout(resolve, 500));

            // Refrescar la lista de servicios
            const servicesData = await refreshServices();
            console.log("Servicios refrescados:", servicesData);

            toast.success("Servicio creado correctamente")
            setIsDialogOpen(false)
            setIsSubmitting(false)
        } catch (error: any) {
            const errorMessage = error?.response?.data?.message || error?.message || "Error al crear el servicio"
            toast.error(errorMessage)
            console.error("Error creating service:", error)
            console.error("Error details:", error?.response?.data)
            setIsSubmitting(false)
        }
    }

    return (
        <Can action="read" subject="Service" redirectOnFail={true}>
            <MainContainer>
                <HeaderActions title="Gestión de Servicios">
                    <div className="flex items-center gap-2">
                        <ReloadButton
                            onClick={fetchServices}
                            isLoading={isLoading}
                        />
                        <Can action="create" subject="Service">
                            <Dialog open={isDialogOpen} onOpenChange={(open) => {
                                setIsDialogOpen(open);
                                if (!open) {
                                    setIsSubmitting(false);
                                }
                            }}>
                                <DialogTrigger asChild>
                                    <AddButton text="Agregar Servicio" />
                                </DialogTrigger>
                                <DialogContent className="sm:max-w-[700px] lg:max-w-[900px] max-h-[90vh] flex flex-col p-0">
                                    <DialogHeader className="px-6 pt-6 pb-4 flex-shrink-0">
                                        <DialogTitle>Agregar Nuevo Servicio</DialogTitle>
                                        <DialogDescription>
                                            Ingrese los detalles del nuevo servicio aquí.
                                        </DialogDescription>
                                    </DialogHeader>
                                    <div className="flex-1 px-6 overflow-y-auto">
                                        <ServiceForm ref={serviceFormRef} onSubmit={handleCreateService} onCancel={() => setIsDialogOpen(false)} />
                                    </div>
                                    <DialogFooter className="px-6 pb-6 pt-4 border-t">
                                        <Button variant="outline" onClick={() => setIsDialogOpen(false)} disabled={isSubmitting}>
                                            Cancelar
                                        </Button>
                                        <Button
                                            variant="default"
                                            onClick={() => {
                                                setIsSubmitting(true);
                                                serviceFormRef.current?.submit();
                                            }}
                                            disabled={isSubmitting}
                                        >
                                            {isSubmitting ? "Creando..." : "Crear Servicio"}
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
                            totalRecords: filteredServices.length,
                            pageSize: pageSize,
                            onPaginationChange: handlePaginationChange,
                            currentPage: currentPage
                        }}
                        actions={(row: Service) => <ActionsCell rowData={row} />}
                    />
                ) : (
                    <PaginatedCards<Service>
                        data={paginatedData}
                        isLoading={isLoading}
                        totalRecords={filteredServices.length}
                        pageSize={pageSize}
                        onPaginationChange={handlePaginationChange}
                        renderCard={(service: Service) => <ServiceCard service={service} />}
                    />
                )}
            </MainContainer>
        </Can>
    )
}
