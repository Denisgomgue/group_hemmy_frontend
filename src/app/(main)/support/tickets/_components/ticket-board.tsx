"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
    Search,
    Plus,
    Filter,
    Grid3X3,
    List,
    Kanban,
    Download,
    RefreshCw
} from "lucide-react";
import { useTickets } from "@/hooks/use-tickets";
import { TicketCard } from "./ticket-card";
import { TicketTable } from "./ticket-table";
import { TicketKanban } from "./ticket-kanban";
import { TicketFilters } from "./ticket-filters";
import { CreateTicketDialog } from "./create-ticket-dialog";
import { TicketStats } from "./ticket-stats";

type ViewMode = "kanban" | "list" | "grid";

export function TicketBoard() {
    const {
        tickets,
        totalTickets,
        isLoading,
        stats,
        filters,
        updateFilters,
        clearFilters,
        refetch
    } = useTickets();

    const [ viewMode, setViewMode ] = useState<ViewMode>("kanban");
    const [ searchTerm, setSearchTerm ] = useState("");
    const [ showFilters, setShowFilters ] = useState(false);
    const [ showCreateDialog, setShowCreateDialog ] = useState(false);

    const handleSearch = (value: string) => {
        setSearchTerm(value);
        updateFilters({ search: value });
    };

    const filteredTickets = tickets.filter(ticket => {
        if (!searchTerm) return true;
        const term = searchTerm.toLowerCase();
        return (
            ticket.title.toLowerCase().includes(term) ||
            ticket.clientName.toLowerCase().includes(term) ||
            ticket.issue.toLowerCase().includes(term) ||
            ticket.id.toLowerCase().includes(term)
        );
    });

    return (
        <div className="space-y-6">
            {/* Header con estadísticas */}
            <TicketStats stats={stats} />

            {/* Barra de herramientas */}
            <Card>
                <CardHeader className="pb-4">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <div className="flex items-center gap-2">
                            <CardTitle className="text-xl">Tickets</CardTitle>
                            <Badge variant="secondary" className="ml-2">
                                {totalTickets} tickets
                            </Badge>
                        </div>

                        <div className="flex items-center gap-2">
                            {/* Búsqueda */}
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                                <Input
                                    placeholder="Buscar tickets..."
                                    value={searchTerm}
                                    onChange={(e) => handleSearch(e.target.value)}
                                    className="pl-10 w-64"
                                />
                            </div>

                            {/* Botón de filtros */}
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setShowFilters(!showFilters)}
                                className="flex items-center gap-2"
                            >
                                <Filter className="h-4 w-4" />
                                Filtros
                            </Button>

                            {/* Botón de exportar */}
                            <Button
                                variant="outline"
                                size="sm"
                                className="flex items-center gap-2"
                            >
                                <Download className="h-4 w-4" />
                                Exportar
                            </Button>

                            {/* Botón de refrescar */}
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => refetch()}
                                disabled={isLoading}
                                className="flex items-center gap-2"
                            >
                                <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
                                Actualizar
                            </Button>

                            {/* Botón de crear ticket */}
                            <Button
                                onClick={() => setShowCreateDialog(true)}
                                className="flex items-center gap-2"
                            >
                                <Plus className="h-4 w-4" />
                                Nuevo Ticket
                            </Button>
                        </div>
                    </div>
                </CardHeader>

                {/* Filtros expandibles */}
                {showFilters && (
                    <CardContent className="pt-0">
                        <TicketFilters
                            filters={filters}
                            onUpdateFilters={updateFilters}
                            onClearFilters={clearFilters}
                        />
                    </CardContent>
                )}
            </Card>

            {/* Selector de vista */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">Vista:</span>
                    <div className="flex items-center border rounded-md">
                        <Button
                            variant={viewMode === "kanban" ? "default" : "ghost"}
                            size="sm"
                            onClick={() => setViewMode("kanban")}
                            className="rounded-r-none"
                        >
                            <Kanban className="h-4 w-4" />
                        </Button>
                        <Button
                            variant={viewMode === "list" ? "default" : "ghost"}
                            size="sm"
                            onClick={() => setViewMode("list")}
                            className="rounded-none"
                        >
                            <List className="h-4 w-4" />
                        </Button>
                        <Button
                            variant={viewMode === "grid" ? "default" : "ghost"}
                            size="sm"
                            onClick={() => setViewMode("grid")}
                            className="rounded-l-none"
                        >
                            <Grid3X3 className="h-4 w-4" />
                        </Button>
                    </div>
                </div>

                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span>Mostrando {filteredTickets.length} de {totalTickets} tickets</span>
                </div>
            </div>

            {/* Contenido según el modo de vista */}
            <div className="min-h-[600px]">
                {viewMode === "kanban" && (
                    <TicketKanban tickets={filteredTickets} />
                )}

                {viewMode === "list" && (
                    <TicketTable tickets={filteredTickets} />
                )}

                {viewMode === "grid" && (
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {filteredTickets.map((ticket) => (
                            <TicketCard key={ticket.id} ticket={ticket} />
                        ))}
                    </div>
                )}
            </div>

            {/* Diálogo de crear ticket */}
            <CreateTicketDialog
                open={showCreateDialog}
                onOpenChange={setShowCreateDialog}
            />
        </div>
    );
}
