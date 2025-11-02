"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Installation, InstallationStatus } from "@/types/installation";

export const columns: ColumnDef<Installation>[] = [
    {
        accessorKey: "client",
        header: "Cliente",
        cell: ({ row }) => {
            const client = row.original.client;
            const displayName = client?.actor?.displayName ||
                (client?.actor?.person
                    ? `${client.actor.person.firstName} ${client.actor.person.lastName}`.trim()
                    : client?.actor?.organization?.legalName) ||
                '-';
            return <span>{displayName}</span>;
        },
    },
    {
        accessorKey: "address",
        header: "Dirección",
        cell: ({ row }) => {
            const address = row.original.address || '-';
            return <span>{address}</span>;
        },
    },
    {
        accessorKey: "sector",
        header: "Sector",
        cell: ({ row }) => {
            const sectorName = row.original.sector?.name || '-';
            return <span>{sectorName}</span>;
        },
    },
    {
        accessorKey: "ipAddress",
        header: "IP",
        cell: ({ row }) => {
            const ipAddress = row.original.ipAddress || '-';
            return <span className="font-mono text-sm">{ipAddress}</span>;
        },
    },
    {
        accessorKey: "status",
        header: "Estado",
        cell: ({ row }) => {
            const status = row.original.status;
            const statusConfig = {
                [ InstallationStatus.ACTIVE ]: {
                    label: 'Activa',
                    className: 'bg-green-100 text-green-800 border-green-200',
                },
                [ InstallationStatus.INACTIVE ]: {
                    label: 'Inactiva',
                    className: 'bg-gray-100 text-gray-800 border-gray-200',
                },
            };

            const config = statusConfig[ status ] || statusConfig[ InstallationStatus.INACTIVE ];

            return (
                <Badge variant="outline" className={config.className}>
                    {config.label}
                </Badge>
            );
        },
    },
    {
        accessorKey: "installedAt",
        header: "Fecha Instalación",
        cell: ({ row }) => {
            const date = row.original.installedAt;
            if (!date) return <span>-</span>;
            return <span>{new Date(date).toLocaleDateString('es-PE')}</span>;
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

