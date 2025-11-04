"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Search, Filter } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
    DndContext,
    closestCorners,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    type DragEndEvent,
    DragOverlay,
} from "@dnd-kit/core"
import { sortableKeyboardCoordinates } from "@dnd-kit/sortable"
import KanbanColumn from "./kanban-column"
import TicketCardKanban from "./ticket-card-kanban"
import { Ticket, TicketStatus } from "@/types/ticket"
import { getClientName } from "@/utils/ticket-helpers"

const STATUS_ORDER: TicketStatus[] = [ "OPEN", "IN_PROGRESS", "PENDING", "RESOLVED", "CLOSED", "CANCELLED" ]

interface KanbanBoardProps {
    tickets: Ticket[]
    onTicketUpdate?: (ticketId: number, statusCode: TicketStatus) => void
    searchTerm?: string
    onSearchChange?: (term: string) => void
    onAddTicket?: () => void
}

export default function KanbanBoard({ tickets, onTicketUpdate, searchTerm = "", onSearchChange, onAddTicket }: KanbanBoardProps) {
    const [ expandedPriorities, setExpandedPriorities ] = useState<string[]>([ "expanded-URGENT", "expanded-HIGH", "expanded-MEDIUM", "expanded-LOW" ])
    const [ activeId, setActiveId ] = useState<string | null>(null)
    const [ localSearchTerm, setLocalSearchTerm ] = useState(searchTerm)

    const sensors = useSensors(
        useSensor(PointerSensor, {
            distance: 8,
            activationConstraint: {
                distance: 8,
            },
        }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        }),
    )

    const handleSearchChange = (term: string) => {
        setLocalSearchTerm(term)
        onSearchChange?.(term)
    }

    const filteredTickets = tickets.filter((ticket) => {
        if (!localSearchTerm && !searchTerm) return true
        const term = (localSearchTerm || searchTerm).toLowerCase()
        const clientName = getClientName(ticket).toLowerCase()
        return (
            ticket.subject.toLowerCase().includes(term) ||
            clientName.includes(term) ||
            (ticket.description?.toLowerCase().includes(term) || false) ||
            ticket.id.toString().includes(term)
        )
    })

    const togglePriorityExpanded = (priority: string) => {
        const key = `expanded-${priority}`
        setExpandedPriorities((prev) => (prev.includes(key) ? prev.filter((p) => p !== key) : [ ...prev, key ]))
    }

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event
        setActiveId(null)

        if (!over) return

        const overId = over.id as string
        if (!overId.includes("__")) return

        const [ newStatus ] = overId.split("__") as [ TicketStatus ]

        // Validar que el estado sea válido
        if (!STATUS_ORDER.includes(newStatus)) return

        const ticketId = parseInt(active.id.toString())
        const ticket = tickets.find((t) => t.id === ticketId)

        if (!ticket || ticket.statusCode === newStatus) return

        // Llamar al callback para actualizar el ticket
        onTicketUpdate?.(ticketId, newStatus)
    }

    const activeTicket = activeId ? tickets.find((t) => t.id.toString() === activeId.toString()) : null

    return (
        <DndContext
            sensors={sensors}
            collisionDetection={closestCorners}
            onDragEnd={handleDragEnd}
            onDragStart={(event) => setActiveId(event.active.id as string)}
        >
            <div className="w-full px-6 pb-6">
                {/* Search Bar */}
                <div className="mb-6 flex gap-3">
                    <div className="flex-1 relative">
                        <Search className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
                        <Input
                            placeholder="Buscar tickets por nombre o cliente..."
                            value={localSearchTerm || searchTerm}
                            onChange={(e) => handleSearchChange(e.target.value)}
                            className="pl-10 bg-white border-slate-200 shadow-sm focus:shadow-md transition-shadow"
                        />
                    </div>
                    <Button variant="outline" className="gap-2 bg-white border-slate-200 hover:bg-slate-50 shadow-sm">
                        <Filter className="w-4 h-4" />
                        Filtros
                    </Button>
                </div>

                {/* Kanban Board */}
                <div className="flex gap-4 pb-4 overflow-x-auto flex-wrap lg:flex-nowrap">
                    {STATUS_ORDER.map((status) => {
                        const statusTickets = filteredTickets.filter((t) => t.statusCode === status)

                        return (
                            <KanbanColumn
                                key={status}
                                status={status}
                                tickets={statusTickets}
                                expandedPriorities={expandedPriorities}
                                onTogglePriority={togglePriorityExpanded}
                                onAddTicket={onAddTicket}
                            />
                        )
                    })}
                </div>

                <DragOverlay>{activeTicket ? <TicketCardKanban ticket={activeTicket} isDragging /> : null}</DragOverlay>
            </div>
        </DndContext>
    )
}

