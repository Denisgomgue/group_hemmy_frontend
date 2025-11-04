import { PaymentMethodCode } from '@/types/payment';

export function getPaymentTypeLabel(type: PaymentMethodCode | string): string {
    const labels: Record<PaymentMethodCode, string> = {
        [PaymentMethodCode.CASH]: 'Efectivo',
        [PaymentMethodCode.TRANSFER]: 'Transferencia',
        [PaymentMethodCode.YAPE]: 'Yape',
        [PaymentMethodCode.PLIN]: 'Plin',
        [PaymentMethodCode.OTHER]: 'Otro',
    };

    return labels[type as PaymentMethodCode] || type;
}

