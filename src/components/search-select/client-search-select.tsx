import React, { useState, useEffect, useCallback } from 'react';
import { SearchSelectInput, SearchSelectOption } from '@/components/ui/search-select-input';
import { Client } from '@/types/client';
import { useClients } from '@/hooks/use-clients';
import { User } from 'lucide-react';

interface ClientSearchSelectProps {
    value?: number;
    onChange: (clientId: number | undefined) => void;
    placeholder?: string;
    disabled?: boolean;
    error?: boolean;
    className?: string;
    onClientSelect?: (client: Client) => void;
}

export function ClientSearchSelect({
    value,
    onChange,
    placeholder = "Buscar cliente...",
    disabled = false,
    error = false,
    className,
    onClientSelect
}: ClientSearchSelectProps) {
    const [ options, setOptions ] = useState<SearchSelectOption[]>([]);
    const { clients, refreshClients, isLoading } = useClients();

    const loadClients = useCallback(async (searchQuery?: string) => {
        try {
            await refreshClients({ search: searchQuery });
        } catch (error) {
            console.error('Error loading clients:', error);
        }
    }, [ refreshClients ]);

    useEffect(() => {
        loadClients();
    }, [ loadClients ]);

    useEffect(() => {
        const clientOptions: SearchSelectOption[] = clients.map(client => {
            const displayName = client?.actor?.displayName ||
                (client?.actor?.person
                    ? `${client.actor.person.firstName} ${client.actor.person.lastName}`.trim()
                    : client?.actor?.organization?.legalName) ||
                'Sin nombre';

            const description = client?.actor?.person?.phone ||
                client?.actor?.organization?.phone ||
                client?.actor?.person?.documentNumber ||
                client?.actor?.organization?.documentNumber || '';

            return {
                value: client.id,
                label: displayName,
                description: description ? `${description}` : '',
                icon: <User className="h-4 w-4" />
            };
        });
        setOptions(clientOptions);
    }, [ clients ]);

    const handleSelect = (selectedValue: number | string | undefined) => {
        const id = typeof selectedValue === 'number' ? selectedValue : undefined;
        onChange(id);
        if (id && onClientSelect) {
            const selectedClient = clients.find(c => c.id === id);
            if (selectedClient) {
                onClientSelect(selectedClient);
            }
        }
    };

    const handleSearch = (query: string) => {
        if (query.length >= 2) {
            loadClients(query);
        }
    };

    return (
        <SearchSelectInput
            options={options}
            value={value}
            onValueChange={handleSelect}
            onSearch={handleSearch}
            placeholder={placeholder}
            disabled={disabled || isLoading}
            error={error}
            className={className}
            isLoading={isLoading}
            emptyMessage="No hay clientes disponibles"
            noResultsMessage="No se encontraron clientes"
            minSearchLength={2}
            debounceMs={500}
        />
    );
} 