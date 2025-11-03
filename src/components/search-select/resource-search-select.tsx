import React, { useState, useEffect } from 'react';
import { SearchSelectInput, SearchSelectOption } from '@/components/ui/search-select-input';
import { useResource } from '@/hooks/use-resource';
import { Package } from 'lucide-react';
import { Resource } from '@/types/resource';

interface ResourceSearchSelectProps {
    value?: number;
    onChange: (resourceId: number | undefined) => void;
    placeholder?: string;
    disabled?: boolean;
    error?: boolean;
    className?: string;
    onResourceSelect?: (resource: Resource) => void;
}

export function ResourceSearchSelect({
    value,
    onChange,
    placeholder = "Buscar recurso...",
    disabled = false,
    error = false,
    className,
    onResourceSelect,
}: ResourceSearchSelectProps) {
    const [ options, setOptions ] = useState<SearchSelectOption[]>([]);
    const { resources, refreshResources, isLoading } = useResource();

    useEffect(() => {
        refreshResources();
    }, [ refreshResources ]);

    useEffect(() => {
        const resourceOptions: SearchSelectOption[] = resources.map(resource => ({
            value: resource.id,
            label: resource.name,
            description: resource.routeCode,
            icon: <Package className="h-4 w-4" />
        }));
        setOptions(resourceOptions);
    }, [ resources ]);

    const handleSelect = (selectedValue: number | string | undefined) => {
        const id = typeof selectedValue === 'number' ? selectedValue : undefined;
        onChange(id);
        if (id && onResourceSelect) {
            const selectedResource = resources.find(r => r.id === id);
            if (selectedResource) {
                onResourceSelect(selectedResource);
            }
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
            loading={isLoading}
        />
    );
}

