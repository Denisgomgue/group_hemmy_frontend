import { ColumnDef } from "@tanstack/react-table"
import { Permission } from "@/types/permission"
import { ActionsCell } from "./actions-cell"

export const columns: ColumnDef<Permission>[] = [
    {
        accessorKey: "code",
        header: "Código",
        cell: ({ row }) => (
            <div className="font-mono text-sm">
                {row.original.code}
            </div>
        ),
    },
    {
        accessorKey: "name",
        header: "Nombre",
        cell: ({ row }) => (
            <div className="font-medium">
                {row.original.name}
            </div>
        ),
    },
    {
        accessorKey: "description",
        header: "Descripción",
        cell: ({ row }) => (
            <div className="text-sm text-muted-foreground max-w-md truncate">
                {row.original.description || "-"}
            </div>
        ),
    },
    {
        accessorKey: "created_at",
        header: "Fecha de Creación",
        cell: ({ row }) => {
            const date = new Date(row.original.created_at)
            return (
                <div className="text-sm">
                    {date.toLocaleDateString("es-ES", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                    })}
                </div>
            )
        },
    },
    {
        id: "actions",
        header: "Acciones",
        cell: ({ row }) => <ActionsCell rowData={row.original} />,
    },
]

