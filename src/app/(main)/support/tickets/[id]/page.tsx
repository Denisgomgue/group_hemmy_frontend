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
        title: `Ticket #${id} | Hemmy`,
        description: `Detalles del ticket #${id}`,
    };
}

export default async function TicketPage({ params }: TicketPageProps) {
    const { id: ticketId } = await params;

    if (!ticketId || isNaN(Number(ticketId))) {
        notFound();
    }

    return (
        <main className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
            <div className="container mx-auto py-6 px-4 max-w-7xl">
                <TicketDetails ticketId={ticketId} />
            </div>
        </main>
    );
}
