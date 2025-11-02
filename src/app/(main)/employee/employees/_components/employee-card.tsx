"use client";

import { Employee, EmployeeStatus } from "@/types/employee";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { format } from "date-fns";
import { es } from 'date-fns/locale';
import { User, Calendar } from "lucide-react";
import { ActionsCell } from "./actions-cell";

interface EmployeeCardProps {
    employee: Employee;
}

export function EmployeeCard({ employee }: EmployeeCardProps) {
    if (!employee) return null;

    const person = employee.person;
    if (!person) return <div className="p-4 border rounded-lg">Sin información de persona</div>;

    const fullName = `${person.firstName} ${person.lastName}`.trim();
    const initials = `${person.firstName.charAt(0)}${person.lastName.charAt(0)}`.toUpperCase();

    const topSectionContent = (
        <div className="flex items-center justify-between mb-4 gap-2">
            <div className="flex-1">
                <div className="flex items-center gap-3">
                    <Avatar className="h-9 w-9 text-sm">
                        <AvatarFallback className="bg-purple-700 text-white">{initials}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                        <div className="font-semibold">{fullName}</div>
                        <div className="text-sm text-muted-foreground">{person.email}</div>
                    </div>
                </div>
            </div>
            <ActionsCell rowData={employee} />
        </div>
    );

    const middleSectionContent = (
        <div className="grid grid-cols-2 gap-x-4 gap-y-3 text-sm mb-4">
            <div>
                <div className="text-xs text-muted-foreground mb-0.5">Cargo</div>
                <div className="flex items-center gap-1.5">
                    <span className="text-xs">
                        {employee.jobTitle || "No especificado"}
                    </span>
                </div>
            </div>
            <div>
                <div className="text-xs text-muted-foreground mb-0.5">Estado</div>
                <div className="flex items-center gap-1.5">
                    <Badge
                        variant={employee.status === EmployeeStatus.ACTIVE ? "default" : "secondary"}
                        className={employee.status === EmployeeStatus.ACTIVE ? "bg-green-500" : "bg-gray-500"}
                    >
                        {employee.status === EmployeeStatus.ACTIVE ? "Activo" : "Inactivo"}
                    </Badge>
                </div>
            </div>
        </div>
    );

    const bottomSectionContent = (
        <div className="grid grid-cols-1 gap-y-2 text-sm">
            {employee.hireDate && (
                <div>
                    <div className="text-xs text-muted-foreground mb-0.5">Fecha de Contratación</div>
                    <div className="flex items-center gap-1.5">
                        <Calendar className="h-3 w-3" />
                        <span className="text-xs">
                            {format(new Date(employee.hireDate), "dd/MM/yyyy", { locale: es })}
                        </span>
                    </div>
                </div>
            )}
            <div>
                <div className="text-xs text-muted-foreground mb-0.5">Fecha de Registro</div>
                <div className="flex items-center gap-1.5">
                    <Calendar className="h-3 w-3" />
                    <span className="text-xs">
                        {format(new Date(employee.created_at), "dd/MM/yyyy", { locale: es })}
                    </span>
                </div>
            </div>
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
