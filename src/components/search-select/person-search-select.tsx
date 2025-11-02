import React, { useState, useEffect, useRef, useCallback } from 'react';
import { SearchSelectInput, SearchSelectOption } from '@/components/ui/search-select-input';
import { Person } from '@/types/user';
import api from '@/lib/axios';
import { User } from 'lucide-react';
import { AxiosError } from 'axios';

interface PersonSearchSelectProps {
    value?: number;
    onChange: (personId: number | undefined) => void;
    placeholder?: string;
    disabled?: boolean;
    error?: boolean;
    className?: string;
    onPersonSelect?: (person: Person) => void;
}

export function PersonSearchSelect({
    value,
    onChange,
    placeholder = "Buscar persona...",
    disabled = false,
    error = false,
    className,
    onPersonSelect
}: PersonSearchSelectProps) {
    const [ options, setOptions ] = useState<SearchSelectOption[]>([]);
    const [ isLoading, setIsLoading ] = useState(false);

    // Refs para manejar cancelación de solicitudes
    const abortControllerRef = useRef<AbortController | null>(null);
    const lastSearchQueryRef = useRef<string>('');

    // Función para cargar personas con cancelación de solicitudes anteriores
    const loadPersons = useCallback(async (searchQuery?: string) => {
        // Cancelar solicitud anterior si existe
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
        }

        // Crear nuevo AbortController para esta solicitud
        const abortController = new AbortController();
        abortControllerRef.current = abortController;

        setIsLoading(true);
        try {
            // Obtener actores de tipo PERSON que incluyen las personas
            const params = searchQuery && searchQuery.trim().length >= 2 ? { search: searchQuery.trim() } : {};
            const response = await api.get('/actor', {
                params,
                signal: abortController.signal // Usar signal para cancelar la solicitud
            });

            // Verificar si la solicitud fue cancelada
            if (abortController.signal.aborted) {
                return;
            }

            const actors = response.data || [];

            // Filtrar solo actores de tipo PERSON que tengan persona
            const personActors = actors.filter((actor: any) =>
                actor.kind === 'PERSON' && actor.person
            );

            // Filtrar por búsqueda si se proporciona (filtrado adicional en cliente)
            let filteredActors = personActors;
            if (searchQuery && searchQuery.trim().length >= 2) {
                const query = searchQuery.trim().toLowerCase();
                filteredActors = personActors.filter((actor: any) => {
                    const person = actor.person;
                    const searchText = `${person.firstName} ${person.lastName} ${person.documentNumber} ${person.email}`.toLowerCase();
                    return searchText.includes(query);
                });
            }

            // Convertir a opciones
            const personOptions: SearchSelectOption[] = filteredActors.map((actor: any) => {
                const person = actor.person;
                return {
                    value: person.id,
                    label: `${person.firstName} ${person.lastName}`.trim(),
                    description: `DNI: ${person.documentNumber}${person.email ? ` • ${person.email}` : ''}`,
                    icon: <User className="h-4 w-4" />
                };
            });

            // Solo actualizar si la solicitud no fue cancelada
            if (!abortController.signal.aborted) {
                setOptions(personOptions);
                lastSearchQueryRef.current = searchQuery || '';
            }
        } catch (error) {
            // Ignorar errores de cancelación
            if (error instanceof AxiosError && error.name === 'CanceledError') {
                return;
            }
            if (abortController.signal.aborted) {
                return;
            }
            console.error('Error loading persons:', error);
            setOptions([]);
        } finally {
            // Solo actualizar loading si no fue cancelado
            if (!abortController.signal.aborted) {
                setIsLoading(false);
            }
        }
    }, []);

    // Cargar opciones iniciales solo una vez
    useEffect(() => {
        loadPersons();

        // Cleanup: cancelar solicitudes pendientes al desmontar
        return () => {
            if (abortControllerRef.current) {
                abortControllerRef.current.abort();
            }
        };
    }, [ loadPersons ]);

    // Handler de búsqueda - SearchSelectInput ya maneja el debounce
    const handleSearch = useCallback((query: string) => {
        // Si la query es la misma que la última, no hacer nada
        if (query === lastSearchQueryRef.current) {
            return;
        }

        // Si la query es muy corta (menos de 3 caracteres), no hacer solicitud
        // El SearchSelectInput ya filtra por minSearchLength, pero verificamos aquí también
        if (query.trim().length > 0 && query.trim().length < 3) {
            // Si tenemos menos de 3 caracteres y antes teníamos resultados, limpiar
            if (options.length > 0) {
                setOptions([]);
            }
            return;
        }

        // Llamar directamente a loadPersons - SearchSelectInput ya aplicó el debounce
        loadPersons(query);
    }, [ loadPersons, options.length ]);

    const handlePersonSelect = (personId: number) => {
        onChange(personId);
        const selectedOption = options.find(opt => opt.value === personId);
        if (selectedOption && onPersonSelect) {
            // Por ahora solo pasamos el ID, pero podrías hacer una llamada para obtener la persona completa
            onPersonSelect({ id: personId } as Person);
        }
    };

    const handleChange = (value: string | number) => {
        if (value === undefined || value === null || value === '') {
            onChange(undefined);
        } else {
            const numericValue = typeof value === 'string' ? parseInt(value, 10) : value;
            if (!isNaN(numericValue)) {
                handlePersonSelect(numericValue);
            }
        }
    };

    const renderPersonOption = (option: SearchSelectOption, isSelected: boolean) => {
        return (
            <div
                className={`flex items-center justify-between px-3 py-2 cursor-pointer hover:bg-accent hover:text-accent-foreground ${isSelected ? 'bg-accent text-accent-foreground' : ''}`}
                onClick={() => handlePersonSelect(option.value as number)}
            >
                <div className="flex items-center gap-3">
                    <User className="h-4 w-4 text-muted-foreground" />
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
            emptyMessage="No hay personas disponibles"
            noResultsMessage="No se encontraron personas"
            renderOption={renderPersonOption}
            minSearchLength={3}
            debounceMs={800}
        />
    );
}

