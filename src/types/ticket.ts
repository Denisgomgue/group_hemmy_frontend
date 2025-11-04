export enum TicketType {
    TECHNICAL = 'TECHNICAL',
    BILLING = 'BILLING',
    COMPLAINT = 'COMPLAINT',
    REQUEST = 'REQUEST',
    OTHER = 'OTHER'
}

export enum TicketPriority {
    LOW = 'LOW',
    MEDIUM = 'MEDIUM',
    HIGH = 'HIGH',
    URGENT = 'URGENT'
}

export enum TicketStatus {
    OPEN = 'OPEN',
    IN_PROGRESS = 'IN_PROGRESS',
    PENDING = 'PENDING',
    RESOLVED = 'RESOLVED',
    CLOSED = 'CLOSED',
    CANCELLED = 'CANCELLED'
}

export enum TicketOutcome {
    RESOLVED = 'RESOLVED',
    NOT_RESOLVED = 'NOT_RESOLVED',
    DUPLICATE = 'DUPLICATE',
    CANCELLED = 'CANCELLED',
    ESCALATED = 'ESCALATED'
}

export enum CreatedAsRole {
    CUSTOMER = 'CUSTOMER',
    TECH = 'TECH',
    ADMIN = 'ADMIN'
}

export interface Ticket {
    id: number;
    typeCode: TicketType;
    priorityCode: TicketPriority;
    statusCode: TicketStatus;
    subject: string;
    description?: string;
    scheduledStart?: string;
    outcome?: TicketOutcome;
    openedAt: string;
    closedAt?: string;
    createdAsRole: CreatedAsRole;
    clientId: number;
    installationId?: number;
    employeeId?: number;
    createdByUserId: number;
    created_at: string;
    updated_at: string;
    client?: {
        id: number;
        clientType: string;
        actor?: {
            displayName: string;
            person?: {
                firstName: string;
                lastName: string;
            };
            organization?: {
                legalName: string;
            };
        };
    };
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
        jobTitle?: string;
        person?: {
            firstName: string;
            lastName: string;
        };
    };
    createdByUser?: {
        id: number;
        firstName: string;
        lastName: string;
        email: string;
    };
}

export interface CreateTicketDto {
    clientId: number;
    installationId?: number;
    typeCode: TicketType;
    priorityCode?: TicketPriority;
    statusCode?: TicketStatus;
    subject: string;
    description?: string;
    employeeId?: number;
    scheduledStart?: string;
    outcome?: TicketOutcome;
    openedAt: string;
    closedAt?: string;
    createdByUserId: number;
    createdAsRole?: CreatedAsRole;
}

export interface UpdateTicketDto {
    clientId?: number;
    installationId?: number;
    typeCode?: TicketType;
    priorityCode?: TicketPriority;
    statusCode?: TicketStatus;
    subject?: string;
    description?: string;
    employeeId?: number;
    scheduledStart?: string;
    outcome?: TicketOutcome;
    openedAt?: string;
    closedAt?: string;
    createdByUserId?: number;
    createdAsRole?: CreatedAsRole;
}

export interface TicketQueryParams {
    page?: number;
    limit?: number;
    search?: string;
    statusCode?: TicketStatus;
    priorityCode?: TicketPriority;
    typeCode?: TicketType;
    clientId?: number;
    employeeId?: number;
    createdByUserId?: number;
}

