"use client"

import { useState, useEffect, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { RefreshCw } from "lucide-react"
import Can from "@/components/permission/can"
import { columns } from "./_components/columns"
import { GeneralTable } from "@/components/dataTable/table"
import { useUsers } from "@/hooks/use-users"
import { toast } from "sonner"
import { ResponsiveTable } from "@/components/dataTable/responsive-table"
import { headers } from "./_components/headers"
import { ActionsCell } from "./_components/actions-cell"
import { User } from "@/types/user"
import { ViewModeSwitcher } from "@/components/dataTable/view-mode-switcher"
import { PaginatedCards } from "@/components/dataTable/paginated-cards"
import { UserCard } from "./_components/user-card"
import { List, LayoutGrid } from "lucide-react"

export default function UsersPage() {
    const { users, refreshUsers, isLoading } = useUsers()
    const [ currentPage, setCurrentPage ] = useState(1)
    const [ pageSize, setPageSize ] = useState(10)
    const [ viewMode, setViewMode ] = useState<"table" | "grid">("table")

    const paginatedData = useMemo(() => {
        const start = (currentPage - 1) * pageSize
        const end = start + pageSize
        return users.slice(start, end)
    }, [ users, currentPage, pageSize ])

    const handlePaginationChange = (page: number, newPageSize: number) => {
        setCurrentPage(page)
        if (newPageSize !== pageSize) {
            setPageSize(newPageSize)
            setCurrentPage(1)
        }
    }

    const fetchUsers = async () => {
        try {
            await refreshUsers();
        } catch (error) {
            console.error("Error fetching users:", error);
            toast.error("Error al cargar los usuarios");
        }
    };

    useEffect(() => {
        fetchUsers()
    }, [ refreshUsers ])

    return (
        <Can action="ver-usuario" subject="configuracion-usuario" redirectOnFail={true}>
            <div className="container mx-auto bg-white dark:bg-slate-900 p-4 rounded-md border">
                <div className="flex flex-col md:flex-row justify-between items-center mb-3 gap-4">
                    <h1 className="text-xl md:text-3xl mb-4 font-bold">Usuarios</h1>
                    <div className="flex md:flex-row flex-col justify-between items-center gap-2">
                        <ViewModeSwitcher
                            viewMode={viewMode}
                            setViewMode={(mode: string) => setViewMode(mode as "table" | "grid")}
                            modes={[
                                { value: "table", icon: <List className="h-4 w-4" />, label: "Tabla" },
                                { value: "grid", icon: <LayoutGrid className="h-4 w-4" />, label: "Cuadrícula" },
                            ]}
                        />
                        {/* 
                            NOTA: Los usuarios NO se crean directamente desde aquí.
                            Se crean cuando se crea un Cliente o Empleado.
                            Ver: ARQUITECTURA_CLIENTES_EMPLEADOS_USUARIOS.md
                        */}
                        <Button
                            variant="outline"
                            onClick={() => fetchUsers()}
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <RefreshCw className="h-4 w-4 animate-spin" />
                            ) : (
                                <RefreshCw className="h-4 w-4" />
                            )}
                            Recargar Datos
                        </Button>
                    </div>
                </div>

                {viewMode === "table" ? (
                    <ResponsiveTable
                        columns={columns}
                        headers={headers}
                        data={paginatedData}
                        isLoading={isLoading}
                        pagination={{
                            totalRecords: users.length,
                            pageSize: pageSize,
                            onPaginationChange: handlePaginationChange,
                            currentPage: currentPage
                        }}
                        actions={(row: User) => <ActionsCell rowData={row} />}
                    />
                ) : (
                    <PaginatedCards<User>
                        data={paginatedData}
                        isLoading={isLoading}
                        totalRecords={users.length}
                        pageSize={pageSize}
                        onPaginationChange={handlePaginationChange}
                        renderCard={(user: User) => <UserCard user={user} />}
                    />
                )}
            </div>
        </Can>
    )
}