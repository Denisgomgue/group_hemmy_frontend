"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AlertCircle, Zap, MessageSquare, Settings, HelpCircle } from "lucide-react"
import { useDraggable } from "@dnd-kit/core"
import { CSS } from "@dnd-kit/utilities"
import { Ticket, TicketType, TicketPriority } from "@/types/ticket"
import { ticketTypeLabels, ticketPriorityLabels, getClientName, formatShortDate } from "@/utils/ticket-helpers"
import { useRouter } from "next/navigation"

const TYPE_ICONS: Record<TicketType, { icon: typeof Zap; label: string; color: string }> = {
    TECHNICAL: { icon: Zap, label: "Técnico", color: "bg-red-100 text-red-700" },
    BILLING: { icon: AlertCircle, label: "Facturación", color: "bg-blue-100 text-blue-700" },
    COMPLAINT: { icon: MessageSquare, label: "Reclamación", color: "bg-purple-100 text-purple-700" },
    REQUEST: { icon: Settings, label: "Solicitud", color: "bg-green-100 text-green-700" },
    OTHER: { icon: HelpCircle, label: "Otro", color: "bg-gray-100 text-gray-700" },
}

const PRIORITY_COLORS: Record<TicketPriority, string> = {
    LOW: "bg-green-100 text-green-700",
    MEDIUM: "bg-yellow-100 text-yellow-700",
    HIGH: "bg-orange-100 text-orange-700",
    URGENT: "bg-red-100 text-red-700",
}

interface TicketCardKanbanProps {
    ticket: Ticket
    isDragging?: boolean
}

export default function TicketCardKanban({ ticket, isDragging }: TicketCardKanbanProps) {
    const router = useRouter()
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        isDragging: isLocalDragging,
    } = useDraggable({
        id: ticket.id.toString(),
    })

    const style = {
        transform: CSS.Translate.toString(transform),
    }

    const typeInfo = TYPE_ICONS[ ticket.typeCode ] || TYPE_ICONS.OTHER
    const IconComponent = typeInfo.icon
    const isBeingDragged = isDragging || isLocalDragging
    const clientName = getClientName(ticket)
    const priorityLabel = ticketPriorityLabels[ ticket.priorityCode ] || ticket.priorityCode

    const handleClick = (e: React.MouseEvent) => {
        // Evitar navegación si se está arrastrando o si el click es en el área de arrastre
        if (!isBeingDragged && !isLocalDragging) {
            e.stopPropagation()
            router.push(`/support/tickets/${ticket.id}`)
        }
    }

    return (
        <Card
            ref={setNodeRef}
            style={style}
            {...attributes}
            onClick={handleClick}
            className={`p-3 transition-all cursor-pointer ${isBeingDragged
                ? "opacity-50 shadow-2xl scale-105 ring-2 ring-blue-400"
                : "hover:shadow-md bg-white border-slate-200 hover:border-slate-300"
                }`}
        >
            <div {...listeners} className="cursor-grab active:cursor-grabbing">
                <div className="space-y-3">
                    {/* Header with ID and Priority */}
                    <div className="flex items-start justify-between gap-2">
                        <div className="flex-1">
                            <p className="text-xs text-slate-500 font-medium">#{ticket.id}</p>
                            <h4 className="text-sm font-semibold text-slate-900 line-clamp-2">{ticket.subject}</h4>
                        </div>
                        <Badge className={`shrink-0 ${PRIORITY_COLORS[ ticket.priorityCode ]}`}>
                            {priorityLabel}
                        </Badge>
                    </div>

                    {/* Type and Client */}
                    <div className="flex items-center gap-2">
                        <div className={`p-1.5 rounded-lg flex items-center justify-center ${typeInfo.color}`}>
                            <IconComponent className="w-3.5 h-3.5" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-xs text-slate-600 truncate font-medium">{clientName}</p>
                        </div>
                    </div>

                    {/* Footer with Date and Status */}
                    <div className="flex items-center justify-between text-xs border-t border-slate-100 pt-2">
                        <span className="text-slate-500">{formatShortDate(ticket.created_at)}</span>
                        <span className={`text-xs font-medium ${ticket.employeeId ? "text-blue-600" : "text-slate-400"}`}>
                            {ticket.employeeId ? "👤 Asignado" : "⏳ Sin asignar"}
                        </span>
                    </div>
                </div>
            </div>
        </Card>
    )
}

