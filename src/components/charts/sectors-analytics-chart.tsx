"use client";

import React, { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell
} from "recharts";
import {
    BarChart3,
    PieChart as PieChartIcon,
    TrendingUp,
    AlertTriangle,
    CheckCircle,
    Clock,
    Users,
    Filter,
    RefreshCw
} from "lucide-react";
import { ClientsAPI, SectorAnalytics } from "@/services/clients-api";

// Colores para los diferentes estados
const COLORS = {
    active: "#10b981",      // Verde
    suspended: "#ef4444",   // Rojo
    inactive: "#f59e0b",    // Amarillo
    paid: "#3b82f6",        // Azul
    expiring: "#f97316",    // Naranja
    expired: "#dc2626",     // Rojo oscuro
    suspendedPayment: "#6b7280" // Gris
};

const CHART_TYPES = [
    { value: "bar", label: "Gráfico de Barras", icon: <BarChart3 className="h-4 w-4" /> },
    { value: "pie", label: "Gráfico Circular", icon: <PieChartIcon className="h-4 w-4" /> }
];

const FILTER_OPTIONS = [
    { value: "all", label: "Todos los Estados" },
    { value: "status", label: "Estados del Cliente" },
    { value: "payment", label: "Estados de Pago" }
];

interface SectorsAnalyticsChartProps {
    className?: string;
}

