"use client";

import { Equipment, EquipmentStatus } from "@/types/equipment";
import { Badge } from "@/components/ui/badge";
import { Package, Building } from "lucide-react";
import { format } from "date-fns";
import { es } from 'date-fns/locale';
import { ActionsCell } from "./actions-cell";

interface EquipmentCardProps {
    equipment: Equipment;
}

export function EquipmentCard({ equipment }: EquipmentCardProps) {
    if (!equipment) return null;

    const statusConfig: Record<EquipmentStatus, { label: string; className: string }> = {
        [ EquipmentStatus.STOCK ]: { label: "En Stock", className: "bg-gray-500" },
        [ EquipmentStatus.ASSIGNED ]: { label: "Asignado", className: "bg-blue-500" },
        [ EquipmentStatus.SOLD ]: { label: "Vendido", className: "bg-green-500" },
        [ EquipmentStatus.MAINTENANCE ]: { label: "Mantenimiento", className: "bg-yellow-500" },
        [ EquipmentStatus.LOST ]: { label: "Perdido", className: "bg-red-500" },
        [ EquipmentStatus.USED ]: { label: "En Uso", className: "bg-purple-500" },
    };
    const config = statusConfig[ equipment.status ];

    // Obtener nombre del empleado
    const getEmployeeName = () => {
        if (equipment.employee?.person) {
            return `${equipment.employee.person.firstName} ${equipment.employee.person.lastName}`.trim();
        }
        return '-';
    };

    const assignedTo = getEmployeeName();
    const jobTitle = equipment.employee?.jobTitle;

    const topSectionContent = (
        <div className="flex items-center justify-between mb-4 gap-2">
            <div className="flex-1">
                <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                        <Building className="h-5 w-5 text-blue-600" />
                    </div>
                    <div className="flex-1">
                        <div className="font-semibold">
                            {equipment.brand || 'Sin marca'} {equipment.model || ''}
                        </div>
                        <div className="text-sm text-muted-foreground">{equipment.category?.name}</div>
                    </div>
                </div>
            </div>
            <ActionsCell rowData={equipment} />
        </div>
    );

    const middleSectionContent = (
        <div className="grid grid-cols-2 gap-x-4 gap-y-3 text-sm mb-4">
            <div>
                <div className="text-xs text-muted-foreground mb-0.5">Estado</div>
                <Badge variant="default" className={config.className}>
                    {config.label}
                </Badge>
            </div>
            <div>
                <div className="text-xs text-muted-foreground mb-0.5">Tipo de Uso</div>
                <Badge variant="outline" className="border-blue-300 text-blue-700">
                    Empleado
                </Badge>
            </div>
        </div>
    );

    const bottomSectionContent = (
        <div className="grid grid-cols-1 gap-y-2 text-sm">
            {equipment.serialNumber && (
                <div>
                    <div className="text-xs text-muted-foreground mb-0.5">Número de Serie</div>
                    <div className="font-medium">{equipment.serialNumber}</div>
                </div>
            )}
            {equipment.macAddress && (
                <div>
                    <div className="text-xs text-muted-foreground mb-0.5">MAC Address</div>
                    <div className="font-medium">{equipment.macAddress}</div>
                </div>
            )}
            {assignedTo !== '-' && (
                <div>
                    <div className="text-xs text-muted-foreground mb-0.5">Asignado a</div>
                    <div className="font-medium">{assignedTo}</div>
                    {jobTitle && (
                        <Badge variant="outline" className="w-fit text-xs mt-1">
                            {jobTitle}
                        </Badge>
                    )}
                </div>
            )}
            {equipment.assignedDate && (
                <div>
                    <div className="text-xs text-muted-foreground mb-0.5">Fecha de Asignación</div>
                    <div className="font-medium">
                        {format(new Date(equipment.assignedDate), "dd/MM/yyyy", { locale: es })}
                    </div>
                </div>
            )}
        </div>
    );

    return (
        <div className="p-4 border rounded-lg shadow-sm bg-card text-card-foreground">
            {topSectionContent}
            {middleSectionContent}
            {bottomSectionContent && (
                <div className="border-t pt-3 mt-4">
                    {bottomSectionContent}
                </div>
            )}
        </div>
    );
}

