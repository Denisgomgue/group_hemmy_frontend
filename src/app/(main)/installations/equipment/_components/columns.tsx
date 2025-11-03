"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Equipment, EquipmentStatus, EquipmentUseType } from "@/types/equipment"
import { Badge } from "@/components/ui/badge"
import { Package, Building, Wifi } from "lucide-react"
import { format } from "date-fns"
import { es } from "date-fns/locale"

export const columns: ColumnDef<Equipment>[] = [
    {
        accessorKey: "brand",
        header: "Marca / Modelo",
        cell: ({ row }) => {
            const brand = row.original.brand;
            const model = row.original.model;
            return (
                <div className="flex items-center gap-2">
                    <div className="flex-shrink-0">
                        <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                            <Package className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                        </div>
                    </div>
                    <div>
                        <div className="font-medium">{brand || '-'}</div>
                        <div className="text-sm text-muted-foreground">{model || '-'}</div>
                    </div>
                </div>
            );
        },
    },
    {
        accessorKey: "serialNumber",
        header: "Número de Serie / MAC",
        cell: ({ row }) => (
            <div>
                <div className="font-medium">{row.original.serialNumber || '-'}</div>
                <div className="text-sm text-muted-foreground">{row.original.macAddress || '-'}</div>
            </div>
        ),
    },
    {
        accessorKey: "category",
        header: "Categoría",
        cell: ({ row }) => (
            <span className="font-medium">{row.original.category?.name || '-'}</span>
        ),
    },
    {
        accessorKey: "useType",
        header: "Tipo de Uso",
        cell: ({ row }) => {
            const useType = row.original.useType;
            const isClient = useType === EquipmentUseType.CLIENT;
            const isEmployee = useType === EquipmentUseType.EMPLOYEE;
            const isCompany = useType === EquipmentUseType.COMPANY;

            return (
                <div className="flex items-center gap-2">
                    {isClient && <Wifi className="h-4 w-4 text-purple-600" />}
                    {isEmployee && <Building className="h-4 w-4 text-blue-600" />}
                    {isCompany && <Building className="h-4 w-4 text-green-600" />}
                    <Badge
                        variant="outline"
                        className={
                            isClient ? "border-purple-300 text-purple-700" :
                                isEmployee ? "border-blue-300 text-blue-700" :
                                    "border-green-300 text-green-700"
                        }
                    >
                        {isClient ? "Cliente" : isEmployee ? "Empleado" : "Empresa"}
                    </Badge>
                </div>
            );
        },
    },
    {
        accessorKey: "assignedTo",
        header: "Asignado a",
        cell: ({ row }) => {
            const equipment = row.original;
            if (equipment.installation?.client) {
                const actor = equipment.installation.client.actor;
                let clientName = '-';
                
                if (actor?.person) {
                    clientName = `${actor.person.firstName} ${actor.person.lastName}`.trim();
                } else if (actor?.organization) {
                    clientName = actor.organization.legalName;
                } else if (actor?.displayName) {
                    clientName = actor.displayName;
                }
                
                const ipAddress = equipment.installation.ipAddress;
                
                return (
                    <div className="flex flex-col gap-1">
                        <div className="font-medium">{clientName}</div>
                        {ipAddress && (
                            <Badge variant="outline" className="w-fit text-xs">
                                {ipAddress}
                            </Badge>
                        )}
                    </div>
                );
            } else if (equipment.employee?.person) {
                return (
                    <div>
                        <div className="font-medium">
                            {equipment.employee.person.firstName} {equipment.employee.person.lastName}
                        </div>
                    </div>
                );
            }
            return <span className="text-muted-foreground">-</span>;
        },
    },
    {
        accessorKey: "status",
        header: "Estado",
        cell: ({ row }) => {
            const status = row.original.status;
            const statusConfig: Record<EquipmentStatus, { label: string; className: string }> = {
                [ EquipmentStatus.STOCK ]: { label: "En Stock", className: "bg-gray-500" },
                [ EquipmentStatus.ASSIGNED ]: { label: "Asignado", className: "bg-blue-500" },
                [ EquipmentStatus.SOLD ]: { label: "Vendido", className: "bg-green-500" },
                [ EquipmentStatus.MAINTENANCE ]: { label: "Mantenimiento", className: "bg-yellow-500" },
                [ EquipmentStatus.LOST ]: { label: "Perdido", className: "bg-red-500" },
                [ EquipmentStatus.USED ]: { label: "En Uso", className: "bg-purple-500" },
            };
            const config = statusConfig[ status ];
            return (
                <Badge variant="default" className={config.className}>
                    {config.label}
                </Badge>
            );
        },
    },
    {
        accessorKey: "assignedDate",
        header: "Fecha de Asignación",
        cell: ({ row }) => (
            <span className="text-sm">
                {row.original.assignedDate ? format(new Date(row.original.assignedDate), "dd/MM/yyyy", { locale: es }) : "-"}
            </span>
        ),
    },
    {
        id: "actions",
        header: "Acciones",
        cell: ({ row }) => {
            // Acciones serán manejadas por ResponsiveTable usando el prop actions
            return null;
        },
    },
];

