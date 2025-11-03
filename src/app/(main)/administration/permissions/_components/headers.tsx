import { Header } from "@/components/dataTable/card-table"
import { Permission } from "@/types/permission"
import { ActionsCell } from "./actions-cell"

export const headers: Header[] = [
    {
        key: "code",
        label: "Código",
        render: (value: any, item: Permission) => (
            <div className="font-mono text-sm font-medium">
                {item.code}
            </div>
        ),
    },
    {
        key: "name",
        label: "Nombre",
        render: (value: any, item: Permission) => (
            <div className="font-semibold">
                {item.name}
            </div>
        ),
    },
    {
        key: "description",
        label: "Descripción",
        render: (value: any, item: Permission) => (
            <div className="text-sm text-muted-foreground">
                {item.description || "-"}
            </div>
        ),
    },
    {
        key: "created_at",
        label: "Fecha de Creación",
        render: (value: any, item: Permission) => {
            const date = new Date(item.created_at)
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
        key: "actions",
        label: "Acciones",
        render: (value: any, item: Permission) => <ActionsCell rowData={item} />,
    },
]

