"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
    MoreHorizontal,
    Clock,
    MapPin,
    User,
    Calendar,
    AlertTriangle,
    CheckCircle,
    XCircle,
    Eye,
    Edit,
    Trash2,
    UserPlus
} from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Ticket } from "@/types/tickets";
import {
    getPriorityColor,
    getPriorityLabel,
    getStatusColor,
    getStatusLabel,
    getCategoryLabel,
    getCategoryIcon,
    formatDuration,
    formatShortDate,
    getTimeSinceCreation
} from "@/utils/ticket-utils";
import { useRouter } from "next/navigation";

interface TicketTableProps {
    tickets: Ticket[];
}

export function TicketTable({ tickets }: TicketTableProps) {
    const router = useRouter();

    const handleViewDetails = (ticketId: string) => {
        router.push(`/administration/tickets/${ticketId}`);
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case "pendiente":
                return <Clock className="h-4 w-4" />;
            case "en-proceso":
                return <AlertTriangle className="h-4 w-4" />;
            case "programado":
                return <Calendar className="h-4 w-4" />;
            case "completado":
                return <CheckCircle className="h-4 w-4" />;
            case "cancelado":
                return <XCircle className="h-4 w-4" />;
            default:
                return <Clock className="h-4 w-4" />;
        }
    };

    if (tickets.length === 0) {
        return (
            <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                    <div className="text-center space-y-4">
                        <div className="text-6xl">📋</div>
                        <h3 className="text-lg font-medium text-muted-foreground">
                            No hay tickets para mostrar
                        </h3>
                        <p className="text-sm text-muted-foreground">
                            Intenta ajustar los filtros o crear un nuevo ticket
                        </p>
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card>
            <CardContent className="p-0">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-muted/50">
                            <tr>
                                <th className="px-4 py-3 text-left text-sm font-medium">ID</th>
                                <th className="px-4 py-3 text-left text-sm font-medium">Título</th>
                                <th className="px-4 py-3 text-left text-sm font-medium">Cliente</th>
                                <th className="px-4 py-3 text-left text-sm font-medium">Categoría</th>
                                <th className="px-4 py-3 text-left text-sm font-medium">Prioridad</th>
                                <th className="px-4 py-3 text-left text-sm font-medium">Estado</th>
                                <th className="px-4 py-3 text-left text-sm font-medium">Asignado</th>
                                <th className="px-4 py-3 text-left text-sm font-medium">Creado</th>
                                <th className="px-4 py-3 text-left text-sm font-medium">Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {tickets.map((ticket) => (
                                <tr
                                    key={ticket.id}
                                    className="border-b hover:bg-muted/30 transition-colors cursor-pointer"
                                    onClick={() => handleViewDetails(ticket.id)}
                                >
                                    {/* ID */}
                                    <td className="px-4 py-3">
                                        <span className="font-mono text-sm font-medium text-muted-foreground">
                                            {ticket.id}
                                        </span>
                                    </td>

                                    {/* Título */}
                                    <td className="px-4 py-3">
                                        <div className="max-w-[250px]">
                                            <p className="font-medium text-sm line-clamp-2">
                                                {ticket.title}
                                            </p>
                                            <p className="text-xs text-muted-foreground mt-1 line-clamp-1">
                                                {ticket.description}
                                            </p>
                                        </div>
                                    </td>

                                    {/* Cliente */}
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-2">
                                            <Avatar className="h-8 w-8">
                                                <AvatarFallback className="text-xs bg-corporate-secondary text-white">
                                                    {ticket.clientName.substring(0, 2).toUpperCase()}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div className="min-w-0">
                                                <p className="font-medium text-sm">{ticket.clientName}</p>
                                                <p className="text-xs text-muted-foreground">{ticket.clientPhone}</p>
                                            </div>
                                        </div>
                                    </td>

                                    {/* Categoría */}
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-2">
                                            <span className="text-lg">{getCategoryIcon(ticket.category)}</span>
                                            <Badge variant="outline" className="text-xs">
                                                {getCategoryLabel(ticket.category)}
                                            </Badge>
                                        </div>
                                    </td>

                                    {/* Prioridad */}
                                    <td className="px-4 py-3">
                                        <Badge className={getPriorityColor(ticket.priority)}>
                                            {getPriorityLabel(ticket.priority)}
                                        </Badge>
                                    </td>

                                    {/* Estado */}
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-2">
                                            {getStatusIcon(ticket.status)}
                                            <Badge className={getStatusColor(ticket.status)}>
                                                {getStatusLabel(ticket.status)}
                                            </Badge>
                                        </div>
                                    </td>

                                    {/* Asignado */}
                                    <td className="px-4 py-3">
                                        {ticket.assignedToName ? (
                                            <div className="flex items-center gap-2">
                                                <Avatar className="h-6 w-6">
                                                    <AvatarFallback className="text-xs bg-corporate-primary text-white">
                                                        {ticket.assignedToName.substring(0, 2).toUpperCase()}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <span className="text-sm">{ticket.assignedToName}</span>
                                            </div>
                                        ) : (
                                            <span className="text-sm text-muted-foreground">Sin asignar</span>
                                        )}
                                    </td>

                                    {/* Creado */}
                                    <td className="px-4 py-3">
                                        <div className="text-sm">
                                            <p>{formatShortDate(ticket.createdAt)}</p>
                                            <p className="text-xs text-muted-foreground">
                                                {getTimeSinceCreation(ticket.createdAt)}
                                            </p>
                                        </div>
                                    </td>

                                    {/* Acciones */}
                                    <td className="px-4 py-3">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8"
                                                    onClick={(e) => e.stopPropagation()}
                                                >
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem onClick={() => handleViewDetails(ticket.id)}>
                                                    <Eye className="h-4 w-4 mr-2" />
                                                    Ver detalles
                                                </DropdownMenuItem>
                                                <DropdownMenuItem>
                                                    <Edit className="h-4 w-4 mr-2" />
                                                    Editar
                                                </DropdownMenuItem>
                                                <DropdownMenuItem>
                                                    <UserPlus className="h-4 w-4 mr-2" />
                                                    Asignar técnico
                                                </DropdownMenuItem>
                                                <DropdownMenuItem className="text-destructive">
                                                    <Trash2 className="h-4 w-4 mr-2" />
                                                    Eliminar
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </CardContent>
        </Card>
    );
}
