import { Payment, PaymentStatusCode, PaymentMethodCode } from '@/types/payment';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';

// Labels para estados de pago
export const paymentStatusLabels: Record<PaymentStatusCode, string> = {
    PENDING: 'Pendiente',
    PAID: 'Pagado',
    OVERDUE: 'Vencido',
    REFUNDED: 'Reembolsado',
};

// Labels para métodos de pago
export const paymentMethodLabels: Record<PaymentMethodCode, string> = {
    CASH: 'Efectivo',
    TRANSFER: 'Transferencia',
    YAPE: 'Yape',
    PLIN: 'Plin',
    OTHER: 'Otro',
};

// Colores para estados de pago
export function getPaymentStatusColor(status: PaymentStatusCode): string {
    const colors: Record<PaymentStatusCode, string> = {
        PENDING: 'bg-yellow-100 text-yellow-800 border-yellow-200',
        PAID: 'bg-green-100 text-green-800 border-green-200',
        OVERDUE: 'bg-red-100 text-red-800 border-red-200',
        REFUNDED: 'bg-gray-100 text-gray-800 border-gray-200',
    };
    return colors[ status ] || colors.PENDING;
}

// Colores para métodos de pago
export function getPaymentMethodColor(method: PaymentMethodCode): string {
    const colors: Record<PaymentMethodCode, string> = {
        CASH: 'bg-blue-100 text-blue-800',
        TRANSFER: 'bg-purple-100 text-purple-800',
        YAPE: 'bg-cyan-100 text-cyan-800',
        PLIN: 'bg-indigo-100 text-indigo-800',
        OTHER: 'bg-gray-100 text-gray-800',
    };
    return colors[ method ] || colors.OTHER;
}

// Formatear monto como moneda
export function formatPaymentAmount(amount: number): string {
    return new Intl.NumberFormat('es-PE', {
        style: 'currency',
        currency: 'PEN',
    }).format(amount);
}

// Formatear fecha corta
export function formatShortDate(dateString: string): string {
    try {
        const date = new Date(dateString);
        return date.toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    } catch {
        return '';
    }
}

// Formatear fecha completa
export function formatFullDate(dateString: string): string {
    try {
        const date = new Date(dateString);
        return date.toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    } catch {
        return '';
    }
}

// Formatear fecha y hora
export function formatDateTime(dateString: string): string {
    try {
        const date = new Date(dateString);
        return date.toLocaleString('es-ES', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    } catch {
        return '';
    }
}

// Formatear tiempo desde creación
export function getTimeSinceCreation(dateString: string): string {
    try {
        const date = new Date(dateString);
        return formatDistanceToNow(date, { addSuffix: true, locale: es });
    } catch {
        return '';
    }
}

// Verificar si un pago está vencido
export function isPaymentOverdue(payment: Payment): boolean {
    if (payment.statusCode === PaymentStatusCode.PAID || payment.statusCode === PaymentStatusCode.REFUNDED) {
        return false;
    }

    if (!payment.scheduledDueDate) {
        return false;
    }

    const dueDate = new Date(payment.scheduledDueDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    dueDate.setHours(0, 0, 0, 0);

    return dueDate < today;
}

// Verificar si un pago está próximo a vencer (dentro de 3 días)
export function isPaymentNearDue(payment: Payment): boolean {
    if (payment.statusCode === PaymentStatusCode.PAID || payment.statusCode === PaymentStatusCode.REFUNDED) {
        return false;
    }

    if (!payment.scheduledDueDate) {
        return false;
    }

    const dueDate = new Date(payment.scheduledDueDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    dueDate.setHours(0, 0, 0, 0);

    const diffTime = dueDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    return diffDays >= 0 && diffDays <= 3;
}

// Obtener el nombre del cliente desde el pago
export function getClientName(payment: Payment): string {
    if (!payment.client) return 'Sin cliente';

    return payment.client.actor?.displayName ||
        (payment.client.actor?.person
            ? `${payment.client.actor.person.firstName} ${payment.client.actor.person.lastName}`.trim()
            : payment.client.actor?.organization?.legalName) ||
        'Sin cliente';
}

// Calcular días hasta vencimiento
export function getDaysUntilDue(payment: Payment): number | null {
    if (!payment.scheduledDueDate) {
        return null;
    }

    if (payment.statusCode === PaymentStatusCode.PAID || payment.statusCode === PaymentStatusCode.REFUNDED) {
        return null;
    }

    const dueDate = new Date(payment.scheduledDueDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    dueDate.setHours(0, 0, 0, 0);

    const diffTime = dueDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    return diffDays;
}

