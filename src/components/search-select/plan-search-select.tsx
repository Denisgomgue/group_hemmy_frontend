import React, { useState, useEffect } from 'react';
import { SearchSelectInput, SearchSelectOption } from '@/components/ui/search-select-input';
import { Plan } from '@/types/plan';
import { usePlans } from '@/hooks/use-plans';
import { Wifi } from 'lucide-react';

interface PlanSearchSelectProps {
    value?: number;
    onChange: (planId: number) => void;
    placeholder?: string;
    disabled?: boolean;
    error?: boolean;
    className?: string;
    onPlanSelect?: (plan: Plan) => void;
}

export function PlanSearchSelect({
    value,
    onChange,
    placeholder = "Buscar plan...",
    disabled = false,
    error = false,
    className,
    onPlanSelect
}: PlanSearchSelectProps) {
    const [ options, setOptions ] = useState<SearchSelectOption[]>([]);
    const { plans, refreshPlans, isLoading } = usePlans();

    useEffect(() => {
        refreshPlans();
    }, [ refreshPlans ]);

    useEffect(() => {
        // Actualizar opciones cuando cambien los planes
        const planOptions: SearchSelectOption[] = plans.map(plan => ({
            value: plan.id,
            label: plan.name,
            description: `Velocidad: ${plan.speedMbps || 'N/A'} Mbps • Precio: S/. ${typeof plan.price === 'number' ? plan.price.toFixed(2) : plan.price}`,
            icon: <Wifi className="h-4 w-4" />
        }));
        setOptions(planOptions);
    }, [ plans ]);

    const handleSearch = (query: string) => {
        refreshPlans();
    };

    const handlePlanSelect = (planId: number) => {
        onChange(planId);
        const selectedPlan = plans.find(plan => plan.id === planId);
        if (selectedPlan && onPlanSelect) {
            onPlanSelect(selectedPlan);
        }
    };

    const handleChange = (value: string | number) => {
        const numericValue = typeof value === 'string' ? parseInt(value, 10) : value;
        if (!isNaN(numericValue)) {
            handlePlanSelect(numericValue);
        }
    };

    const renderPlanOption = (option: SearchSelectOption, isSelected: boolean) => (
        <div
            className={`flex items-center justify-between px-3 py-2 cursor-pointer hover:bg-accent hover:text-accent-foreground ${isSelected ? 'bg-accent text-accent-foreground' : ''
                }`}
            onClick={() => handlePlanSelect(option.value as number)}
        >
            <div className="flex items-center gap-3">
                <Wifi className="h-4 w-4 text-muted-foreground" />
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
            emptyMessage="No hay planes disponibles"
            noResultsMessage="No se encontraron planes"
            renderOption={renderPlanOption}
            minSearchLength={1}
            debounceMs={300}
        />
    );
} 