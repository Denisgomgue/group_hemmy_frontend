// Tipos para usuarios según backend
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
}

export interface Organization {
    id: number;
    name: string;
    taxId?: string;
    email?: string;
    phone?: string;
    address?: string;
}

export interface User {
    id: number;
    passwordHash: string;
    isActive: boolean;
    created_at: string;
    updated_at: string;
    actorId: number;
    actor?: Actor;
}

export interface CreateUserDto {
    actorId: number;
    passwordHash: string;
    isActive?: boolean;
}

export interface UpdateUserDto {
    passwordHash?: string;
    isActive?: boolean;
    actorId?: number;
}

export interface UserQueryParams {
    page?: number;
    limit?: number;
    search?: string;
    isActive?: boolean;
}
