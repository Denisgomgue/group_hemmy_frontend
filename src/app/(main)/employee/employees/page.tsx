"use client"

import { useState, useEffect, useMemo, useRef } from "react"
import Can from "@/components/permission/can"
import { columns } from "./_components/columns"
import { ResponsiveTable } from "@/components/dataTable/responsive-table"
import { useEmployees } from "@/hooks/use-employees"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { EmployeeForm, EmployeeFormRef } from "./_components/employee-form"
import { toast } from "sonner"
import { headers } from "./_components/headers"
import { ActionsCell } from "./_components/actions-cell"
import { Employee } from "@/types/employee"
import { ViewModeSwitcher } from "@/components/dataTable/view-mode-switcher"
import { PaginatedCards } from "@/components/dataTable/paginated-cards"
import { EmployeeCard } from "./_components/employee-card"
import { List, LayoutGrid } from "lucide-react"
import { MainContainer } from "@/components/layout/main-container"
import { HeaderActions } from "@/components/layout/header-actions"
import { ReloadButton } from "@/components/layout/reload-button"
import { AddButton } from "@/components/layout/add-button"
import { TableToolbar } from "@/components/dataTable/table-toolbar"
import { Button } from "@/components/ui/button"
import { EmployeesAPI } from "@/services/employees-api"

export default function EmployeesPage() {
    const { employees, refreshEmployees, isLoading } = useEmployees()
    const [ isDialogOpen, setIsDialogOpen ] = useState(false)
    const [ currentPage, setCurrentPage ] = useState(1)
    const [ pageSize, setPageSize ] = useState(10)
    const [ viewMode, setViewMode ] = useState<"table" | "grid">("table")
    const [ isSubmitting, setIsSubmitting ] = useState(false)
    const [ searchTerm, setSearchTerm ] = useState("")
    const employeeFormRef = useRef<EmployeeFormRef>(null)

    // Filtrar empleados según término de búsqueda
    const filteredEmployees = useMemo(() => {
        let filtered = employees

        // Filtrar por búsqueda
        if (searchTerm.trim()) {
            const searchLower = searchTerm.toLowerCase().trim()
            filtered = filtered.filter((employee: Employee) => {
                const firstName = employee.person?.firstName?.toLowerCase() || ''
                const lastName = employee.person?.lastName?.toLowerCase() || ''
                const email = employee.person?.email?.toLowerCase() || ''
                const phone = employee.person?.phone?.toLowerCase() || ''
                const documentNumber = employee.person?.documentNumber?.toLowerCase() || ''
                const jobTitle = employee.jobTitle?.toLowerCase() || ''

                return firstName.includes(searchLower) ||
                    lastName.includes(searchLower) ||
                    email.includes(searchLower) ||
                    phone.includes(searchLower) ||
                    documentNumber.includes(searchLower) ||
                    jobTitle.includes(searchLower)
            })
        }

        return filtered
    }, [ employees, searchTerm ])

    const paginatedData = useMemo(() => {
        const start = (currentPage - 1) * pageSize
        const end = start + pageSize
        return filteredEmployees.slice(start, end)
    }, [ filteredEmployees, currentPage, pageSize ])

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

    const fetchEmployees = async () => {
        try {
            await refreshEmployees()
        } catch (error) {
            console.error("Error fetching employees:", error)
            toast.error("Error al cargar los empleados")
        }
    }

    useEffect(() => {
        fetchEmployees()
    }, [])

    const handleCreateEmployee = async (result: any) => {
        try {
            // El formulario maneja la creación completa
            // Esperar un poco para asegurar que la creación se completó
            await new Promise((resolve) => setTimeout(resolve, 500));

            // Refrescar la lista de empleados
            const employeesData = await refreshEmployees();
            console.log("Empleados refrescados:", employeesData);

            toast.success("Empleado creado correctamente")
            setIsDialogOpen(false)
            setIsSubmitting(false)
        } catch (error: any) {
            const errorMessage = error?.response?.data?.message || error?.message || "Error al crear el empleado"
            toast.error(errorMessage)
            console.error("Error creating employee:", error)
            console.error("Error details:", error?.response?.data)
            setIsSubmitting(false)
        }
    }

    return (
        <Can action="read" subject="Employee" redirectOnFail={true}>
            <MainContainer>
                <HeaderActions title="Gestión de Empleados">
                    <div className="flex items-center gap-2">
                        <ReloadButton
                            onClick={fetchEmployees}
                            isLoading={isLoading}
                        />
                        <Can action="create" subject="Employee">
                            <Dialog open={isDialogOpen} onOpenChange={(open) => {
                                setIsDialogOpen(open);
                                if (!open) {
                                    setIsSubmitting(false);
                                }
                            }}>
                                <DialogTrigger asChild>
                                    <AddButton text="Agregar Empleado" />
                                </DialogTrigger>
                                <DialogContent className="sm:w-full md:w-[80vw] max-w-[900px]  max-h-[80vh] flex flex-col p-0">
                                    <DialogHeader className="px-6 pt-6 pb-4 flex-shrink-0">
                                        <DialogTitle>Agregar Nuevo Empleado</DialogTitle>
                                        <DialogDescription>
                                            Ingrese los detalles del nuevo empleado aquí.
                                        </DialogDescription>
                                    </DialogHeader>
                                    <div className="flex-1 px-6 overflow-y-auto">
                                        <EmployeeForm ref={employeeFormRef} onSubmit={handleCreateEmployee} onCancel={() => setIsDialogOpen(false)} />
                                    </div>
                                    <DialogFooter className="px-6 pb-6 pt-4 border-t">
                                        <Button variant="outline" onClick={() => setIsDialogOpen(false)} disabled={isSubmitting}>
                                            Cancelar
                                        </Button>
                                        <Button
                                            variant="default"
                                            onClick={() => {
                                                setIsSubmitting(true);
                                                employeeFormRef.current?.submit();
                                            }}
                                            disabled={isSubmitting}
                                        >
                                            {isSubmitting ? "Creando..." : "Crear Empleado"}
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
                            searchPlaceholder="Buscar por nombre, DNI, teléfono, cargo..."
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
                            totalRecords: filteredEmployees.length,
                            pageSize: pageSize,
                            onPaginationChange: handlePaginationChange,
                            currentPage: currentPage
                        }}
                        actions={(row: Employee) => <ActionsCell rowData={row} />}
                    />
                ) : (
                    <PaginatedCards<Employee>
                        data={paginatedData}
                        isLoading={isLoading}
                        totalRecords={filteredEmployees.length}
                        pageSize={pageSize}
                        onPaginationChange={handlePaginationChange}
                        renderCard={(employee: Employee) => <EmployeeCard employee={employee} />}
                    />
                )}
            </MainContainer>
        </Can>
    )
}
