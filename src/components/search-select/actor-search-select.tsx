import React, { useState, useEffect } from 'react';
import { SearchSelectInput, SearchSelectOption } from '@/components/ui/search-select-input';
import { Actor } from '@/types/client';
import api from '@/lib/axios';
import { User, Building2 } from 'lucide-react';

interface ActorSearchSelectProps {
    value?: number;
    onChange: (actorId: number) => void;
    placeholder?: string;
    disabled?: boolean;
    error?: boolean;
    className?: string;
    onActorSelect?: (actor: Actor) => void;
}

export function ActorSearchSelect({
    value,
    onChange,
    placeholder = "Buscar actor (persona u organización)...",
    disabled = false,
    error = false,
    className,
    onActorSelect
}: ActorSearchSelectProps) {
    const [ options, setOptions ] = useState<SearchSelectOption[]>([]);
    const [ isLoading, setIsLoading ] = useState(false);

    const loadActors = async (searchQuery?: string) => {
        setIsLoading(true);
        try {
            const params = searchQuery ? { search: searchQuery } : {};
            const response = await api.get('/actor', { params });
            const actors: Actor[] = response.data || [];

            const actorOptions: SearchSelectOption[] = actors.map(actor => {
                const displayName = actor.displayName ||
                    (actor.person
                        ? `${actor.person.firstName} ${actor.person.lastName}`.trim()
                        : actor.organization?.legalName) ||
                    'Sin nombre';

                const description = actor.person
                    ? `DNI: ${actor.person.documentNumber || 'N/A'}${actor.person.email ? ` • ${actor.person.email}` : ''}`
                    : actor.organization
                        ? `RUC: ${actor.organization.documentNumber || 'N/A'}${actor.organization.email ? ` • ${actor.organization.email}` : ''}`
                        : 'Sin información';

                return {
                    value: actor.id,
                    label: displayName,
                    description,
                    icon: actor.kind === 'PERSON' ? <User className="h-4 w-4" /> : <Building2 className="h-4 w-4" />
                };
            });

            setOptions(actorOptions);
        } catch (error) {
            console.error('Error loading actors:', error);
            setOptions([]);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadActors();
    }, []);

    const handleSearch = (query: string) => {
        loadActors(query);
    };

    const handleActorSelect = (actorId: number) => {
        onChange(actorId);
        const selectedOption = options.find(opt => opt.value === actorId);
        if (selectedOption && onActorSelect) {
            // Aquí podrías hacer una llamada para obtener el actor completo
            // Por ahora solo pasamos el ID
            onActorSelect({ id: actorId } as Actor);
        }
    };

    const handleChange = (value: string | number) => {
        const numericValue = typeof value === 'string' ? parseInt(value, 10) : value;
        if (!isNaN(numericValue)) {
            handleActorSelect(numericValue);
        }
    };

    const renderActorOption = (option: SearchSelectOption, isSelected: boolean) => {
        const actorOption = options.find(opt => opt.value === option.value);
        const isPerson = actorOption?.icon?.type === User;

        return (
            <div
                className={`flex items-center justify-between px-3 py-2 cursor-pointer hover:bg-accent hover:text-accent-foreground ${isSelected ? 'bg-accent text-accent-foreground' : ''
                    }`}
                onClick={() => handleActorSelect(option.value as number)}
            >
                <div className="flex items-center gap-3">
                    {isPerson ? (
                        <User className="h-4 w-4 text-muted-foreground" />
                    ) : (
                        <Building2 className="h-4 w-4 text-muted-foreground" />
                    )}
                    <div>
                        <div className="font-medium">{option.label}</div>
                        <div className="text-sm text-muted-foreground">{option.description}</div>
                    </div>
                </div>
            </div>
        );
    };

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
            emptyMessage="No hay actores disponibles"
            noResultsMessage="No se encontraron actores"
            renderOption={renderActorOption}
            minSearchLength={2}
            debounceMs={500}
        />
    );
}

