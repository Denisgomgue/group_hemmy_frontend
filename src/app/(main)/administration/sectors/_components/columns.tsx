"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Sector } from "@/types/sector";

export const columns: ColumnDef<Sector>[] = [
    {
        accessorKey: "name",
        header: "Nombre",
        cell: ({ row }) => {
            return <span className="font-medium">{row.original.name}</span>;
        },
    },
    {
        accessorKey: "description",
        header: "Descripción",
        cell: ({ row }) => {
            const description = row.original.description || '-';
            return <span className="text-muted-foreground">{description}</span>;
        },
    },
    {
        accessorKey: "created_at",
        header: "Fecha Creación",
        cell: ({ row }) => {
            const date = new Date(row.original.created_at);
            return <span>{date.toLocaleDateString('es-PE')}</span>;
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
