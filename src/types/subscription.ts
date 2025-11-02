// Tipos para suscripciones según backend
import { Installation } from './installation';
import { Plan } from './plan';

export enum SubscriptionStatus {
    ACTIVE = 'ACTIVE',
    INACTIVE = 'INACTIVE',
    SUSPENDED = 'SUSPENDED',
    CANCELLED = 'CANCELLED'
}

export interface Subscription {
    id: number;
    startDate: string;
    endDate?: string;
    billingDay: number;
    status: SubscriptionStatus;
    advancePayment: boolean;
    created_at: string;
    updated_at: string;
    installationId: number;
    installation?: Installation;
    planId: number;
    plan?: Plan;
}

export interface CreateSubscriptionDto {
    startDate: string;
    endDate?: string;
    billingDay: number;
    status: SubscriptionStatus;
    advancePayment?: boolean;
    installationId: number;
    planId: number;
}

export interface UpdateSubscriptionDto {
    startDate?: string;
    endDate?: string;
    billingDay?: number;
    status?: SubscriptionStatus;
    advancePayment?: boolean;
    installationId?: number;
    planId?: number;
}

export interface SubscriptionQueryParams {
    page?: number;
    limit?: number;
    search?: string;
    status?: SubscriptionStatus;
    installationId?: number;
    planId?: number;
}

