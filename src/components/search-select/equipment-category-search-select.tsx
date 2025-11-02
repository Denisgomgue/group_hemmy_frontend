import React, { useState, useEffect } from 'react';
import { SearchSelectInput, SearchSelectOption } from '@/components/ui/search-select-input';
import { EquipmentCategory } from '@/types/equipment';
import { EquipmentCategoriesAPI } from '@/services/equipment-api';
import { Package } from 'lucide-react';

interface EquipmentCategorySearchSelectProps {
    value?: number;
    onChange: (categoryId: number) => void;
    placeholder?: string;
    disabled?: boolean;
    error?: boolean;
    className?: string;
    onCategorySelect?: (category: EquipmentCategory) => void;
}

export function EquipmentCategorySearchSelect({
    value,
    onChange,
    placeholder = "Buscar categoría...",
    disabled = false,
    error = false,
    className,
    onCategorySelect
}: EquipmentCategorySearchSelectProps) {
    const [ options, setOptions ] = useState<SearchSelectOption[]>([]);
    const [ isLoading, setIsLoading ] = useState(false);

    const loadCategories = async () => {
        setIsLoading(true);
        try {
            const categories = await EquipmentCategoriesAPI.getAll();
            const categoryOptions: SearchSelectOption[] = categories.map(category => ({
                value: category.id,
                label: category.name,
                description: category.code,
                icon: <Package className="h-4 w-4" />
            }));
            setOptions(categoryOptions);
        } catch (error) {
            console.error('Error loading categories:', error);
            setOptions([]);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadCategories();
    }, []);

    const handleSearch = (query: string) => {
        // Filter local options
        if (!query.trim()) {
            loadCategories();
            return;
        }

        const filtered = options.filter(opt =>
            opt.label.toLowerCase().includes(query.toLowerCase()) ||
            opt.description.toLowerCase().includes(query.toLowerCase())
        );
        setOptions(filtered);
    };

    const handleCategorySelect = (categoryId: number) => {
        onChange(categoryId);
        const selectedCategory = options.find(opt => opt.value === categoryId);
        if (selectedCategory && onCategorySelect) {
            // Find the full category from options
            const category = options.find(opt => opt.value === categoryId);
            if (category) {
                onCategorySelect({
                    id: categoryId,
                    name: category.label as string,
                    code: category.description as string,
                    created_at: '',
                    updated_at: ''
                } as EquipmentCategory);
            }
        }
    };

    const handleChange = (value: string | number) => {
        const numericValue = typeof value === 'string' ? parseInt(value, 10) : value;
        if (!isNaN(numericValue)) {
            handleCategorySelect(numericValue);
        }
    };

    const renderCategoryOption = (option: SearchSelectOption, isSelected: boolean) => (
        <div
            className={`flex items-center justify-between px-3 py-2 cursor-pointer hover:bg-accent hover:text-accent-foreground ${isSelected ? 'bg-accent text-accent-foreground' : ''}`
            }
            onClick={() => handleCategorySelect(option.value as number)}
        >
            <div className="flex items-center gap-3">
                <Package className="h-4 w-4 text-muted-foreground" />
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
            onSearch={handleSearch}
            placeholder={placeholder}
            disabled={disabled}
            error={error}
            className={className}
            options={options}
            isLoading={isLoading}
            emptyMessage="No hay categorías disponibles"
            noResultsMessage="No se encontraron categorías"
            renderOption={renderCategoryOption}
            minSearchLength={0}
            debounceMs={300}
        />
    );
}

