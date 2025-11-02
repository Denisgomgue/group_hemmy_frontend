export enum EquipmentStatus {
    STOCK = 'STOCK',
    ASSIGNED = 'ASSIGNED',
    SOLD = 'SOLD',
    MAINTENANCE = 'MAINTENANCE',
    LOST = 'LOST',
    USED = 'USED'
}

export enum EquipmentUseType {
    CLIENT = 'CLIENT',
    EMPLOYEE = 'EMPLOYEE',
    COMPANY = 'COMPANY'
}

export interface EquipmentCategory {
    id: number;
    code: string;
    name: string;
    created_at: string;
    updated_at: string;
}

export interface Equipment {
    id: number;
    serialNumber?: string;
    macAddress?: string;
    brand?: string;
    model?: string;
    status: EquipmentStatus;
    assignedDate?: string;
    useType: EquipmentUseType;
    notes?: string;
    categoryId?: number;
    installationId?: number;
    employeeId?: number;
    created_at: string;
    updated_at: string;
    category?: EquipmentCategory;
    installation?: {
        id: number;
        ipAddress?: string;
        client?: {
            id: number;
            clientType: string;
            actor?: {
                displayName: string;
            };
        };
    };
    employee?: {
        id: number;
        person?: {
            firstName: string;
            lastName: string;
        };
    };
}

export interface CreateEquipmentDto {
    serialNumber?: string;
    macAddress?: string;
    brand?: string;
    model?: string;
    status?: EquipmentStatus;
    assignedDate?: string;
    useType: EquipmentUseType;
    notes?: string;
    installationId?: number;
    employeeId?: number;
    categoryId: number;
}

export interface UpdateEquipmentDto {
    serialNumber?: string;
    macAddress?: string;
    brand?: string;
    model?: string;
    status?: EquipmentStatus;
    assignedDate?: string;
    useType?: EquipmentUseType;
    notes?: string;
    installationId?: number;
    employeeId?: number;
    categoryId?: number;
}

export interface EquipmentQueryParams {
    page?: number;
    limit?: number;
    search?: string;
    status?: EquipmentStatus;
    useType?: EquipmentUseType;
    categoryId?: number;
}

