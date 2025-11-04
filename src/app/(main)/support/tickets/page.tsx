"use client"

import { useState } from "react"
import KanbanBoard from "@/components/kanban-board"
import TicketsSummary from "@/components/tickets-summary"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Plus, LayoutGrid, BarChart3 } from "lucide-react"
import { useTicket } from "@/hooks/use-ticket"
import { TicketStatus } from "@/types/ticket"
import { CreateTicketDialog } from "./_components/create-ticket-dialog"
import { toast } from "sonner"

export default function TicketsPage() {
    const [ activeView, setActiveView ] = useState("kanban")
    const [ showCreateDialog, setShowCreateDialog ] = useState(false)
    const { tickets, isLoading, updateTicket, isUpdating } = useTicket()

    const handleTicketUpdate = async (ticketId: number, statusCode: TicketStatus) => {
        try {
            await updateTicket({
                id: ticketId,
                data: { statusCode },
            })
        } catch (error) {
            toast.error("Error al actualizar el estado del ticket")
            console.error("Error updating ticket:", error)
        }
    }

    return (
        <main className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
            {/* Header */}
            <div className="border-b border-slate-200 bg-white shadow-sm">
                <div className="max-w-7xl mx-auto px-6 py-8">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                                Centro de Tickets
                            </h1>
                            <p className="text-slate-600 mt-2">Gestiona solicitudes de atención técnica en tiempo real</p>
                        </div>
                        <Button
                            size="lg"
                            className="gap-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg"
                            onClick={() => setShowCreateDialog(true)}
                        >
                            <Plus className="w-5 h-5" />
                            Nuevo Ticket
                        </Button>
                    </div>

                    <Tabs value={activeView} onValueChange={setActiveView} className="w-full">
                        <TabsList className="grid w-fit grid-cols-2 bg-slate-100 p-1">
                            <TabsTrigger value="kanban" className="gap-2 data-[state=active]:shadow-md">
                                <LayoutGrid className="w-4 h-4" />
                                Vista Kanban
                            </TabsTrigger>
                            <TabsTrigger value="summary" className="gap-2 data-[state=active]:shadow-md">
                                <BarChart3 className="w-4 h-4" />
                                Resúmenes
                            </TabsTrigger>
                        </TabsList>

                        <TabsContent value="kanban" className="mt-6">
                            {isLoading ? (
                                <div className="flex items-center justify-center py-12">
                                    <p className="text-slate-600">Cargando tickets...</p>
                                </div>
                            ) : (
                                <KanbanBoard
                                    tickets={tickets}
                                    onTicketUpdate={handleTicketUpdate}
                                    onAddTicket={() => setShowCreateDialog(true)}
                                />
                            )}
                        </TabsContent>

                        <TabsContent value="summary" className="mt-6">
                            {isLoading ? (
                                <div className="flex items-center justify-center py-12">
                                    <p className="text-slate-600">Cargando resúmenes...</p>
                                </div>
                            ) : (
                                <TicketsSummary tickets={tickets} />
                            )}
                        </TabsContent>
                    </Tabs>
                </div>
            </div>

            {/* Dialog de crear ticket */}
            <CreateTicketDialog open={showCreateDialog} onOpenChange={setShowCreateDialog} />
        </main>
    )
}
