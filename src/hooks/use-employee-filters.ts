import { useState, useMemo } from 'react';
import { Employee } from '@/types/employee';

export function useEmployeeFilters(employees: Employee[]) {
    const [ searchTerm, setSearchTerm ] = useState('');
    const [ filters, setFilters ] = useState<any>({});
    const [ currentPage, setCurrentPage ] = useState(1);
    const [ pageSize, setPageSize ] = useState(10);
    const [ viewMode, setViewMode ] = useState<"list" | "grid">("list");

    const filteredEmployees = useMemo(() => {
        let filtered = employees;

        // Filtrar por búsqueda
        if (searchTerm.trim()) {
            const searchLower = searchTerm.toLowerCase().trim();
            filtered = filtered.filter(employee => {
                const firstName = employee.person?.firstName?.toLowerCase() || '';
                const lastName = employee.person?.lastName?.toLowerCase() || '';
                const email = employee.person?.email?.toLowerCase() || '';
                const phone = employee.person?.phone?.toLowerCase() || '';
                const documentNumber = employee.person?.documentNumber?.toLowerCase() || '';
                const jobTitle = employee.jobTitle?.toLowerCase() || '';

                return firstName.includes(searchLower) ||
                    lastName.includes(searchLower) ||
                    email.includes(searchLower) ||
                    phone.includes(searchLower) ||
                    documentNumber.includes(searchLower) ||
                    jobTitle.includes(searchLower);
            });
        }

        // Aplicar filtros adicionales
        if (filters.status) {
            filtered = filtered.filter(emp => emp.status === filters.status);
        }

        return filtered;
    }, [ employees, searchTerm, filters ]);

    const paginatedEmployees = useMemo(() => {
        const start = (currentPage - 1) * pageSize;
        const end = start + pageSize;
        return filteredEmployees.slice(start, end);
    }, [ filteredEmployees, currentPage, pageSize ]);

    const totalRecords = filteredEmployees.length;

    return {
        searchTerm,
        setSearchTerm,
        filters,
        setFilters,
        currentPage,
        setCurrentPage,
        pageSize,
        setPageSize,
        viewMode,
        setViewMode,
        paginatedEmployees,
        totalRecords,
    };
}

