"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Subscription, SubscriptionStatus } from "@/types/subscription";
import { Calendar, MapPin, Network, DollarSign } from "lucide-react";
import { ActionsCell } from "./actions-cell";
import React from "react";

interface SubscriptionCardProps {
    subscription: Subscription;
}

export function SubscriptionCard({ subscription }: SubscriptionCardProps) {
    const installation = subscription.installation;
    const clientDisplay = installation?.client?.actor?.displayName ||
        (installation?.client?.actor?.person
            ? `${installation.client.actor.person.firstName} ${installation.client.actor.person.lastName}`.trim()
            : installation?.client?.actor?.organization?.legalName) ||
        'Sin cliente';
    const sector = installation?.sector?.name;
    const planName = subscription.plan?.name || 'Sin plan';
    const serviceName = subscription.plan?.service?.name || '';
    const planPrice = subscription.plan?.price;

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

    const config = statusConfig[ subscription.status ] || statusConfig[ SubscriptionStatus.INACTIVE ];

    return (
        <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                    <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                            <Network className="h-5 w-5 text-blue-600" />
                            <h3 className="font-semibold text-lg">{planName}</h3>
                        </div>
                        {serviceName && (
                            <span className="text-sm text-muted-foreground">{serviceName}</span>
                        )}
                    </div>
                    <ActionsCell rowData={subscription} />
                </div>
            </CardHeader>
            <CardContent className="space-y-3">
                <div className="flex items-center gap-2 text-sm">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <div className="flex flex-col">
                        <span className="font-medium">{clientDisplay}</span>
                        {sector && <span className="text-muted-foreground">{sector}</span>}
                    </div>
                </div>

                <div className="flex items-center gap-2 text-sm">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">
                        Inicio: {new Date(subscription.startDate).toLocaleDateString('es-PE')}
                    </span>
                </div>

                {subscription.endDate && (
                    <div className="flex items-center gap-2 text-sm">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span className="text-muted-foreground">
                            Fin: {new Date(subscription.endDate).toLocaleDateString('es-PE')}
                        </span>
                    </div>
                )}

                <div className="flex items-center justify-between pt-2 border-t">
                    <div className="flex items-center gap-2">
                        {subscription.advancePayment && (
                            <Badge variant="outline" className="border-blue-500 text-blue-700">
                                Anticipo
                            </Badge>
                        )}
                        <Badge variant="outline" className={config.className}>
                            {config.label}
                        </Badge>
                    </div>
                    {planPrice && (
                        <div className="flex items-center gap-2 text-lg font-semibold">
                            <DollarSign className="h-5 w-5 text-green-600" />
                            <span>S/ {typeof planPrice === 'number' ? planPrice.toFixed(2) : planPrice}</span>
                        </div>
                    )}
                </div>

                <div className="pt-2 border-t">
                    <span className="text-xs text-muted-foreground">
                        Día de facturación: {subscription.billingDay}
                    </span>
                </div>

                <div className="pt-2 border-t">
                    <span className="text-xs text-muted-foreground">
                        • Creado: {new Date(subscription.created_at).toLocaleDateString('es-PE')}
                    </span>
                </div>
            </CardContent>
        </Card>
    );
}

