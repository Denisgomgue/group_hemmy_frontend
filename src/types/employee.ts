import { Person } from './user';

export enum EmployeeStatus {
    ACTIVE = 'ACTIVE',
    INACTIVE = 'INACTIVE',
}

export interface Employee {
    id: number;
    personId: number;
    hireDate?: string;
    status: EmployeeStatus;
    jobTitle?: string;
    created_at: string;
    updated_at: string;
    person?: Person;
}

export interface CreateEmployeeDto {
    personId: number;
    hireDate?: string;
    status: EmployeeStatus;
    jobTitle?: string;
}

export interface UpdateEmployeeDto {
    personId?: number;
    hireDate?: string;
    status?: EmployeeStatus;
    jobTitle?: string;
}

export interface EmployeeQueryParams {
    page?: number;
    limit?: number;
    search?: string;
    status?: EmployeeStatus;
}

