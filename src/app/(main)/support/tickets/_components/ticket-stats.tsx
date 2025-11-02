"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
    Clock,
    CheckCircle,
    AlertTriangle,
    XCircle,
    Users,
    Calendar,
    TrendingUp,
    AlertCircle
} from "lucide-react";
import { TicketStats as TicketStatsType } from "@/types/tickets";

interface TicketStatsProps {
    stats?: TicketStatsType;
}

export function TicketStats({ stats }: TicketStatsProps) {
    if (!stats) {
        return (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {[ 1, 2, 3, 4 ].map((i) => (
                    <Card key={i} className="animate-pulse">
                        <CardHeader className="pb-2">
                            <div className="h-4 bg-muted rounded w-24"></div>
                        </CardHeader>
                        <CardContent>
                            <div className="h-8 bg-muted rounded w-16"></div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        );
    }

    const statCards = [
        {
            title: "Total Tickets",
            value: stats.total,
            icon: Calendar,
            color: "text-blue-600",
            bgColor: "bg-blue-50",
            borderColor: "border-blue-200"
        },
        {
            title: "Pendientes",
            value: stats.pendiente,
            icon: Clock,
            color: "text-yellow-600",
            bgColor: "bg-yellow-50",
            borderColor: "border-yellow-200"
        },
        {
            title: "En Proceso",
            value: stats.enProceso,
            icon: Users,
            color: "text-blue-600",
            bgColor: "bg-blue-50",
            borderColor: "border-blue-200"
        },
        {
            title: "Completados",
            value: stats.completado,
            icon: CheckCircle,
            color: "text-green-600",
            bgColor: "bg-green-50",
            borderColor: "border-green-200"
        },
        {
            title: "Urgentes",
            value: stats.urgente,
            icon: AlertCircle,
            color: "text-red-600",
            bgColor: "bg-red-50",
            borderColor: "border-red-200"
        },
        {
            title: "Alta Prioridad",
            value: stats.alta,
            icon: AlertTriangle,
            color: "text-orange-600",
            bgColor: "bg-orange-50",
            borderColor: "border-orange-200"
        },
        {
            title: "Programados",
            value: stats.programado,
            icon: TrendingUp,
            color: "text-purple-600",
            bgColor: "bg-purple-50",
            borderColor: "border-purple-200"
        },
        {
            title: "Cancelados",
            value: stats.cancelado,
            icon: XCircle,
            color: "text-gray-600",
            bgColor: "bg-gray-50",
            borderColor: "border-gray-200"
        }
    ];

    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {statCards.map((stat) => {
                const Icon = stat.icon;
                return (
                    <Card key={stat.title} className={`border-l-4 ${stat.borderColor}`}>
                        <CardHeader className="pb-2">
                            <div className="flex items-center justify-between">
                                <CardTitle className="text-sm font-medium text-muted-foreground">
                                    {stat.title}
                                </CardTitle>
                                <div className={`p-2 rounded-full ${stat.bgColor}`}>
                                    <Icon className={`h-4 w-4 ${stat.color}`} />
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stat.value}</div>
                            <p className="text-xs text-muted-foreground mt-1">
                                {stat.title === "Total Tickets"
                                    ? "tickets en el sistema"
                                    : stat.title === "Pendientes" || stat.title === "En Proceso"
                                        ? "requieren atención"
                                        : stat.title === "Completados"
                                            ? "resueltos exitosamente"
                                            : stat.title === "Urgentes" || stat.title === "Alta Prioridad"
                                                ? "necesitan acción inmediata"
                                                : stat.title === "Programados"
                                                    ? "agendados para atención"
                                                    : "no procesados"
                                }
                            </p>
                        </CardContent>
                    </Card>
                );
            })}
        </div>
    );
}
