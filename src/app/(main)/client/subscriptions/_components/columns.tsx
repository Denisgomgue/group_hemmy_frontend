"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Subscription, SubscriptionStatus } from "@/types/subscription";

export const columns: ColumnDef<Subscription>[] = [
    {
        accessorKey: "installation",
        header: "Instalación",
        cell: ({ row }) => {
            const installation = row.original.installation;
            const clientDisplay = installation?.client?.actor?.displayName ||
                (installation?.client?.actor?.person
                    ? `${installation.client.actor.person.firstName} ${installation.client.actor.person.lastName}`.trim()
                    : installation?.client?.actor?.organization?.legalName) ||
                'Sin cliente';
            const sector = installation?.sector?.name;
            return (
                <div className="flex flex-col">
                    <span className="font-medium">{clientDisplay}</span>
                    {sector && <span className="text-sm text-muted-foreground">{sector}</span>}
                </div>
            );
        },
    },
    {
        accessorKey: "plan",
        header: "Plan",
        cell: ({ row }) => {
            const planName = row.original.plan?.name || '-';
            const serviceName = row.original.plan?.service?.name || '';
            return (
                <div className="flex flex-col">
                    <span className="font-medium">{planName}</span>
                    {serviceName && <span className="text-sm text-muted-foreground">{serviceName}</span>}
                </div>
            );
        },
    },
    {
        accessorKey: "startDate",
        header: "Fecha Inicio",
        cell: ({ row }) => {
            const date = new Date(row.original.startDate);
            return <span>{date.toLocaleDateString('es-PE')}</span>;
        },
    },
    {
        accessorKey: "endDate",
        header: "Fecha Fin",
        cell: ({ row }) => {
            const date = row.original.endDate ? new Date(row.original.endDate) : null;
            return <span>{date ? date.toLocaleDateString('es-PE') : '-'}</span>;
        },
    },
    {
        accessorKey: "billingDay",
        header: "Día Fact.",
        cell: ({ row }) => {
            return <span className="text-center">{row.original.billingDay}</span>;
        },
    },
    {
        accessorKey: "status",
        header: "Estado",
        cell: ({ row }) => {
            const status = row.original.status;
            const statusConfig = {
                [ SubscriptionStatus.ACTIVE ]: {
                    label: 'Activa',
                    className: 'bg-green-100 text-green-800 border-green-200',
                },
                [ SubscriptionStatus.INACTIVE ]: {
                    label: 'Inactiva',
                    className: 'bg-gray-100 text-gray-800 border-gray-200',
                },
                [ SubscriptionStatus.SUSPENDED ]: {
                    label: 'Suspendida',
                    className: 'bg-yellow-100 text-yellow-800 border-yellow-200',
                },
                [ SubscriptionStatus.CANCELLED ]: {
                    label: 'Cancelada',
                    className: 'bg-red-100 text-red-800 border-red-200',
                },
            };

            const config = statusConfig[ status ] || statusConfig[ SubscriptionStatus.INACTIVE ];

            return (
                <Badge variant="outline" className={config.className}>
                    {config.label}
                </Badge>
            );
        },
    },
    {
        accessorKey: "advancePayment",
        header: "Anticipo",
        cell: ({ row }) => {
            const advance = row.original.advancePayment;
            return (
                <Badge variant={advance ? "outline" : "secondary"} className={advance ? "border-blue-500 text-blue-700" : ""}>
                    {advance ? 'Sí' : 'No'}
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

