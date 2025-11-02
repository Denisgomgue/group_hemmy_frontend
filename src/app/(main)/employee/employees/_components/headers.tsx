"use client";

import { Employee } from "@/types/employee";

export const headers = [
    {
        key: "person",
        label: "Empleado",
        render: (value: string, item: Employee) => {
            const person = item.person;
            if (!person) return <span className="text-muted-foreground">Sin persona</span>;
            return <span className="font-medium">{person.firstName} {person.lastName}</span>;
        },
    },
    {
        key: "jobTitle",
        label: "Cargo",
        render: (value: string, item: Employee) => {
            return item.jobTitle || '-';
        },
    },
    {
        key: "hireDate",
        label: "Fecha Contratación",
        render: (value: string, item: Employee) => {
            if (!item.hireDate) return '-';
            const date = new Date(item.hireDate);
            return date.toLocaleDateString('es-PE');
        },
    },
    {
        key: "status",
        label: "Estado",
        render: (value: string, item: Employee) => {
            return <span className={item.status === 'ACTIVE' ? 'text-green-600' : 'text-gray-600'}>{item.status === 'ACTIVE' ? 'Activo' : 'Inactivo'}</span>;
        },
    },
];

