// Tipos para instalaciones según backend
import { Sector } from './sector';

export enum InstallationStatus {
    ACTIVE = 'ACTIVE',
    INACTIVE = 'INACTIVE'
}

export interface Client {
    id: number;
    status: string;
    created_at: string;
    updated_at: string;
    actorId: number;
    actor?: {
        id: number;
        kind: 'PERSON' | 'ORGANIZATION';
        displayName: string;
        person?: {
            id: number;
            firstName: string;
            lastName: string;
            email: string;
            phone?: string;
        };
        organization?: {
            id: number;
            legalName: string;
            email?: string;
            phone?: string;
        };
    };
}

export interface Installation {
    id: number;
    address?: string;
    ipAddress?: string;
    imagePath?: string;
    installedAt?: string;
    status: InstallationStatus;
    created_at: string;
    updated_at: string;
    clientId: number;
    client?: Client;
    sectorId: number;
    sector?: Sector;
}

export interface CreateInstallationDto {
    address?: string;
    ipAddress?: string;
    imagePath?: string;
    installedAt?: string;
    status: InstallationStatus;
    clientId: number;
    sectorId: number;
}

export interface UpdateInstallationDto {
    address?: string;
    ipAddress?: string;
    imagePath?: string;
    installedAt?: string;
    status?: InstallationStatus;
    clientId?: number;
    sectorId?: number;
}

export interface InstallationQueryParams {
    page?: number;
    limit?: number;
    search?: string;
    status?: InstallationStatus;
    clientId?: number;
    sectorId?: number;
}

