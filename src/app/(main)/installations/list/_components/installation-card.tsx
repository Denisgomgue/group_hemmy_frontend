"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Installation, InstallationStatus } from "@/types/installation";
import { MapPin, Wifi, Calendar, User, Building2 } from "lucide-react";
import { ActionsCell } from "./actions-cell";
import React from "react";

interface InstallationCardProps {
    installation: Installation;
}

export function InstallationCard({ installation }: InstallationCardProps) {
    const client = installation.client;
    const clientName = client?.actor?.displayName ||
        (client?.actor?.person
            ? `${client.actor.person.firstName} ${client.actor.person.lastName}`.trim()
            : client?.actor?.organization?.legalName) ||
        'Sin cliente';

    const sectorName = installation.sector?.name || 'Sin sector';

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

    const config = statusConfig[ installation.status ] || statusConfig[ InstallationStatus.INACTIVE ];

    const clientKind = client?.actor?.kind;

    return (
        <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                    <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                            {clientKind === 'PERSON' ? (
                                <User className="h-5 w-5 text-blue-600" />
                            ) : (
                                <Building2 className="h-5 w-5 text-blue-600" />
                            )}
                            <h3 className="font-semibold text-lg">{clientName}</h3>
                        </div>
                        <Badge variant="outline" className={config.className}>
                            {config.label}
                        </Badge>
                    </div>
                    <ActionsCell rowData={installation} />
                </div>
            </CardHeader>
            <CardContent className="space-y-2">
                {installation.address && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <MapPin className="h-4 w-4" />
                        <span>{installation.address}</span>
                    </div>
                )}
                {installation.sector && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <MapPin className="h-4 w-4" />
                        <span>Sector: {sectorName}</span>
                    </div>
                )}
                {installation.ipAddress && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Wifi className="h-4 w-4" />
                        <span className="font-mono">{installation.ipAddress}</span>
                    </div>
                )}
                {installation.installedAt && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        <span>Instalado: {new Date(installation.installedAt).toLocaleDateString('es-PE')}</span>
                    </div>
                )}
                <div className="pt-2 border-t">
                    <span className="text-xs text-muted-foreground">
                        • Creado: {new Date(installation.created_at).toLocaleDateString('es-PE')}
                    </span>
                </div>
            </CardContent>
        </Card>
    );
}

