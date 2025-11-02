"use client"

import { useState, useEffect, useMemo, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Filter } from "lucide-react"
// import { Users, UserCheck, UserX, Clock } from "lucide-react" // TODO: Comentado temporalmente para KPIs
import Can from "@/components/permission/can"
import { columns } from "./_components/columns"
import { ResponsiveTable } from "@/components/dataTable/responsive-table"
import { useClients } from "@/hooks/use-clients"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { ClientForm, ClientFormRef } from "./_components/client-form"
import { toast } from "sonner"
import { headers } from "./_components/headers"
import { ActionsCell } from "./_components/actions-cell"
import { Client, ClientStatus } from "@/types/client"
import { ViewModeSwitcher } from "@/components/dataTable/view-mode-switcher"
import { PaginatedCards } from "@/components/dataTable/paginated-cards"
import { ClientCard } from "./_components/client-card"
import { List, LayoutGrid } from "lucide-react"
import { MainContainer } from "@/components/layout/main-container"
import { HeaderActions } from "@/components/layout/header-actions"
import { ReloadButton } from "@/components/layout/reload-button"
import { AddButton } from "@/components/layout/add-button"
import { TableToolbar } from "@/components/dataTable/table-toolbar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Check } from "lucide-react"
// import { ClientSummaryCards, ClientSummaryCard } from "@/components/client-summary-cards" // TODO: Comentado temporalmente para KPIs

