"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
    MoreHorizontal,
    Clock,
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
import { Ticket, TicketStatus, TicketPriority } from "@/types/ticket";
import {
    getClientName,
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

interface TicketTableProps {
    tickets: Ticket[];
}

export function TicketTable({ tickets }: TicketTableProps) {
    const router = useRouter();

    const handleViewDetails = (ticketId: number) => {
        router.push(`/support/tickets/${ticketId}`);
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
                                <th className="px-4 py-3 text-left text-sm font-medium">Asunto</th>
                                <th className="px-4 py-3 text-left text-sm font-medium">Cliente</th>
                                <th className="px-4 py-3 text-left text-sm font-medium">Tipo</th>
                                <th className="px-4 py-3 text-left text-sm font-medium">Prioridad</th>
                                <th className="px-4 py-3 text-left text-sm font-medium">Estado</th>
                                <th className="px-4 py-3 text-left text-sm font-medium">Asignado</th>
                                <th className="px-4 py-3 text-left text-sm font-medium">Creado</th>
                                <th className="px-4 py-3 text-left text-sm font-medium">Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {tickets.map((ticket) => {
                                const clientName = getClientName(ticket);
                                const employeeName = getEmployeeName(ticket);

                                return (
                                    <tr
                                        key={ticket.id}
                                        className="border-b hover:bg-muted/30 transition-colors cursor-pointer"
                                        onClick={() => handleViewDetails(ticket.id)}
                                    >
                                        {/* ID */}
                                        <td className="px-4 py-3">
                                            <span className="font-mono text-sm font-medium text-muted-foreground">
                                                #{ticket.id}
                                            </span>
                                        </td>

                                        {/* Asunto */}
                                        <td className="px-4 py-3">
                                            <div className="max-w-[250px]">
                                                <p className="font-medium text-sm line-clamp-2">
                                                    {ticket.subject}
                                                </p>
                                                {ticket.description && (
                                                    <p className="text-xs text-muted-foreground mt-1 line-clamp-1">
                                                        {ticket.description}
                                                    </p>
                                                )}
                                            </div>
                                        </td>

                                        {/* Cliente */}
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-2">
                                                <Avatar className="h-8 w-8">
                                                    <AvatarFallback className="text-xs bg-primary text-primary-foreground">
                                                        {clientName.substring(0, 2).toUpperCase()}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <div className="min-w-0">
                                                    <p className="font-medium text-sm">{clientName}</p>
                                                </div>
                                            </div>
                                        </td>

                                        {/* Tipo */}
                                        <td className="px-4 py-3">
                                            <Badge variant="outline" className="text-xs">
                                                {ticketTypeLabels[ ticket.typeCode ]}
                                            </Badge>
                                        </td>

                                        {/* Prioridad */}
                                        <td className="px-4 py-3">
                                            <Badge className={getPriorityColor(ticket.priorityCode)}>
                                                {ticketPriorityLabels[ ticket.priorityCode ]}
                                            </Badge>
                                        </td>

                                        {/* Estado */}
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-2">
                                                {getStatusIcon(ticket.statusCode)}
                                                <Badge className={getStatusColor(ticket.statusCode)}>
                                                    {ticketStatusLabels[ ticket.statusCode ]}
                                                </Badge>
                                            </div>
                                        </td>

                                        {/* Asignado */}
                                        <td className="px-4 py-3">
                                            {employeeName ? (
                                                <div className="flex items-center gap-2">
                                                    <Avatar className="h-6 w-6">
                                                        <AvatarFallback className="text-xs bg-primary text-primary-foreground">
                                                            {employeeName.substring(0, 2).toUpperCase()}
                                                        </AvatarFallback>
                                                    </Avatar>
                                                    <span className="text-sm">{employeeName}</span>
                                                </div>
                                            ) : (
                                                <span className="text-sm text-muted-foreground">Sin asignar</span>
                                            )}
                                        </td>

                                        {/* Creado */}
                                        <td className="px-4 py-3">
                                            <div className="text-sm">
                                                <p>{formatShortDate(ticket.openedAt)}</p>
                                                <p className="text-xs text-muted-foreground">
                                                    {getTimeSinceCreation(ticket.openedAt)}
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
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </CardContent>
        </Card>
    );
}
