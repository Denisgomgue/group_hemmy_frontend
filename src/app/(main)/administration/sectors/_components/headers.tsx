"use client";

import { Sector } from "@/types/sector";

export const headers = [
    {
        key: "id",
        label: "ID",
        render: (value: string, item: Sector) => {
            return <span className="font-medium">{item.id}</span>;
        },
    },
    {
        key: "name",
        label: "Nombre",
        render: (value: string, item: Sector) => {
            return <span className="font-medium">{item.name}</span>;
        },
    },
    {
        key: "description",
        label: "Descripción",
        render: (value: string, item: Sector) => {
            return item.description || '-';
        },
    },
    {
        key: "created_at",
        label: "Fecha Creación",
        render: (value: string, item: Sector) => {
            const date = new Date(item.created_at);
            return date.toLocaleDateString('es-PE');
        },
    },
];
