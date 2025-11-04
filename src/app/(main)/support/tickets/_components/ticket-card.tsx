"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
    XCircle
} from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Ticket, TicketStatus, TicketPriority } from "@/types/ticket";
import {
    getClientName,
    getClientPhone,
    getEmployeeName,
    ticketPriorityLabels,
    ticketStatusLabels,
    ticketTypeLabels,
    getPriorityColor,
    getStatusColor,
    formatShortDate,
    getTimeSinceCreation
} from "@/utils/ticket-helpers";
import { useRouter } from "next/navigation";

interface TicketCardProps {
    ticket: Ticket;
}

export function TicketCard({ ticket }: TicketCardProps) {
    const router = useRouter();
    const [ isHovered, setIsHovered ] = useState(false);

    const handleViewDetails = () => {
        router.push(`/support/tickets/${ticket.id}`);
    };

    const getStatusIcon = (status: TicketStatus) => {
        switch (status) {
            case TicketStatus.PENDING:
                return <Clock className="h-4 w-4" />;
            case TicketStatus.IN_PROGRESS:
                return <AlertTriangle className="h-4 w-4" />;
            case TicketStatus.OPEN:
                return <Calendar className="h-4 w-4" />;
            case TicketStatus.RESOLVED:
            case TicketStatus.CLOSED:
                return <CheckCircle className="h-4 w-4" />;
            case TicketStatus.CANCELLED:
                return <XCircle className="h-4 w-4" />;
            default:
                return <Clock className="h-4 w-4" />;
        }
    };

    const getBorderColor = (priority: TicketPriority) => {
        switch (priority) {
            case TicketPriority.URGENT:
                return 'border-l-red-500';
            case TicketPriority.HIGH:
                return 'border-l-orange-500';
            case TicketPriority.MEDIUM:
                return 'border-l-yellow-500';
            case TicketPriority.LOW:
                return 'border-l-blue-500';
            default:
                return 'border-l-blue-500';
        }
    };

    const clientName = getClientName(ticket);
    const clientPhone = getClientPhone(ticket);
    const employeeName = getEmployeeName(ticket);
    const installationIP = ticket.installation?.ipAddress;

    return (
        <Card
            className={`transition-all duration-200 cursor-pointer hover:shadow-lg border-l-4 ${getBorderColor(ticket.priorityCode)}`}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onClick={handleViewDetails}
        >
            <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-mono text-sm font-medium text-muted-foreground">
                            #{ticket.id}
                        </span>
                        <Badge className={getPriorityColor(ticket.priorityCode)}>
                            {ticketPriorityLabels[ ticket.priorityCode ]}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                            {ticketTypeLabels[ ticket.typeCode ]}
                        </Badge>
                    </div>

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
                            <DropdownMenuItem onClick={handleViewDetails}>
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

                <CardTitle className="text-base line-clamp-2 leading-tight mt-2">
                    {ticket.subject}
                </CardTitle>
            </CardHeader>

            <CardContent className="space-y-3">
                {/* Cliente */}
                <div className="flex items-start gap-2 text-sm">
                    <User className="h-4 w-4 mt-0.5 flex-shrink-0 text-muted-foreground" />
                    <div className="min-w-0">
                        <p className="font-medium text-foreground">{clientName}</p>
                        {clientPhone && (
                            <p className="text-xs text-muted-foreground">{clientPhone}</p>
                        )}
                    </div>
                </div>

                {/* Instalación */}
                {installationIP && (
                    <div className="flex items-start gap-2 text-sm text-muted-foreground">
                        <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
                        <p className="text-xs">IP: {installationIP}</p>
                    </div>
                )}

                {/* Estado */}
                <div className="flex items-center gap-2">
                    {getStatusIcon(ticket.statusCode)}
                    <Badge className={getStatusColor(ticket.statusCode)}>
                        {ticketStatusLabels[ ticket.statusCode ]}
                    </Badge>
                </div>

                {/* Información adicional */}
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        <span>{getTimeSinceCreation(ticket.openedAt)}</span>
                    </div>
                </div>

                {/* Descripción */}
                {ticket.description && (
                    <div className="text-xs text-muted-foreground line-clamp-2 pt-2 border-t">
                        {ticket.description}
                    </div>
                )}

                {/* Empleado asignado */}
                {employeeName && (
                    <div className="flex items-center gap-2 pt-2 border-t">
                        <Avatar className="h-6 w-6">
                            <AvatarFallback className="text-xs bg-primary text-primary-foreground">
                                {employeeName.substring(0, 2).toUpperCase()}
                            </AvatarFallback>
                        </Avatar>
                        <span className="text-xs text-muted-foreground">
                            Asignado a {employeeName}
                        </span>
                    </div>
                )}

                {/* Fecha programada */}
                {ticket.scheduledStart && (
                    <div className="flex items-center gap-2 text-xs text-muted-foreground pt-2 border-t">
                        <Calendar className="h-3 w-3" />
                        <span>Programado: {formatShortDate(ticket.scheduledStart)}</span>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
