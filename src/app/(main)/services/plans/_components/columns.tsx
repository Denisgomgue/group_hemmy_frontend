"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Plan } from "@/types/plan";
import { Badge } from "@/components/ui/badge";

export const columns: ColumnDef<Plan>[] = [
    {
        accessorKey: "name",
        header: "Nombre",
        cell: ({ row }) => {
            return <span className="font-medium">{row.original.name}</span>;
        },
    },
    {
        accessorKey: "service",
        header: "Servicio",
        cell: ({ row }) => {
            const serviceName = row.original.service?.name || '-';
            return <span className="text-muted-foreground">{serviceName}</span>;
        },
    },
    {
        accessorKey: "speedMbps",
        header: "Velocidad (Mbps)",
        cell: ({ row }) => {
            const speed = row.original.speedMbps;
            return speed ? <span className="text-center">{speed} Mbps</span> : '-';
        },
    },
    {
        accessorKey: "price",
        header: "Precio",
        cell: ({ row }) => {
            const price = row.original.price;
            return (
                <span className="text-right font-semibold">
                    S/ {typeof price === 'number' ? price.toFixed(2) : price}
                </span>
            );
        },
    },
    {
        accessorKey: "type",
        header: "Tipo Web",
        cell: ({ row }) => {
            const type = row.original.type;
            return (
                <Badge variant={type ? "outline" : "secondary"} className={type ? "border-blue-500 text-blue-700" : ""}>
                    {type ? 'Web' : 'Normal'}
                </Badge>
            );
        },
    },
    {
        accessorKey: "isActive",
        header: "Estado",
        cell: ({ row }) => {
            const isActive = row.original.isActive;
            return (
                <Badge variant={isActive ? "default" : "secondary"}>
                    {isActive ? 'Activo' : 'Inactivo'}
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
