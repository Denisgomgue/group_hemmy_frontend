import React, { useState, useEffect } from 'react';
import { SearchSelectInput, SearchSelectOption } from '@/components/ui/search-select-input';
import { Installation } from '@/types/installation';
import { useInstallations } from '@/hooks/use-installations';
import { MapPin } from 'lucide-react';

interface InstallationSearchSelectProps {
    value?: number;
    onChange: (installationId: number) => void;
    placeholder?: string;
    disabled?: boolean;
    error?: boolean;
    className?: string;
    onInstallationSelect?: (installation: Installation) => void;
}

export function InstallationSearchSelect({
    value,
    onChange,
    placeholder = "Buscar instalación...",
    disabled = false,
    error = false,
    className,
    onInstallationSelect
}: InstallationSearchSelectProps) {
    const [ options, setOptions ] = useState<SearchSelectOption[]>([]);
    const { installations, refreshInstallations, isLoading } = useInstallations();

    useEffect(() => {
        refreshInstallations();
    }, [ refreshInstallations ]);

    useEffect(() => {
        // Actualizar opciones cuando cambien las instalaciones
        const installationOptions: SearchSelectOption[] = installations.map(installation => {
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
    }, [ installations ]);

    const handleInstallationSelect = (installationId: number) => {
        onChange(installationId);
        const selectedInstallation = installations.find(inst => inst.id === installationId);
        if (selectedInstallation && onInstallationSelect) {
            onInstallationSelect(selectedInstallation);
        }
    };

    const handleChange = (value: string | number) => {
        const numericValue = typeof value === 'string' ? parseInt(value, 10) : value;
        if (!isNaN(numericValue)) {
            handleInstallationSelect(numericValue);
        }
    };

    const renderInstallationOption = (option: SearchSelectOption, isSelected: boolean) => (
        <div
            className={`flex items-center justify-between px-3 py-2 cursor-pointer hover:bg-accent hover:text-accent-foreground ${isSelected ? 'bg-accent text-accent-foreground' : ''
                }`}
            onClick={() => handleInstallationSelect(option.value as number)}
        >
            <div className="flex items-center gap-3">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <div>
                    <div className="font-medium">{option.label}</div>
                    {option.description && (
                        <div className="text-sm text-muted-foreground">{option.description}</div>
                    )}
                </div>
            </div>
        </div>
    );

    return (
        <SearchSelectInput
            value={value}
            onChange={handleChange}
            placeholder={placeholder}
            disabled={disabled}
            error={error}
            className={className}
            options={options}
            isLoading={isLoading || !installations.length}
            emptyMessage="No hay instalaciones disponibles"
            noResultsMessage="No se encontraron instalaciones"
            renderOption={renderInstallationOption}
            minSearchLength={0}
            debounceMs={300}
        />
    );
}

