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
    Tag,
    Calendar,
    AlertTriangle,
    CheckCircle,
    XCircle
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

interface TicketCardProps {
    ticket: Ticket;
}

export function TicketCard({ ticket }: TicketCardProps) {
    const router = useRouter();
    const [ isHovered, setIsHovered ] = useState(false);

    const handleViewDetails = () => {
        router.push(`/administration/tickets/${ticket.id}`);
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

    return (
        <Card
            className={`transition-all duration-200 cursor-pointer hover:shadow-lg border-l-4 ${ticket.priority === 'urgente' ? 'border-l-red-500' :
                    ticket.priority === 'alta' ? 'border-l-orange-500' :
                        ticket.priority === 'media' ? 'border-l-yellow-500' :
                            'border-l-blue-500'
                }`}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onClick={handleViewDetails}
        >
            <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-mono text-sm font-medium text-muted-foreground">
                            {ticket.id}
                        </span>
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

                <CardTitle className="text-base line-clamp-2 leading-tight">
                    {ticket.title}
                </CardTitle>
            </CardHeader>

            <CardContent className="space-y-3">
                {/* Cliente */}
                <div className="flex items-start gap-2 text-sm text-muted-foreground">
                    <User className="h-4 w-4 mt-0.5 flex-shrink-0" />
                    <div className="min-w-0">
                        <p className="font-medium text-foreground">{ticket.clientName}</p>
                        <p className="text-xs">{ticket.clientPhone}</p>
                    </div>
                </div>

                {/* Dirección */}
                <div className="flex items-start gap-2 text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
                    <p className="text-xs line-clamp-2">{ticket.address}</p>
                </div>

                {/* Categoría */}
                <div className="flex items-center gap-2">
                    <span className="text-2xl">{getCategoryIcon(ticket.category)}</span>
                    <Badge variant="outline" className="text-xs">
                        {getCategoryLabel(ticket.category)}
                    </Badge>
                </div>

                {/* Estado */}
                <div className="flex items-center gap-2">
                    {getStatusIcon(ticket.status)}
                    <Badge className={getStatusColor(ticket.status)}>
                        {getStatusLabel(ticket.status)}
                    </Badge>
                </div>

                {/* Información adicional */}
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        <span>{getTimeSinceCreation(ticket.createdAt)}</span>
                    </div>

                    {ticket.estimatedDuration && (
                        <span className="text-xs">
                            {formatDuration(ticket.estimatedDuration)}
                        </span>
                    )}
                </div>

                {/* Técnico asignado */}
                {ticket.assignedToName && (
                    <div className="flex items-center gap-2 pt-2 border-t">
                        <Avatar className="h-6 w-6">
                            <AvatarFallback className="text-xs bg-corporate-secondary text-white">
                                {ticket.assignedToName.substring(0, 2).toUpperCase()}
                            </AvatarFallback>
                        </Avatar>
                        <span className="text-xs text-muted-foreground">
                            Asignado a {ticket.assignedToName}
                        </span>
                    </div>
                )}

                {/* Etiquetas */}
                {ticket.tags && ticket.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 pt-2 border-t">
                        {ticket.tags.slice(0, 3).map((tag, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                                {tag}
                            </Badge>
                        ))}
                        {ticket.tags.length > 3 && (
                            <Badge variant="secondary" className="text-xs">
                                +{ticket.tags.length - 3}
                            </Badge>
                        )}
                    </div>
                )}

                {/* Fecha programada */}
                {ticket.scheduledDate && (
                    <div className="flex items-center gap-2 text-xs text-muted-foreground pt-2 border-t">
                        <Calendar className="h-3 w-3" />
                        <span>Programado: {formatShortDate(ticket.scheduledDate)}</span>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
