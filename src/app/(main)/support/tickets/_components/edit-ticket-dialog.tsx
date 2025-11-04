"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { updateTicketSchema, UpdateTicketFormData, TicketType, TicketPriority, TicketStatus, TicketOutcome, CreatedAsRole } from "@/schemas/ticket-schema";
import { Ticket, UpdateTicketDto } from "@/types/ticket";
import { useTicket } from "@/hooks/use-ticket";
import { InstallationSearchSelect } from "@/components/search-select/installation-search-select";
import { EmployeeSearchSelect } from "@/components/search-select/employee-search-select";
import { CalendarIcon, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { getClientName } from "@/utils/ticket-helpers";

interface EditTicketDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    ticket: Ticket;
}

const ticketTypeLabels: Record<TicketType, string> = {
    TECHNICAL: 'Técnico',
    BILLING: 'Facturación',
    COMPLAINT: 'Queja',
    REQUEST: 'Solicitud',
    OTHER: 'Otro'
};

const ticketPriorityLabels: Record<TicketPriority, string> = {
    LOW: 'Baja',
    MEDIUM: 'Media',
    HIGH: 'Alta',
    URGENT: 'Urgente'
};

const ticketStatusLabels: Record<TicketStatus, string> = {
    OPEN: 'Abierto',
    IN_PROGRESS: 'En Proceso',
    PENDING: 'Pendiente',
    RESOLVED: 'Resuelto',
    CLOSED: 'Cerrado',
    CANCELLED: 'Cancelado'
};

const ticketOutcomeLabels: Record<TicketOutcome, string> = {
    RESOLVED: 'Resuelto',
    NOT_RESOLVED: 'No Resuelto',
    DUPLICATE: 'Duplicado',
    CANCELLED: 'Cancelado',
    ESCALATED: 'Escalado'
};

const createdAsRoleLabels: Record<CreatedAsRole, string> = {
    CUSTOMER: 'Cliente',
    TECH: 'Técnico',
    ADMIN: 'Administrador'
};

