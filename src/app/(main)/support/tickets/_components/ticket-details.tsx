"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    ArrowLeft,
    Clock,
    MapPin,
    User,
    Phone,
    Mail,
    Calendar,
    Tag,
    MessageSquare,
    FileText,
    Settings,
    CheckCircle,
    AlertCircle,
    Info,
    Edit,
    Loader2,
} from "lucide-react";
import { Ticket, TicketStatus, TicketPriority, TicketType } from "@/types/ticket";
import { useTicketById } from "@/hooks/use-ticket-by-id";
import { useTicket } from "@/hooks/use-ticket";
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
    getTimeSinceCreation,
} from "@/utils/ticket-helpers";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { EditTicketDialog } from "./edit-ticket-dialog";

interface TicketDetailsProps {
    ticketId: string;
}

export function TicketDetails({ ticketId }: TicketDetailsProps) {
    const router = useRouter();
    const { data: ticket, isLoading, error } = useTicketById(ticketId);
    const { updateTicket, isUpdating } = useTicket();
    const [ activeTab, setActiveTab ] = useState("detalles");
    const [ isEditingStatus, setIsEditingStatus ] = useState(false);
    const [ showEditDialog, setShowEditDialog ] = useState(false);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-center">
                    <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
                    <p className="text-muted-foreground">Cargando ticket...</p>
                </div>
            </div>
        );
    }

    if (error || !ticket) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-center">
                    <AlertCircle className="h-8 w-8 mx-auto mb-4 text-destructive" />
                    <p className="text-muted-foreground">Error al cargar el ticket</p>
                    <Button
                        variant="outline"
                        className="mt-4"
                        onClick={() => router.push("/support/tickets")}
                    >
                        Volver a Tickets
                    </Button>
                </div>
            </div>
        );
    }

    const clientName = getClientName(ticket);
    const clientPhone = getClientPhone(ticket);
    const employeeName = getEmployeeName(ticket);
    const clientEmail = ticket.client?.actor?.person?.email || ticket.client?.actor?.organization?.email || '';
    const clientAddress = ticket.installation?.address?.fullAddress ||
        ticket.client?.actor?.person?.address ||
        ticket.client?.actor?.organization?.address ||
        'No especificada';

    const handleStatusChange = async (newStatus: TicketStatus) => {
        try {
            await updateTicket({
                id: ticket.id,
                data: { statusCode: newStatus },
            });
            setIsEditingStatus(false);
            toast.success("Estado del ticket actualizado correctamente");
        } catch (error) {
            toast.error("Error al actualizar el estado del ticket");
        }
    };

    return (
        <div className="space-y-6">
            {/* Header con navegación */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => router.push("/support/tickets")}
                    >
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Volver a Tickets
                    </Button>
                    <div>
                        <h1 className="text-2xl font-bold">Ticket #{ticket.id}</h1>
                        <p className="text-muted-foreground">{ticket.subject}</p>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setShowEditDialog(true)}
                        disabled={!ticket}
                    >
                        <Edit className="h-4 w-4 mr-2" />
                        Editar
                    </Button>
                </div>
            </div>

            {/* Información principal */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Columna principal */}
                <div className="lg:col-span-2 space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Info className="h-5 w-5" />
                                Información del Ticket
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <h3 className="font-medium mb-2">Asunto</h3>
                                <p className="text-muted-foreground">{ticket.subject}</p>
                            </div>

                            {ticket.description && (
                                <div>
                                    <h3 className="font-medium mb-2">Descripción</h3>
                                    <p className="text-muted-foreground whitespace-pre-wrap">{ticket.description}</p>
                                </div>
                            )}

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <h3 className="font-medium mb-2">Tipo</h3>
                                    <Badge variant="outline">{ticketTypeLabels[ ticket.typeCode ]}</Badge>
                                </div>
                                {ticket.scheduledStart && (
                                    <div>
                                        <h3 className="font-medium mb-2">Fecha Programada</h3>
                                        <p className="text-muted-foreground">
                                            {new Date(ticket.scheduledStart).toLocaleString('es-ES')}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Comentarios - Placeholder */}
                    <Card>
                        <Tabs value={activeTab} onValueChange={setActiveTab}>
                            <CardHeader>
                                <TabsList className="grid w-full grid-cols-2">
                                    <TabsTrigger value="detalles" className="flex items-center gap-2">
                                        <MessageSquare className="h-4 w-4" />
                                        Comentarios
                                    </TabsTrigger>
                                    <TabsTrigger value="timeline" className="flex items-center gap-2">
                                        <FileText className="h-4 w-4" />
                                        Línea de Tiempo
                                    </TabsTrigger>
                                </TabsList>
                            </CardHeader>
                            <CardContent>
                                <TabsContent value="detalles" className="space-y-4">
                                    <div className="text-center py-8 text-muted-foreground">
                                        <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
                                        <p>Los comentarios estarán disponibles próximamente</p>
                                    </div>
                                </TabsContent>

                                <TabsContent value="timeline" className="space-y-4">
                                    <div className="space-y-4">
                                        <div className="flex gap-3">
                                            <div className="flex flex-col items-center">
                                                <div className="w-3 h-3 bg-primary rounded-full"></div>
                                                <div className="w-px h-8 bg-muted mt-2"></div>
                                            </div>
                                            <div className="flex-1 pb-4">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <span className="font-medium text-sm">Sistema</span>
                                                    <span className="text-xs text-muted-foreground">
                                                        {formatShortDate(ticket.created_at)}
                                                    </span>
                                                </div>
                                                <p className="text-sm text-muted-foreground">
                                                    Ticket creado con estado: {ticketStatusLabels[ ticket.statusCode ]}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </TabsContent>
                            </CardContent>
                        </Tabs>
                    </Card>
                </div>

                {/* Barra lateral */}
                <div className="space-y-6">
                    {/* Estado y prioridad */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Estado</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <div className="flex items-center justify-between mb-2">
                                    <label className="text-sm font-medium">Estado Actual</label>
                                    {!isEditingStatus && (
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => setIsEditingStatus(true)}
                                        >
                                            <Edit className="h-3 w-3" />
                                        </Button>
                                    )}
                                </div>
                                {isEditingStatus ? (
                                    <Select
                                        value={ticket.statusCode}
                                        onValueChange={(value) => handleStatusChange(value as TicketStatus)}
                                        disabled={isUpdating}
                                    >
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {Object.entries(ticketStatusLabels).map(([ value, label ]) => (
                                                <SelectItem key={value} value={value}>
                                                    {label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                ) : (
                                    <Badge className={getStatusColor(ticket.statusCode)}>
                                        {ticketStatusLabels[ ticket.statusCode ]}
                                    </Badge>
                                )}
                            </div>

                            <div>
                                <label className="text-sm font-medium">Prioridad</label>
                                <Badge className={`mt-2 ${getPriorityColor(ticket.priorityCode)}`}>
                                    {ticketPriorityLabels[ ticket.priorityCode ]}
                                </Badge>
                            </div>

                            <div>
                                <label className="text-sm font-medium">Asignado a</label>
                                <div className="flex items-center gap-2 mt-2">
                                    {employeeName ? (
                                        <>
                                            <Avatar className="h-8 w-8">
                                                <AvatarFallback className="text-xs">
                                                    {employeeName.substring(0, 2).toUpperCase()}
                                                </AvatarFallback>
                                            </Avatar>
                                            <span className="text-sm">{employeeName}</span>
                                        </>
                                    ) : (
                                        <span className="text-sm text-muted-foreground">No asignado</span>
                                    )}
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Información del cliente */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <User className="h-5 w-5" />
                                Cliente
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <label className="text-sm font-medium">Nombre</label>
                                <p className="text-sm text-muted-foreground mt-1">{clientName}</p>
                            </div>

                            {clientPhone && (
                                <div>
                                    <label className="text-sm font-medium">Teléfono</label>
                                    <div className="flex items-center gap-2 mt-1">
                                        <Phone className="h-4 w-4 text-muted-foreground" />
                                        <p className="text-sm text-muted-foreground">{clientPhone}</p>
                                    </div>
                                </div>
                            )}

                            {clientEmail && (
                                <div>
                                    <label className="text-sm font-medium">Email</label>
                                    <div className="flex items-center gap-2 mt-1">
                                        <Mail className="h-4 w-4 text-muted-foreground" />
                                        <p className="text-sm text-muted-foreground">{clientEmail}</p>
                                    </div>
                                </div>
                            )}

                            <div>
                                <label className="text-sm font-medium">Dirección</label>
                                <div className="flex items-start gap-2 mt-1">
                                    <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                                    <p className="text-sm text-muted-foreground">{clientAddress}</p>
                                </div>
                            </div>

                            {ticket.installation?.ipAddress && (
                                <div>
                                    <label className="text-sm font-medium">IP de Instalación</label>
                                    <p className="text-sm text-muted-foreground mt-1 font-mono">
                                        {ticket.installation.ipAddress}
                                    </p>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Fechas */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Calendar className="h-5 w-5" />
                                Fechas
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <label className="text-sm font-medium">Abierto</label>
                                <div className="flex items-center gap-2 mt-1">
                                    <Clock className="h-4 w-4 text-muted-foreground" />
                                    <p className="text-sm text-muted-foreground">
                                        {new Date(ticket.openedAt).toLocaleString('es-ES')}
                                    </p>
                                </div>
                                <p className="text-xs text-muted-foreground mt-1">
                                    {getTimeSinceCreation(ticket.openedAt)}
                                </p>
                            </div>

                            {ticket.closedAt && (
                                <div>
                                    <label className="text-sm font-medium">Cerrado</label>
                                    <div className="flex items-center gap-2 mt-1">
                                        <Clock className="h-4 w-4 text-muted-foreground" />
                                        <p className="text-sm text-muted-foreground">
                                            {new Date(ticket.closedAt).toLocaleString('es-ES')}
                                        </p>
                                    </div>
                                </div>
                            )}

                            <div>
                                <label className="text-sm font-medium">Última actualización</label>
                                <div className="flex items-center gap-2 mt-1">
                                    <Clock className="h-4 w-4 text-muted-foreground" />
                                    <p className="text-sm text-muted-foreground">
                                        {new Date(ticket.updated_at).toLocaleString('es-ES')}
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* Dialog de editar ticket */}
            {ticket && (
                <EditTicketDialog
                    open={showEditDialog}
                    onOpenChange={setShowEditDialog}
                    ticket={ticket}
                />
            )}
        </div>
    );
}

