import React, { useState, useEffect, useCallback } from 'react';
import { SearchSelectInput, SearchSelectOption } from '@/components/ui/search-select-input';
import { Employee } from '@/types/employee';
import { useEmployees } from '@/hooks/use-employees';
import { User, MapPin, Phone, Briefcase } from 'lucide-react';

interface EmployeeSearchSelectProps {
    value?: number;
    onChange: (employeeId: number) => void;
    placeholder?: string;
    disabled?: boolean;
    error?: boolean;
    className?: string;
    onEmployeeSelect?: (employee: Employee) => void;
}

export function EmployeeSearchSelect({
    value,
    onChange,
    placeholder = "Buscar empleado...",
    disabled = false,
    error = false,
    className,
    onEmployeeSelect
}: EmployeeSearchSelectProps) {
    const [ options, setOptions ] = useState<SearchSelectOption[]>([]);
    const [ isLoading, setIsLoading ] = useState(false);
    const { refreshEmployees } = useEmployees();

    const loadEmployees = useCallback(async (searchQuery?: string) => {
        setIsLoading(true);
        try {
            const fetchedEmployees = await refreshEmployees();

            // Filtrar por searchQuery si se proporciona
            let filteredEmployees = fetchedEmployees;
            if (searchQuery && searchQuery.trim()) {
                filteredEmployees = fetchedEmployees.filter(employee => {
                    const firstName = employee.person?.firstName?.toLowerCase() || '';
                    const lastName = employee.person?.lastName?.toLowerCase() || '';
                    const jobTitle = employee.jobTitle?.toLowerCase() || '';
                    return `${firstName} ${lastName}`.includes(searchQuery.toLowerCase()) ||
                        jobTitle.includes(searchQuery.toLowerCase());
                });
            }

            const employeeOptions: SearchSelectOption[] = filteredEmployees.map(employee => ({
                value: employee.id,
                label: `${employee.person?.firstName || ''} ${employee.person?.lastName || ''}`.trim() || 'Sin nombre',
                description: `${employee.jobTitle || 'Sin cargo'}${employee.person?.email ? ` • ${employee.person.email}` : ''}`,
                icon: <Briefcase className="h-4 w-4" />
            }));
            setOptions(employeeOptions);
        } catch (error) {
            console.error('Error loading employees:', error);
            setOptions([]);
        } finally {
            setIsLoading(false);
        }
    }, [ refreshEmployees ]);

    useEffect(() => {
        loadEmployees();
    }, [ loadEmployees ]);

    const handleSearch = (query: string) => {
        loadEmployees(query);
    };

    const handleEmployeeSelect = (employeeId: number) => {
        onChange(employeeId);
        const selectedEmployee = options.find(opt => opt.value === employeeId);
        if (selectedEmployee && onEmployeeSelect) {
            // Encontrar el empleado completo en los datos
            const employee = options.find(opt => opt.value === employeeId);
            if (employee) {
                // Aquí necesitarías obtener el empleado completo del hook
                // Por ahora solo pasamos el ID
                onEmployeeSelect({ id: employeeId } as Employee);
            }
        }
    };

    const handleChange = (value: string | number) => {
        const numericValue = typeof value === 'string' ? parseInt(value, 10) : value;
        if (!isNaN(numericValue)) {
            handleEmployeeSelect(numericValue);
        }
    };

    const renderEmployeeOption = (option: SearchSelectOption, isSelected: boolean) => (
        <div
            className={`flex items-center justify-between px-3 py-2 cursor-pointer hover:bg-accent hover:text-accent-foreground ${isSelected ? 'bg-accent text-accent-foreground' : ''
                }`}
            onClick={() => handleEmployeeSelect(option.value as number)}
        >
            <div className="flex items-center gap-3">
                <Briefcase className="h-4 w-4 text-muted-foreground" />
                <div>
                    <div className="font-medium">{option.label}</div>
                    <div className="text-sm text-muted-foreground">{option.description}</div>
                </div>
            </div>
        </div>
    );

    return (
        <SearchSelectInput
            value={value}
            onChange={handleChange}
            onSearch={handleSearch}
            placeholder={placeholder}
            disabled={disabled}
            error={error}
            className={className}
            options={options}
            isLoading={isLoading}
            emptyMessage="No hay empleados disponibles"
            noResultsMessage="No se encontraron empleados"
            renderOption={renderEmployeeOption}
            minSearchLength={2}
            debounceMs={500}
        />
    );
}
