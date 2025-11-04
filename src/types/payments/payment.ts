// Re-exportar tipos desde el módulo principal de payment
export * from '@/types/payment';

// Mantener compatibilidad con tipos antiguos si es necesario
import { Payment as PaymentBase, PaymentStatusCode, PaymentMethodCode } from '@/types/payment';

// Tipo para distinguir entre pago y aplazamiento (para UI)
export type PaymentType = 'payment' | 'postponement';

// Extender Payment para incluir campos adicionales usados por el formulario
export interface Payment extends PaymentBase {
    // Campos adicionales para compatibilidad con código existente
    code?: string;
    status?: string; // Para compatibilidad con código existente (PENDING, PAYMENT_DAILY, LATE_PAYMENT, VOIDED)
    dueDate?: string; // Para compatibilidad con código existente
    engagementDate?: string; // Para aplazamientos
    amount?: number; // Para compatibilidad con código existente
    baseAmount?: number; // Monto base del plan
    reconnectionFee?: number;
    discount?: number;
    paymentType?: PaymentMethodCode; // Para compatibilidad con código existente
    transfername?: string;
    reconnection?: boolean;
    advancePayment?: boolean;
    currentPlan?: {
        name?: string;
        speed?: string;
        service?: {
            name?: string;
        };
    };
}

// Enum para estados de pago (compatible con código existente)
export enum PaymentStatus {
    PENDING = 'PENDING',
    PAYMENT_DAILY = 'PAYMENT_DAILY',
    LATE_PAYMENT = 'LATE_PAYMENT',
    VOIDED = 'VOIDED',
    // También incluir valores del backend para compatibilidad
    PAID = 'PAID',
    OVERDUE = 'OVERDUE',
    REFUNDED = 'REFUNDED',
}

