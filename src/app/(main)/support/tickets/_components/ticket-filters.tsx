"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { X, CalendarIcon, Filter, RotateCcw } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { TicketFilters as TicketFiltersType } from "@/types/tickets";
import {
    priorityFilterOptions,
    statusFilterOptions,
    categoryFilterOptions
} from "@/utils/ticket-labels";

interface TicketFiltersProps {
    filters: TicketFiltersType;
    onUpdateFilters: (filters: Partial<TicketFiltersType>) => void;
    onClearFilters: () => void;
}

export function TicketFilters({ filters, onUpdateFilters, onClearFilters }: TicketFiltersProps) {
    const [ localFilters, setLocalFilters ] = useState<TicketFiltersType>(filters);

    const handleFilterChange = (key: keyof TicketFiltersType, value: any) => {
        const newFilters = { ...localFilters, [ key ]: value };
        setLocalFilters(newFilters);
        onUpdateFilters(newFilters);
    };

    const handleClearFilters = () => {
        setLocalFilters({});
        onClearFilters();
    };

    const hasActiveFilters = Object.values(filters).some(value =>
        value !== undefined &&
        value !== null &&
        (Array.isArray(value) ? value.length > 0 : value !== '')
    );

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Filter className="h-4 w-4" />
                    <span className="font-medium">Filtros Avanzados</span>
                    {hasActiveFilters && (
                        <Badge variant="secondary" className="ml-2">
                            {Object.values(filters).filter(v => v !== undefined && v !== null && (Array.isArray(v) ? v.length > 0 : v !== '')).length} activos
                        </Badge>
                    )}
                </div>

                <div className="flex items-center gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={handleClearFilters}
                        className="flex items-center gap-2"
                    >
                        <RotateCcw className="h-4 w-4" />
                        Limpiar
                    </Button>
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {/* Búsqueda por texto */}
                <div className="space-y-2">
                    <Label htmlFor="search">Búsqueda</Label>
                    <Input
                        id="search"
                        placeholder="Buscar en tickets..."
                        value={localFilters.search || ""}
                        onChange={(e) => handleFilterChange("search", e.target.value)}
                    />
                </div>

                {/* Filtro por estado */}
                <div className="space-y-2">
                    <Label htmlFor="status">Estado</Label>
                    <Select
                        value={localFilters.status?.[ 0 ] || ""}
                        onValueChange={(value) => handleFilterChange("status", value ? [ value ] : undefined)}
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

                {/* Filtro por prioridad */}
                <div className="space-y-2">
                    <Label htmlFor="priority">Prioridad</Label>
                    <Select
                        value={localFilters.priority?.[ 0 ] || ""}
                        onValueChange={(value) => handleFilterChange("priority", value ? [ value ] : undefined)}
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

                {/* Filtro por categoría */}
                <div className="space-y-2">
                    <Label htmlFor="category">Categoría</Label>
                    <Select
                        value={localFilters.category?.[ 0 ] || ""}
                        onValueChange={(value) => handleFilterChange("category", value ? [ value ] : undefined)}
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

                {/* Filtro por fecha desde */}
                <div className="space-y-2">
                    <Label>Fecha desde</Label>
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button
                                variant="outline"
                                className="w-full justify-start text-left font-normal"
                            >
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {localFilters.dateRange?.from ? (
                                    format(new Date(localFilters.dateRange.from), "PPP", { locale: es })
                                ) : (
                                    <span>Seleccionar fecha</span>
                                )}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                                mode="single"
                                selected={localFilters.dateRange?.from ? new Date(localFilters.dateRange.from) : undefined}
                                onSelect={(date) => handleFilterChange("dateRange", {
                                    ...localFilters.dateRange,
                                    from: date ? date.toISOString() : undefined
                                })}
                                initialFocus
                            />
                        </PopoverContent>
                    </Popover>
                </div>

                {/* Filtro por fecha hasta */}
                <div className="space-y-2">
                    <Label>Fecha hasta</Label>
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button
                                variant="outline"
                                className="w-full justify-start text-left font-normal"
                            >
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {localFilters.dateRange?.to ? (
                                    format(new Date(localFilters.dateRange.to), "PPP", { locale: es })
                                ) : (
                                    <span>Seleccionar fecha</span>
                                )}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                                mode="single"
                                selected={localFilters.dateRange?.to ? new Date(localFilters.dateRange.to) : undefined}
                                onSelect={(date) => handleFilterChange("dateRange", {
                                    ...localFilters.dateRange,
                                    to: date ? date.toISOString() : undefined
                                })}
                                initialFocus
                            />
                        </PopoverContent>
                    </Popover>
                </div>
            </div>

            {/* Filtros activos */}
            {hasActiveFilters && (
                <div className="flex flex-wrap gap-2 pt-2 border-t">
                    <span className="text-sm text-muted-foreground mr-2">Filtros activos:</span>

                    {filters.search && (
                        <Badge variant="secondary" className="flex items-center gap-1">
                            Búsqueda: {filters.search}
                            <X
                                className="h-3 w-3 cursor-pointer"
                                onClick={() => handleFilterChange("search", undefined)}
                            />
                        </Badge>
                    )}

                    {filters.status?.map((status) => (
                        <Badge key={status} variant="secondary" className="flex items-center gap-1">
                            Estado: {status}
                            <X
                                className="h-3 w-3 cursor-pointer"
                                onClick={() => handleFilterChange("status", filters.status?.filter(s => s !== status))}
                            />
                        </Badge>
                    ))}

                    {filters.priority?.map((priority) => (
                        <Badge key={priority} variant="secondary" className="flex items-center gap-1">
                            Prioridad: {priority}
                            <X
                                className="h-3 w-3 cursor-pointer"
                                onClick={() => handleFilterChange("priority", filters.priority?.filter(p => p !== priority))}
                            />
                        </Badge>
                    ))}

                    {filters.category?.map((category) => (
                        <Badge key={category} variant="secondary" className="flex items-center gap-1">
                            Categoría: {category}
                            <X
                                className="h-3 w-3 cursor-pointer"
                                onClick={() => handleFilterChange("category", filters.category?.filter(c => c !== category))}
                            />
                        </Badge>
                    ))}

                    {filters.dateRange?.from && (
                        <Badge variant="secondary" className="flex items-center gap-1">
                            Desde: {format(new Date(filters.dateRange.from), "dd/MM/yyyy")}
                            <X
                                className="h-3 w-3 cursor-pointer"
                                onClick={() => handleFilterChange("dateRange", { ...filters.dateRange, from: undefined })}
                            />
                        </Badge>
                    )}

                    {filters.dateRange?.to && (
                        <Badge variant="secondary" className="flex items-center gap-1">
                            Hasta: {format(new Date(filters.dateRange.to), "dd/MM/yyyy")}
                            <X
                                className="h-3 w-3 cursor-pointer"
                                onClick={() => handleFilterChange("dateRange", { ...filters.dateRange, to: undefined })}
                            />
                        </Badge>
                    )}
                </div>
            )}
        </div>
    );
}
