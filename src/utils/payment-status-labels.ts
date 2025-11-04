import { PaymentStatusCode } from '@/types/payment';

// Labels para todos los estados posibles (incluyendo los usados por el código existente)
const statusLabels: Record<string, string> = {
    // Estados del backend
    [ PaymentStatusCode.PENDING ]: 'Pendiente',
    [ PaymentStatusCode.PAID ]: 'Pagado',
    [ PaymentStatusCode.OVERDUE ]: 'Vencido',
    [ PaymentStatusCode.REFUNDED ]: 'Reembolsado',
    // Estados adicionales usados por el código existente
    'PAYMENT_DAILY': 'Pago Diario',
    'LATE_PAYMENT': 'Pago Atrasado',
    'VOIDED': 'Anulado',
};

export function getPaymentStatusLabel(status: PaymentStatusCode | string): string {
    return statusLabels[ status ] || status;
}

