"use client";

import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { ImageIcon, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { buildApiUrl } from '@/config/api-config';

interface ImageUploadProps {
    id: string;
    label: string;
    value: string;
    onChange: (value: string) => void;
    logoType: 'normal' | 'horizontal' | 'reduced' | 'negative';
    companyId: number;
    className?: string;
    disabled?: boolean;
}

export function ImageUpload({
    id,
    label,
    value,
    onChange,
    logoType,
    companyId,
    className,
    disabled = false
}: ImageUploadProps) {
    const [ preview, setPreview ] = useState<string | null>(null);
    const [ isUploading, setIsUploading ] = useState(false);
    const [ error, setError ] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Manejar la selección de archivo
    const handleFileSelect = useCallback(async (file: File) => {
        if (!file) return;

        try {
            setIsUploading(true);
            setError(null);

            // Validar tipo de archivo
            const allowedTypes = [ 'image/jpeg', 'image/jpg', 'image/png', 'image/svg+xml', 'image/webp' ];
            if (!allowedTypes.includes(file.type)) {
                throw new Error('Tipo de archivo no permitido. Solo se permiten: JPEG, PNG, SVG, WebP');
            }

            // Validar tamaño (5MB)
            const maxSize = 5 * 1024 * 1024; // 5MB
            if (file.size > maxSize) {
                throw new Error('El archivo es demasiado grande. Máximo 5MB');
            }

            // Crear preview
            const reader = new FileReader();
            reader.onload = (e) => {
                setPreview(e.target?.result as string);
            };
            reader.readAsDataURL(file);

            // Crear FormData para la subida
            const formData = new FormData();
            formData.append('logo', file);



            // Subir imagen al backend usando la API configurada
            // Las cookies HTTP-only se envían automáticamente con credentials: 'include'
            const response = await fetch(buildApiUrl(`/company/${companyId}/logo/${logoType}`), {
                method: 'POST',
                body: formData,
                credentials: 'include', // Incluir cookies de autenticación HTTP-only
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Error al subir la imagen');
            }

            const result = await response.json();

            // Actualizar el valor del formulario con la ruta del backend
            // IMPORTANTE: Usar el campo específico según el tipo de logo
            let logoPath = '';
            switch (logoType) {
                case 'normal':
                    logoPath = result.logoNormal || '';
                    break;
                case 'horizontal':
                    logoPath = result.logoHorizontal || '';
                    break;
                case 'reduced':
                    logoPath = result.logoReduced || '';
                    break;
                case 'negative':
                    logoPath = result.logoNegative || '';
                    break;
                default:
                    logoPath = '';
            }

            // Solo actualizar si se obtuvo una ruta válida
            if (logoPath) {
                onChange(logoPath);

                // Actualizar el preview con la imagen subida
                const imageUrl = buildApiUrl('') + '/' + logoPath;
                setPreview(imageUrl);
            }

        } catch (err: any) {
            setError(err.message || 'Error al subir la imagen. Inténtalo de nuevo.');
            console.error('Error al subir imagen:', err);
        } finally {
            setIsUploading(false);
        }
    }, [ companyId, logoType, onChange ]);

    // Manejar el drop de archivos
    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            handleFileSelect(files[ 0 ]);
        }
    }, [ handleFileSelect ]);

    // Manejar el drag over
    const handleDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault();
    }, []);

    // Eliminar imagen
    const handleRemove = useCallback(() => {
        setPreview(null);
        onChange('');
        setError(null);
    }, [ onChange ]);

    // Abrir selector de archivos
    const handleClick = useCallback(() => {
        fileInputRef.current?.click();
    }, []);

    // Cargar imagen existente cuando cambie el valor o al montar el componente
    useEffect(() => {
        if (value && value.trim() !== '') {
            const imageUrl = buildApiUrl('') + '/' + value;
            setPreview(imageUrl);
        } else {
            setPreview(null);
        }
    }, [ value, logoType ]);

    return (
        <Card className={cn("w-full", className)}>
            <CardContent className="p-4">
                <Label htmlFor={id} className="text-sm font-medium mb-2 block">
                    {label}
                </Label>

                <div className="space-y-3">
                    {/* Área de preview */}
                    {preview && (
                        <div className="relative">
                            <img
                                src={preview}
                                alt={`Preview de ${label}`}
                                className="w-full h-32 object-contain border rounded-lg bg-gray-50"
                            />
                            <Button
                                type="button"
                                variant="destructive"
                                size="sm"
                                className="absolute top-2 right-2 h-6 w-6 p-0"
                                onClick={handleRemove}
                                disabled={disabled}
                            >
                                <X className="h-3 w-3" />
                            </Button>
                        </div>
                    )}

                    {/* Área de subida */}
                    {!preview && (
                        <div
                            className={cn(
                                "border-2 border-dashed rounded-lg p-6 text-center transition-colors",
                                "hover:border-primary/50 hover:bg-primary/5",
                                disabled && "opacity-50 cursor-not-allowed"
                            )}
                            onDrop={handleDrop}
                            onDragOver={handleDragOver}
                        >
                            <div className="space-y-2">
                                <ImageIcon className="mx-auto h-8 w-8 text-gray-400" />
                                <div className="text-sm text-gray-600">
                                    <p className="font-medium">Arrastra y suelta tu imagen aquí</p>
                                    <p className="text-xs text-gray-500 mt-1">
                                        o haz clic para seleccionar
                                    </p>
                                </div>
                                <div className="text-xs text-gray-500">
                                    <p>Tipos permitidos: JPEG, PNG, SVG, WebP</p>
                                    <p>Tamaño máximo: 5MB</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Mensaje de error */}
                    {error && (
                        <div className="text-sm text-red-600 bg-red-50 p-2 rounded">
                            {error}
                        </div>
                    )}

                    {/* Botón de selección */}
                    <Button
                        type="button"
                        variant="outline"
                        onClick={handleClick}
                        disabled={disabled || isUploading}
                        className="w-full"
                    >
                        {isUploading ? 'Subiendo...' : 'Seleccionar Imagen'}
                    </Button>

                    {/* Input file oculto */}
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                            const file = e.target.files?.[ 0 ];
                            if (file) handleFileSelect(file);
                        }}
                        className="hidden"
                    />
                </div>
            </CardContent>
        </Card>
    );
}
