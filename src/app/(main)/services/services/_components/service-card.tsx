"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Service } from "@/types/service";
import { Network } from "lucide-react";
import { ActionsCell } from "./actions-cell";
import React from "react";

interface ServiceCardProps {
    service: Service;
}

export function ServiceCard({ service }: ServiceCardProps) {
    return (
        <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                    <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                            <Network className="h-5 w-5 text-blue-600" />
                            <h3 className="font-semibold text-lg">{service.name}</h3>
                        </div>
                    </div>
                    <ActionsCell rowData={service} />
                </div>
            </CardHeader>
            <CardContent className="space-y-2">
                {service.description && (
                    <div className="flex items-start gap-2 text-sm text-muted-foreground">
                        <span>{service.description}</span>
                    </div>
                )}
                <div className="pt-2 border-t">
                    <span className="text-xs text-muted-foreground">
                        • Creado: {new Date(service.created_at).toLocaleDateString('es-PE')}
                    </span>
                </div>
            </CardContent>
        </Card>
    );
}