export default function ClientsPage() {
    const { clients, refreshClients, isLoading } = useClients()
    const [ isDialogOpen, setIsDialogOpen ] = useState(false)
    const [ currentPage, setCurrentPage ] = useState(1)
    const [ pageSize, setPageSize ] = useState(10)
    const [ viewMode, setViewMode ] = useState<"table" | "grid">("table")
    const [ isSubmitting, setIsSubmitting ] = useState(false)
    const [ searchTerm, setSearchTerm ] = useState("")
    const [ statusFilter, setStatusFilter ] = useState<ClientStatus | "all">("all")
    const [ isFilterOpen, setIsFilterOpen ] = useState(false)
    // const [ activeCardFilter, setActiveCardFilter ] = useState<string | null>(null) // TODO: Comentado temporalmente para KPIs
    const clientFormRef = useRef<ClientFormRef>(null)

    // Filtrar clientes según término de búsqueda y estado
    const filteredClients = useMemo(() => {
        let filtered = clients

        // Filtrar por búsqueda
        if (searchTerm.trim()) {
            const searchLower = searchTerm.toLowerCase().trim()
            filtered = filtered.filter(client => {
                // Verificar si el actor es una Persona
                if (client.actor?.kind === 'PERSON' && client.actor?.person) {
                    const firstName = client.actor.person.firstName?.toLowerCase() || ''
                    const lastName = client.actor.person.lastName?.toLowerCase() || ''
                    const documentNumber = client.actor.person.documentNumber?.toLowerCase() || ''

                    return firstName.includes(searchLower) ||
                        lastName.includes(searchLower) ||
                        documentNumber.includes(searchLower)
                }
                // Verificar si el actor es una Organización
                if (client.actor?.kind === 'ORGANIZATION' && client.actor?.organization) {
                    const legalName = client.actor.organization.legalName?.toLowerCase() || ''
                    const documentNumber = client.actor.organization.documentNumber?.toLowerCase() || ''

                    return legalName.includes(searchLower) ||
                        documentNumber.includes(searchLower)
                }
                return false
            })
        }

        // Filtrar por estado
        if (statusFilter !== "all") {
            filtered = filtered.filter(client => client.status === statusFilter)
        }

        return filtered
    }, [ clients, searchTerm, statusFilter ])

    const paginatedData = useMemo(() => {
        const start = (currentPage - 1) * pageSize
        const end = start + pageSize
        return filteredClients.slice(start, end)
    }, [ filteredClients, currentPage, pageSize ])

    // TODO: KPIs comentados temporalmente hasta tener endpoints
    // Calcular estadísticas de clientes
    // const clientStats = useMemo(() => {
    //     const total = clients.length
    //     const active = clients.filter(c => c.status === ClientStatus.ACTIVE).length
    //     const suspended = clients.filter(c => c.status === ClientStatus.SUSPENDED).length
    //     const inactive = clients.filter(c => c.status === ClientStatus.INACTIVE).length
    //     return { total, active, suspended, inactive }
    // }, [ clients ])

    // Crear tarjetas de resumen
    // const summaryCards: ClientSummaryCard[] = useMemo(() => [
    //     {
    //         title: "Total Clientes",
    //         value: clientStats.total,
    //         description: "Total de clientes registrados",
    //         icon: <Users />,
    //         borderColor: "border-l-blue-500",
    //         bgColor: "bg-blue-50 dark:bg-blue-950",
    //         textColor: "text-blue-700 dark:text-blue-300",
    //         filterKey: "ALL",
    //         isLoading
    //     },
    //     {
    //         title: "Clientes Activos",
    //         value: clientStats.active,
    //         description: "Clientes activos en el sistema",
    //         icon: <UserCheck />,
    //         borderColor: "border-l-green-500",
    //         bgColor: "bg-green-50 dark:bg-green-950",
    //         textColor: "text-green-700 dark:text-green-300",
    //         filterKey: "ACTIVE",
    //         isLoading
    //     },
    //     {
    //         title: "Clientes Suspendidos",
    //         value: clientStats.suspended,
    //         description: "Clientes suspendidos",
    //         icon: <UserX />,
    //         borderColor: "border-l-red-500",
    //         bgColor: "bg-red-50 dark:bg-red-950",
    //         textColor: "text-red-700 dark:text-red-300",
    //         filterKey: "SUSPENDED",
    //         isLoading
    //     },
    //     {
    //         title: "Clientes Inactivos",
    //         value: clientStats.inactive,
    //         description: "Clientes inactivos",
    //         icon: <Clock />,
    //         borderColor: "border-l-gray-500",
    //         bgColor: "bg-gray-50 dark:bg-gray-950",
    //         textColor: "text-gray-700 dark:text-gray-300",
    //         filterKey: "INACTIVE",
    //         isLoading
    //     }
    // ], [ clientStats, isLoading ])

    // Filtrar datos según el filtro activo
    // const filteredClients = useMemo(() => {
    //     if (!activeCardFilter || activeCardFilter === "ALL") return clients
    //     return clients.filter(c => c.status === activeCardFilter)
    // }, [ clients, activeCardFilter ])

    // const filteredPaginatedData = useMemo(() => {
    //     const start = (currentPage - 1) * pageSize
    //     const end = start + pageSize
    //     return filteredClients.slice(start, end)
    // }, [ filteredClients, currentPage, pageSize ])

    // const handleCardFilterChange = (filterKey: string | null) => {
    //     setActiveCardFilter(filterKey)
    //     setCurrentPage(1) // Reset a la primera página
    // }

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

    const fetchClients = async () => {
        try {
            await refreshClients()
        } catch (error) {
            console.error("Error fetching clients:", error)
            toast.error("Error al cargar los clientes")
        }
    }

    useEffect(() => {
        fetchClients()
    }, [])

    const handleCreateClient = async (result: any) => {
        try {
            // El formulario maneja la creación completa (Persona/Org → Actor → Cliente → Usuario)
            // Esperar un poco para asegurar que la creación se completó
            await new Promise((resolve) => setTimeout(resolve, 500));

            // Refrescar la lista de clientes
            const clientsData = await refreshClients();
            console.log("Clientes refrescados:", clientsData);

            toast.success("Cliente creado correctamente")
            setIsDialogOpen(false)
            setIsSubmitting(false)
        } catch (error: any) {
            const errorMessage = error?.response?.data?.message || error?.message || "Error al crear el cliente"
            toast.error(errorMessage)
            console.error("Error creating client:", error)
            console.error("Error details:", error?.response?.data)
            setIsSubmitting(false)
        }
    }

    return (
        <Can action="ver-cliente" subject="clientes" redirectOnFail={true}>
            <MainContainer>
                <HeaderActions title="Gestión de Clientes">
                    <div className="flex items-center gap-2">
                        <ReloadButton
                            onClick={fetchClients}
                            isLoading={isLoading}
                        />
                        <Can action="crear-cliente" subject="clientes">
                            <Dialog open={isDialogOpen} onOpenChange={(open) => {
                                setIsDialogOpen(open);
                                if (!open) {
                                    setIsSubmitting(false);
                                }
                            }}>
                                <DialogTrigger asChild>
                                    <AddButton text="Agregar Cliente" />
                                </DialogTrigger>
                                <DialogContent className="sm:max-w-[900px] lg:max-w-[1100px] max-h-[90vh] flex flex-col p-0">
                                    <DialogHeader className="px-6 pt-6 pb-4 flex-shrink-0">
                                        <DialogTitle>Agregar Nuevo Cliente</DialogTitle>
                                        <DialogDescription>
                                            Ingrese los detalles del nuevo cliente aquí.
                                        </DialogDescription>
                                    </DialogHeader>
                                    <div className="flex-1 px-6 overflow-y-auto">
                                        <ClientForm ref={clientFormRef} onSubmit={handleCreateClient} onCancel={() => setIsDialogOpen(false)} />
                                    </div>
                                    <DialogFooter className="px-6 pb-6 pt-4 border-t">
                                        <Button variant="outline" onClick={() => setIsDialogOpen(false)} disabled={isSubmitting}>
                                            Cancelar
                                        </Button>
                                        <Button
                                            variant="default"
                                            onClick={() => {
                                                setIsSubmitting(true);
                                                clientFormRef.current?.submit();
                                            }}
                                            disabled={isSubmitting}
                                        >
                                            {isSubmitting ? "Creando..." : "Crear Cliente"}
                                        </Button>
                                    </DialogFooter>
                                </DialogContent>
                            </Dialog>
                        </Can>
                    </div>
                </HeaderActions>

                {/* TODO: KPIs comentados temporalmente hasta tener endpoints
                <ClientSummaryCards
                    cards={summaryCards}
                    isLoading={isLoading}
                    onFilterChange={handleCardFilterChange}
                    activeFilter={activeCardFilter}
                />
                */}

                <div className="flex items-center gap-4">
                    <div className="flex-1">
                        <TableToolbar
                            value={searchTerm}
                            onValueChange={setSearchTerm}
                            onSearch={handleSearch}
                            searchPlaceholder="Buscar por DNI, nombre o apellidos..."
                        />
                    </div>
                    <Popover open={isFilterOpen} onOpenChange={setIsFilterOpen}>
                        <PopoverTrigger asChild>
                            <Button variant="outline" className="gap-2">
                                <Filter className="h-4 w-4" />
                                Filtrar por Estado
                                {statusFilter !== "all" && (
                                    <span className="ml-1 px-1.5 py-0.5 text-xs bg-primary text-primary-foreground rounded">
                                        {statusFilter === ClientStatus.ACTIVE ? "Activos" :
                                            statusFilter === ClientStatus.SUSPENDED ? "Suspendidos" :
                                                statusFilter === ClientStatus.INACTIVE ? "Inactivos" : ""}
                                    </span>
                                )}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-56 p-3">
                            <div className="space-y-2">
                                <div className="font-medium text-sm mb-3">Estado del Cliente</div>
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
                                        setStatusFilter(ClientStatus.ACTIVE)
                                        setIsFilterOpen(false)
                                        setCurrentPage(1)
                                    }}
                                    className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors flex items-center justify-between ${statusFilter === ClientStatus.ACTIVE
                                        ? "bg-primary text-primary-foreground"
                                        : "hover:bg-accent"
                                        }`}
                                >
                                    <span>Activos</span>
                                    {statusFilter === ClientStatus.ACTIVE && <Check className="h-4 w-4" />}
                                </button>
                                <button
                                    onClick={() => {
                                        setStatusFilter(ClientStatus.SUSPENDED)
                                        setIsFilterOpen(false)
                                        setCurrentPage(1)
                                    }}
                                    className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors flex items-center justify-between ${statusFilter === ClientStatus.SUSPENDED
                                        ? "bg-primary text-primary-foreground"
                                        : "hover:bg-accent"
                                        }`}
                                >
                                    <span>Suspendidos</span>
                                    {statusFilter === ClientStatus.SUSPENDED && <Check className="h-4 w-4" />}
                                </button>
                                <button
                                    onClick={() => {
                                        setStatusFilter(ClientStatus.INACTIVE)
                                        setIsFilterOpen(false)
                                        setCurrentPage(1)
                                    }}
                                    className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors flex items-center justify-between ${statusFilter === ClientStatus.INACTIVE
                                        ? "bg-primary text-primary-foreground"
                                        : "hover:bg-accent"
                                        }`}
                                >
                                    <span>Inactivos</span>
                                    {statusFilter === ClientStatus.INACTIVE && <Check className="h-4 w-4" />}
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
                            totalRecords: filteredClients.length,
                            pageSize: pageSize,
                            onPaginationChange: handlePaginationChange,
                            currentPage: currentPage
                        }}
                        actions={(row: Client) => <ActionsCell rowData={row} />}
                    />
                ) : (
                    <PaginatedCards<Client>
                        data={paginatedData}
                        isLoading={isLoading}
                        totalRecords={filteredClients.length}
                        pageSize={pageSize}
                        onPaginationChange={handlePaginationChange}
                        renderCard={(client: Client) => <ClientCard client={client} />}
                    />
                )}
            </MainContainer>
        </Can>
    )
}

