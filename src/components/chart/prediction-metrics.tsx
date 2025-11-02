"use client"

import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
    TrendingUp,
    TrendingDown,
    Target,
    Calendar,
    AlertCircle,
    CheckCircle,
    Clock,
    DollarSign
} from "lucide-react";

interface PredictionMetricsProps {
    accuracy: number;
    confidence: number;
    nextMonthPrediction: number;
    lastMonthActual: number;
    growthRate: number;
    riskLevel: "low" | "medium" | "high";
    daysUntilNextPayment: number;
    expectedRevenue: number;
}

export function PredictionMetrics({
    accuracy,
    confidence,
    nextMonthPrediction,
    lastMonthActual,
    growthRate,
    riskLevel,
    daysUntilNextPayment,
    expectedRevenue
}: PredictionMetricsProps) {
    const getRiskColor = (level: string) => {
        switch (level) {
            case "low":
                return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400";
            case "medium":
                return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400";
            case "high":
                return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400";
            default:
                return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400";
        }
    };

    const getRiskIcon = (level: string) => {
        switch (level) {
            case "low":
                return <CheckCircle className="h-4 w-4" />;
            case "medium":
                return <Clock className="h-4 w-4" />;
            case "high":
                return <AlertCircle className="h-4 w-4" />;
            default:
                return <AlertCircle className="h-4 w-4" />;
        }
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
            {/* Precisión del Modelo */}
            <Card className="bg-gray-50/50 dark:bg-gray-900/20 border-gray-200 dark:border-gray-700">
                <CardHeader className="pb-2">
                    <CardTitle className="text-xs font-medium flex items-center gap-2 text-gray-600 dark:text-gray-400">
                        <Target className="h-3 w-3" />
                        Precisión del Modelo
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <span className="text-lg font-semibold text-gray-700 dark:text-gray-300">{accuracy}%</span>
                            <Badge variant="outline" className="text-xs px-2 py-0.5">
                                {accuracy >= 90 ? "Excelente" : accuracy >= 80 ? "Buena" : "Mejorable"}
                            </Badge>
                        </div>
                        <Progress value={accuracy} className="h-1.5 bg-gray-200 dark:bg-gray-700" />
                        <p className="text-xs text-gray-500 dark:text-gray-500">
                            Basado en datos históricos
                        </p>
                    </div>
                </CardContent>
            </Card>

            {/* Nivel de Confianza */}
            <Card className="bg-gray-50/50 dark:bg-gray-900/20 border-gray-200 dark:border-gray-700">
                <CardHeader className="pb-2">
                    <CardTitle className="text-xs font-medium flex items-center gap-2 text-gray-600 dark:text-gray-400">
                        <TrendingUp className="h-3 w-3" />
                        Nivel de Confianza
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <span className="text-lg font-semibold text-gray-700 dark:text-gray-300">{confidence}%</span>
                            <Badge variant="outline" className="text-xs px-2 py-0.5">
                                {confidence >= 85 ? "Alto" : confidence >= 70 ? "Medio" : "Bajo"}
                            </Badge>
                        </div>
                        <Progress value={confidence} className="h-1.5 bg-gray-200 dark:bg-gray-700" />
                        <p className="text-xs text-gray-500 dark:text-gray-500">
                            Confianza en predicciones
                        </p>
                    </div>
                </CardContent>
            </Card>

            {/* Predicción Próximo Mes */}
            <Card className="bg-gray-50/50 dark:bg-gray-900/20 border-gray-200 dark:border-gray-700">
                <CardHeader className="pb-2">
                    <CardTitle className="text-xs font-medium flex items-center gap-2 text-gray-600 dark:text-gray-400">
                        <Calendar className="h-3 w-3" />
                        Próximo Mes
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <span className="text-lg font-semibold text-gray-700 dark:text-gray-300">
                                S/. {(nextMonthPrediction / 1000).toFixed(0)}k
                            </span>
                            <Badge variant="outline" className="text-xs px-2 py-0.5">
                                {growthRate > 0 ? "+" : ""}{growthRate}%
                            </Badge>
                        </div>
                        <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-500">
                            <span>vs mes anterior:</span>
                            <span className="font-medium">
                                S/. {(lastMonthActual / 1000).toFixed(0)}k
                            </span>
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-500">
                            Predicción basada en IA
                        </p>
                    </div>
                </CardContent>
            </Card>

            {/* Nivel de Riesgo */}
            <Card className="bg-gray-50/50 dark:bg-gray-900/20 border-gray-200 dark:border-gray-700">
                <CardHeader className="pb-2">
                    <CardTitle className="text-xs font-medium flex items-center gap-2 text-gray-600 dark:text-gray-400">
                        <AlertCircle className="h-3 w-3" />
                        Nivel de Riesgo
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <Badge variant="outline" className="text-xs px-2 py-0.5">
                                {getRiskIcon(riskLevel)}
                                {riskLevel === "low" ? "Bajo" : riskLevel === "medium" ? "Medio" : "Alto"}
                            </Badge>
                        </div>
                        <div className="space-y-1">
                            <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-500">
                                <span>Próximo pago en:</span>
                                <span className="font-medium">{daysUntilNextPayment} días</span>
                            </div>
                            <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-500">
                                <span>Ingresos esperados:</span>
                                <span className="font-medium">
                                    S/. {(expectedRevenue / 1000).toFixed(0)}k
                                </span>
                            </div>
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-500">
                            Basado en patrones históricos
                        </p>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

// Componente para mostrar alertas de predicción
interface PredictionAlertsProps {
    metrics?: {
        accuracy: number;
        confidence: number;
        nextMonthPrediction: number;
        lastMonthActual: number;
        growthRate: number;
        riskLevel: "low" | "medium" | "high";
        daysUntilNextPayment: number;
        expectedRevenue: number;
    };
    paymentSummary?: {
        totalAmount: number;
        totalPayments: number;
        averageAmount: number;
        pendingPayments: number;
        dailyPayments: number;
        latePayments: number;
    };
}

export function PredictionAlerts({ metrics, paymentSummary }: PredictionAlertsProps) {
    const alerts = [];

    // Generar alertas basadas en métricas reales
    if (metrics) {
        // Alerta de precisión baja
        if (metrics.accuracy < 70) {
            alerts.push({
                id: 1,
                type: "warning" as const,
                title: "Precisión baja",
                description: `La precisión del modelo es del ${metrics.accuracy}%. Se recomienda revisar los datos históricos.`,
                icon: AlertCircle,
            });
        }

        // Alerta de riesgo alto
        if (metrics.riskLevel === "high") {
            alerts.push({
                id: 2,
                type: "warning" as const,
                title: "Riesgo alto detectado",
                description: `La tasa de crecimiento es del ${metrics.growthRate}%. Se recomienda análisis adicional.`,
                icon: AlertCircle,
            });
        }

        // Alerta de crecimiento positivo
        if (metrics.growthRate > 10) {
            alerts.push({
                id: 3,
                type: "success" as const,
                title: "Crecimiento excelente",
                description: `Tasa de crecimiento del ${metrics.growthRate}%. Se superó la meta mensual.`,
                icon: CheckCircle,
            });
        }

        // Alerta de próximos pagos
        if (metrics.daysUntilNextPayment <= 7) {
            alerts.push({
                id: 4,
                type: "info" as const,
                title: "Pagos próximos",
                description: `Se esperan pagos en los próximos ${metrics.daysUntilNextPayment} días.`,
                icon: Clock,
            });
        }
    }

    if (paymentSummary) {
        // Alerta de pagos pendientes
        if (paymentSummary.pendingPayments > 0) {
            alerts.push({
                id: 5,
                type: "warning" as const,
                title: "Pagos pendientes",
                description: `Hay ${paymentSummary.pendingPayments} pagos pendientes que requieren atención.`,
                icon: AlertCircle,
            });
        }

        // Alerta de pagos atrasados
        if (paymentSummary.latePayments > 0) {
            alerts.push({
                id: 6,
                type: "warning" as const,
                title: "Pagos atrasados",
                description: `Se detectaron ${paymentSummary.latePayments} pagos atrasados.`,
                icon: AlertCircle,
            });
        }
    }

    // Si no hay alertas, mostrar mensaje informativo
    if (alerts.length === 0) {
        alerts.push({
            id: 0,
            type: "info" as const,
            title: "Todo en orden",
            description: "No se detectaron alertas importantes en el análisis predictivo.",
            icon: CheckCircle,
        });
    }

    const getAlertStyles = (type: string) => {
        switch (type) {
            case "warning":
                return "border-l-yellow-500 bg-yellow-50 dark:bg-yellow-950/20";
            case "info":
                return "border-l-blue-500 bg-blue-50 dark:bg-blue-950/20";
            case "success":
                return "border-l-green-500 bg-green-50 dark:bg-green-950/20";
            default:
                return "border-l-gray-500 bg-gray-50 dark:bg-gray-950/20";
        }
    };

    return (
        <Card className="col-span-full">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <AlertCircle className="h-5 w-5 text-orange-600" />
                    Alertas de Predicción
                </CardTitle>
                <CardDescription>
                    Alertas importantes basadas en análisis predictivo
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-3">
                    {alerts.map((alert) => (
                        <div
                            key={alert.id}
                            className={`p-3 rounded-lg border-l-4 ${getAlertStyles(alert.type)}`}
                        >
                            <div className="flex items-start gap-3">
                                <alert.icon className="h-5 w-5 mt-0.5 text-muted-foreground" />
                                <div className="flex-1">
                                    <h4 className="font-medium text-sm">{alert.title}</h4>
                                    <p className="text-sm text-muted-foreground mt-1">
                                        {alert.description}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
} 