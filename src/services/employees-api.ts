import api from '@/lib/axios';
import { Employee, CreateEmployeeDto, UpdateEmployeeDto, EmployeeQueryParams } from '@/types/employee';

export const EmployeesAPI = {
    getAll: async (params?: EmployeeQueryParams): Promise<Employee[]> => {
        const response = await api.get<Employee[]>('/employee', { params });
        return response.data;
    },

    getById: async (id: number): Promise<Employee> => {
        const response = await api.get<Employee>(`/employee/${id}`);
        return response.data;
    },

    create: async (data: CreateEmployeeDto): Promise<Employee> => {
        const response = await api.post<Employee>('/employee', data);
        return response.data;
    },

    update: async (id: number, data: UpdateEmployeeDto): Promise<Employee> => {
        const response = await api.patch<Employee>(`/employee/${id}`, data);
        return response.data;
    },

    delete: async (id: number): Promise<void> => {
        await api.delete(`/employee/${id}`);
    },
};

