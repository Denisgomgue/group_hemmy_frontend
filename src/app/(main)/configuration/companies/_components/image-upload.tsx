"use client";

import type React from "react";
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Upload, X, Eye } from "lucide-react";
import { cn } from "@/lib/utils";

interface ImageUploadProps {
    id: string;
    label: string;
    value: string;
    onChange: (value: string) => void;
    className?: string;
}

export function ImageUpload({ id, label, value, onChange, className }: ImageUploadProps) {
    const [ isDragOver, setIsDragOver ] = useState(false);
    const [ preview, setPreview ] = useState<string | null>(value || null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileSelect = (file: File) => {
        if (file && file.type.startsWith("image/")) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const result = e.target?.result as string;
                setPreview(result);
                onChange(result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragOver(false);
        const files = Array.from(e.dataTransfer.files);
        if (files.length > 0) {
            handleFileSelect(files[ 0 ]);
        }
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragOver(true);
    };

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragOver(false);
    };

    const handleClick = () => {
        fileInputRef.current?.click();
    };

    const handleRemove = () => {
        setPreview(null);
        onChange("");
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    return (
        <div className={cn("space-y-2", className)}>
            <Label htmlFor={id}>{label}</Label>
            <Card
                className={cn(
                    "relative overflow-hidden transition-all duration-200",
                    isDragOver && "border-primary bg-primary/5",
                )}
            >
                <CardContent className="p-0">
                    {preview ? (
                        <div className="relative group">
                            <div className="aspect-video w-full bg-muted flex items-center justify-center overflow-hidden">
                                <img
                                    src={preview || "/placeholder.svg"}
                                    alt={label}
                                    className="max-w-full max-h-full object-contain"
                                />
                            </div>
                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center gap-2">
                                <Button
                                    type="button"
                                    size="sm"
                                    variant="secondary"
                                    onClick={handleClick}
                                    className="bg-white/90 text-black hover:bg-white"
                                >
                                    <Eye className="h-4 w-4 mr-1" />
                                    Cambiar
                                </Button>
                                <Button
                                    type="button"
                                    size="sm"
                                    variant="destructive"
                                    onClick={handleRemove}
                                    className="bg-red-500/90 hover:bg-red-500"
                                >
                                    <X className="h-4 w-4 mr-1" />
                                    Eliminar
                                </Button>
                            </div>
                        </div>
                    ) : (
                        <div
                            className={cn(
                                "aspect-video w-full border-2 border-dashed border-border bg-muted/30 flex flex-col items-center justify-center cursor-pointer transition-colors duration-200 hover:bg-muted/50",
                                isDragOver && "border-primary bg-primary/10",
                            )}
                            onDrop={handleDrop}
                            onDragOver={handleDragOver}
                            onDragLeave={handleDragLeave}
                            onClick={handleClick}
                        >
                            <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                            <p className="text-sm text-muted-foreground text-center px-4">
                                Arrastra una imagen aquí o haz clic para seleccionar
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">PNG, JPG, GIF hasta 10MB</p>
                        </div>
                    )}
                </CardContent>
            </Card>
            <input
                ref={fileInputRef}
                id={id}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                    const file = e.target.files?.[ 0 ];
                    if (file) handleFileSelect(file);
                }}
            />
        </div>
    );
}
