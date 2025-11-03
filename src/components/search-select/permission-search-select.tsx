import React, { useState, useEffect } from 'react';
import { SearchSelectInput, SearchSelectOption } from '@/components/ui/search-select-input';
import { Permission } from '@/types/permission';
import { PermissionAPI } from '@/services/permissions-api';
import { Shield } from 'lucide-react';

interface PermissionSearchSelectProps {
    value?: number;
    onChange: (permissionId: number) => void;
    placeholder?: string;
    disabled?: boolean;
    error?: boolean;
    className?: string;
    onPermissionSelect?: (permission: Permission) => void;
    excludePermissionIds?: number[]; // Para excluir permisos ya asignados
}

export function PermissionSearchSelect({
    value,
    onChange,
    placeholder = "Buscar permiso...",
    disabled = false,
    error = false,
    className,
    onPermissionSelect,
    excludePermissionIds = []
}: PermissionSearchSelectProps) {
    const [ options, setOptions ] = useState<SearchSelectOption[]>([]);
    const [ permissions, setPermissions ] = useState<Permission[]>([]);
    const [ isLoading, setIsLoading ] = useState(false);

    useEffect(() => {
        const loadPermissions = async () => {
            setIsLoading(true);
            try {
                const data = await PermissionAPI.getAll();
                // Filtrar permisos excluidos y el permiso superadmin (*)
                const filtered = data.filter(p =>
                    p.code !== '*' && !excludePermissionIds.includes(p.id)
                );
                setPermissions(filtered);
            } catch (error) {
                console.error('Error loading permissions:', error);
            } finally {
                setIsLoading(false);
            }
        };
        loadPermissions();
    }, [ excludePermissionIds ]);

    useEffect(() => {
        const permissionOptions: SearchSelectOption[] = permissions.map(permission => ({
            value: permission.id,
            label: permission.name,
            description: permission.code,
            icon: <Shield className="h-4 w-4" />
        }));
        setOptions(permissionOptions);
    }, [ permissions ]);

    const handleSelect = (selectedValue: number) => {
        onChange(selectedValue);
        const selected = permissions.find(p => p.id === selectedValue);
        if (selected && onPermissionSelect) {
            onPermissionSelect(selected);
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

