"use client";

import { useMemo } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
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
import { Ticket, TicketStatus, TicketPriority } from "@/types/ticket";
import {
    getClientName,
    getEmployeeName,
    ticketPriorityLabels,
    ticketTypeLabels,
    getPriorityColor,
    getStatusColor,
    formatShortDate
} from "@/utils/ticket-helpers";
import { useRouter } from "next/navigation";

interface TicketKanbanProps {
    tickets: Ticket[];
}

interface KanbanColumn {
    id: TicketStatus;
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
            id: TicketStatus.OPEN,
            title: "Abierto",
            count: 0,
            tickets: [],
            color: "border-blue-500",
            icon: <Clock className="h-5 w-5 text-blue-600" />
        },
        {
            id: TicketStatus.IN_PROGRESS,
            title: "En Proceso",
            count: 0,
            tickets: [],
            color: "border-yellow-500",
            icon: <AlertTriangle className="h-5 w-5 text-yellow-600" />
        },
        {
            id: TicketStatus.PENDING,
            title: "Pendiente",
            count: 0,
            tickets: [],
            color: "border-purple-500",
            icon: <Calendar className="h-5 w-5 text-purple-600" />
        },
        {
            id: TicketStatus.RESOLVED,
            title: "Resuelto",
            count: 0,
            tickets: [],
            color: "border-green-500",
            icon: <CheckCircle className="h-5 w-5 text-green-600" />
        },
        {
            id: TicketStatus.CLOSED,
            title: "Cerrado",
            count: 0,
            tickets: [],
            color: "border-gray-500",
            icon: <CheckCircle className="h-5 w-5 text-gray-600" />
        },
        {
            id: TicketStatus.CANCELLED,
            title: "Cancelado",
            count: 0,
            tickets: [],
            color: "border-red-500",
            icon: <XCircle className="h-5 w-5 text-red-600" />
        }
    ], []);

    // Organizar tickets en columnas
    const organizedColumns = useMemo(() => {
        return columns.map(column => ({
            ...column,
            tickets: tickets.filter(ticket => ticket.statusCode === column.id),
            count: tickets.filter(ticket => ticket.statusCode === column.id).length
        }));
    }, [ tickets, columns ]);

    const handleViewDetails = (ticketId: number) => {
        router.push(`/support/tickets/${ticketId}`);
    };

    // Componente de tarjeta de ticket para Kanban
    const KanbanTicketCard = ({ ticket }: { ticket: Ticket }) => {
        const clientName = getClientName(ticket);
        const employeeName = getEmployeeName(ticket);
        const installationIP = ticket.installation?.ipAddress;

        return (
            <Card
                className="shadow-sm border-l-4 border-l-primary mb-3 cursor-pointer hover:shadow-md transition-shadow group"
                onClick={() => handleViewDetails(ticket.id)}
            >
                <CardHeader className="p-3 pb-0">
                    <div className="flex justify-between items-start">
                        <div className="flex items-center gap-2 flex-wrap">
                            <div className="cursor-grab opacity-0 group-hover:opacity-100 transition-opacity">
                                <GripVertical className="h-4 w-4 text-muted-foreground" />
                            </div>
                            <span className="font-mono text-xs font-medium text-muted-foreground">#{ticket.id}</span>
                            <Badge className={getPriorityColor(ticket.priorityCode)}>
                                {ticketPriorityLabels[ ticket.priorityCode ]}
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
                        <div className="font-medium text-sm line-clamp-2">{ticket.subject}</div>

                        <div className="text-sm text-muted-foreground flex items-start gap-1">
                            <User className="h-3 w-3 mt-1 flex-shrink-0" />
                            <span className="line-clamp-1">{clientName}</span>
                        </div>

                        {installationIP && (
                            <div className="text-sm text-muted-foreground flex items-start gap-1">
                                <MapPin className="h-3 w-3 mt-1 flex-shrink-0" />
                                <span className="line-clamp-1 text-xs">IP: {installationIP}</span>
                            </div>
                        )}

                        <div className="flex items-center gap-2">
                            <Badge variant="outline" className="text-xs">
                                {ticketTypeLabels[ ticket.typeCode ]}
                            </Badge>
                        </div>

                        <div className="flex justify-between items-center text-xs text-muted-foreground">
                            <div className="flex items-center gap-1">
                                <Clock className="h-3 w-3 flex-shrink-0" />
                                {formatShortDate(ticket.openedAt)}
                            </div>
                            {employeeName && (
                                <div className="flex items-center gap-1">
                                    <Avatar className="h-5 w-5 bg-primary text-primary-foreground">
                                        <AvatarFallback className="text-[10px]">
                                            {employeeName.substring(0, 2).toUpperCase()}
                                        </AvatarFallback>
                                    </Avatar>
                                </div>
                            )}
                        </div>
                    </div>
                </CardContent>
            </Card>
        );
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-6 gap-6">
            {organizedColumns.map((column) => (
                <div key={column.id} className="flex flex-col">
                    {/* Header de columna */}
                    <div className={`flex items-center justify-between mb-4 pb-2 border-b-2 ${column.color}`}>
                        <div className="flex items-center gap-2">
                            {column.icon}
                            <h3 className="font-medium text-sm">{column.title}</h3>
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
