"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Employee, EmployeeStatus } from "@/types/employee"
import { Badge } from "@/components/ui/badge"
import { User } from "lucide-react"
import { format } from "date-fns"
import { es } from "date-fns/locale"

export const columns: ColumnDef<Employee>[] = [
    {
        accessorKey: "person",
        header: "Empleado",
        cell: ({ row }) => {
            const person = row.original.person;
            if (!person) return <span className="text-muted-foreground">Sin persona</span>;

            return (
                <div className="flex items-center gap-3">
                    <div className="flex-shrink-0">
                        <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                            <User className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                        </div>
                    </div>
                    <div>
                        <div className="font-medium">{person.firstName} {person.lastName}</div>
                        <div className="text-sm text-muted-foreground">{person.email}</div>
                    </div>
                </div>
            );
        },
    },
    {
        accessorKey: "jobTitle",
        header: "Cargo",
        cell: ({ row }) => (
            <span>{row.original.jobTitle || "-"}</span>
        ),
    },
    {
        accessorKey: "hireDate",
        header: "Fecha Contratación",
        cell: ({ row }) => (
            <span className="text-sm">
                {row.original.hireDate ? format(new Date(row.original.hireDate), "dd/MM/yyyy", { locale: es }) : "-"}
            </span>
        ),
    },
    {
        accessorKey: "status",
        header: "Estado",
        cell: ({ row }) => {
            const status = row.original.status;
            return (
                <Badge
                    variant={status === EmployeeStatus.ACTIVE ? "default" : "secondary"}
                    className={status === EmployeeStatus.ACTIVE ? "bg-green-500" : "bg-gray-500"}
                >
                    {status === EmployeeStatus.ACTIVE ? "Activo" : "Inactivo"}
                </Badge>
            );
        },
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
