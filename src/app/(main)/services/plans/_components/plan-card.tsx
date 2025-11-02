"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plan } from "@/types/plan";
import { Network, Zap, DollarSign } from "lucide-react";
import { ActionsCell } from "./actions-cell";
import React from "react";

interface PlanCardProps {
    plan: Plan;
}

export function PlanCard({ plan }: PlanCardProps) {
    return (
        <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                    <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                            <Network className="h-5 w-5 text-blue-600" />
                            <h3 className="font-semibold text-lg">{plan.name}</h3>
                        </div>
                    </div>
                    <ActionsCell rowData={plan} />
                </div>
            </CardHeader>
            <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Zap className="h-4 w-4" />
                        <span>{plan.service?.name || 'Sin servicio'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        {plan.type && (
                            <Badge variant="outline" className="border-blue-500 text-blue-700">
                                Web
                            </Badge>
                        )}
                        <Badge variant={plan.isActive ? "default" : "secondary"}>
                            {plan.isActive ? 'Activo' : 'Inactivo'}
                        </Badge>
                    </div>
                </div>

                {plan.speedMbps && (
                    <div className="flex items-center gap-2 text-sm">
                        <span className="font-medium">Velocidad:</span>
                        <span className="text-muted-foreground">{plan.speedMbps} Mbps</span>
                    </div>
                )}

                <div className="flex items-center gap-2 text-lg font-semibold pt-2 border-t">
                    <DollarSign className="h-5 w-5 text-green-600" />
                    <span>S/ {typeof plan.price === 'number' ? plan.price.toFixed(2) : plan.price}</span>
                </div>

                {plan.description && (
                    <div className="text-sm text-muted-foreground pt-2">
                        <span>{plan.description}</span>
                    </div>
                )}

                <div className="pt-2 border-t">
                    <span className="text-xs text-muted-foreground">
                        • Creado: {new Date(plan.created_at).toLocaleDateString('es-PE')}
                    </span>
                </div>
            </CardContent>
        </Card>
    );
}

