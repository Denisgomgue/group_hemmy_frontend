"use client";

import { Badge } from "@/components/ui/badge";
import { Subscription, SubscriptionStatus } from "@/types/subscription";

export const headers = [
    {
        key: "id",
        label: "ID",
        render: (value: string, item: Subscription) => {
            return <span className="font-medium">{item.id}</span>;
        },
    },
    {
        key: "installation",
        label: "Instalación",
        render: (value: string, item: Subscription) => {
            const installation = item.installation;
            const clientDisplay = installation?.client?.actor?.displayName ||
                (installation?.client?.actor?.person
                    ? `${installation.client.actor.person.firstName} ${installation.client.actor.person.lastName}`.trim()
                    : installation?.client?.actor?.organization?.legalName) ||
                'Sin cliente';
            const sector = installation?.sector?.name;
            return (
                <div>
                    <div className="font-medium">{clientDisplay}</div>
                    {sector && <div className="text-sm text-muted-foreground">{sector}</div>}
                </div>
            );
        },
    },
    {
        key: "plan",
        label: "Plan",
        render: (value: string, item: Subscription) => {
            const planName = item.plan?.name || '-';
            const serviceName = item.plan?.service?.name || '';
            return (
                <div>
                    <div className="font-medium">{planName}</div>
                    {serviceName && <div className="text-sm text-muted-foreground">{serviceName}</div>}
                </div>
            );
        },
    },
    {
        key: "startDate",
        label: "Inicio",
        render: (value: string, item: Subscription) => {
            const date = new Date(item.startDate);
            return date.toLocaleDateString('es-PE');
        },
    },
    {
        key: "endDate",
        label: "Fin",
        render: (value: string, item: Subscription) => {
            const date = item.endDate ? new Date(item.endDate) : null;
            return date ? date.toLocaleDateString('es-PE') : '-';
        },
    },
    {
        key: "billingDay",
        label: "Día Fact.",
        render: (value: string, item: Subscription) => {
            return item.billingDay;
        },
    },
    {
        key: "status",
        label: "Estado",
        render: (value: string, item: Subscription) => {
            const status = item.status;
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
        key: "advancePayment",
        label: "Anticipo",
        render: (value: string, item: Subscription) => {
            return item.advancePayment ? 'Sí' : 'No';
        },
    },
];

