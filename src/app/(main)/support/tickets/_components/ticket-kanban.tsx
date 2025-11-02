"use client";

import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import {
    Clock,
    AlertTriangle,
    Calendar,
    CheckCircle,
    XCircle,
    GripVertical,
    MoreHorizontal,
    User,
    MapPin
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

interface TicketKanbanProps {
    tickets: Ticket[];
}

interface KanbanColumn {
    id: string;
    title: string;
    count: number;
    tickets: Ticket[];
    color: string;
    icon: React.ReactNode;
}

export function TicketKanban({ tickets }: TicketKanbanProps) {
    const router = useRouter();

    const columns: KanbanColumn[] = useMemo(() => [
        {
            id: "pendiente",
            title: "Pendiente",
            count: 0,
            tickets: [],
            color: "border-yellow-500",
            icon: <Clock className="h-5 w-5 text-yellow-600" />
        },
        {
            id: "en-proceso",
            title: "En Proceso",
            count: 0,
            tickets: [],
            color: "border-blue-500",
            icon: <AlertTriangle className="h-5 w-5 text-blue-600" />
        },
        {
            id: "programado",
            title: "Programado",
            count: 0,
            tickets: [],
            color: "border-purple-500",
            icon: <Calendar className="h-5 w-5 text-purple-600" />
        },
        {
            id: "completado",
            title: "Completado",
            count: 0,
            tickets: [],
            color: "border-green-500",
            icon: <CheckCircle className="h-5 w-5 text-green-600" />
        },
        {
            id: "cancelado",
            title: "Cancelado",
            count: 0,
            tickets: [],
            color: "border-gray-500",
            icon: <XCircle className="h-5 w-5 text-gray-600" />
        }
    ], []);

    // Organizar tickets en columnas
    const organizedColumns = useMemo(() => {
        return columns.map(column => ({
            ...column,
            tickets: tickets.filter(ticket => ticket.status === column.id),
            count: tickets.filter(ticket => ticket.status === column.id).length
        }));
    }, [ tickets, columns ]);

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

    // Componente de tarjeta de ticket para Kanban
    const KanbanTicketCard = ({ ticket }: { ticket: Ticket }) => (
        <Card
            className="shadow-sm border-l-4 border-l-corporate-primary mb-3 cursor-pointer hover:shadow-md transition-shadow group"
            onClick={() => handleViewDetails(ticket.id)}
        >
            <CardHeader className="p-3 pb-0">
                <div className="flex justify-between items-start">
                    <div className="flex items-center gap-2 flex-wrap">
                        <div className="cursor-grab opacity-0 group-hover:opacity-100 transition-opacity">
                            <GripVertical className="h-4 w-4 text-muted-foreground" />
                        </div>
                        <span className="font-medium text-sm">{ticket.id}</span>
                        <Badge className={getPriorityColor(ticket.priority)}>
                            {getPriorityLabel(ticket.priority)}
                        </Badge>
                    </div>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleViewDetails(ticket.id)}>
                                Ver detalles
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                                Asignar técnico
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                                Cambiar estado
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                                Editar
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </CardHeader>
            <CardContent className="p-3">
                <div className="space-y-2">
                    <div className="font-medium text-sm line-clamp-2">{ticket.title}</div>

                    <div className="text-sm text-muted-foreground flex items-start gap-1">
                        <User className="h-3 w-3 mt-1 flex-shrink-0" />
                        <span className="line-clamp-1">{ticket.clientName}</span>
                    </div>

                    <div className="text-sm text-muted-foreground flex items-start gap-1">
                        <MapPin className="h-3 w-3 mt-1 flex-shrink-0" />
                        <span className="line-clamp-2 text-xs">{ticket.address}</span>
                    </div>

                    <div className="flex items-center gap-2">
                        <span className="text-lg">{getCategoryIcon(ticket.category)}</span>
                        <Badge variant="outline" className="text-xs">
                            {getCategoryLabel(ticket.category)}
                        </Badge>
                    </div>

                    <div className="flex justify-between items-center text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3 flex-shrink-0" />
                            {new Date(ticket.createdAt).toLocaleDateString('es-ES')}
                        </div>
                        {ticket.assignedTo && (
                            <div className="flex items-center gap-1">
                                <Avatar className="h-5 w-5 bg-corporate-secondary text-white">
                                    <AvatarFallback className="text-[10px]">
                                        {ticket.assignedToName?.substring(0, 2).toUpperCase()}
                                    </AvatarFallback>
                                </Avatar>
                            </div>
                        )}
                    </div>
                </div>
            </CardContent>
        </Card>
    );

    return (
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
            {organizedColumns.map((column) => (
                <div key={column.id} className="flex flex-col">
                    {/* Header de columna */}
                    <div className={`flex items-center justify-between mb-4 pb-2 border-b-2 ${column.color}`}>
                        <div className="flex items-center gap-2">
                            {column.icon}
                            <h3 className="font-medium">{column.title}</h3>
                        </div>
                        <Badge variant="outline" className="bg-muted">
                            {column.count}
                        </Badge>
                    </div>

                    {/* Contenido de la columna */}
                    <ScrollArea className="h-[calc(100vh-280px)]">
                        <div className="space-y-3 pr-3">
                            {column.tickets.length === 0 ? (
                                <div className="text-center py-8 text-muted-foreground">
                                    <div className="text-4xl mb-2">📭</div>
                                    <p className="text-sm">No hay tickets</p>
                                </div>
                            ) : (
                                column.tickets.map((ticket) => (
                                    <KanbanTicketCard key={ticket.id} ticket={ticket} />
                                ))
                            )}
                        </div>
                        <ScrollBar orientation="vertical" />
                    </ScrollArea>
                </div>
            ))}
        </div>
    );
}
