"use client";

import { Equipment, EquipmentStatus } from "@/types/equipment";
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
        key: "assignedTo",
        label: "Asignado a",
        render: (value: string, item: Equipment) => {
            if (item.employee?.person) {
                const employeeName = `${item.employee.person.firstName} ${item.employee.person.lastName}`.trim();
                const jobTitle = item.employee.jobTitle;
                return (
                    <div className="flex flex-col gap-1">
                        <div className="font-medium">{employeeName}</div>
                        {jobTitle && (
                            <Badge variant="outline" className="w-fit text-xs">
                                {jobTitle}
                            </Badge>
                        )}
                    </div>
                );
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

