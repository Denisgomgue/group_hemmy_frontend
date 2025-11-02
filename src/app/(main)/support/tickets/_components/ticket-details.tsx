"use client";

import { useState, useEffect } from "react";
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
} from "lucide-react";
import { Ticket } from "@/types/tickets/ticket";
import { TicketComment } from "@/types/tickets/ticket-comment";
import { TicketTimeline } from "@/types/tickets/ticket-timeline";
import Link from "next/link";
import { Label } from "@/components/ui/label";

interface TicketDetailsProps {
    ticketId: string;
}

// Datos de ejemplo (en producción vendrían de una API)
const mockTicket: Ticket = {
    id: "T-1234",
    title: "Sin conexión a internet",
    description: "El cliente no tiene conexión a internet desde ayer. Ha intentado reiniciar el router pero no funciona. Necesita asistencia técnica urgente.",
    clientId: "C003",
    clientName: "María González",
    clientPhone: "+51 999 345 678",
    clientEmail: "maria@email.com",
    address: "Av. Principal 123, Sector Norte, Huaraz, Ancash",
    issue: "Sin conexión a internet",
    priority: "alta",
    status: "en-proceso",
    category: "internet",
    assignedTo: "T001",
    assignedToName: "Carlos Méndez",
    createdAt: "2024-01-15T08:00:00Z",
    updatedAt: "2024-01-15T09:00:00Z",
    estimatedDuration: 90,
    notes: "Cliente reporta que la luz del router está apagada. Posible problema de energía o router defectuoso.",
    tags: [ "internet", "router", "urgente" ],
};

const mockComments: TicketComment[] = [
    {
        id: "1",
        ticketId: "T-1234",
        userId: "U001",
        userName: "María González",
        content: "Hola, sigo sin conexión. ¿Pueden enviar un técnico hoy?",
        createdAt: "2024-01-15T08:30:00Z",
        isInternal: false,
    },
    {
        id: "2",
        ticketId: "T-1234",
        userId: "U002",
        userName: "Carlos Méndez",
        content: "Hola María, he programado una visita técnica para hoy a las 2:00 PM. ¿Te parece bien?",
        createdAt: "2024-01-15T09:00:00Z",
        isInternal: false,
    },
];

const mockTimeline: TicketTimeline[] = [
    {
        id: "1",
        ticketId: "T-1234",
        action: "ticket_created",
        description: "Ticket creado por el cliente",
        userId: "U001",
        userName: "María González",
        timestamp: "2024-01-15T08:00:00Z",
    },
    {
        id: "2",
        ticketId: "T-1234",
        action: "ticket_assigned",
        description: "Ticket asignado a Carlos Méndez",
        userId: "U003",
        userName: "Sistema",
        timestamp: "2024-01-15T08:15:00Z",
    },
    {
        id: "3",
        ticketId: "T-1234",
        action: "status_changed",
        description: "Estado cambiado a 'En Proceso'",
        userId: "U002",
        userName: "Carlos Méndez",
        timestamp: "2024-01-15T09:00:00Z",
    },
];

