"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { X, CalendarIcon, Plus, Loader2, Clock } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ticketSchema, TicketFormData } from "@/schemas/ticket-schema";
import { useTickets } from "@/hooks/use-tickets";
import {
    priorityFilterOptions,
    categoryFilterOptions,
    statusFilterOptions
} from "@/utils/ticket-labels";
import { ClientSearchSelect } from "@/components/search-select/client-search-select";
import { EmployeeSearchSelect } from "@/components/search-select/employee-search-select";
import { Client } from "@/types/clients/client";
import { useClient } from "@/hooks/use-client";

interface CreateTicketDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function CreateTicketDialog({ open, onOpenChange }: CreateTicketDialogProps) {
    const { createTicket, isCreating } = useTickets();
    const [ tags, setTags ] = useState<string[]>([]);
    const [ newTag, setNewTag ] = useState("");
    const [ selectedClient, setSelectedClient ] = useState<Client | null>(null);
    const { getClientById } = useClient();

    const form = useForm<TicketFormData>({
        resolver: zodResolver(ticketSchema),
        defaultValues: {
            title: "",
            description: "",
            clientId: undefined,
            employeeId: undefined,
            priority: "media",
            category: "otro",
            status: "pendiente",
            scheduledDate: undefined,
            scheduledTime: "",
            estimatedDuration: undefined,
            notes: "",
            tags: []
        }
    });

    const onSubmit = async (data: TicketFormData) => {
        try {
            if (!selectedClient) {
                throw new Error("Debe seleccionar un cliente");
            }

            // Crear el objeto CreateTicketDto con todos los campos requeridos
            const ticketData = {
                ...data,
                tags: tags,
                // Campos requeridos por CreateTicketDto
                clientName: `${selectedClient.name || ''} ${selectedClient.lastName || ''}`.trim(),
                clientPhone: selectedClient.phone || '',
                clientEmail: '', // El tipo Client no tiene email, usar string vacío
                address: selectedClient.address || '',
                issue: data.description, // Usar la descripción como issue
                // Convertir clientId a string como requiere el DTO
                clientId: selectedClient.id.toString()
            };

            await createTicket(ticketData);
            form.reset();
            setTags([]);
            setSelectedClient(null);
            onOpenChange(false);
        } catch (error) {
            console.error("Error al crear ticket:", error);
        }
    };

    const handleClientSelect = async (clientId: number) => {
        try {
            const client = await getClientById(clientId);
            setSelectedClient(client);
            form.setValue("clientId", clientId);
        } catch (error) {
            console.error("Error al obtener cliente:", error);
        }
    };

    const handleEmployeeSelect = (employeeId: number) => {
        form.setValue("employeeId", employeeId);
    };

    const addTag = () => {
        if (newTag.trim() && !tags.includes(newTag.trim()) && tags.length < 10) {
            setTags([ ...tags, newTag.trim() ]);
            setNewTag("");
        }
    };

