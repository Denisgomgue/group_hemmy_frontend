import React, { useState, useEffect } from 'react';
import { SearchSelectInput, SearchSelectOption } from '@/components/ui/search-select-input';
import { Role } from '@/types/role';
import { RoleAPI } from '@/services/roles-api';
import { UserCog } from 'lucide-react';

interface RoleSearchSelectProps {
    value?: number;
    onChange: (roleId: number) => void;
    placeholder?: string;
    disabled?: boolean;
    error?: boolean;
    className?: string;
    onRoleSelect?: (role: Role) => void;
    excludeRoleIds?: number[]; // Para excluir roles ya asignados
}

export function RoleSearchSelect({
    value,
    onChange,
    placeholder = "Buscar rol...",
    disabled = false,
    error = false,
    className,
    onRoleSelect,
    excludeRoleIds = []
}: RoleSearchSelectProps) {
    const [ options, setOptions ] = useState<SearchSelectOption[]>([]);
    const [ roles, setRoles ] = useState<Role[]>([]);
    const [ isLoading, setIsLoading ] = useState(false);

    useEffect(() => {
        const loadRoles = async () => {
            setIsLoading(true);
            try {
                const data = await RoleAPI.getAll();
                // Filtrar roles excluidos
                const filtered = data.filter(r => !excludeRoleIds.includes(r.id));
                setRoles(filtered);
            } catch (error) {
                console.error('Error loading roles:', error);
            } finally {
                setIsLoading(false);
            }
        };
        loadRoles();
    }, [ excludeRoleIds ]);

    useEffect(() => {
        const roleOptions: SearchSelectOption[] = roles.map(role => ({
            value: role.id,
            label: role.name,
            description: role.code,
            icon: <UserCog className="h-4 w-4" />
        }));
        setOptions(roleOptions);
    }, [ roles ]);

    const handleSelect = (selectedValue: number) => {
        onChange(selectedValue);
        const selected = roles.find(r => r.id === selectedValue);
        if (selected && onRoleSelect) {
            onRoleSelect(selected);
        }
    };

    return (
        <SearchSelectInput
            options={options}
            value={value}
            onValueChange={handleSelect}
            placeholder={placeholder}
            disabled={disabled || isLoading}
            error={error}
            className={className}
        />
    );
}

