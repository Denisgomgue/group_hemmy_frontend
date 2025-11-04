import React, { useState, useEffect } from 'react';
import { SearchSelectInput, SearchSelectOption } from '@/components/ui/search-select-input';
import { Installation } from '@/types/installation';
import { useInstallations } from '@/hooks/use-installations';
import { MapPin } from 'lucide-react';

interface InstallationSearchSelectProps {
    value?: number;
    onChange: (installationId: number | undefined) => void;
    placeholder?: string;
    disabled?: boolean;
    error?: boolean;
    className?: string;
    clientId?: number; // Filtrar instalaciones por cliente
    onInstallationSelect?: (installation: Installation) => void;
}

export function InstallationSearchSelect({
    value,
    onChange,
    placeholder = "Buscar instalación...",
    disabled = false,
    error = false,
    className,
    clientId,
    onInstallationSelect
}: InstallationSearchSelectProps) {
    const [ options, setOptions ] = useState<SearchSelectOption[]>([]);
    const { installations, refreshInstallations, isLoading } = useInstallations();

    useEffect(() => {
        refreshInstallations();
    }, [ refreshInstallations ]);

    useEffect(() => {
        // Filtrar instalaciones por cliente si se proporciona clientId
        let filteredInstallations = installations;
        if (clientId) {
            filteredInstallations = installations.filter(inst => inst.clientId === clientId);
        }

        // Actualizar opciones cuando cambien las instalaciones
        const installationOptions: SearchSelectOption[] = filteredInstallations.map(installation => {
            const clientDisplay = installation?.client?.actor?.displayName ||
                (installation?.client?.actor?.person
                    ? `${installation.client.actor.person.firstName} ${installation.client.actor.person.lastName}`.trim()
                    : installation?.client?.actor?.organization?.legalName) ||
                'Sin cliente';
            const sector = installation?.sector?.name;
            const ip = installation.ipAddress;

            return {
                value: installation.id,
                label: `${clientDisplay}${ip ? ` (${ip})` : ''}`,
                description: sector || 'Sin sector',
                icon: <MapPin className="h-4 w-4" />
            };
        });
        setOptions(installationOptions);
    }, [ installations, clientId ]);

    const handleSelect = (selectedValue: number | string | undefined) => {
        const id = typeof selectedValue === 'number' ? selectedValue : undefined;
        onChange(id);
        if (id && onInstallationSelect) {
            const selectedInstallation = installations.find(inst => inst.id === id);
            if (selectedInstallation) {
                onInstallationSelect(selectedInstallation);
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
            isLoading={isLoading}
            emptyMessage="No hay instalaciones disponibles"
            noResultsMessage="No se encontraron instalaciones"
        />
    );
}