    const removeTag = (tagToRemove: string) => {
        setTags(tags.filter(tag => tag !== tagToRemove));
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            addTag();
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Plus className="h-5 w-5" />
                        Crear Nuevo Ticket
                    </DialogTitle>
                </DialogHeader>

                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    {/* Información básica */}
                    <div className="space-y-2">
                        <Label htmlFor="title">Título *</Label>
                        <Input
                            id="title"
                            placeholder="Descripción breve del problema o servicio"
                            {...form.register("title")}
                        />
                        {form.formState.errors.title && (
                            <p className="text-sm text-destructive">
                                {form.formState.errors.title.message}
                            </p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="description">Descripción *</Label>
                        <Textarea
                            id="description"
                            placeholder="Descripción detallada del problema..."
                            rows={3}
                            {...form.register("description")}
                        />
                        {form.formState.errors.description && (
                            <p className="text-sm text-destructive">
                                {form.formState.errors.description.message}
                            </p>
                        )}
                    </div>

                    {/* Prioridad, categoría y estado */}
                    <div className="grid gap-4 md:grid-cols-3">
                        <div className="space-y-2">
                            <Label htmlFor="priority">Prioridad *</Label>
                            <Select
                                value={form.watch("priority")}
                                onValueChange={(value) => form.setValue("priority", value as any)}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Seleccionar prioridad" />
                                </SelectTrigger>
                                <SelectContent>
                                    {priorityFilterOptions.map((option) => (
                                        <SelectItem key={option.value} value={option.value}>
                                            {option.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="category">Categoría *</Label>
                            <Select
                                value={form.watch("category")}
                                onValueChange={(value) => form.setValue("category", value as any)}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Seleccionar categoría" />
                                </SelectTrigger>
                                <SelectContent>
                                    {categoryFilterOptions.map((option) => (
                                        <SelectItem key={option.value} value={option.value}>
                                            {option.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="status">Estado *</Label>
                            <Select
                                value={form.watch("status")}
                                onValueChange={(value) => form.setValue("status", value as any)}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Seleccionar estado" />
                                </SelectTrigger>
                                <SelectContent>
                                    {statusFilterOptions.map((option) => (
                                        <SelectItem key={option.value} value={option.value}>
                                            {option.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {/* Selección de Cliente y Empleado */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-medium border-b pb-2">Asignación</h3>

                        <div className="grid gap-4 md:grid-cols-2">
                            <div className="space-y-2">
                                <Label htmlFor="clientId">Cliente *</Label>
                                <ClientSearchSelect
                                    value={form.watch("clientId")}
                                    onChange={handleClientSelect}
                                    placeholder="Buscar y seleccionar cliente..."
                                    error={!!form.formState.errors.clientId}
                                />
                                {form.formState.errors.clientId && (
                                    <p className="text-sm text-destructive">
                                        {form.formState.errors.clientId.message}
                                    </p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="employeeId">Empleado Asignado *</Label>
                                <EmployeeSearchSelect
                                    value={form.watch("employeeId")}
                                    onChange={handleEmployeeSelect}
                                    placeholder="Buscar y seleccionar empleado..."
                                    error={!!form.formState.errors.employeeId}
                                />
                                {form.formState.errors.employeeId && (
                                    <p className="text-sm text-destructive">
                                        {form.formState.errors.employeeId.message}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Información adicional */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-medium border-b pb-2">Información Adicional</h3>

                        <div className="grid gap-4 md:grid-cols-3">
                            <div className="space-y-2">
                                <Label>Fecha Programada</Label>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button
                                            variant="outline"
                                            className="w-full justify-start text-left font-normal"
                                        >
                                            <CalendarIcon className="mr-2 h-4 w-4" />
                                            {form.watch("scheduledDate") ? (
                                                format(new Date(form.watch("scheduledDate") || ''), "PPP", { locale: es })
                                            ) : (
                                                <span>Seleccionar fecha</span>
                                            )}
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0" align="start">
                                        <Calendar
                                            mode="single"
                                            selected={form.watch("scheduledDate") ? new Date(form.watch("scheduledDate") || '') : undefined}
                                            onSelect={(date) => {
                                                if (date) {
                                                    form.setValue("scheduledDate", date.toISOString());
                                                } else {
                                                    form.setValue("scheduledDate", undefined);
                                                }
                                            }}
                                            initialFocus
                                            disabled={(date) => date < new Date()}
                                        />
                                    </PopoverContent>
                                </Popover>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="scheduledTime">Hora Programada</Label>
                                <Input
                                    id="scheduledTime"
                                    type="time"
                                    placeholder="09:00"
                                    {...form.register("scheduledTime")}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="estimatedDuration">Duración Estimada (minutos)</Label>
                                <Input
                                    id="estimatedDuration"
                                    type="number"
                                    placeholder="60"
                                    min="15"
                                    max="480"
                                    {...form.register("estimatedDuration", { valueAsNumber: true })}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="notes">Notas Adicionales</Label>
                            <Textarea
                                id="notes"
                                placeholder="Información adicional, instrucciones especiales, requisitos técnicos..."
                                rows={3}
                                {...form.register("notes")}
                            />
                        </div>



                        {/* Etiquetas */}
                        <div className="space-y-2">
                            <Label>Etiquetas</Label>
                            <div className="flex gap-2">
                                <Input
                                    placeholder="Agregar etiqueta..."
                                    value={newTag}
                                    onChange={(e) => setNewTag(e.target.value)}
                                    onKeyPress={handleKeyPress}
                                    maxLength={20}
                                />
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={addTag}
                                    disabled={!newTag.trim() || tags.length >= 10}
                                >
                                    <Plus className="h-4 w-4" />
                                </Button>
                            </div>

                            {tags.length > 0 && (
                                <div className="flex flex-wrap gap-2 mt-2">
                                    {tags.map((tag, index) => (
                                        <Badge key={index} variant="secondary" className="flex items-center gap-1">
                                            {tag}
                                            <X
                                                className="h-3 w-3 cursor-pointer"
                                                onClick={() => removeTag(tag)}
                                            />
                                        </Badge>
                                    ))}
                                </div>
                            )}

                            <p className="text-xs text-muted-foreground">
                                Máximo 10 etiquetas. Presiona Enter para agregar.
                            </p>
                            <p className="text-xs text-muted-foreground">
                                <strong>Uso de etiquetas:</strong> Útil para categorizar tickets por tipo de servicio,
                                ubicación geográfica, equipo específico, o cualquier clasificación personalizada que
                                ayude a organizar y filtrar tickets.
                            </p>
                        </div>
                    </div>

                    {/* Botones de acción */}
                    <div className="flex justify-end gap-2 pt-4 border-t">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                            disabled={isCreating}
                        >
                            Cancelar
                        </Button>
                        <Button
                            type="submit"
                            disabled={isCreating}
                            className="flex items-center gap-2"
                        >
                            {isCreating ? (
                                <>
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                    Creando...
                                </>
                            ) : (
                                <>
                                    <Plus className="h-4 w-4" />
                                    Crear Ticket
                                </>
                            )}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
