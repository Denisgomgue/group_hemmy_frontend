import React, { useState, useEffect } from 'react';
import { SearchSelectInput, SearchSelectOption } from '@/components/ui/search-select-input';
import { Sector } from '@/types/sector';
import { useSectors } from '@/hooks/use-sectors';
import { MapPin } from 'lucide-react';

interface SectorSearchSelectProps {
    value?: number;
    onChange: (sectorId: number) => void;
    placeholder?: string;
    disabled?: boolean;
    error?: boolean;
    className?: string;
    onSectorSelect?: (sector: Sector) => void;
}

export function SectorSearchSelect({
    value,
    onChange,
    placeholder = "Buscar sector...",
    disabled = false,
    error = false,
    className,
    onSectorSelect
}: SectorSearchSelectProps) {
    const [ options, setOptions ] = useState<SearchSelectOption[]>([]);
    const { sectors, refreshSectors, isLoading } = useSectors();

    useEffect(() => {
        refreshSectors();
    }, []);

    useEffect(() => {
        // Actualizar opciones cuando cambien los sectores
        const sectorOptions: SearchSelectOption[] = sectors.map(sector => ({
            value: sector.id,
            label: sector.name,
            description: sector.description || 'Sin descripción',
            icon: <MapPin className="h-4 w-4" />
        }));
        setOptions(sectorOptions);
    }, [ sectors ]);

    const loadSectors = async (searchQuery?: string) => {
        try {
            await refreshSectors();
            // Los sectores se filtran automáticamente en el useEffect cuando cambian
        } catch (error) {
            console.error('Error loading sectors:', error);
        }
    };

    const handleSearch = (query: string) => {
        loadSectors(query);
    };

    const handleSectorSelect = (sectorId: number) => {
        onChange(sectorId);
        const selectedSector = sectors.find(s => s.id === sectorId);
        if (selectedSector && onSectorSelect) {
            onSectorSelect(selectedSector);
        }
    };

    const handleChange = (value: string | number) => {
        const numericValue = typeof value === 'string' ? parseInt(value, 10) : value;
        if (!isNaN(numericValue)) {
            handleSectorSelect(numericValue);
        }
    };

    const renderSectorOption = (option: SearchSelectOption, isSelected: boolean) => (
        <div
            className={`flex items-center justify-between px-3 py-2 cursor-pointer hover:bg-accent hover:text-accent-foreground ${isSelected ? 'bg-accent text-accent-foreground' : ''
                }`}
            onClick={() => handleSectorSelect(option.value as number)}
        >
            <div className="flex items-center gap-3">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <div>
                    <div className="font-medium">{option.label}</div>
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
            isLoading={isLoading || !sectors.length}
            emptyMessage="No hay sectores disponibles"
            noResultsMessage="No se encontraron sectores"
            renderOption={renderSectorOption}
            minSearchLength={2}
            debounceMs={500}
        />
    );
} 