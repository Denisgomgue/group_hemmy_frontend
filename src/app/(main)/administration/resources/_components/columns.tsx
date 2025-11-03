import { ColumnDef } from "@tanstack/react-table"
import { Resource } from "@/types/resource"
import { ActionsCell } from "./actions-cell"
import { Badge } from "@/components/ui/badge"

export const columns: ColumnDef<Resource>[] = [
    {
        accessorKey: "routeCode",
        header: "Código",
        cell: ({ row }) => (
            <div className="font-mono text-sm">
                {row.original.routeCode}
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
        accessorKey: "orderIndex",
        header: "Orden",
        cell: ({ row }) => (
            <div className="text-sm">
                {row.original.orderIndex}
            </div>
        ),
    },
    {
        accessorKey: "isActive",
        header: "Estado",
        cell: ({ row }) => (
            <Badge variant={row.original.isActive ? "default" : "secondary"}>
                {row.original.isActive ? "Activo" : "Inactivo"}
            </Badge>
        ),
    },
    {
        id: "actions",
        header: "Acciones",
        cell: ({ row }) => <ActionsCell rowData={row.original} />,
    },
]
