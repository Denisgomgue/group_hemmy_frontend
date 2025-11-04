"use client"

import { ChevronDown, ChevronRight, Plus } from "lucide-react"
import TicketCardKanban from "./ticket-card-kanban"
import { useDroppable } from "@dnd-kit/core"
import { Button } from "@/components/ui/button"
import { Ticket, TicketStatus, TicketPriority } from "@/types/ticket"
import { ticketStatusLabels, ticketPriorityLabels } from "@/utils/ticket-helpers"

const STATUS_CONFIG: Record<TicketStatus, { label: string; badgeColor: string }> = {
    OPEN: { label: "Abierto", badgeColor: "bg-slate-100 text-slate-700" },
    IN_PROGRESS: { label: "En Curso", badgeColor: "bg-blue-100 text-blue-700" },
    PENDING: { label: "Pendiente", badgeColor: "bg-amber-100 text-amber-700" },
    RESOLVED: { label: "Resuelto", badgeColor: "bg-emerald-100 text-emerald-700" },
    CLOSED: { label: "Cerrado", badgeColor: "bg-gray-100 text-gray-700" },
    CANCELLED: { label: "Cancelado", badgeColor: "bg-red-100 text-red-700" },
}

const PRIORITY_ORDER: TicketPriority[] = [ "URGENT", "HIGH", "MEDIUM", "LOW" ]

const PRIORITY_CONFIG: Record<TicketPriority, { label: string; badgeColor: string }> = {
    URGENT: { label: "Urgente", badgeColor: "bg-red-100 text-red-700" },
    HIGH: { label: "Alta", badgeColor: "bg-orange-100 text-orange-700" },
    MEDIUM: { label: "Media", badgeColor: "bg-yellow-100 text-yellow-700" },
    LOW: { label: "Baja", badgeColor: "bg-green-100 text-green-700" },
}

interface KanbanColumnProps {
    status: TicketStatus
    tickets: Ticket[]
    expandedPriorities: string[]
    onTogglePriority: (priority: string) => void
    onAddTicket?: () => void
}

export default function KanbanColumn({ status, tickets, expandedPriorities, onTogglePriority, onAddTicket }: KanbanColumnProps) {
    const { setNodeRef, isOver } = useDroppable({
        id: `${status}__dropzone`,
    })

    const config = STATUS_CONFIG[ status ]

    const groupedByPriority = PRIORITY_ORDER.reduce(
        (acc, priority) => {
            const priorityTickets = tickets.filter((t) => t.priorityCode === priority)
            if (priorityTickets.length > 0) {
                acc[ priority ] = priorityTickets
            }
            return acc
        },
        {} as Record<TicketPriority, Ticket[]>,
    )

    return (
        <div
            ref={setNodeRef}
            className={`flex-1 min-w-80 max-w-md flex flex-col bg-white rounded-xl border-2 transition-all duration-200 ${isOver ? "border-blue-400 shadow-lg bg-blue-50" : "border-slate-200 shadow-sm hover:shadow-md"
                } p-4 min-h-96`}
        >
            {/* Column Header */}
            <div className="mb-4">
                <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold text-slate-900 text-lg">{config.label}</h3>
                    <span className={`text-sm font-semibold px-3 py-1 rounded-full ${config.badgeColor}`}>{tickets.length}</span>
                </div>
                <div className="h-1 bg-gradient-to-r from-blue-500 via-blue-500 to-transparent rounded" />
            </div>

            {/* Priority Groups */}
            <div className="flex-1 space-y-3 overflow-y-auto">
                {Object.keys(groupedByPriority).length > 0 ? (
                    Object.entries(groupedByPriority).map(([ priority, priorityTickets ]) => {
                        const isExpanded = expandedPriorities.includes(`expanded-${priority}`)
                        const priorityConfig = PRIORITY_CONFIG[ priority as TicketPriority ]

                        return (
                            <div key={priority} className="space-y-2">
                                {/* Priority Header */}
                                <button
                                    onClick={() => onTogglePriority(priority)}
                                    className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg font-medium text-sm transition-all hover:shadow-sm ${priorityConfig.badgeColor}`}
                                >
                                    {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                                    {priorityConfig.label}
                                    <span className="ml-auto text-xs font-bold bg-white/60 px-2 py-1 rounded">
                                        {priorityTickets.length}
                                    </span>
                                </button>

                                {isExpanded && (
                                    <div className="space-y-2 pl-2 border-l-2 border-slate-200">
                                        {priorityTickets.map((ticket) => (
                                            <TicketCardKanban key={ticket.id} ticket={ticket} />
                                        ))}
                                    </div>
                                )}
                            </div>
                        )
                    })
                ) : (
                    <div className="flex items-center justify-center h-32 text-slate-400">
                        <p className="text-sm">No hay tickets</p>
                    </div>
                )}
            </div>

            {/* Add Ticket Button */}
            {onAddTicket && (
                <Button
                    variant="outline"
                    className="w-full mt-4 gap-2 border-dashed border-slate-300 text-slate-600 hover:text-slate-900 hover:bg-slate-50 bg-transparent transition-colors"
                    onClick={onAddTicket}
                >
                    <Plus className="w-4 h-4" />
                    Agregar Tarea
                </Button>
            )}
        </div>
    )
}

