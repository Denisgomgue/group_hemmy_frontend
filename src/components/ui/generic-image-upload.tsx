"use client";

import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { ImageIcon, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import api from '@/lib/axios';

interface GenericImageUploadProps {
    id: string;
    label: string;
    value: string;
    onChange: (value: string) => void;
    onFileChange?: (file: File | null) => void; // Para modo creación
    uploadEndpoint: string;
    className?: string;
    disabled?: boolean;
    maxSize?: number; // en MB
}

export function GenericImageUpload({
    id,
    label,
    value,
    onChange,
    onFileChange,
    uploadEndpoint,
    className,
    disabled = false,
    maxSize = 10
}: GenericImageUploadProps) {
    const [ preview, setPreview ] = useState<string | null>(null);
    const [ isUploading, setIsUploading ] = useState(false);
    const [ error, setError ] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [ tempFile, setTempFile ] = useState<File | null>(null);

    // Manejar la selección de archivo
    const handleFileSelect = useCallback(async (file: File) => {
        if (!file) return;

        try {
            setError(null);

            // Validar tipo de archivo
            const allowedTypes = [ 'image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp' ];
            if (!allowedTypes.includes(file.type)) {
                throw new Error('Tipo de archivo no permitido. Solo se permiten: JPEG, PNG, GIF, WebP');
            }

            // Validar tamaño
            const maxSizeBytes = maxSize * 1024 * 1024; // convertir MB a bytes
            if (file.size > maxSizeBytes) {
                throw new Error(`El archivo es demasiado grande. Máximo ${maxSize}MB`);
            }

            // Crear preview temporal
            const reader = new FileReader();
            reader.onload = (e) => {
                setPreview(e.target?.result as string);
            };
            reader.readAsDataURL(file);

            // Si hay onFileChange, guardar el archivo temporalmente (modo creación)
            if (onFileChange) {
                setTempFile(file);
                onFileChange(file);
                return;
            }

            // Si no hay onFileChange, subir inmediatamente (modo edición)
            setIsUploading(true);

            // Crear FormData para la subida
            const formData = new FormData();
            formData.append('image', file);

            // Subir imagen al backend usando axios
            const response = await api.post(uploadEndpoint, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            // Obtener la ruta de la imagen del response
            // El backend puede devolver el objeto completo o solo imagePath
            const imagePath = response.data?.imagePath || response.data?.data?.imagePath;
            if (imagePath) {
                onChange(imagePath);
                // El preview se actualizará en el useEffect cuando cambie value
            }

        } catch (err: any) {
            setError(err.response?.data?.message || err.message || 'Error al subir la imagen. Inténtalo de nuevo.');
            console.error('Error al subir imagen:', err);
            setPreview(null); // Limpiar preview en caso de error
            setTempFile(null);
            onFileChange?.(null);
        } finally {
            setIsUploading(false);
        }
    }, [ uploadEndpoint, onChange, maxSize, onFileChange ]);

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
        setTempFile(null);
        onFileChange?.(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    }, [ onChange, onFileChange ]);

    // Abrir selector de archivos
    const handleClick = useCallback(() => {
        fileInputRef.current?.click();
    }, []);

    // Cargar imagen existente cuando cambie el valor o al montar el componente
    useEffect(() => {
        if (value && value.trim() !== '' && !tempFile) {
            // Si es una ruta relativa, construir la URL completa
            const imageUrl = value.startsWith('http')
                ? value
                : `${api.defaults.baseURL}${value.startsWith('/') ? value : `/${value}`}`;
            setPreview(imageUrl);
        } else if (!value && !tempFile) {
            setPreview(null);
        }
    }, [ value, tempFile ]);

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
                                className="w-full h-48 object-contain border rounded-lg bg-gray-50"
                            />
                            <Button
                                type="button"
                                variant="destructive"
                                size="sm"
                                className="absolute top-2 right-2 h-8 w-8 p-0"
                                onClick={handleRemove}
                                disabled={disabled || isUploading}
                            >
                                <X className="h-4 w-4" />
                            </Button>
                        </div>
                    )}

                    {/* Área de subida */}
                    {!preview && (
                        <div
                            className={cn(
                                "border-2 border-dashed rounded-lg p-6 text-center transition-colors",
                                "hover:border-primary/50 hover:bg-primary/5",
                                disabled && "opacity-50 cursor-not-allowed",
                                !disabled && "cursor-pointer"
                            )}
                            onDrop={handleDrop}
                            onDragOver={handleDragOver}
                            onClick={!disabled ? handleClick : undefined}
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
                                    <p>Tipos permitidos: JPEG, PNG, GIF, WebP</p>
                                    <p>Tamaño máximo: {maxSize}MB</p>
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
                    {preview && (
                        <Button
                            type="button"
                            variant="outline"
                            onClick={handleClick}
                            disabled={disabled || isUploading}
                            className="w-full"
                        >
                            {isUploading ? 'Subiendo...' : 'Cambiar Imagen'}
                        </Button>
                    )}

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
                        disabled={disabled || isUploading}
                    />
                </div>
            </CardContent>
        </Card>
    );
}

