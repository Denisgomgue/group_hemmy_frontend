"use client";

import React, { useState, useEffect } from "react";
// import { useQuery } from "@tanstack/react-query"; // Deshabilitado - usando datos ficticios
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import {
    Users,
    UserCheck,
    UserX,
    Clock,
    DollarSign,
    CheckCircle,
    AlertTriangle,
    TrendingUp,
    TrendingDown,
    Activity,
    Calendar,
    CreditCard,
    BarChart3,
    UserPlus,
    Ticket,
    Wrench,
    Package,
    HardDrive,
    AlertCircle,
    CheckSquare,
    Settings,
    Download,
    ArrowUpRight,
    Plus,
    Bell
} from "lucide-react";
// APIs temporalmente deshabilitadas - usando datos ficticios
// import { ClientsAPI } from "@/services/clients-api";
// import { PaymentsAPI } from "@/services/payments-api";
// import { DevicesAPI } from "@/services/devices-api";
import {
    LineChart,
    Line,
    BarChart,
    Bar,
    PieChart,
    Pie,
    Cell,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    Area,
    AreaChart
} from "recharts";
import { useQuery } from "@tanstack/react-query";

// Componente de tarjeta KPI principal
interface KPICardProps {
    title: string;
    value: number | string;
    change: string;
    changeType: "positive" | "negative" | "neutral";
    icon: React.ReactNode;
    isLoading?: boolean;
}

