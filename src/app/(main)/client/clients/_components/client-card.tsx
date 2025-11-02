"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Client, ClientStatus } from "@/types/client";
import { Mail, Phone, FileText, Building2, User } from "lucide-react";
import { ActionsCell } from "./actions-cell";
import React from "react";

interface ClientCardProps {
    client: Client;
}

export function ClientCard({ client }: ClientCardProps) {
    const displayName = client.actor?.displayName ||
        (client.actor?.person
            ? `${client.actor.person.firstName} ${client.actor.person.lastName}`.trim()
            : client.actor?.organization?.legalName) ||
        'Sin nombre';

    const email = client.actor?.person?.email || client.actor?.organization?.email;
    const phone = client.actor?.person?.phone || client.actor?.organization?.phone;

    // Obtener documento según el tipo de actor
    let documentNumber = '-';
    if (client.actor?.person) {
        documentNumber = client.actor.person.documentNumber || '-';
    } else if (client.actor?.organization) {
        documentNumber = client.actor.organization.documentNumber || '-';
    }

    const kind = client.actor?.kind;

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

    const config = statusConfig[ client.status ] || statusConfig[ ClientStatus.INACTIVE ];

    return (
        <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                    <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                            {kind === 'PERSON' ? (
                                <User className="h-5 w-5 text-blue-600" />
                            ) : (
                                <Building2 className="h-5 w-5 text-blue-600" />
                            )}
                            <h3 className="font-semibold text-lg">{displayName}</h3>
                        </div>
                        <Badge variant="outline" className={config.className}>
                            {config.label}
                        </Badge>
                    </div>
                    <ActionsCell rowData={client} />
                </div>
            </CardHeader>
            <CardContent className="space-y-2">
                
                {phone && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Phone className="h-4 w-4" />
                        <span>{phone}</span>
                    </div>
                )}
                {documentNumber && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <FileText className="h-4 w-4" />
                        <span>{documentNumber}</span>
                    </div>
                )}
                <div className="pt-2 border-t">
                    <span className="text-xs text-muted-foreground">
                        • Creado: {new Date(client.created_at).toLocaleDateString('es-PE')}
                    </span>
                </div>
            </CardContent>
        </Card>
    );
}

