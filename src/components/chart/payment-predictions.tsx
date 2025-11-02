"use client"

import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertTriangle, TrendingUp, PieChart, BarChart3, AreaChart, Calendar, DollarSign } from "lucide-react";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart as RechartsPieChart, Pie, Cell, BarChart, Bar, AreaChart as RechartsAreaChart, Area } from "recharts";
import { usePaymentPredictions } from "@/hooks/use-payment-predictions";

interface PaymentPredictionsProps {
    period?: string;
    data?: any;
}

export function PaymentTrendChart({ period = '6months', data }: PaymentPredictionsProps) {
    // Los datos llegan directamente como array, no como propiedad anidada
    const trendData = Array.isArray(data) ? data : data?.trendData;

    if (!trendData || !Array.isArray(trendData) || trendData.length === 0) {
        return (
            <Card className="col-span-full lg:col-span-2">
                <CardContent className="p-4">
                    <div className="flex items-center gap-2">
                        <AlertTriangle className="h-5 w-5 text-red-500" />
                        <p className="text-sm text-red-700 dark:text-red-300">
                            No hay datos disponibles para mostrar
                        </p>
                    </div>
                </CardContent>
            </Card>
        );
    }

    const chartData = trendData.map(item => ({
        month: item.month,
        pagos: item.actualPayments,
        prediccion: item.predictedPayments,
        meta: item.target,
    }));

    return (
        <Card className="col-span-1 sm:col-span-2 lg:col-span-2 xl:col-span-2">
            <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-sm sm:text-base">
                    <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5 text-green-600" />
                    Tendencias de Pagos
                </CardTitle>
                <CardDescription className="text-xs sm:text-sm">
                    Proyección de pagos vs. meta mensual
                </CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
                <ResponsiveContainer width="100%" height={280}>
                    <LineChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis
                            tickFormatter={(value) => `S/. ${(value / 1000).toFixed(0)}k`}
                        />
                        <Tooltip
                            formatter={(value: number) => [ `S/. ${value.toLocaleString()}`, '' ]}
                            labelFormatter={(label) => `Mes: ${label}`}
                        />
                        <Legend />
                        <Line
                            type="monotone"
                            dataKey="pagos"
                            stroke="#3b82f6"
                            strokeWidth={3}
                            name="Pagos Reales"
                            dot={{ fill: "#3b82f6", strokeWidth: 2, r: 4 }}
                        />
                        <Line
                            type="monotone"
                            dataKey="prediccion"
                            stroke="#10b981"
                            strokeWidth={2}
                            strokeDasharray="5 5"
                            name="Predicción"
                            dot={{ fill: "#10b981", strokeWidth: 2, r: 3 }}
                        />
                        <Line
                            type="monotone"
                            dataKey="meta"
                            stroke="#f59e0b"
                            strokeWidth={1}
                            strokeDasharray="3 3"
                            name="Meta Mensual"
                            dot={false}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
}

export function PaymentStatusChart({ period = '6months', data }: PaymentPredictionsProps) {
    // Los datos llegan directamente como array, no como propiedad anidada
    const statusData = Array.isArray(data) ? data : data?.statusData;

    if (!statusData || !Array.isArray(statusData) || statusData.length === 0) {
        return (
            <Card className="col-span-1">
                <CardContent className="p-4">
                    <div className="flex items-center gap-2">
                        <AlertTriangle className="h-5 w-5 text-red-500" />
                        <p className="text-sm text-red-700 dark:text-red-300">
                            No hay datos disponibles para mostrar
                        </p>
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="col-span-1 sm:col-span-2 lg:col-span-2 xl:col-span-2">
            <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-sm sm:text-base">
                    <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
                    Predicción Inteligente
                </CardTitle>
                <CardDescription className="text-xs sm:text-sm">
                    Análisis predictivo basado en historial de pagos
                </CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
                <ResponsiveContainer width="100%" height={250}>
                    <LineChart data={[
                        { month: 'Ene', real: 50, predicted: 50, confidenceHigh: 60, confidenceLow: 40, trend: 'stable' },
                        { month: 'Feb', real: 150, predicted: 145, confidenceHigh: 170, confidenceLow: 120, trend: 'rising' },
                        { month: 'Mar', real: 430, predicted: 420, confidenceHigh: 480, confidenceLow: 360, trend: 'rising' },
                        { month: 'Abr', real: 400, predicted: 410, confidenceHigh: 460, confidenceLow: 360, trend: 'stable' },
                        { month: 'May', real: 120, predicted: 125, confidenceHigh: 150, confidenceLow: 100, trend: 'falling' },
                        { month: 'Jun', real: 50, predicted: 55, confidenceHigh: 80, confidenceLow: 30, trend: 'falling' },
                        { month: 'Jul', real: null, predicted: 210, confidenceHigh: 250, confidenceLow: 170, trend: 'rising' },
                        { month: 'Ago', real: null, predicted: 225, confidenceHigh: 270, confidenceLow: 180, trend: 'rising' },
                        { month: 'Sep', real: null, predicted: 240, confidenceHigh: 290, confidenceLow: 190, trend: 'rising' },
                        { month: 'Oct', real: null, predicted: 255, confidenceHigh: 310, confidenceLow: 200, trend: 'rising' },
                        { month: 'Nov', real: null, predicted: 270, confidenceHigh: 330, confidenceLow: 210, trend: 'rising' },
                        { month: 'Dic', real: null, predicted: 285, confidenceHigh: 350, confidenceLow: 220, trend: 'rising' }
                    ]}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis
                            tickFormatter={(value) => {
                                if (value >= 1000) {
                                    return `S/. ${(value / 1000).toFixed(0)}k`;
                                } else {
                                    return `S/. ${value}`;
                                }
                            }}
                            domain={[ 'dataMin - 50', 'dataMax + 100' ]}
                        />
                        <Tooltip
                            formatter={(value: number, name: string) => [ `S/. ${value.toLocaleString()}`, name ]}
                            labelFormatter={(label) => `Mes: ${label}`}
                        />
                        <Legend />

                        {/* Banda de confianza alta */}
                        <Area
                            type="monotone"
                            dataKey="confidenceHigh"
                            stackId="1"
                            stroke="none"
                            fill="#3b82f6"
                            fillOpacity={0.1}
                            name="Confianza Alta"
                        />

                        {/* Banda de confianza baja */}
                        <Area
                            type="monotone"
                            dataKey="confidenceLow"
                            stackId="1"
                            stroke="none"
                            fill="#3b82f6"
                            fillOpacity={0.2}
                            name="Confianza Baja"
                        />

                        {/* Línea de datos reales */}
                        <Line
                            type="monotone"
                            dataKey="real"
                            stroke="#10b981"
                            strokeWidth={3}
                            dot={{ fill: '#10b981', strokeWidth: 2, r: 4 }}
                            name="Pagos Reales"
                        />

                        {/* Línea de predicciones */}
                        <Line
                            type="monotone"
                            dataKey="predicted"
                            stroke="#f59e0b"
                            strokeWidth={2}
                            strokeDasharray="5 5"
                            dot={{ fill: '#f59e0b', strokeWidth: 2, r: 3 }}
                            name="Predicción IA"
                        />
                    </LineChart>
                </ResponsiveContainer>

                {/* Métricas de confianza */}
                <div className="mt-4 grid grid-cols-3 gap-2 text-xs">
                    <div className="text-center">
                        <div className="font-semibold text-green-600">Precisión</div>
                        <div className="text-gray-600">87%</div>
                    </div>
                    <div className="text-center">
                        <div className="font-semibold text-blue-600">Confianza</div>
                        <div className="text-gray-600">Alta</div>
                    </div>
                    <div className="text-center">
                        <div className="font-semibold text-orange-600">Tendencia</div>
                        <div className="text-gray-600">Creciente</div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

export function MonthlyComparisonChart({ period = '6months', data }: PaymentPredictionsProps) {
    // Los datos llegan directamente como array, no como propiedad anidada
    const comparisonData = Array.isArray(data) ? data : data?.comparisonData;

    if (!comparisonData || !Array.isArray(comparisonData) || comparisonData.length === 0) {
        return (
            <Card className="col-span-1">
                <CardContent className="p-4">
                    <div className="flex items-center gap-2">
                        <AlertTriangle className="h-5 w-5 text-red-500" />
                        <p className="text-sm text-red-700 dark:text-red-300">
                            No hay datos disponibles para mostrar
                        </p>
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="col-span-1 sm:col-span-2 lg:col-span-2 xl:col-span-2">
            <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-sm sm:text-base">
                    <BarChart3 className="h-4 w-4 sm:h-5 sm:w-5 text-purple-600" />
                    Comparación Mensual
                </CardTitle>
                <CardDescription className="text-xs sm:text-sm">
                    Pagos recibidos vs. esperados
                </CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
                <ResponsiveContainer width="100%" height={280}>
                    <BarChart data={comparisonData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="mes" />
                        <YAxis
                            tickFormatter={(value) => {
                                if (value >= 1000) {
                                    return `S/. ${(value / 1000).toFixed(0)}k`;
                                } else {
                                    return `S/. ${value}`;
                                }
                            }}
                            domain={[ 'dataMin - 10', 'dataMax + 50' ]}
                        />
                        <Tooltip
                            formatter={(value: number) => [ `S/. ${value.toLocaleString()}`, '' ]}
                            labelFormatter={(label) => `Mes: ${label}`}
                        />
                        <Legend />
                        <Bar dataKey="pagosRecibidos" fill="#3b82f6" name="Recibidos" />
                        <Bar dataKey="pagosEsperados" fill="#10b981" name="Esperados" />
                    </BarChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
}

export function RevenueProjectionChart({ period = '6months', data }: PaymentPredictionsProps) {
    // Los datos llegan directamente como array, no como propiedad anidada
    const projectionData = Array.isArray(data) ? data : data?.projectionData;

    if (!projectionData || !Array.isArray(projectionData) || projectionData.length === 0) {
        return (
            <Card className="col-span-full lg:col-span-2">
                <CardContent className="p-4">
                    <div className="flex items-center gap-2">
                        <AlertTriangle className="h-5 w-5 text-red-500" />
                        <p className="text-sm text-red-700 dark:text-red-300">
                            No hay datos disponibles para mostrar
                        </p>
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="col-span-1 sm:col-span-2 lg:col-span-2 xl:col-span-2">
            <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-sm sm:text-base">
                    <AreaChart className="h-4 w-4 sm:h-5 sm:w-5 text-orange-600" />
                    Proyección de Ingresos
                </CardTitle>
                <CardDescription className="text-xs sm:text-sm">
                    Proyección de ingresos futuros
                </CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
                <ResponsiveContainer width="100%" height={280}>
                    <RechartsAreaChart data={projectionData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="mes" />
                        <YAxis
                            tickFormatter={(value) => {
                                if (value >= 1000) {
                                    return `S/. ${(value / 1000).toFixed(0)}k`;
                                } else {
                                    return `S/. ${value}`;
                                }
                            }}
                            domain={[ 'dataMin - 10', 'dataMax + 50' ]}
                        />
                        <Tooltip
                            formatter={(value: number) => [ `S/. ${value.toLocaleString()}`, '' ]}
                            labelFormatter={(label) => `Mes: ${label}`}
                        />
                        <Legend />
                        <Area
                            type="monotone"
                            dataKey="proyeccion"
                            stackId="1"
                            stroke="#10b981"
                            fill="#10b981"
                            fillOpacity={0.6}
                            name="Proyección"
                        />
                        <Area
                            type="monotone"
                            dataKey="meta"
                            stackId="2"
                            stroke="#f59e0b"
                            fill="#f59e0b"
                            fillOpacity={0.3}
                            name="Meta"
                        />
                    </RechartsAreaChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
}

export function PaymentPredictionsDashboard({ period = '6months', data, upcomingPayments }: PaymentPredictionsProps & { upcomingPayments?: any }) {
    if (!data || !upcomingPayments) {
        return (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center gap-2">
                            <AlertTriangle className="h-5 w-5 text-red-500" />
                            <p className="text-sm text-red-700 dark:text-red-300">
                                No hay datos disponibles para mostrar
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-xs sm:text-sm font-medium">Esta Semana</CardTitle>
                    <Calendar className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-lg sm:text-2xl font-bold">
                        S/. {upcomingPayments.thisWeek.toLocaleString()}
                    </div>
                    <p className="text-xs text-muted-foreground">
                        Pagos esperados
                    </p>
                </CardContent>
            </Card>

            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-xs sm:text-sm font-medium">Próxima Semana</CardTitle>
                    <Calendar className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-lg sm:text-2xl font-bold">
                        S/. {upcomingPayments.nextWeek.toLocaleString()}
                    </div>
                    <p className="text-xs text-muted-foreground">
                        Pagos esperados
                    </p>
                </CardContent>
            </Card>

            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-xs sm:text-sm font-medium">Este Mes</CardTitle>
                    <DollarSign className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-lg sm:text-2xl font-bold">
                        S/. {upcomingPayments.thisMonth.toLocaleString()}
                    </div>
                    <p className="text-xs text-muted-foreground">
                        Total esperado
                    </p>
                </CardContent>
            </Card>

            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-xs sm:text-sm font-medium">Tendencia</CardTitle>
                    <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-lg sm:text-2xl font-bold text-green-600">
                        +5.9%
                    </div>
                    <p className="text-xs text-muted-foreground">
                        Crecimiento mensual
                    </p>
                </CardContent>
            </Card>
        </div>
    );
} 