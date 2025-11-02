"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { User } from "@/types/user";

export const columns: ColumnDef<User>[] = [
    {
        accessorKey: "id",
        header: "ID",
        cell: ({ row }) => {
            return <span className="font-medium">{row.original.id}</span>;
        },
    },
    {
        accessorKey: "displayName",
        header: "Nombre",
        cell: ({ row }) => {
            const displayName = row.original.actor?.displayName ||
                (row.original.actor?.person
                    ? `${row.original.actor.person.firstName} ${row.original.actor.person.lastName}`.trim()
                    : row.original.actor?.organization?.name) ||
                '-';
            return displayName;
        },
    },
    {
        accessorKey: "email",
        header: "Email",
        cell: ({ row }) => {
            const email = row.original.actor?.person?.email ||
                row.original.actor?.organization?.email ||
                '-';
            return <span>{email}</span>;
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
        accessorKey: "documentNumber",
        header: "Documento",
        cell: ({ row }) => {
            const docNumber = row.original.actor?.person?.documentNumber ||
                row.original.actor?.organization?.taxId ||
                '-';
            return <span>{docNumber}</span>;
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
        accessorKey: "isActive",
        header: "Estado",
        cell: ({ row }) => {
            const isActive = row.original.isActive;
            return (
                <Badge
                    variant="outline"
                    className={
                        isActive
                            ? "bg-green-100 text-green-800 border-green-200"
                            : "bg-red-100 text-red-800 border-red-200"
                    }
                >
                    {isActive ? "Activo" : "Inactivo"}
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