export function TicketDetails({ ticketId }: TicketDetailsProps) {
    const [ ticket, setTicket ] = useState<Ticket | null>(null);
    const [ comments, setComments ] = useState<TicketComment[]>([]);
    const [ timeline, setTimeline ] = useState<TicketTimeline[]>([]);
    const [ activeTab, setActiveTab ] = useState("detalles");

    useEffect(() => {
        // Simular carga de datos
        setTicket(mockTicket);
        setComments(mockComments);
        setTimeline(mockTimeline);
    }, [ ticketId ]);

    if (!ticket) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-corporate-primary mx-auto mb-4"></div>
                    <p className="text-muted-foreground">Cargando ticket...</p>
                </div>
            </div>
        );
    }

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case "urgente":
                return "bg-red-600 text-white";
            case "alta":
                return "bg-corporate-danger text-white";
            case "media":
                return "bg-corporate-warning text-white";
            default:
                return "bg-corporate-info text-white";
        }
    };

    const getPriorityLabel = (priority: string) => {
        switch (priority) {
            case "urgente":
                return "Urgente";
            case "alta":
                return "Alta";
            case "media":
                return "Media";
            default:
                return "Baja";
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case "pendiente":
                return "bg-corporate-warning text-white";
            case "en-proceso":
                return "bg-corporate-info text-white";
            case "programado":
                return "bg-corporate-secondary text-white";
            case "completado":
                return "bg-corporate-success text-white";
            case "cancelado":
                return "bg-gray-500 text-white";
            default:
                return "bg-gray-500 text-white";
        }
    };

    const getStatusLabel = (status: string) => {
        switch (status) {
            case "pendiente":
                return "Pendiente";
            case "en-proceso":
                return "En Proceso";
            case "programado":
                return "Programado";
            case "completado":
                return "Completado";
            case "cancelado":
                return "Cancelado";
            default:
                return status;
        }
    };

    const getCategoryLabel = (category: string) => {
        switch (category) {
            case "internet":
                return "Internet";
            case "telefonia":
                return "Telefonía";
            case "television":
                return "Televisión";
            case "equipos":
                return "Equipos";
            case "instalacion":
                return "Instalación";
            case "mantenimiento":
                return "Mantenimiento";
            default:
                return category;
        }
    };

    return (
        <div className="space-y-6">
            {/* Header con navegación */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link href="/tickets">
                        <Button variant="ghost" size="sm">
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Volver a Tickets
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold text-corporate-primary">{ticket.id}</h1>
                        <p className="text-muted-foreground">{ticket.title}</p>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm">
                        <Settings className="h-4 w-4 mr-2" />
                        Editar
                    </Button>
                    <Button className="bg-corporate-primary hover:bg-corporate-secondary text-white">
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Completar
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
                                <h3 className="font-medium mb-2">Descripción</h3>
                                <p className="text-muted-foreground">{ticket.description}</p>
                            </div>

                            {ticket.notes && (
                                <div>
                                    <h3 className="font-medium mb-2">Notas Técnicas</h3>
                                    <p className="text-muted-foreground">{ticket.notes}</p>
                                </div>
                            )}

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <h3 className="font-medium mb-2">Categoría</h3>
                                    <Badge variant="outline">{getCategoryLabel(ticket.category)}</Badge>
                                </div>
                                <div>
                                    <h3 className="font-medium mb-2">Duración Estimada</h3>
                                    <p className="text-muted-foreground">
                                        {ticket.estimatedDuration ? `${ticket.estimatedDuration} min` : "No especificada"}
                                    </p>
                                </div>
                            </div>

                            {ticket.tags && ticket.tags.length > 0 && (
                                <div>
                                    <h3 className="font-medium mb-2">Etiquetas</h3>
                                    <div className="flex flex-wrap gap-2">
                                        {ticket.tags.map((tag) => (
                                            <Badge key={tag} variant="secondary" className="text-xs">
                                                {tag}
                                            </Badge>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Tabs para comentarios y timeline */}
                    <Card>
                        <CardHeader>
                            <Tabs value={activeTab} onValueChange={setActiveTab}>
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
                            </Tabs>
                        </CardHeader>
                        <CardContent>
                            <TabsContent value="detalles" className="space-y-4">
                                {comments.map((comment) => (
                                    <div key={comment.id} className="flex gap-3 p-3 rounded-lg border">
                                        <Avatar className="h-8 w-8">
                                            <AvatarFallback className="text-xs">
                                                {comment.userName.substring(0, 2).toUpperCase()}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="font-medium text-sm">{comment.userName}</span>
                                                <span className="text-xs text-muted-foreground">
                                                    {new Date(comment.createdAt).toLocaleString('es-ES')}
                                                </span>
                                            </div>
                                            <p className="text-sm">{comment.content}</p>
                                        </div>
                                    </div>
                                ))}

                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        placeholder="Agregar un comentario..."
                                        className="flex-1 px-3 py-2 border rounded-md text-sm"
                                    />
                                    <Button size="sm">Enviar</Button>
                                </div>
                            </TabsContent>

                            <TabsContent value="timeline" className="space-y-4">
                                {timeline.map((event) => (
                                    <div key={event.id} className="flex gap-3">
                                        <div className="flex flex-col items-center">
                                            <div className="w-3 h-3 bg-corporate-primary rounded-full"></div>
                                            <div className="w-px h-8 bg-muted mt-2"></div>
                                        </div>
                                        <div className="flex-1 pb-4">
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="font-medium text-sm">{event.userName}</span>
                                                <span className="text-xs text-muted-foreground">
                                                    {new Date(event.timestamp).toLocaleString('es-ES')}
                                                </span>
                                            </div>
                                            <p className="text-sm text-muted-foreground">{event.description}</p>
                                        </div>
                                    </div>
                                ))}
                            </TabsContent>
                        </CardContent>
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
                                <Label className="text-sm font-medium">Estado Actual</Label>
                                <Badge className={`mt-2 ${getStatusColor(ticket.status)}`}>
                                    {getStatusLabel(ticket.status)}
                                </Badge>
                            </div>

                            <div>
                                <Label className="text-sm font-medium">Prioridad</Label>
                                <Badge className={`mt-2 ${getPriorityColor(ticket.priority)}`}>
                                    {getPriorityLabel(ticket.priority)}
                                </Badge>
                            </div>

                            <div>
                                <Label className="text-sm font-medium">Asignado a</Label>
                                <div className="flex items-center gap-2 mt-2">
                                    <Avatar className="h-8 w-8">
                                        <AvatarFallback className="text-xs">
                                            {ticket.assignedToName?.substring(0, 2).toUpperCase() || "NA"}
                                        </AvatarFallback>
                                    </Avatar>
                                    <span className="text-sm">{ticket.assignedToName || "No asignado"}</span>
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
                                <Label className="text-sm font-medium">Nombre</Label>
                                <p className="text-sm text-muted-foreground mt-1">{ticket.clientName}</p>
                            </div>

                            <div>
                                <Label className="text-sm font-medium">Teléfono</Label>
                                <div className="flex items-center gap-2 mt-1">
                                    <Phone className="h-4 w-4 text-muted-foreground" />
                                    <p className="text-sm text-muted-foreground">{ticket.clientPhone}</p>
                                </div>
                            </div>

                            <div>
                                <Label className="text-sm font-medium">Email</Label>
                                <div className="flex items-center gap-2 mt-1">
                                    <Mail className="h-4 w-4 text-muted-foreground" />
                                    <p className="text-sm text-muted-foreground">{ticket.clientEmail}</p>
                                </div>
                            </div>

                            <div>
                                <Label className="text-sm font-medium">Dirección</Label>
                                <div className="flex items-start gap-2 mt-1">
                                    <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                                    <p className="text-sm text-muted-foreground">{ticket.address}</p>
                                </div>
                            </div>
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
                                <Label className="text-sm font-medium">Creado</Label>
                                <div className="flex items-center gap-2 mt-1">
                                    <Clock className="h-4 w-4 text-muted-foreground" />
                                    <p className="text-sm text-muted-foreground">
                                        {new Date(ticket.createdAt).toLocaleString('es-ES')}
                                    </p>
                                </div>
                            </div>

                            <div>
                                <Label className="text-sm font-medium">Última actualización</Label>
                                <div className="flex items-center gap-2 mt-1">
                                    <Clock className="h-4 w-4 text-muted-foreground" />
                                    <p className="text-sm text-muted-foreground">
                                        {new Date(ticket.updatedAt).toLocaleString('es-ES')}
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
