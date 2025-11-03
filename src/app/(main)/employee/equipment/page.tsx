"use client"

import { useState, useEffect, useMemo, useRef } from "react"
import Can from "@/components/permission/can"
import { columns } from "./_components/columns"
import { ResponsiveTable } from "@/components/dataTable/responsive-table"
import { useEquipment } from "@/hooks/use-equipment"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { EquipmentForm, EquipmentFormRef } from "./_components/equipment-form"
import { toast } from "sonner"
import { headers } from "./_components/headers"
import { ActionsCell } from "./_components/actions-cell"
import { Equipment, EquipmentUseType } from "@/types/equipment"
import { ViewModeSwitcher } from "@/components/dataTable/view-mode-switcher"
import { PaginatedCards } from "@/components/dataTable/paginated-cards"
import { EquipmentCard } from "./_components/equipment-card"
import { List, LayoutGrid } from "lucide-react"
import { MainContainer } from "@/components/layout/main-container"
import { HeaderActions } from "@/components/layout/header-actions"
import { ReloadButton } from "@/components/layout/reload-button"
import { AddButton } from "@/components/layout/add-button"
import { TableToolbar } from "@/components/dataTable/table-toolbar"
import { Button } from "@/components/ui/button"
import { EquipmentAPI } from "@/services/equipment-api"

export default function EmployeeEquipmentPage() {
    const { equipment, refreshEquipment, isLoading } = useEquipment()
    const [ isDialogOpen, setIsDialogOpen ] = useState(false)
    const [ currentPage, setCurrentPage ] = useState(1)
    const [ pageSize, setPageSize ] = useState(10)
    const [ viewMode, setViewMode ] = useState<"table" | "grid">("table")
    const [ isSubmitting, setIsSubmitting ] = useState(false)
    const [ searchTerm, setSearchTerm ] = useState("")
    const equipmentFormRef = useRef<EquipmentFormRef>(null)

    // Filtrar equipos solo de empleados y según término de búsqueda
    const filteredEquipment = useMemo(() => {
        let filtered = equipment.filter((item: Equipment) => item.useType === EquipmentUseType.EMPLOYEE)

        // Filtrar por búsqueda
        if (searchTerm.trim()) {
            const searchLower = searchTerm.toLowerCase().trim()
            filtered = filtered.filter((item: Equipment) => {
                const brand = item.brand?.toLowerCase() || ''
                const model = item.model?.toLowerCase() || ''
                const serialNumber = item.serialNumber?.toLowerCase() || ''
                const macAddress = item.macAddress?.toLowerCase() || ''
                const category = item.category?.name?.toLowerCase() || ''
                const employeeName = item.employee?.person 
                    ? `${item.employee.person.firstName} ${item.employee.person.lastName}`.toLowerCase()
                    : ''

                return brand.includes(searchLower) ||
                    model.includes(searchLower) ||
                    serialNumber.includes(searchLower) ||
                    macAddress.includes(searchLower) ||
                    category.includes(searchLower) ||
                    employeeName.includes(searchLower)
            })
        }

        return filtered
    }, [ equipment, searchTerm ])

    const paginatedData = useMemo(() => {
        const start = (currentPage - 1) * pageSize
        const end = start + pageSize
        return filteredEquipment.slice(start, end)
    }, [ filteredEquipment, currentPage, pageSize ])

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

    const fetchEquipment = async () => {
        try {
            await refreshEquipment()
        } catch (error) {
            console.error("Error fetching equipment:", error)
            toast.error("Error al cargar los equipos")
        }
    }

    useEffect(() => {
        fetchEquipment()
    }, [])

    const handleCreateEquipment = async (result: any) => {
        try {
            toast.success("Equipo creado correctamente")
            setIsDialogOpen(false)
            await refreshEquipment()
        } catch (error: any) {
            const errorMessage = error?.response?.data?.message || error?.message || "Error al crear el equipo"
            toast.error(errorMessage)
            console.error("Error creating equipment:", error)
        }
    }

    const handleDeleteEquipment = async (equipmentId: string) => {
        try {
            const idAsNumber = parseInt(equipmentId, 10);
            if (isNaN(idAsNumber)) {
                toast.error("ID de equipo inválido");
                return;
            }
            await EquipmentAPI.delete(idAsNumber);
            await refreshEquipment();
            toast.success("Equipo eliminado correctamente");
        } catch (error: any) {
            const errorMessage = error?.response?.data?.message || error?.message || "Error al eliminar el equipo";
            toast.error(errorMessage);
            console.error("Error deleting equipment:", error);
        }
    };

    return (
        <Can action="read" subject="Equipment" redirectOnFail={true}>
            <MainContainer>
                <HeaderActions title="Equipos Asignados a Empleados">
                    <div className="flex items-center gap-2">
                        <ReloadButton
                            onClick={fetchEquipment}
                            isLoading={isLoading}
                        />
                        <Can action="create" subject="Equipment">
                            <Dialog open={isDialogOpen} onOpenChange={(open) => {
                                setIsDialogOpen(open);
                                if (!open) {
                                    setIsSubmitting(false);
                                }
                            }}>
                                <DialogTrigger asChild>
                                    <AddButton text="Agregar Equipo" />
                                </DialogTrigger>
                                <DialogContent className="sm:max-w-[900px] lg:max-w-[1100px] max-h-[90vh] flex flex-col p-0">
                                    <DialogHeader className="px-6 pt-6 pb-4 flex-shrink-0">
                                        <DialogTitle>Agregar Nuevo Equipo</DialogTitle>
                                        <DialogDescription>
                                            Ingrese los detalles del nuevo equipo para empleados aquí.
                                        </DialogDescription>
                                    </DialogHeader>
                                    <div className="flex-1 px-6 overflow-y-auto">
                                        <EquipmentForm ref={equipmentFormRef} onSubmit={handleCreateEquipment} onCancel={() => setIsDialogOpen(false)} />
                                    </div>
                                    <DialogFooter className="px-6 pb-6 pt-4 border-t">
                                        <Button variant="outline" onClick={() => setIsDialogOpen(false)} disabled={isSubmitting}>
                                            Cancelar
                                        </Button>
                                        <Button
                                            variant="default"
                                            onClick={() => {
                                                setIsSubmitting(true);
                                                equipmentFormRef.current?.submit();
                                            }}
                                            disabled={isSubmitting}
                                        >
                                            {isSubmitting ? "Creando..." : "Crear Equipo"}
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
                            searchPlaceholder="Buscar por marca, modelo, serie, MAC, categoría, empleado..."
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
                            totalRecords: filteredEquipment.length,
                            pageSize: pageSize,
                            onPaginationChange: handlePaginationChange,
                            currentPage: currentPage
                        }}
                        actions={(row: Equipment) => <ActionsCell rowData={row} />}
                    />
                ) : (
                    <PaginatedCards<Equipment>
                        data={paginatedData}
                        isLoading={isLoading}
                        totalRecords={filteredEquipment.length}
                        pageSize={pageSize}
                        onPaginationChange={handlePaginationChange}
                        renderCard={(equipment: Equipment) => <EquipmentCard equipment={equipment} />}
                    />
                )}
            </MainContainer>
        </Can>
    )
}

