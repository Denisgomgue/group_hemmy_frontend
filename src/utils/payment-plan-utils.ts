import { Payment } from '@/types/payment';

export interface TicketPlanDetails {
    isChange: boolean;
    previous?: {
        service: string;
        name: string;
        speed: string;
    };
    current: {
        service: string;
        name: string;
        speed: string;
    };
}

export interface TicketDetails {
    plan: TicketPlanDetails;
}

export function getTicketDetails(payment: Payment): TicketDetails {
    // Obtener información del plan actual desde el payment
    // Si no existe información del plan, usar valores por defecto
    const currentPlan = {
        service: payment.client?.actor?.organization?.legalName 
            ? 'Servicio Empresarial' 
            : 'Servicio Residencial',
        name: 'Plan Básico',
        speed: '50 Mbps',
    };

    // Verificar si hay cambio de plan (simulado)
    const isChange = false; // Por ahora asumimos que no hay cambio de plan

    return {
        plan: {
            isChange,
            current: currentPlan,
        },
    };
}

