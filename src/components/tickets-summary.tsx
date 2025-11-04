"use client"

import { Card } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts"
import { TrendingUp, AlertCircle, Clock, CheckCircle } from "lucide-react"
import { Ticket, TicketStatus, TicketPriority, TicketType } from "@/types/ticket"
import { ticketStatusLabels, ticketPriorityLabels, ticketTypeLabels } from "@/utils/ticket-helpers"

const COLORS = [ "#ef4444", "#f59e0b", "#3b82f6", "#10b981" ]

interface TicketsSummaryProps {
    tickets: Ticket[]
}

export default function TicketsSummary({ tickets }: TicketsSummaryProps) {
    // Calcular estadísticas de estado
    const statusData = [
        { name: "Abiertos", value: tickets.filter((t) => t.statusCode === "OPEN").length },
        { name: "En Proceso", value: tickets.filter((t) => t.statusCode === "IN_PROGRESS").length },
        { name: "Pendientes", value: tickets.filter((t) => t.statusCode === "PENDING").length },
        { name: "Resueltos", value: tickets.filter((t) => t.statusCode === "RESOLVED" || t.statusCode === "CLOSED").length },
    ]

    // Calcular estadísticas de prioridad
    const priorityData = [
        { name: "Urgente", value: tickets.filter((t) => t.priorityCode === "URGENT").length },
        { name: "Alta", value: tickets.filter((t) => t.priorityCode === "HIGH").length },
        { name: "Media", value: tickets.filter((t) => t.priorityCode === "MEDIUM").length },
        { name: "Baja", value: tickets.filter((t) => t.priorityCode === "LOW").length },
    ]

    // Calcular métricas principales
    const totalTickets = tickets.length
    const openTickets = tickets.filter((t) => t.statusCode === "OPEN").length
    const inProgressTickets = tickets.filter((t) => t.statusCode === "IN_PROGRESS").length
    const resolvedToday = tickets.filter((t) => {
        if (!t.closedAt) return false
        const closedDate = new Date(t.closedAt)
        const today = new Date()
        return closedDate.toDateString() === today.toDateString()
    }).length

    const resolvedTotal = tickets.filter((t) => t.statusCode === "RESOLVED" || t.statusCode === "CLOSED").length
    const resolutionRate = totalTickets > 0 ? Math.round((resolvedTotal / totalTickets) * 100) : 0

    const ticketMetrics = [
        { label: "Tickets Abiertos", value: openTickets, icon: AlertCircle, color: "text-red-500" },
        { label: "En Progreso", value: inProgressTickets, icon: Clock, color: "text-blue-500" },
        { label: "Resueltos Hoy", value: resolvedToday, icon: CheckCircle, color: "text-green-500" },
        { label: "Tasa de Resolución", value: `${resolutionRate}%`, icon: TrendingUp, color: "text-purple-500" },
    ]

    // Calcular resumen por tipo
    const typeSummary = Object.values(TicketType).map((type) => {
        const typeTickets = tickets.filter((t) => t.typeCode === type)
        const total = typeTickets.length
        const open = typeTickets.filter((t) => t.statusCode === "OPEN").length
        const resolved = typeTickets.filter((t) => t.statusCode === "RESOLVED" || t.statusCode === "CLOSED").length
        const percentage = total > 0 ? Math.round((resolved / total) * 100) : 0

        return {
            type: ticketTypeLabels[ type ],
            total,
            open,
            resolved,
            percentage,
        }
    }).filter((item) => item.total > 0)

    return (
        <div className="space-y-6 pb-8">
            {/* Métricas Principales */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {ticketMetrics.map((metric, idx) => {
                    const Icon = metric.icon
                    return (
                        <Card key={idx} className="p-6 bg-card border-border">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-muted-foreground mb-1">{metric.label}</p>
                                    <p className="text-2xl font-bold text-foreground">{metric.value}</p>
                                </div>
                                <Icon className={`w-8 h-8 ${metric.color} opacity-75`} />
                            </div>
                        </Card>
                    )
                })}
            </div>

            {/* Gráficos */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Gráfico de Estados */}
                <Card className="p-6 bg-card border-border">
                    <h3 className="text-lg font-semibold text-foreground mb-4">Distribución por Estado</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={statusData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--color-border))" />
                            <XAxis dataKey="name" stroke="hsl(var(--color-muted-foreground))" />
                            <YAxis stroke="hsl(var(--color-muted-foreground))" />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: "hsl(var(--color-card))",
                                    border: "1px solid hsl(var(--color-border))",
                                    borderRadius: "6px",
                                }}
                            />
                            <Bar dataKey="value" fill="hsl(var(--color-primary))" radius={[ 8, 8, 0, 0 ]} />
                        </BarChart>
                    </ResponsiveContainer>
                </Card>

                {/* Gráfico de Prioridades */}
                <Card className="p-6 bg-card border-border">
                    <h3 className="text-lg font-semibold text-foreground mb-4">Tickets por Prioridad</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie
                                data={priorityData.filter((d) => d.value > 0)}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                label={({ name, value }) => `${name}: ${value}`}
                                outerRadius={100}
                                fill="hsl(var(--color-primary))"
                                dataKey="value"
                            >
                                {priorityData.map((_, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[ index % COLORS.length ]} />
                                ))}
                            </Pie>
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: "hsl(var(--color-card))",
                                    border: "1px solid hsl(var(--color-border))",
                                    borderRadius: "6px",
                                }}
                            />
                        </PieChart>
                    </ResponsiveContainer>
                </Card>
            </div>

            {/* Tabla de Resumen */}
            <Card className="p-6 bg-card border-border">
                <h3 className="text-lg font-semibold text-foreground mb-4">Resumen por Tipo de Ticket</h3>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-border">
                                <th className="text-left py-3 px-4 font-semibold text-foreground">Tipo</th>
                                <th className="text-center py-3 px-4 font-semibold text-foreground">Total</th>
                                <th className="text-center py-3 px-4 font-semibold text-foreground">Abiertos</th>
                                <th className="text-center py-3 px-4 font-semibold text-foreground">Resueltos</th>
                                <th className="text-center py-3 px-4 font-semibold text-foreground">% Resolución</th>
                            </tr>
                        </thead>
                        <tbody>
                            {typeSummary.map((row, idx) => (
                                <tr key={idx} className="border-b border-border hover:bg-muted/50">
                                    <td className="py-3 px-4 text-foreground">{row.type}</td>
                                    <td className="text-center py-3 px-4 text-foreground font-semibold">{row.total}</td>
                                    <td className="text-center py-3 px-4 text-orange-600">{row.open}</td>
                                    <td className="text-center py-3 px-4 text-green-600">{row.resolved}</td>
                                    <td className="text-center py-3 px-4">
                                        <div className="flex items-center justify-center gap-2">
                                            <div className="w-12 h-2 bg-muted rounded overflow-hidden">
                                                <div className="h-full bg-green-500" style={{ width: `${row.percentage}%` }} />
                                            </div>
                                            <span className="text-foreground font-semibold">{row.percentage}%</span>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>
        </div>
    )
}

