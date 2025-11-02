import { Metadata } from "next";
import { TicketBoard } from "./_components/ticket-board";

export const metadata: Metadata = {
    title: "Tickets | Administración",
    description: "Gestión de tickets del sistema",
};

export default function TicketsPage() {
    return <TicketBoard />;
}