export function EditTicketDialog({ open, onOpenChange, ticket }: EditTicketDialogProps) {
    const { updateTicket, isUpdating } = useTicket();
    const [ selectedInstallationId, setSelectedInstallationId ] = useState<number | undefined>(ticket.installationId);
    const [ scheduledDate, setScheduledDate ] = useState<Date | undefined>(
        ticket.scheduledStart ? new Date(ticket.scheduledStart) : undefined
    );
    const [ closedDate, setClosedDate ] = useState<Date | undefined>(
        ticket.closedAt ? new Date(ticket.closedAt) : undefined
    );

    const form = useForm<UpdateTicketFormData>({
        resolver: zodResolver(updateTicketSchema),
        defaultValues: {
            installationId: ticket.installationId ?? undefined,
            typeCode: ticket.typeCode,
            priorityCode: ticket.priorityCode,
            statusCode: ticket.statusCode,
            subject: ticket.subject,
            description: ticket.description ?? "",
            employeeId: ticket.employeeId ?? undefined,
            scheduledStart: ticket.scheduledStart,
            outcome: ticket.outcome ?? undefined,
            openedAt: ticket.openedAt,
            closedAt: ticket.closedAt ?? undefined,
            createdAsRole: ticket.createdAsRole,
        }
    });

    // Actualizar valores cuando cambia el ticket o se abre el diálogo
    useEffect(() => {
        if (open && ticket) {
            form.reset({
                installationId: ticket.installationId ?? undefined,
                typeCode: ticket.typeCode,
                priorityCode: ticket.priorityCode,
                statusCode: ticket.statusCode,
                subject: ticket.subject,
                description: ticket.description ?? "",
                employeeId: ticket.employeeId ?? undefined,
                scheduledStart: ticket.scheduledStart,
                outcome: ticket.outcome ?? undefined,
                openedAt: ticket.openedAt,
                closedAt: ticket.closedAt ?? undefined,
                createdAsRole: ticket.createdAsRole,
            });
            setSelectedInstallationId(ticket.installationId ?? undefined);
            setScheduledDate(ticket.scheduledStart ? new Date(ticket.scheduledStart) : undefined);
            setClosedDate(ticket.closedAt ? new Date(ticket.closedAt) : undefined);
        }
    }, [ open, ticket, form ]);

    const onSubmit = async (data: UpdateTicketFormData) => {
        try {
            // Preparar datos para actualizar el ticket
            const ticketData: UpdateTicketDto = {
                installationId: data.installationId ?? undefined,
                typeCode: data.typeCode,
                priorityCode: data.priorityCode,
                statusCode: data.statusCode,
                subject: data.subject,
                description: data.description ?? undefined,
                employeeId: data.employeeId ?? undefined,
                scheduledStart: scheduledDate ? scheduledDate.toISOString() : undefined,
                outcome: data.outcome ?? undefined,
                openedAt: data.openedAt,
                closedAt: closedDate ? closedDate.toISOString() : undefined,
                createdAsRole: data.createdAsRole,
            };

            await updateTicket({
                id: ticket.id,
                data: ticketData,
            });
            onOpenChange(false);
        } catch (error: any) {
            console.error("Error al actualizar ticket:", error);
        }
    };

    const handleInstallationChange = (installationId: number | undefined) => {
        form.setValue("installationId", installationId || undefined);
        setSelectedInstallationId(installationId);
    };

    const handleEmployeeChange = (employeeId: number | undefined) => {
        form.setValue("employeeId", employeeId || undefined);
    };

    const clientName = getClientName(ticket);

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Editar Ticket #{ticket.id}</DialogTitle>
                </DialogHeader>

                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    {/* Información básica */}
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="subject">Asunto *</Label>
                            <Input
                                id="subject"
                                placeholder="Descripción breve del problema o servicio"
                                {...form.register("subject")}
                                className={form.formState.errors.subject ? "border-destructive" : ""}
                            />
                            {form.formState.errors.subject && (
                                <p className="text-sm text-destructive">
                                    {form.formState.errors.subject.message}
                                </p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="description">Descripción</Label>
                            <Textarea
                                id="description"
                                placeholder="Descripción detallada del problema..."
                                rows={4}
                                {...form.register("description")}
                            />
                            {form.formState.errors.description && (
                                <p className="text-sm text-destructive">
                                    {form.formState.errors.description.message}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Tipo, Prioridad y Estado */}
                    <div className="grid gap-4 md:grid-cols-3">
                        <div className="space-y-2">
                            <Label htmlFor="typeCode">Tipo *</Label>
                            <Select
                                value={form.watch("typeCode")}
                                onValueChange={(value) => form.setValue("typeCode", value as TicketType)}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Seleccionar tipo" />
                                </SelectTrigger>
                                <SelectContent>
                                    {Object.entries(ticketTypeLabels).map(([ value, label ]) => (
                                        <SelectItem key={value} value={value}>
                                            {label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="priorityCode">Prioridad</Label>
                            <Select
                                value={form.watch("priorityCode") || TicketPriority.MEDIUM}
                                onValueChange={(value) => form.setValue("priorityCode", value as TicketPriority)}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Seleccionar prioridad" />
                                </SelectTrigger>
                                <SelectContent>
                                    {Object.entries(ticketPriorityLabels).map(([ value, label ]) => (
                                        <SelectItem key={value} value={value}>
                                            {label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="statusCode">Estado</Label>
                            <Select
                                value={form.watch("statusCode") || TicketStatus.OPEN}
                                onValueChange={(value) => form.setValue("statusCode", value as TicketStatus)}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Seleccionar estado" />
                                </SelectTrigger>
                                <SelectContent>
                                    {Object.entries(ticketStatusLabels).map(([ value, label ]) => (
                                        <SelectItem key={value} value={value}>
                                            {label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {/* Cliente (solo lectura) e Instalación */}
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="clientId">Cliente *</Label>
                            <Input
                                id="clientId"
                                value={clientName}
                                disabled
                                className="bg-muted cursor-not-allowed"
                                readOnly
                            />
                            <p className="text-xs text-muted-foreground">
                                El cliente no puede ser modificado
                            </p>
                        </div>

                        {form.watch("clientId") && (
                            <div className="space-y-2">
                                <Label htmlFor="installationId">Instalación (Opcional)</Label>
                                <InstallationSearchSelect
                                    value={selectedInstallationId}
                                    onChange={handleInstallationChange}
                                    placeholder="Buscar instalación del cliente..."
                                    clientId={ticket.clientId}
                                />
                            </div>
                        )}
                    </div>

                    {/* Empleado, Fechas y otros campos */}
                    <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                            <Label htmlFor="employeeId">Empleado Asignado (Opcional)</Label>
                            <EmployeeSearchSelect
                                value={form.watch("employeeId") ?? undefined}
                                onChange={handleEmployeeChange}
                                placeholder="Buscar y seleccionar empleado..."
                            />
                        </div>

                        <div className="space-y-2">
                            <Label>Fecha Programada</Label>
                            <Popover modal={false}>
                                <PopoverTrigger asChild>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        className={cn(
                                            "w-full justify-start text-left font-normal",
                                            !scheduledDate && "text-muted-foreground"
                                        )}
                                    >
                                        <CalendarIcon className="mr-2 h-4 w-4" />
                                        {scheduledDate ? (
                                            format(scheduledDate, "PPP", { locale: es })
                                        ) : (
                                            <span>Seleccionar fecha</span>
                                        )}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent
                                    className="w-auto p-0 z-[99999]"
                                    align="start"
                                    onOpenAutoFocus={(e) => e.preventDefault()}
                                    sideOffset={4}
                                >
                                    <div className="relative pointer-events-auto" onPointerDown={(e) => e.stopPropagation()}>
                                        <Calendar
                                            mode="single"
                                            selected={scheduledDate}
                                            onSelect={(date) => {
                                                setScheduledDate(date);
                                            }}
                                            initialFocus={false}
                                        />
                                    </div>
                                </PopoverContent>
                            </Popover>
                        </div>
                    </div>

                    {/* Fecha de cierre y resultado */}
                    <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                            <Label>Fecha de Cierre (Opcional)</Label>
                            <Popover modal={false}>
                                <PopoverTrigger asChild>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        className={cn(
                                            "w-full justify-start text-left font-normal",
                                            !closedDate && "text-muted-foreground"
                                        )}
                                    >
                                        <CalendarIcon className="mr-2 h-4 w-4" />
                                        {closedDate ? (
                                            format(closedDate, "PPP", { locale: es })
                                        ) : (
                                            <span>Seleccionar fecha</span>
                                        )}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent
                                    className="w-auto p-0 z-[99999]"
                                    align="start"
                                    onOpenAutoFocus={(e) => e.preventDefault()}
                                    sideOffset={4}
                                >
                                    <div className="relative pointer-events-auto" onPointerDown={(e) => e.stopPropagation()}>
                                        <Calendar
                                            mode="single"
                                            selected={closedDate}
                                            onSelect={(date) => {
                                                setClosedDate(date);
                                            }}
                                            initialFocus={false}
                                        />
                                    </div>
                                </PopoverContent>
                            </Popover>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="outcome">Resultado (Opcional)</Label>
                            <Select
                                value={form.watch("outcome") || "none"}
                                onValueChange={(value) => {
                                    if (value === "none") {
                                        form.setValue("outcome", undefined);
                                    } else {
                                        form.setValue("outcome", value as TicketOutcome);
                                    }
                                }}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Sin resultado" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="none">Sin resultado</SelectItem>
                                    {Object.entries(ticketOutcomeLabels).map(([ value, label ]) => (
                                        <SelectItem key={value} value={value}>
                                            {label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {/* Rol de creación */}
                    <div className="space-y-2">
                        <Label htmlFor="createdAsRole">Creado Como</Label>
                        <Select
                            value={form.watch("createdAsRole") || CreatedAsRole.CUSTOMER}
                            onValueChange={(value) => form.setValue("createdAsRole", value as CreatedAsRole)}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Seleccionar rol" />
                            </SelectTrigger>
                            <SelectContent>
                                {Object.entries(createdAsRoleLabels).map(([ value, label ]) => (
                                    <SelectItem key={value} value={value}>
                                        {label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                            disabled={isUpdating}
                        >
                            Cancelar
                        </Button>
                        <Button
                            type="submit"
                            disabled={isUpdating}
                        >
                            {isUpdating ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Guardando...
                                </>
                            ) : (
                                "Guardar Cambios"
                            )}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
