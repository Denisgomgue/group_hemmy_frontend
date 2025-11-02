"use client";

import { useState, useMemo } from "react";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Clock } from "lucide-react";
import { BusinessHour, BusinessHours, DAYS_OF_WEEK, DEFAULT_BUSINESS_HOURS } from "@/types/company/business-hours";

interface BusinessHoursFormProps {
    value: BusinessHours | undefined;
    onChange: (value: BusinessHours) => void;
}

export function BusinessHoursForm({ value, onChange }: BusinessHoursFormProps) {
    // Estado local para los horarios - se inicializa una sola vez
    const [ hoursData, setHoursData ] = useState<BusinessHours>(() => {
        if (value && Array.isArray(value) && value.length > 0) {
            // Fusionar datos del backend con estructura base
            const mergedHours = DEFAULT_BUSINESS_HOURS.map(defaultDay => {
                const existingDay = value.find(v => v.day === defaultDay.day);
                if (existingDay) {
                    return {
                        day: defaultDay.day,
                        isOpen: existingDay.isOpen ?? false,
                        openTime: existingDay.openTime || undefined,    // Solo usar valor si existe
                        closeTime: existingDay.closeTime || undefined,  // Solo usar valor si existe
                    };
                }
                // Si no existe el día en los datos del backend, usar estructura vacía
                return {
                    day: defaultDay.day,
                    isOpen: false,
                    openTime: undefined,
                    closeTime: undefined,
                };
            });

            console.log("🕐 BusinessHoursForm - Fusionando datos del backend:", { original: value, merged: mergedHours });
            return mergedHours;
        }

        // Si no hay datos del backend, inicializar con campos vacíos
        const emptyHours = DEFAULT_BUSINESS_HOURS.map(defaultDay => ({
            ...defaultDay,
            openTime: undefined,  // Campo vacío en lugar de valor por defecto
            closeTime: undefined, // Campo vacío en lugar de valor por defecto
            isOpen: false         // Por defecto cerrado
        }));

        console.log("🕐 BusinessHoursForm - Inicializando sin datos del backend:", emptyHours);
        return emptyHours;
    });

    // Estado para detectar cambios locales
    const [ hasLocalChanges, setHasLocalChanges ] = useState(false);

    // Función simple para manejar cambios
    const handleDayChange = (day: string, field: keyof BusinessHour, newValue: boolean | string) => {
        const newData = hoursData.map(hour => {
            if (hour.day === day) {
                const updated = { ...hour };

                if (field === 'openTime' || field === 'closeTime') {
                    // Para campos de tiempo, convertir string vacío a undefined
                    updated[ field ] = newValue === '' ? undefined : newValue as string | undefined;
                } else if (field === 'isOpen') {
                    updated.isOpen = newValue as boolean;
                    // Si se cierra el día, limpiar los tiempos
                    if (!newValue) {
                        updated.openTime = undefined;
                        updated.closeTime = undefined;
                    }
                }

                return updated;
            }
            return hour;
        });

        // Actualizar estado local
        setHoursData(newData);
        setHasLocalChanges(true);

        // Notificar al formulario padre
        onChange(newData);
    };

    // Generar opciones de tiempo
    const timeOptions = useMemo(() => {
        const times = [];
        for (let hour = 0; hour < 24; hour++) {
            for (let minute = 0; minute < 60; minute += 30) {
                const timeString = `${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`;
                times.push(timeString);
            }
        }
        return times;
    }, []);

    return (
        <Card className="border-primary/20">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5" />
                    Horarios de Atención
                    {hasLocalChanges && (
                        <span className="text-xs bg-orange-100 text-orange-800 px-2 py-1 rounded-full">
                            Cambios pendientes
                        </span>
                    )}
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                {DAYS_OF_WEEK.map(({ value: dayValue, label }) => {
                    const dayData = hoursData.find(h => h.day === dayValue);
                    if (!dayData) return null;

                    return (
                        <div key={dayValue} className="flex items-center gap-4 p-3 rounded-lg border border-muted">
                            <div className="w-20">
                                <Label className="text-sm font-medium">{label}</Label>
                            </div>

                            <div className="flex items-center gap-2">
                                <Switch
                                    checked={dayData.isOpen}
                                    onCheckedChange={(checked) => {
                                        handleDayChange(dayValue, "isOpen", checked);
                                    }}
                                />
                                <span className="text-sm text-muted-foreground">
                                    {dayData.isOpen ? "Abierto" : "Cerrado"}
                                </span>
                            </div>

                            {dayData.isOpen && (
                                <div className="flex items-center gap-2 ml-auto">
                                    <Select
                                        value={dayData.openTime || ""}
                                        onValueChange={(timeValue) => {
                                            handleDayChange(dayValue, "openTime", timeValue);
                                        }}
                                    >
                                        <SelectTrigger className="w-24">
                                            <SelectValue placeholder="Abrir" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {timeOptions.map((time) => (
                                                <SelectItem key={time} value={time}>
                                                    {time}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>

                                    <span className="text-muted-foreground">a</span>

                                    <Select
                                        value={dayData.closeTime || ""}
                                        onValueChange={(timeValue) => {
                                            handleDayChange(dayValue, "closeTime", timeValue);
                                        }}
                                    >
                                        <SelectTrigger className="w-24">
                                            <SelectValue placeholder="Cerrar" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {timeOptions.map((time) => (
                                                <SelectItem key={time} value={time}>
                                                    {time}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            )}
                        </div>
                    );
                })}
            </CardContent>
        </Card>
    );
}
