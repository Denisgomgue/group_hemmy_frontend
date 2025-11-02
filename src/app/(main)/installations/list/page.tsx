"use client"

import { useState, useEffect, useMemo, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Filter } from "lucide-react"
import Can from "@/components/permission/can"
import { columns } from "./_components/columns"
import { ResponsiveTable } from "@/components/dataTable/responsive-table"
import { useInstallations } from "@/hooks/use-installations"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { InstallationForm, InstallationFormRef } from "./_components/installation-form"
import { toast } from "sonner"
import { headers } from "./_components/headers"
import { ActionsCell } from "./_components/actions-cell"
import { Installation, InstallationStatus } from "@/types/installation"
import { ViewModeSwitcher } from "@/components/dataTable/view-mode-switcher"
import { PaginatedCards } from "@/components/dataTable/paginated-cards"
import { InstallationCard } from "./_components/installation-card"
import { List, LayoutGrid } from "lucide-react"
import { MainContainer } from "@/components/layout/main-container"
import { HeaderActions } from "@/components/layout/header-actions"
import { ReloadButton } from "@/components/layout/reload-button"
import { AddButton } from "@/components/layout/add-button"
import { TableToolbar } from "@/components/dataTable/table-toolbar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Check } from "lucide-react"

export default function InstallationsPage() {
    const { installations, refreshInstallations, isLoading } = useInstallations()
    const [ isDialogOpen, setIsDialogOpen ] = useState(false)
    const [ currentPage, setCurrentPage ] = useState(1)
    const [ pageSize, setPageSize ] = useState(10)
    const [ viewMode, setViewMode ] = useState<"table" | "grid">("table")
    const [ isSubmitting, setIsSubmitting ] = useState(false)
    const [ searchTerm, setSearchTerm ] = useState("")
    const [ statusFilter, setStatusFilter ] = useState<InstallationStatus | "all">("all")
    const [ isFilterOpen, setIsFilterOpen ] = useState(false)
    const installationFormRef = useRef<InstallationFormRef>(null)

    // Filtrar instalaciones según término de búsqueda y estado
    const filteredInstallations = useMemo(() => {
        let filtered = installations

        // Filtrar por búsqueda
        if (searchTerm.trim()) {
            const searchLower = searchTerm.toLowerCase().trim()
            filtered = filtered.filter(installation => {
                const client = installation.client;
                const clientName = client?.actor?.displayName ||
                    (client?.actor?.person
                        ? `${client?.actor?.person.firstName} ${client?.actor?.person.lastName}`.trim()
                        : client?.actor?.organization?.legalName) || '';
                const address = installation.address?.toLowerCase() || '';
                const ipAddress = installation.ipAddress?.toLowerCase() || '';
                const sectorName = installation.sector?.name?.toLowerCase() || '';

                return clientName.toLowerCase().includes(searchLower) ||
                    address.includes(searchLower) ||
                    ipAddress.includes(searchLower) ||
                    sectorName.includes(searchLower);
            })
        }

        // Filtrar por estado
        if (statusFilter !== "all") {
            filtered = filtered.filter(installation => installation.status === statusFilter)
        }

        return filtered
    }, [ installations, searchTerm, statusFilter ])

    const paginatedData = useMemo(() => {
        const start = (currentPage - 1) * pageSize
        const end = start + pageSize
        return filteredInstallations.slice(start, end)
    }, [ filteredInstallations, currentPage, pageSize ])

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

    const fetchInstallations = async () => {
        try {
            await refreshInstallations()
        } catch (error) {
            console.error("Error fetching installations:", error)
            toast.error("Error al cargar las instalaciones")
        }
    }

    useEffect(() => {
        fetchInstallations()
    }, [])

    const handleCreateInstallation = async (result: any) => {
        try {
            // El formulario maneja la creación completa
            // Esperar un poco para asegurar que la creación se completó
            await new Promise((resolve) => setTimeout(resolve, 500));

            // Refrescar la lista de instalaciones
            const installationsData = await refreshInstallations();
            console.log("Instalaciones refrescadas:", installationsData);

            toast.success("Instalación creada correctamente")
            setIsDialogOpen(false)
            setIsSubmitting(false)
        } catch (error: any) {
            const errorMessage = error?.response?.data?.message || error?.message || "Error al crear la instalación"
            toast.error(errorMessage)
            console.error("Error creating installation:", error)
            console.error("Error details:", error?.response?.data)
            setIsSubmitting(false)
        }
    }

    return (
        <Can action="read" subject="Installation" redirectOnFail={true}>
            <MainContainer>
                <HeaderActions title="Gestión de Instalaciones">
                    <div className="flex items-center gap-2">
                        <ReloadButton
                            onClick={fetchInstallations}
                            isLoading={isLoading}
                        />
                        <Can action="create" subject="Installation">
                            <Dialog open={isDialogOpen} onOpenChange={(open) => {
                                setIsDialogOpen(open);
                                if (!open) {
                                    setIsSubmitting(false);
                                }
                            }}>
                                <DialogTrigger asChild>
                                    <AddButton text="Agregar Instalación" />
                                </DialogTrigger>
                                <DialogContent className="sm:max-w-[900px] lg:max-w-[1100px] max-h-[90vh] flex flex-col p-0">
                                    <DialogHeader className="px-6 pt-6 pb-4 flex-shrink-0">
                                        <DialogTitle>Agregar Nueva Instalación</DialogTitle>
                                        <DialogDescription>
                                            Ingrese los detalles de la nueva instalación aquí.
                                        </DialogDescription>
                                    </DialogHeader>
                                    <div className="flex-1 px-6 overflow-y-auto">
                                        <InstallationForm ref={installationFormRef} onSubmit={handleCreateInstallation} onCancel={() => setIsDialogOpen(false)} />
                                    </div>
                                    <DialogFooter className="px-6 pb-6 pt-4 border-t">
                                        <Button variant="outline" onClick={() => setIsDialogOpen(false)} disabled={isSubmitting}>
                                            Cancelar
                                        </Button>
                                        <Button
                                            variant="default"
                                            onClick={() => {
                                                setIsSubmitting(true);
                                                installationFormRef.current?.submit();
                                            }}
                                            disabled={isSubmitting}
                                        >
                                            {isSubmitting ? "Creando..." : "Crear Instalación"}
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
                            searchPlaceholder="Buscar por cliente, dirección, IP o sector..."
                        />
                    </div>
                    <Popover open={isFilterOpen} onOpenChange={setIsFilterOpen}>
                        <PopoverTrigger asChild>
                            <Button variant="outline" className="gap-2">
                                <Filter className="h-4 w-4" />
                                Filtrar por Estado
                                {statusFilter !== "all" && (
                                    <span className="ml-1 px-1.5 py-0.5 text-xs bg-primary text-primary-foreground rounded">
                                        {statusFilter === InstallationStatus.ACTIVE ? "Activas" :
                                            statusFilter === InstallationStatus.INACTIVE ? "Inactivas" : ""}
                                    </span>
                                )}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-56 p-3">
                            <div className="space-y-2">
                                <div className="font-medium text-sm mb-3">Estado de la Instalación</div>
                                <button
                                    onClick={() => {
                                        setStatusFilter("all")
                                        setIsFilterOpen(false)
                                        setCurrentPage(1)
                                    }}
                                    className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors flex items-center justify-between ${statusFilter === "all"
                                        ? "bg-primary text-primary-foreground"
                                        : "hover:bg-accent"
                                        }`}
                                >
                                    <span>Todos</span>
                                    {statusFilter === "all" && <Check className="h-4 w-4" />}
                                </button>
                                <button
                                    onClick={() => {
                                        setStatusFilter(InstallationStatus.ACTIVE)
                                        setIsFilterOpen(false)
                                        setCurrentPage(1)
                                    }}
                                    className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors flex items-center justify-between ${statusFilter === InstallationStatus.ACTIVE
                                        ? "bg-primary text-primary-foreground"
                                        : "hover:bg-accent"
                                        }`}
                                >
                                    <span>Activas</span>
                                    {statusFilter === InstallationStatus.ACTIVE && <Check className="h-4 w-4" />}
                                </button>
                                <button
                                    onClick={() => {
                                        setStatusFilter(InstallationStatus.INACTIVE)
                                        setIsFilterOpen(false)
                                        setCurrentPage(1)
                                    }}
                                    className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors flex items-center justify-between ${statusFilter === InstallationStatus.INACTIVE
                                        ? "bg-primary text-primary-foreground"
                                        : "hover:bg-accent"
                                        }`}
                                >
                                    <span>Inactivas</span>
                                    {statusFilter === InstallationStatus.INACTIVE && <Check className="h-4 w-4" />}
                                </button>
                            </div>
                        </PopoverContent>
                    </Popover>
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
                            totalRecords: filteredInstallations.length,
                            pageSize: pageSize,
                            onPaginationChange: handlePaginationChange,
                            currentPage: currentPage
                        }}
                        actions={(row: Installation) => <ActionsCell rowData={row} />}
                    />
                ) : (
                    <PaginatedCards<Installation>
                        data={paginatedData}
                        isLoading={isLoading}
                        totalRecords={filteredInstallations.length}
                        pageSize={pageSize}
                        onPaginationChange={handlePaginationChange}
                        renderCard={(installation: Installation) => <InstallationCard installation={installation} />}
                    />
                )}
            </MainContainer>
        </Can>
    )
}

