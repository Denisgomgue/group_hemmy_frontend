// Tipos para clientes según backend
export enum ClientStatus {
    ACTIVE = 'ACTIVE',
    INACTIVE = 'INACTIVE',
    SUSPENDED = 'SUSPENDED'
}

export interface Actor {
    id: number;
    kind: 'PERSON' | 'ORGANIZATION';
    displayName: string;
    person?: Person;
    organization?: Organization;
    created_at: string;
    updated_at: string;
}

export interface Person {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    documentType?: string;
    documentNumber?: string;
    birthdate?: string;
    address?: string;
}

export interface Organization {
    id: number;
    legalName: string;
    documentType?: string;
    documentNumber?: string;
    email?: string;
    phone?: string;
    address?: string;
    representativePersonId?: number;
    created_at?: string;
    updated_at?: string;
}

export interface Client {
    id: number;
    status: ClientStatus;
    created_at: string;
    updated_at: string;
    actorId: number;
    actor?: Actor;
}

export interface CreateClientDto {
    status: ClientStatus;
    actorId: number;
}

export interface UpdateClientDto {
    status?: ClientStatus;
    actorId?: number;
}

export interface ClientQueryParams {
    page?: number;
    limit?: number;
    search?: string;
    status?: ClientStatus;
}

