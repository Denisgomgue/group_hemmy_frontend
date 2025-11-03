import { Header } from "@/components/dataTable/card-table"
import { Role } from "@/types/role"
import { ActionsCell } from "./actions-cell"
import { Badge } from "@/components/ui/badge"

export const headers: Header[] = [
    {
        key: "code",
        label: "Código",
        render: (value: any, item: Role) => (
            <div className="font-mono text-sm font-medium">
                {item.code}
            </div>
        ),
    },
    {
        key: "name",
        label: "Nombre",
        render: (value: any, item: Role) => (
            <div className="font-semibold">
                {item.name}
            </div>
        ),
    },
    {
        key: "description",
        label: "Descripción",
        render: (value: any, item: Role) => (
            <div className="text-sm text-muted-foreground">
                {item.description || "-"}
            </div>
        ),
    },
    {
        key: "isSystem",
        label: "Tipo",
        render: (value: any, item: Role) => (
            <Badge variant={item.isSystem ? "default" : "outline"}>
                {item.isSystem ? "Sistema" : "Personalizado"}
            </Badge>
        ),
    },
    {
        key: "created_at",
        label: "Fecha de Creación",
        render: (value: any, item: Role) => {
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
        render: (value: any, item: Role) => <ActionsCell rowData={item} />,
    },
]