function KPICard({
    title,
    value,
    change,
    changeType,
    icon,
    isLoading = false
}: KPICardProps) {
    const getChangeColor = () => {
        switch (changeType) {
            case "positive":
                return "text-green-600";
            case "negative":
                return "text-red-600";
            default:
                return "text-gray-600";
        }
    };

    if (isLoading) {
        return (
            <Card className="border-l-4 border-l-primary">
                <CardContent className="p-6">
                    <div className="flex justify-between items-start">
                        <div className="space-y-2 flex-1">
                            <Skeleton className="h-4 w-32" />
                            <Skeleton className="h-8 w-20" />
                            <Skeleton className="h-3 w-40" />
                        </div>
                        <Skeleton className="h-12 w-12 rounded-lg" />
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="border-l-4 border-l-primary hover:shadow-lg transition-all duration-300 shadow-md">
            <CardContent className="p-6">
                <div className="flex justify-between items-start">
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-muted-foreground mb-3">
                            {title}
                        </p>

                        <h3 className="text-3xl font-bold text-foreground mb-2">
                            {typeof value === 'number' ? value.toLocaleString() : value}
                        </h3>

                        <p className={`text-sm ${getChangeColor()}`}>
                            {change}
                        </p>
                    </div>

                    <div className="flex-shrink-0 ml-6">
                        <div className="p-4 rounded-xl bg-primary/10">
                            {icon}
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

// Componente para actividad reciente
interface RecentActivityItem {
    id: string;
    type: 'client' | 'payment' | 'ticket' | 'device';
    title: string;
    description: string;
    time: string;
}

function RecentActivityItem({ type, title, description, time }: Omit<RecentActivityItem, 'id'>) {
    const getIcon = () => {
        switch (type) {
            case 'client':
                return <UserPlus className="h-4 w-4" />;
            case 'payment':
                return <CheckCircle className="h-4 w-4" />;
            case 'ticket':
                return <Ticket className="h-4 w-4" />;
            case 'device':
                return <Package className="h-4 w-4" />;
            default:
                return <Activity className="h-4 w-4" />;
        }
    };

    const getIconColor = () => {
        switch (type) {
            case 'client':
                return 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400';
            case 'payment':
                return 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400';
            case 'ticket':
                return 'bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400';
            case 'device':
                return 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400';
            default:
                return 'bg-gray-100 text-gray-600 dark:bg-gray-900/30 dark:text-gray-400';
        }
    };

    return (
        <div className="flex items-center space-x-4 py-3 border-b border-border/50 last:border-b-0">
            <div className={`p-2 rounded-full ${getIconColor()}`}>
                {getIcon()}
            </div>
            <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground">
                    {title}
                </p>
                <p className="text-xs text-muted-foreground">
                    {description}
                </p>
            </div>
            <div className="text-xs text-muted-foreground">
                {time}
            </div>
        </div>
    );
}

// Componente para próximos vencimientos
interface UpcomingDueItem {
    id: string;
    clientName: string;
    plan: string;
    amount: string;
    dueDate: string;
}

function UpcomingDueItem({ clientName, plan, amount, dueDate }: Omit<UpcomingDueItem, 'id'>) {
    const getInitials = (name: string) => {
        return name.charAt(0);
    };

    return (
        <div className="flex items-center justify-between py-3 border-b border-border/50 last:border-b-0">
            <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-sm font-medium text-primary">
                        {getInitials(clientName)}
                    </span>
                </div>
                <div>
                    <p className="text-sm font-medium text-foreground">
                        {clientName}
                    </p>
                    <p className="text-xs text-muted-foreground">
                        {plan} - {amount}
                    </p>
                </div>
            </div>
            <div className="text-sm text-orange-600 font-medium">
                {dueDate}
            </div>
        </div>
    );
}

// Colores para gráficos
const CHART_COLORS = {
    primary: "#8b5cf6",
    success: "#10b981",
    warning: "#f59e0b",
    danger: "#ef4444",
    info: "#3b82f6",
    secondary: "#6b7280"
};

// Componente de reloj mejorado para el dashboard
function DashboardClock() {
    const [ time, setTime ] = useState(new Date())

    useEffect(() => {
        const timer = setInterval(() => {
            setTime(new Date())
        }, 1000)

        return () => clearInterval(timer)
    }, [])

    const formatTime = (date: Date) => {
        return date.toLocaleTimeString("es-ES", {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            hour12: false,
        })
    }

    const formatDate = (date: Date) => {
        return date.toLocaleDateString("es-ES", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
        })
    }

    const getGreeting = () => {
        const hour = time.getHours()
        if (hour < 12) return "Buenos días"
        if (hour < 19) return "Buenas tardes"
        return "Buenas noches"
    }

    return (
        <Card className="relative overflow-hidden border-border/40 bg-gradient-to-br from-card via-card to-card/80 backdrop-blur-sm w-80">
            {/* Decorative gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 pointer-events-none" />

            <div className="relative p-4 space-y-3">
                {/* Greeting */}
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="font-medium">{getGreeting()}</span>
                </div>

                {/* Time Display */}
                <div className="space-y-1">
                    <div className="flex items-baseline gap-2">
                        <Clock className="h-6 w-6 text-primary/80" />
                        <div className="font-mono text-3xl font-bold tracking-tight text-foreground tabular-nums">
                            {formatTime(time)}
                        </div>
                    </div>

                    {/* Timezone indicator */}
                    <div className="flex items-center gap-2 text-xs text-muted-foreground ml-8">
                        <span className="px-1.5 py-0.5 rounded-md bg-muted/50 font-medium text-[10px]">
                            {Intl.DateTimeFormat().resolvedOptions().timeZone}
                        </span>
                    </div>
                </div>

                {/* Date Display */}
                <div className="flex items-center gap-2 pt-2 border-t border-border/40">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <div className="text-xs text-muted-foreground capitalize">{formatDate(time)}</div>
                </div>

                {/* Decorative elements */}
                <div className="absolute top-3 right-3 h-16 w-16 rounded-full bg-primary/5 blur-xl" />
                <div className="absolute bottom-3 right-6 h-12 w-12 rounded-full bg-accent/5 blur-lg" />
            </div>
        </Card>
    )
}

export default function DashboardPage() {

    // ✅ DATOS FICTICIOS - No se comunica con la base de datos
    const paymentSummary = {
        totalRecaudado: 125430.50,
        pagosPendientes: 23,
        pagosAtrasados: 8
    };

    const growthMetrics = {
        totalClients: 156,
        newClientsLast30Days: 12,
        monthlyGrowth: 8.3
    };

    const monthlyRevenue = {
        months: [
            { month: "Ene", revenue: 95000 },
            { month: "Feb", revenue: 102000 },
            { month: "Mar", revenue: 98000 },
            { month: "Abr", revenue: 115000 },
            { month: "May", revenue: 108000 },
            { month: "Jun", revenue: 120000 },
            { month: "Jul", revenue: 125430 }
        ]
    };

    const supportTickets = {
        byStatus: { open: 14, inProgress: 8, resolved: 45 },
        trends: { dailyNew: 3, weeklyNew: 18 }
    };

    const recentActivity = [
        {
            id: "1",
            type: "client" as const,
            title: "Nuevo cliente registrado",
            description: "Juan Pérez - Plan Básico",
            time: "Hace 5 min"
        },
        {
            id: "2",
            type: "payment" as const,
            title: "Pago procesado",
            description: "S/. 150.00 - María García",
            time: "Hace 15 min"
        },
        {
            id: "3",
            type: "ticket" as const,
            title: "Ticket resuelto",
            description: "#1234 - Problema de conexión",
            time: "Hace 1 hora"
        },
        {
            id: "4",
            type: "device" as const,
            title: "Equipo asignado",
            description: "Router WiFi - Cliente #45",
            time: "Hace 2 horas"
        },
        {
            id: "5",
            type: "payment" as const,
            title: "Pago pendiente",
            description: "S/. 200.00 - Carlos López",
            time: "Hace 3 horas"
        }
    ];

    const upcomingDues = [
        {
            id: "1",
            clientName: "Ana Martínez",
            plan: "Plan Premium",
            amount: "S/. 250",
            dueDate: "Hoy"
        },
        {
            id: "2",
            clientName: "Roberto Silva",
            plan: "Plan Básico",
            amount: "S/. 150",
            dueDate: "Mañana"
        },
        {
            id: "3",
            clientName: "Laura González",
            plan: "Plan Estándar",
            amount: "S/. 180",
            dueDate: "En 2 días"
        },
        {
            id: "4",
            clientName: "Miguel Torres",
            plan: "Plan Premium",
            amount: "S/. 250",
            dueDate: "En 3 días"
        }
    ];

    // Estados de carga (siempre false - datos ficticios)
    const isLoadingPayments = false;
    const isLoadingGrowth = false;
    const isLoadingRevenue = false;
    const isLoadingTickets = false;
    const isLoadingRecentActivity = false;
    const isLoadingUpcomingDues = false;

    // Datos para gráfico de ingresos mensuales
    const monthlyData = monthlyRevenue.months;

    return (
        <div className="container mx-auto px-6 py-8 space-y-8">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div className="space-y-2">
                    <h1 className="text-4xl font-bold text-foreground">
                        Dashboard
                    </h1>
                    <p className="text-muted-foreground text-lg">
                        Bienvenido a tu panel de control
                    </p>
                </div>

                <div className="flex items-center">
                    {/* Reloj en tiempo real */}
                    <DashboardClock />
                </div>
            </div>

            {/* Navegación de pestañas */}
            <div className="flex space-x-8 border-b border-border pb-4">
                <button className="pb-4 border-b-2 border-primary text-primary font-medium">
                    Vista general
                </button>
                <button className="pb-4 text-muted-foreground hover:text-foreground transition-colors">
                    Analíticas
                </button>
                <button className="pb-4 text-muted-foreground hover:text-foreground transition-colors">
                    Reportes
                </button>
            </div>

            {/* Métricas principales (4 KPI Cards) */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                <KPICard
                    title="Ingresos Totales"
                    value={`S/. ${(paymentSummary?.totalRecaudado || 0).toLocaleString('es-PE', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2
                    })}`}
                    change={`+${growthMetrics?.monthlyGrowth ? growthMetrics.monthlyGrowth.toFixed(1) : 0}% desde el mes pasado`}
                    changeType={growthMetrics?.monthlyGrowth ? "positive" : "negative"}
                    icon={<DollarSign className="h-6 w-6 text-primary" />}
                    isLoading={isLoadingPayments || isLoadingGrowth}
                />

                <KPICard
                    title="Total Clientes"
                    value={growthMetrics?.totalClients || 0}
                    change={`+${growthMetrics?.newClientsLast30Days || 0} desde el mes pasado`}
                    changeType="positive"
                    icon={<Users className="h-6 w-6 text-primary" />}
                    isLoading={isLoadingGrowth}
                />

                <KPICard
                    title="Tickets Abiertos"
                    value={supportTickets?.byStatus.open || 0}
                    change={`${supportTickets?.trends.dailyNew || 0} nuevos hoy`}
                    changeType="neutral"
                    icon={<Ticket className="h-6 w-6 text-primary" />}
                    isLoading={isLoadingTickets}
                />

                <KPICard
                    title="Pagos Pendientes"
                    value={paymentSummary?.pagosPendientes || 0}
                    change={`+${paymentSummary?.pagosAtrasados || 0} desde la semana pasada`}
                    changeType="negative"
                    icon={<CreditCard className="h-6 w-6 text-primary" />}
                    isLoading={isLoadingPayments}
                />
            </div>

            {/* Gráfico de resumen mensual */}
            <Card className="shadow-lg">
                <CardHeader className="pb-4">
                    <CardTitle className="flex items-center gap-2 text-xl">
                        <BarChart3 className="h-6 w-6" />
                        Resumen Mensual
                    </CardTitle>
                </CardHeader>
                <CardContent className="pt-2">
                    {isLoadingRevenue ? (
                        <Skeleton className="h-80 w-full" />
                    ) : (
                        <div className="h-80">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={monthlyData}>
                                    <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                                    <XAxis
                                        dataKey="month"
                                        fontSize={12}
                                        tick={{ fill: 'currentColor' }}
                                    />
                                    <YAxis
                                        fontSize={12}
                                        tick={{ fill: 'currentColor' }}
                                        tickFormatter={(value) => `$${value}`}
                                    />
                                    <Tooltip
                                        content={({ active, payload }) => {
                                            if (active && payload && payload.length) {
                                                return (
                                                    <div className="bg-background border border-border rounded-lg shadow-lg p-3">
                                                        <p className="font-medium">{payload[ 0 ].payload.month}</p>
                                                        <p className="text-sm text-primary">
                                                            S/. {payload[ 0 ].value?.toLocaleString('es-PE', { minimumFractionDigits: 2 })}
                                                        </p>
                                                    </div>
                                                );
                                            }
                                            return null;
                                        }}
                                    />
                                    <Bar
                                        dataKey="revenue"
                                        fill={CHART_COLORS.primary}
                                        radius={[ 4, 4, 0, 0 ]}
                                    />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Sección inferior: Actividad Reciente y Próximos Vencimientos */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Actividad Reciente */}
                <Card className="shadow-lg">
                    <CardHeader className="pb-4">
                        <CardTitle className="flex items-center justify-between text-xl">
                            <span>Actividad Reciente</span>
                            <Button variant="ghost" size="sm" className="hover:bg-primary/10">
                                <ArrowUpRight className="h-4 w-4" />
                            </Button>
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                        {isLoadingRecentActivity ? (
                            <div className="px-6 py-4 space-y-4">
                                {[ ...Array(4) ].map((_, i) => (
                                    <div key={i} className="flex items-center space-x-4 py-3">
                                        <Skeleton className="h-8 w-8 rounded-full" />
                                        <div className="flex-1 space-y-2">
                                            <Skeleton className="h-4 w-3/4" />
                                            <Skeleton className="h-3 w-1/2" />
                                        </div>
                                        <Skeleton className="h-3 w-16" />
                                    </div>
                                ))}
                            </div>
                        ) : recentActivity && recentActivity.length > 0 ? (
                            <div className="px-6">
                                {recentActivity.map((activity: RecentActivityItem) => (
                                    <RecentActivityItem
                                        key={activity.id}
                                        type={activity.type}
                                        title={activity.title}
                                        description={activity.description}
                                        time={activity.time}
                                    />
                                ))}
                            </div>
                        ) : (
                            <div className="px-6 py-8 text-center">
                                <Activity className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                                <p className="text-muted-foreground">No hay actividad reciente</p>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Próximos Vencimientos */}
                <Card className="shadow-lg">
                    <CardHeader className="pb-4">
                        <CardTitle className="flex items-center justify-between text-xl">
                            <span>Próximos Vencimientos</span>
                            <Button variant="ghost" size="sm" className="hover:bg-primary/10">
                                <Bell className="h-4 w-4" />
                            </Button>
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                        {isLoadingUpcomingDues ? (
                            <div className="px-6 py-4 space-y-4">
                                {[ ...Array(4) ].map((_, i) => (
                                    <div key={i} className="flex items-center justify-between py-3">
                                        <div className="flex items-center space-x-3">
                                            <Skeleton className="h-8 w-8 rounded-full" />
                                            <div className="space-y-2">
                                                <Skeleton className="h-4 w-32" />
                                                <Skeleton className="h-3 w-24" />
                                            </div>
                                        </div>
                                        <Skeleton className="h-4 w-16" />
                                    </div>
                                ))}
                            </div>
                        ) : upcomingDues && upcomingDues.length > 0 ? (
                            <div className="px-6">
                                {upcomingDues.map((due: UpcomingDueItem) => (
                                    <UpcomingDueItem
                                        key={due.id}
                                        clientName={due.clientName}
                                        plan={due.plan}
                                        amount={due.amount}
                                        dueDate={due.dueDate}
                                    />
                                ))}
                            </div>
                        ) : (
                            <div className="px-6 py-8 text-center">
                                <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                                <p className="text-muted-foreground">No hay vencimientos próximos</p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}