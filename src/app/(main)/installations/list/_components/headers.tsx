"use client";

import { Badge } from "@/components/ui/badge";
import { Installation, InstallationStatus } from "@/types/installation";

export const headers = [
    {
        key: "id",
        label: "ID",
        render: (value: string, item: Installation) => {
            return <span className="font-medium">{item.id}</span>;
        },
    },
    {
        key: "client",
        label: "Cliente",
        render: (value: string, item: Installation) => {
            const client = item.client;
            const displayName = client?.actor?.displayName ||
                (client?.actor?.person
                    ? `${client.actor.person.firstName} ${client.actor.person.lastName}`.trim()
                    : client?.actor?.organization?.legalName) ||
                '-';
            return displayName;
        },
    },
    {
        key: "address",
        label: "Dirección",
        render: (value: string, item: Installation) => {
            return item.address || '-';
        },
    },
    {
        key: "sector",
        label: "Sector",
        render: (value: string, item: Installation) => {
            return item.sector?.name || '-';
        },
    },
    {
        key: "ipAddress",
        label: "IP",
        render: (value: string, item: Installation) => {
            return item.ipAddress ? <span className="font-mono text-sm">{item.ipAddress}</span> : '-';
        },
    },
    {
        key: "status",
        label: "Estado",
        render: (value: string, item: Installation) => {
            const status = item.status;
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
        key: "installedAt",
        label: "Fecha Instalación",
        render: (value: string, item: Installation) => {
            if (!item.installedAt) return '-';
            const date = new Date(item.installedAt);
            return date.toLocaleDateString('es-PE');
        },
    },
    {
        key: "created_at",
        label: "Fecha Creación",
        render: (value: string, item: Installation) => {
            const date = new Date(item.created_at);
            return date.toLocaleDateString('es-PE');
        },
    },
];

