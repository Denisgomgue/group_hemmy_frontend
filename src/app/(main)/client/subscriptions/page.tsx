"use client"

import { useState, useEffect, useMemo, useRef } from "react"
import Can from "@/components/permission/can"
import { columns } from "./_components/columns"
import { ResponsiveTable } from "@/components/dataTable/responsive-table"
import { useSubscriptions } from "@/hooks/use-subscriptions"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { SubscriptionForm, SubscriptionFormRef } from "./_components/subscription-form"
import { toast } from "sonner"
import { headers } from "./_components/headers"
import { ActionsCell } from "./_components/actions-cell"
import { Subscription, SubscriptionStatus } from "@/types/subscription"
import { ViewModeSwitcher } from "@/components/dataTable/view-mode-switcher"
import { PaginatedCards } from "@/components/dataTable/paginated-cards"
import { SubscriptionCard } from "./_components/subscription-card"
import { List, LayoutGrid } from "lucide-react"
import { MainContainer } from "@/components/layout/main-container"
import { HeaderActions } from "@/components/layout/header-actions"
import { ReloadButton } from "@/components/layout/reload-button"
import { AddButton } from "@/components/layout/add-button"
import { TableToolbar } from "@/components/dataTable/table-toolbar"
import { Button } from "@/components/ui/button"

export default function SubscriptionsPage() {
    const { subscriptions, refreshSubscriptions, isLoading } = useSubscriptions()
    const [ isDialogOpen, setIsDialogOpen ] = useState(false)
    const [ currentPage, setCurrentPage ] = useState(1)
    const [ pageSize, setPageSize ] = useState(10)
    const [ viewMode, setViewMode ] = useState<"table" | "grid">("table")
    const [ isSubmitting, setIsSubmitting ] = useState(false)
    const [ searchTerm, setSearchTerm ] = useState("")
    const subscriptionFormRef = useRef<SubscriptionFormRef>(null)

    // Filtrar suscripciones según término de búsqueda
    const filteredSubscriptions = useMemo(() => {
        let filtered = subscriptions

        // Filtrar por búsqueda
        if (searchTerm.trim()) {
            const searchLower = searchTerm.toLowerCase().trim()
            filtered = filtered.filter(subscription => {
                const clientDisplay = subscription?.installation?.client?.actor?.displayName?.toLowerCase() ||
                    (subscription?.installation?.client?.actor?.person
                        ? `${subscription.installation.client.actor.person.firstName} ${subscription.installation.client.actor.person.lastName}`.toLowerCase()
                        : subscription?.installation?.client?.actor?.organization?.legalName?.toLowerCase()) ||
                    '';
                const planName = subscription?.plan?.name?.toLowerCase() || '';
                const serviceName = subscription?.plan?.service?.name?.toLowerCase() || '';
                const sectorName = subscription?.installation?.sector?.name?.toLowerCase() || '';

                return clientDisplay.includes(searchLower) ||
                    planName.includes(searchLower) ||
                    serviceName.includes(searchLower) ||
                    sectorName.includes(searchLower);
            })
        }

        return filtered
    }, [ subscriptions, searchTerm ])

    const paginatedData = useMemo(() => {
        const start = (currentPage - 1) * pageSize
        const end = start + pageSize
        return filteredSubscriptions.slice(start, end)
    }, [ filteredSubscriptions, currentPage, pageSize ])

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

    const fetchSubscriptions = async () => {
        try {
            await refreshSubscriptions()
        } catch (error) {
            console.error("Error fetching subscriptions:", error)
            toast.error("Error al cargar las suscripciones")
        }
    }

    useEffect(() => {
        fetchSubscriptions()
    }, [])

    const handleCreateSubscription = async (result: any) => {
        try {
            // El formulario maneja la creación completa
            // Esperar un poco para asegurar que la creación se completó
            await new Promise((resolve) => setTimeout(resolve, 500));

            // Refrescar la lista de suscripciones
            const subscriptionsData = await refreshSubscriptions();
            console.log("Suscripciones refrescadas:", subscriptionsData);

            toast.success("Suscripción creada correctamente")
            setIsDialogOpen(false)
            setIsSubmitting(false)
        } catch (error: any) {
            const errorMessage = error?.response?.data?.message || error?.message || "Error al crear la suscripción"
            toast.error(errorMessage)
            console.error("Error creating subscription:", error)
            console.error("Error details:", error?.response?.data)
            setIsSubmitting(false)
        }
    }

    return (
        <Can action="read" subject="Subscription" redirectOnFail={true}>
            <MainContainer>
                <HeaderActions title="Gestión de Suscripciones">
                    <div className="flex items-center gap-2">
                        <ReloadButton
                            onClick={fetchSubscriptions}
                            isLoading={isLoading}
                        />
                        <Can action="create" subject="Subscription">
                            <Dialog open={isDialogOpen} onOpenChange={(open) => {
                                setIsDialogOpen(open);
                                if (!open) {
                                    setIsSubmitting(false);
                                }
                            }}>
                                <DialogTrigger asChild>
                                    <AddButton text="Agregar Suscripción" />
                                </DialogTrigger>
                                <DialogContent className="sm:max-w-[900px] lg:max-w-[1200px] xl:max-w-[1400px] max-h-[90vh] flex flex-col p-0">
                                    <DialogHeader className="px-6 pt-6 pb-4 flex-shrink-0">
                                        <DialogTitle>Agregar Nueva Suscripción</DialogTitle>
                                        <DialogDescription>
                                            Ingrese los detalles de la nueva suscripción aquí.
                                        </DialogDescription>
                                    </DialogHeader>
                                    <div className="flex-1 px-6 overflow-y-auto">
                                        <SubscriptionForm ref={subscriptionFormRef} onSubmit={handleCreateSubscription} onCancel={() => setIsDialogOpen(false)} />
                                    </div>
                                    <DialogFooter className="px-6 pb-6 pt-4 border-t">
                                        <Button variant="outline" onClick={() => setIsDialogOpen(false)} disabled={isSubmitting}>
                                            Cancelar
                                        </Button>
                                        <Button
                                            variant="default"
                                            onClick={() => {
                                                setIsSubmitting(true);
                                                subscriptionFormRef.current?.submit();
                                            }}
                                            disabled={isSubmitting}
                                        >
                                            {isSubmitting ? "Creando..." : "Crear Suscripción"}
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
                            searchPlaceholder="Buscar por cliente, plan, servicio o sector..."
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
                            totalRecords: filteredSubscriptions.length,
                            pageSize: pageSize,
                            onPaginationChange: handlePaginationChange,
                            currentPage: currentPage
                        }}
                        actions={(row: Subscription) => <ActionsCell rowData={row} />}
                    />
                ) : (
                    <PaginatedCards<Subscription>
                        data={paginatedData}
                        isLoading={isLoading}
                        totalRecords={filteredSubscriptions.length}
                        pageSize={pageSize}
                        onPaginationChange={handlePaginationChange}
                        renderCard={(subscription: Subscription) => <SubscriptionCard subscription={subscription} />}
                    />
                )}
            </MainContainer>
        </Can>
    )
}

