// Tipos para planes según backend
import { Service } from './service';

export interface Plan {
    id: number;
    name: string;
    price: number;
    speedMbps?: number;
    description?: string;
    isActive: boolean;
    type: boolean;
    created_at: string;
    updated_at: string;
    serviceId?: number;
    service?: Service; // Relación con Service
}

export interface CreatePlanDto {
    name: string;
    price: number;
    serviceId?: number;
    speedMbps?: number;
    description?: string;
    isActive?: boolean;
    type?: boolean;
}

export interface UpdatePlanDto {
    name?: string;
    price?: number;
    serviceId?: number;
    speedMbps?: number;
    description?: string;
    isActive?: boolean;
    type?: boolean;
}

export interface PlanQueryParams {
    page?: number;
    limit?: number;
    search?: string;
    serviceId?: number;
    isActive?: boolean;
}

