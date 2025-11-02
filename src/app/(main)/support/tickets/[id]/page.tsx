import { Metadata } from "next";
import { notFound } from "next/navigation";
import { TicketDetails } from "../_components/ticket-details";

interface TicketPageProps {
    params: Promise<{
        id: string;
    }>;
}

export async function generateMetadata({ params }: TicketPageProps): Promise<Metadata> {
    const { id } = await params;
    return {
        title: `Ticket ${id} | Hemmy`,
        description: `Detalles del ticket ${id}`,
    };
}

export default async function TicketPage({ params }: TicketPageProps) {
    // En producción, aquí se haría la llamada a la API para obtener el ticket
    const { id: ticketId } = await params;

    if (!ticketId) {
        notFound();
    }

    return (
        <div className="container mx-auto py-6 px-4">
            <TicketDetails ticketId={ticketId} />
        </div>
    );
}
