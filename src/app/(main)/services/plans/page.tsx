"use client"

import { useState, useEffect, useMemo, useRef } from "react"
import Can from "@/components/permission/can"
import { columns } from "./_components/columns"
import { ResponsiveTable } from "@/components/dataTable/responsive-table"
import { usePlans } from "@/hooks/use-plans"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { PlanForm, PlanFormRef } from "./_components/plan-form"
import { toast } from "sonner"
import { headers } from "./_components/headers"
import { ActionsCell } from "./_components/actions-cell"
import { Plan } from "@/types/plan"
import { ViewModeSwitcher } from "@/components/dataTable/view-mode-switcher"
import { PaginatedCards } from "@/components/dataTable/paginated-cards"
import { PlanCard } from "./_components/plan-card"
import { List, LayoutGrid } from "lucide-react"
import { MainContainer } from "@/components/layout/main-container"
import { HeaderActions } from "@/components/layout/header-actions"
import { ReloadButton } from "@/components/layout/reload-button"
import { AddButton } from "@/components/layout/add-button"
import { TableToolbar } from "@/components/dataTable/table-toolbar"
import { Button } from "@/components/ui/button"

export default function PlansPage() {
    const { plans, refreshPlans, isLoading } = usePlans()
    const [ isDialogOpen, setIsDialogOpen ] = useState(false)
    const [ currentPage, setCurrentPage ] = useState(1)
    const [ pageSize, setPageSize ] = useState(10)
    const [ viewMode, setViewMode ] = useState<"table" | "grid">("table")
    const [ isSubmitting, setIsSubmitting ] = useState(false)
    const [ searchTerm, setSearchTerm ] = useState("")
    const planFormRef = useRef<PlanFormRef>(null)

    // Filtrar planes según término de búsqueda
    const filteredPlans = useMemo(() => {
        let filtered = plans

        // Filtrar por búsqueda
        if (searchTerm.trim()) {
            const searchLower = searchTerm.toLowerCase().trim()
            filtered = filtered.filter(plan => {
                const name = plan.name?.toLowerCase() || '';
                const description = plan.description?.toLowerCase() || '';
                const serviceName = plan.service?.name?.toLowerCase() || '';
                return name.includes(searchLower) ||
                    description.includes(searchLower) ||
                    serviceName.includes(searchLower);
            })
        }

        return filtered
    }, [ plans, searchTerm ])

    const paginatedData = useMemo(() => {
        const start = (currentPage - 1) * pageSize
        const end = start + pageSize
        return filteredPlans.slice(start, end)
    }, [ filteredPlans, currentPage, pageSize ])

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

    const fetchPlans = async () => {
        try {
            await refreshPlans()
        } catch (error) {
            console.error("Error fetching plans:", error)
            toast.error("Error al cargar los planes")
        }
    }

    useEffect(() => {
        fetchPlans()
    }, [])

    const handleCreatePlan = async (result: any) => {
        try {
            // El formulario maneja la creación completa
            // Esperar un poco para asegurar que la creación se completó
            await new Promise((resolve) => setTimeout(resolve, 500));

            // Refrescar la lista de planes
            const plansData = await refreshPlans();
            console.log("Planes refrescados:", plansData);

            toast.success("Plan creado correctamente")
            setIsDialogOpen(false)
            setIsSubmitting(false)
        } catch (error: any) {
            const errorMessage = error?.response?.data?.message || error?.message || "Error al crear el plan"
            toast.error(errorMessage)
            console.error("Error creating plan:", error)
            console.error("Error details:", error?.response?.data)
            setIsSubmitting(false)
        }
    }

    return (
        <Can action="read" subject="Plan" redirectOnFail={true}>
            <MainContainer>
                <HeaderActions title="Gestión de Planes">
                    <div className="flex items-center gap-2">
                        <ReloadButton
                            onClick={fetchPlans}
                            isLoading={isLoading}
                        />
                        <Can action="create" subject="Plan">
                            <Dialog open={isDialogOpen} onOpenChange={(open) => {
                                setIsDialogOpen(open);
                                if (!open) {
                                    setIsSubmitting(false);
                                }
                            }}>
                                <DialogTrigger asChild>
                                    <AddButton text="Agregar Plan" />
                                </DialogTrigger>
                                <DialogContent className="sm:max-w-[800px] lg:max-w-[1000px] max-h-[90vh] flex flex-col p-0">
                                    <DialogHeader className="px-6 pt-6 pb-4 flex-shrink-0">
                                        <DialogTitle>Agregar Nuevo Plan</DialogTitle>
                                        <DialogDescription>
                                            Ingrese los detalles del nuevo plan aquí.
                                        </DialogDescription>
                                    </DialogHeader>
                                    <div className="flex-1 px-6 overflow-y-auto">
                                        <PlanForm ref={planFormRef} onSubmit={handleCreatePlan} onCancel={() => setIsDialogOpen(false)} />
                                    </div>
                                    <DialogFooter className="px-6 pb-6 pt-4 border-t">
                                        <Button variant="outline" onClick={() => setIsDialogOpen(false)} disabled={isSubmitting}>
                                            Cancelar
                                        </Button>
                                        <Button
                                            variant="default"
                                            onClick={() => {
                                                setIsSubmitting(true);
                                                planFormRef.current?.submit();
                                            }}
                                            disabled={isSubmitting}
                                        >
                                            {isSubmitting ? "Creando..." : "Crear Plan"}
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
                            searchPlaceholder="Buscar por nombre, descripción o servicio..."
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
                            totalRecords: filteredPlans.length,
                            pageSize: pageSize,
                            onPaginationChange: handlePaginationChange,
                            currentPage: currentPage
                        }}
                        actions={(row: Plan) => <ActionsCell rowData={row} />}
                    />
                ) : (
                    <PaginatedCards<Plan>
                        data={paginatedData}
                        isLoading={isLoading}
                        totalRecords={filteredPlans.length}
                        pageSize={pageSize}
                        onPaginationChange={handlePaginationChange}
                        renderCard={(plan: Plan) => <PlanCard plan={plan} />}
                    />
                )}
            </MainContainer>
        </Can>
    )
}