export function SectorsAnalyticsChart({ className }: SectorsAnalyticsChartProps) {
    const [ chartType, setChartType ] = useState<"bar" | "pie">("bar");
    const [ filterType, setFilterType ] = useState<"all" | "status" | "payment">("all");
    const [ selectedMetric, setSelectedMetric ] = useState<string>("total");

    // Query para obtener datos de análisis
    const {
        data: analyticsData,
        isLoading,
        error,
        refetch
    } = useQuery({
        queryKey: [ "sectorsAnalytics" ],
        queryFn: () => ClientsAPI.getAnalyticsBySectors(),
        staleTime: 5 * 60 * 1000, // 5 minutos
    });

    // Procesar datos para el gráfico
    const chartData = useMemo(() => {
        if (!analyticsData?.sectors) return [];

        return analyticsData.sectors.map(sector => {
            const data: any = {
                sector: sector.sectorName,
                total: sector.total
            };

            if (filterType === "all" || filterType === "status") {
                data.active = sector.active;
                data.suspended = sector.suspended;
                data.inactive = sector.inactive;
            }

            if (filterType === "all" || filterType === "payment") {
                data.paid = sector.paid;
                data.expiring = sector.expiring;
                data.expired = sector.expired;
                data.suspendedPayment = sector.suspendedPayment;
            }

            return data;
        });
    }, [ analyticsData, filterType ]);

    // Datos para gráfico circular (solo una métrica)
    const pieData = useMemo(() => {
        if (!analyticsData?.sectors || chartType !== "pie") return [];

        return analyticsData.sectors.map(sector => ({
            name: sector.sectorName,
            value: sector[ selectedMetric as keyof SectorAnalytics ] as number,
            percentage: analyticsData.total > 0
                ? ((sector[ selectedMetric as keyof SectorAnalytics ] as number) / analyticsData.total * 100).toFixed(1)
                : 0
        }));
    }, [ analyticsData, selectedMetric, chartType ]);

    // Opciones de métricas para gráfico circular
    const metricOptions = useMemo(() => {
        const options = [
            { value: "total", label: "Total Clientes" },
            { value: "active", label: "Activos" },
            { value: "suspended", label: "Suspendidos" },
            { value: "inactive", label: "Inactivos" }
        ];

        if (filterType === "all" || filterType === "payment") {
            options.push(
                { value: "paid", label: "Pagados" },
                { value: "expiring", label: "Por Vencer" },
                { value: "expired", label: "Vencidos" },
                { value: "suspendedPayment", label: "Suspendidos Pago" }
            );
        }

        return options;
    }, [ filterType ]);

    const renderTooltip = (props: any) => {
        const { active, payload } = props;
        if (active && payload && payload.length) {
            return (
                <div className="bg-background border border-border rounded-lg shadow-lg p-3">
                    <p className="font-medium text-foreground mb-2">
                        {payload[0].payload.sector}
                    </p>
                    {payload.map((entry: any, index: number) => (
                        <p key={index} className="text-sm" style={{ color: entry.color }}>
                            {`${entry.name}: ${entry.value} clientes`}
                        </p>
                    ))}
                </div>
            );
        }
        return null;
    };

    const renderPieTooltip = (props: any) => {
        const { active, payload } = props;
        if (active && payload && payload.length) {
            const data = payload[0].payload;
            return (
                <div className="bg-background border border-border rounded-lg shadow-lg p-3">
                    <p className="font-medium text-foreground mb-2">{data.name}</p>
                    <p className="text-sm text-foreground">
                        {`${data.value} clientes (${data.percentage}%)`}
                    </p>
                </div>
            );
        }
        return null;
    };

    if (isLoading) {
        return (
            <Card className={className}>
                <CardHeader>
                    <Skeleton className="h-6 w-64" />
                    <Skeleton className="h-4 w-96" />
                </CardHeader>
                <CardContent>
                    <Skeleton className="h-80 w-full" />
                </CardContent>
            </Card>
        );
    }

    if (error) {
        return (
            <Card className={className}>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <CardTitle className="flex items-center gap-2">
                            <AlertTriangle className="h-5 w-5 text-destructive" />
                            Error al cargar datos
                        </CardTitle>
                        <Button variant="outline" size="sm" onClick={() => refetch()}>
                            <RefreshCw className="h-4 w-4 mr-2" />
                            Reintentar
                        </Button>
                    </div>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground">
                        No se pudieron cargar los datos de análisis por sectores.
                    </p>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className={className}>
            <CardHeader>
                <div className="flex flex-col gap-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle className="flex items-center gap-2">
                                <Users className="h-5 w-5" />
                                Análisis por Sectores
                            </CardTitle>
                            <p className="text-sm text-muted-foreground mt-1">
                                Distribución de clientes según sectores y estados
                            </p>
                        </div>
                        <Button variant="outline" size="sm" onClick={() => refetch()}>
                            <RefreshCw className="h-4 w-4 mr-2" />
                            Actualizar
                        </Button>
                    </div>

                    {/* Controles */}
                    <div className="flex flex-wrap gap-4">
                        {/* Tipo de gráfico */}
                        <div className="flex items-center gap-2">
                            <Filter className="h-4 w-4 text-muted-foreground" />
                            <Select value={chartType} onValueChange={(value: "bar" | "pie") => setChartType(value)}>
                                <SelectTrigger className="w-40">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {CHART_TYPES.map(type => (
                                        <SelectItem key={type.value} value={type.value}>
                                            <div className="flex items-center gap-2">
                                                {type.icon}
                                                {type.label}
                                            </div>
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Filtro de datos */}
                        <div className="flex items-center gap-2">
                            <Select value={filterType} onValueChange={(value: "all" | "status" | "payment") => setFilterType(value)}>
                                <SelectTrigger className="w-44">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {FILTER_OPTIONS.map(option => (
                                        <SelectItem key={option.value} value={option.value}>
                                            {option.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Métrica para gráfico circular */}
                        {chartType === "pie" && (
                            <div className="flex items-center gap-2">
                                <Select value={selectedMetric} onValueChange={setSelectedMetric}>
                                    <SelectTrigger className="w-48">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {metricOptions.map(option => (
                                            <SelectItem key={option.value} value={option.value}>
                                                {option.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        )}
                    </div>
                </div>
            </CardHeader>

            <CardContent>
                {/* Estadísticas resumen */}
                {analyticsData && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                        <div className="bg-blue-50 dark:bg-blue-950/20 p-4 rounded-lg">
                            <div className="flex items-center gap-2">
                                <Users className="h-5 w-5 text-blue-600" />
                                <span className="text-sm font-medium text-blue-900 dark:text-blue-100">
                                    Total Clientes
                                </span>
                            </div>
                            <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">
                                {analyticsData.total.toLocaleString()}
                            </p>
                        </div>

                        <div className="bg-green-50 dark:bg-green-950/20 p-4 rounded-lg">
                            <div className="flex items-center gap-2">
                                <CheckCircle className="h-5 w-5 text-green-600" />
                                <span className="text-sm font-medium text-green-900 dark:text-green-100">
                                    Sectores Activos
                                </span>
                            </div>
                            <p className="text-2xl font-bold text-green-900 dark:text-green-100">
                                {analyticsData.summary.totalSectors}
                            </p>
                        </div>

                        <div className="bg-orange-50 dark:bg-orange-950/20 p-4 rounded-lg">
                            <div className="flex items-center gap-2">
                                <TrendingUp className="h-5 w-5 text-orange-600" />
                                <span className="text-sm font-medium text-orange-900 dark:text-orange-100">
                                    Promedio por Sector
                                </span>
                            </div>
                            <p className="text-2xl font-bold text-orange-900 dark:text-orange-100">
                                {analyticsData.summary.averageClientsPerSector}
                            </p>
                        </div>
                    </div>
                )}

                {/* Gráfico */}
                <div className="h-80">
                    {chartType === "bar" ? (
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                                <XAxis
                                    dataKey="sector"
                                    angle={-45}
                                    textAnchor="end"
                                    height={80}
                                    fontSize={12}
                                />
                                <YAxis fontSize={12} />
                                <Tooltip content={renderTooltip} />
                                <Legend />

                                {(filterType === "all" || filterType === "status") && (
                                    <>
                                        <Bar dataKey="active" stackId="status" fill={COLORS.active} name="Activos" />
                                        <Bar dataKey="suspended" stackId="status" fill={COLORS.suspended} name="Suspendidos" />
                                        <Bar dataKey="inactive" stackId="status" fill={COLORS.inactive} name="Inactivos" />
                                    </>
                                )}

                                {(filterType === "all" || filterType === "payment") && (
                                    <>
                                        <Bar dataKey="paid" stackId="payment" fill={COLORS.paid} name="Pagados" />
                                        <Bar dataKey="expiring" stackId="payment" fill={COLORS.expiring} name="Por Vencer" />
                                        <Bar dataKey="expired" stackId="payment" fill={COLORS.expired} name="Vencidos" />
                                        <Bar dataKey="suspendedPayment" stackId="payment" fill={COLORS.suspendedPayment} name="Suspendidos Pago" />
                                    </>
                                )}
                            </BarChart>
                        </ResponsiveContainer>
                    ) : (
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={pieData}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    label={({ name, percentage }) => `${name}: ${percentage}%`}
                                    outerRadius={100}
                                    fill="#8884d8"
                                    dataKey="value"
                                >
                                    {pieData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={Object.values(COLORS)[ index % Object.values(COLORS).length ]} />
                                    ))}
                                </Pie>
                                <Tooltip content={renderPieTooltip} />
                            </PieChart>
                        </ResponsiveContainer>
                    )}
                </div>

                {/* Tabla de datos */}
                <div className="mt-6">
                    <h4 className="text-lg font-semibold mb-3">Datos Detallados por Sector</h4>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b">
                                    <th className="text-left p-2">Sector</th>
                                    <th className="text-right p-2">Total</th>
                                    <th className="text-right p-2">Activos</th>
                                    <th className="text-right p-2">Suspendidos</th>
                                    <th className="text-right p-2">Inactivos</th>
                                    <th className="text-right p-2">Pagados</th>
                                    <th className="text-right p-2">Por Vencer</th>
                                    <th className="text-right p-2">Vencidos</th>
                                </tr>
                            </thead>
                            <tbody>
                                {analyticsData?.sectors.map((sector, index) => (
                                    <tr key={sector.sectorName} className={index % 2 === 0 ? "bg-muted/50" : ""}>
                                        <td className="p-2 font-medium">{sector.sectorName}</td>
                                        <td className="p-2 text-right">{sector.total}</td>
                                        <td className="p-2 text-right">
                                            <Badge variant={sector.active > 0 ? "default" : "secondary"}>
                                                {sector.active}
                                            </Badge>
                                        </td>
                                        <td className="p-2 text-right">
                                            <Badge variant={sector.suspended > 0 ? "destructive" : "secondary"}>
                                                {sector.suspended}
                                            </Badge>
                                        </td>
                                        <td className="p-2 text-right">
                                            <Badge variant={sector.inactive > 0 ? "secondary" : "outline"}>
                                                {sector.inactive}
                                            </Badge>
                                        </td>
                                        <td className="p-2 text-right">
                                            <Badge variant={sector.paid > 0 ? "default" : "secondary"}>
                                                {sector.paid}
                                            </Badge>
                                        </td>
                                        <td className="p-2 text-right">
                                            <Badge variant={sector.expiring > 0 ? "secondary" : "outline"}>
                                                {sector.expiring}
                                            </Badge>
                                        </td>
                                        <td className="p-2 text-right">
                                            <Badge variant={sector.expired > 0 ? "destructive" : "secondary"}>
                                                {sector.expired}
                                            </Badge>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
