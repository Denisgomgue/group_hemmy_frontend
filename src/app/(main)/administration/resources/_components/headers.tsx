import { Header } from "@/components/dataTable/card-table"
import { Resource } from "@/types/resource"
import { ActionsCell } from "./actions-cell"
import { Badge } from "@/components/ui/badge"

export const headers: Header[] = [
  {
    key: "routeCode",
    label: "Código",
    render: (value: any, item: Resource) => (
      <div className="font-mono text-sm font-medium">
        {item.routeCode}
      </div>
    ),
  },
  {
    key: "name",
    label: "Nombre",
    render: (value: any, item: Resource) => (
      <div className="font-semibold">
        {item.name}
      </div>
    ),
  },
  {
    key: "description",
    label: "Descripción",
    render: (value: any, item: Resource) => (
      <div className="text-sm text-muted-foreground">
        {item.description || "-"}
      </div>
    ),
  },
  {
    key: "orderIndex",
    label: "Orden",
    render: (value: any, item: Resource) => (
      <div className="text-sm">
        {item.orderIndex}
      </div>
    ),
  },
  {
    key: "isActive",
    label: "Estado",
    render: (value: any, item: Resource) => (
      <Badge variant={item.isActive ? "default" : "secondary"}>
        {item.isActive ? "Activo" : "Inactivo"}
      </Badge>
    ),
  },
  {
    key: "actions",
    label: "Acciones",
    render: (value: any, item: Resource) => <ActionsCell rowData={item} />,
  },
]
