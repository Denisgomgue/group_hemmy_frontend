"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Sector } from "@/types/sector";
import { MapPin, FileText } from "lucide-react";
import { ActionsCell } from "./actions-cell";
import React from "react";

interface SectorCardProps {
    sector: Sector;
}

export function SectorCard({ sector }: SectorCardProps) {
    return (
        <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                    <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                            <MapPin className="h-5 w-5 text-blue-600" />
                            <h3 className="font-semibold text-lg">{sector.name}</h3>
                        </div>
                    </div>
                    <ActionsCell rowData={sector} />
                </div>
            </CardHeader>
            <CardContent className="space-y-2">
                {sector.description && (
                    <div className="flex items-start gap-2 text-sm text-muted-foreground">
                        <FileText className="h-4 w-4 mt-0.5" />
                        <span>{sector.description}</span>
                    </div>
                )}
                <div className="pt-2 border-t">
                    <span className="text-xs text-muted-foreground">
                        • Creado: {new Date(sector.created_at).toLocaleDateString('es-PE')}
                    </span>
                </div>
            </CardContent>
        </Card>
    );
}

