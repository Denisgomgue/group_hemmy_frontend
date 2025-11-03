"use client";

import { Equipment, EquipmentStatus, EquipmentUseType } from "@/types/equipment";
import { Badge } from "@/components/ui/badge";

export const headers = [
    {
        key: "brand",
        label: "Marca / Modelo",
        render: (value: string, item: Equipment) => {
            const brand = item.brand || '-';
            const model = item.model || '-';
            return (
                <div>
                    <div className="font-medium">{brand}</div>
                    <div className="text-sm text-muted-foreground">{model}</div>
                </div>
            );
        },
    },
    {
        key: "serialNumber",
        label: "Número de Serie / MAC",
        render: (value: string, item: Equipment) => {
            return (
                <div>
                    <div className="font-medium">{item.serialNumber || '-'}</div>
                    <div className="text-sm text-muted-foreground">{item.macAddress || '-'}</div>
                </div>
            );
        },
    },
    {
        key: "category",
        label: "Categoría",
        render: (value: string, item: Equipment) => {
            return item.category?.name || '-';
        },
    },
    {
        key: "useType",
        label: "Tipo de Uso",
        render: (value: string, item: Equipment) => {
            const useType = item.useType;
            const isClient = useType === EquipmentUseType.CLIENT;
            const isEmployee = useType === EquipmentUseType.EMPLOYEE;
            const isCompany = useType === EquipmentUseType.COMPANY;

            return (
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
            );
        },
    },
    {
        key: "assignedTo",
        label: "Asignado a",
        render: (value: string, item: Equipment) => {
            if (item.installation?.client) {
                const actor = item.installation.client.actor;
                let clientName = '-';
                
                if (actor?.person) {
                    clientName = `${actor.person.firstName} ${actor.person.lastName}`.trim();
                } else if (actor?.organization) {
                    clientName = actor.organization.legalName;
                } else if (actor?.displayName) {
                    clientName = actor.displayName;
                }
                
                const ipAddress = item.installation.ipAddress;
                
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
            } else if (item.employee?.person) {
                return `${item.employee.person.firstName} ${item.employee.person.lastName}`;
            }
            return '-';
        },
    },
    {
        key: "status",
        label: "Estado",
        render: (value: string, item: Equipment) => {
            const status = item.status;
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
        key: "assignedDate",
        label: "Fecha de Asignación",
        render: (value: string, item: Equipment) => {
            if (!item.assignedDate) return '-';
            const date = new Date(item.assignedDate);
            return date.toLocaleDateString('es-PE');
        },
    },
];

