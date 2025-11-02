import { useState, useCallback } from 'react';
import { EmployeesAPI } from '@/services/employees-api';
import { Employee, CreateEmployeeDto, UpdateEmployeeDto, EmployeeQueryParams } from '@/types/employee';

interface EmployeeSummary {
    total: number;
    active: number;
    inactive: number;
    byRole: Record<string, number>;
}

export function useEmployees() {
    const [ employees, setEmployees ] = useState<Employee[]>([]);
    const [ isLoading, setIsLoading ] = useState(false);
    const [ error, setError ] = useState<Error | null>(null);

    const fetchEmployees = useCallback(async (params?: EmployeeQueryParams) => {
        setIsLoading(true);
        setError(null);
        try {
            const data = await EmployeesAPI.getAll(params);
            setEmployees(data);
            return data;
        } catch (err) {
            const error = err instanceof Error ? err : new Error('Error al cargar empleados');
            setError(error);
            throw error;
        } finally {
            setIsLoading(false);
        }
    }, []);

    const refreshEmployees = useCallback(async (params?: EmployeeQueryParams) => {
        return await fetchEmployees(params);
    }, [ fetchEmployees ]);

    const createEmployee = useCallback(async (employeeData: CreateEmployeeDto) => {
        try {
            const newEmployee = await EmployeesAPI.create(employeeData);
            await fetchEmployees();
            return newEmployee;
        } catch (err) {
            throw err;
        }
    }, [ fetchEmployees ]);

    const updateEmployee = useCallback(async (id: number, employeeData: UpdateEmployeeDto) => {
        try {
            const updatedEmployee = await EmployeesAPI.update(id, employeeData);
            await fetchEmployees();
            return updatedEmployee;
        } catch (err) {
            throw err;
        }
    }, [ fetchEmployees ]);

    const deleteEmployee = useCallback(async (id: number) => {
        try {
            await EmployeesAPI.delete(id);
            await fetchEmployees();
        } catch (err) {
            throw err;
        }
    }, [ fetchEmployees ]);

    const getEmployeeSummary = useCallback(async (): Promise<EmployeeSummary> => {
        try {
            const employeesData = await EmployeesAPI.getAll();

            const summary: EmployeeSummary = {
                total: employeesData.length,
                active: employeesData.filter(emp => emp.status === 'ACTIVE').length,
                inactive: employeesData.filter(emp => emp.status === 'INACTIVE').length,
                byRole: {}
            };

            return summary;
        } catch (err) {
            console.error('Error loading employee summary:', err);
            return {
                total: 0,
                active: 0,
                inactive: 0,
                byRole: {}
            };
        }
    }, []);

    return {
        employees,
        isLoading,
        error,
        fetchEmployees,
        refreshEmployees,
        createEmployee,
        updateEmployee,
        deleteEmployee,
        getEmployeeSummary,
    };
}

