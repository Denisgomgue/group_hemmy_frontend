"use client";

import { Badge } from "@/components/ui/badge";
import { Client, ClientStatus } from "@/types/client";

export const headers = [
    {
        key: "id",
        label: "ID",
        render: (value: string, item: Client) => {
            return <span className="font-medium">{item.id}</span>;
        },
    },
    {
        key: "displayName",
        label: "Nombre",
        render: (value: string, item: Client) => {
            const displayName = item.actor?.displayName ||
                (item.actor?.person
                    ? `${item.actor.person.firstName} ${item.actor.person.lastName}`.trim()
                    : item.actor?.organization?.legalName) ||
                '-';
            return displayName;
        },
    },
    {
        key: "email",
        label: "Email",
        render: (value: string, item: Client) => {
            const email = item.actor?.person?.email ||
                item.actor?.organization?.email ||
                '-';
            return email;
        },
    },
    {
        key: "phone",
        label: "Teléfono",
        render: (value: string, item: Client) => {
            const phone = item.actor?.person?.phone ||
                item.actor?.organization?.phone ||
                '-';
            return phone;
        },
    },
    {
        key: "documentNumber",
        label: "Documento",
        render: (value: string, item: Client) => {
            const actor = item.actor;
            if (actor?.person) {
                return actor.person.documentNumber || '-';
            }
            if (actor?.organization) {
                return actor.organization.documentNumber || '-';
            }
            return '-';
        },
    },
    {
        key: "kind",
        label: "Tipo",
        render: (value: string, item: Client) => {
            const kind = item.actor?.kind;
            return (
                <Badge variant="outline">
                    {kind === 'PERSON' ? 'Persona' : kind === 'ORGANIZATION' ? 'Organización' : '-'}
                </Badge>
            );
        },
    },
    {
        key: "status",
        label: "Estado",
        render: (value: string, item: Client) => {
            const status = item.status;
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
        key: "created_at",
        label: "Fecha Creación",
        render: (value: string, item: Client) => {
            const date = new Date(item.created_at);
            return date.toLocaleDateString('es-PE');
        },
    },
];

