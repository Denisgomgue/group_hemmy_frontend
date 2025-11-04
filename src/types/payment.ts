import { Client } from './client';
import { User } from './user';

export enum PaymentStatusCode {
    PENDING = 'PENDING',
    PAID = 'PAID',
    OVERDUE = 'OVERDUE',
    REFUNDED = 'REFUNDED',
}

export enum PaymentMethodCode {
    CASH = 'CASH',
    TRANSFER = 'TRANSFER',
    YAPE = 'YAPE',
    PLIN = 'PLIN',
    OTHER = 'OTHER',
}

export interface Payment {
    id: number;
    statusCode: PaymentStatusCode;
    paymentDate?: string;
    scheduledDueDate?: string;
    amountTotal: number;
    methodCode?: PaymentMethodCode;
    reference?: string;
    isVoid: boolean;
    voidReason?: string;
    voidedAt?: string;
    created_at: string;
    updated_at: string;
    clientId: number;
    createdByUserId?: number;
    voidedByUserId?: number;
    client?: Client;
    createdByUser?: User;
    voidedByUser?: User;
}

export interface CreatePaymentDto {
    clientId: number;
    statusCode: PaymentStatusCode;
    paymentDate?: string;
    scheduledDueDate?: string;
    amountTotal: number;
    methodCode?: PaymentMethodCode;
    reference?: string;
    createdByUserId?: number;
    isVoid?: boolean;
    voidReason?: string;
    voidedAt?: string;
    voidedByUserId?: number;
}

export interface UpdatePaymentDto {
    clientId?: number;
    statusCode?: PaymentStatusCode;
    paymentDate?: string;
    scheduledDueDate?: string;
    amountTotal?: number;
    methodCode?: PaymentMethodCode;
    reference?: string;
    createdByUserId?: number;
    isVoid?: boolean;
    voidReason?: string;
    voidedAt?: string;
    voidedByUserId?: number;
}

export interface PaymentQueryParams {
    page?: number;
    limit?: number;
    search?: string;
    statusCode?: PaymentStatusCode;
    clientId?: number;
    createdByUserId?: number;
}

