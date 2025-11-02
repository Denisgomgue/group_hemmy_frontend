"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Client, ClientStatus } from "@/types/client";

export const columns: ColumnDef<Client>[] = [
    {
        accessorKey: "displayName",
        header: "Nombre",
        cell: ({ row }) => {
            const displayName = row.original.actor?.displayName ||
                (row.original.actor?.person
                    ? `${row.original.actor.person.firstName} ${row.original.actor.person.lastName}`.trim()
                    : row.original.actor?.organization?.legalName) ||
                '-';
            return displayName;
        },
    },
    {
        accessorKey: "phone",
        header: "Teléfono",
        cell: ({ row }) => {
            const phone = row.original.actor?.person?.phone ||
                row.original.actor?.organization?.phone ||
                '-';
            return <span>{phone}</span>;
        },
    },
    {
        accessorKey: "kind",
        header: "Tipo",
        cell: ({ row }) => {
            const kind = row.original.actor?.kind;
            return (
                <Badge variant="outline">
                    {kind === 'PERSON' ? 'Persona' : kind === 'ORGANIZATION' ? 'Organización' : '-'}
                </Badge>
            );
        },
    },
    {
        accessorKey: "status",
        header: "Estado",
        cell: ({ row }) => {
            const status = row.original.status;
            const statusConfig = {
                [ ClientStatus.ACTIVE ]: {
                    label: 'Activo',
                    className: 'bg-green-100 text-green-800 border-green-200',
                },
                [ ClientStatus.INACTIVE ]: {
                    label: 'Inactivo',
                    className: 'bg-gray-100 text-gray-800 border-gray-200',
                },
                [ ClientStatus.SUSPENDED ]: {
                    label: 'Suspendido',
                    className: 'bg-red-100 text-red-800 border-red-200',
                },
            };

            const config = statusConfig[ status ] || statusConfig[ ClientStatus.INACTIVE ];

            return (
                <Badge variant="outline" className={config.className}>
                    {config.label}
                </Badge>
            );
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

