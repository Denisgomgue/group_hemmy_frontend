"use client";

import React, { useState } from "react";
import { Building2, RefreshCw } from "lucide-react";
import { useCompanies } from "@/hooks/use-companies";
import { Company } from "@/types/company/company";
import { useToast } from "@/hooks/use-toast";
import { CompanyForm } from "./_components/company-form";
import { UpdateCompanyFormData } from "@/schemas/company-schema";

export default function CompaniesPage() {
    const { toast } = useToast();
    const {
        activeCompany,
        isLoading,
        error,
        refetch,
        updateCompany,
        isUpdating,
    } = useCompanies();

    const [ showSuccess, setShowSuccess ] = useState(false);

    // Manejar actualización
    const handleSubmit = async (data: UpdateCompanyFormData) => {
        try {
            if (activeCompany) {
                const company = activeCompany as Company;


                // Filtrar datos antes de enviar - solo campos con valores reales
                const filteredData = Object.entries(data).reduce((acc, [ key, value ]) => {
                    // Solo incluir campos que tengan valores reales (no undefined, null, vacíos o espacios en blanco)
                    if (value !== undefined && value !== null && value !== '' && value !== ' ' && value !== '  ') {
                        // Para campos booleanos, incluir solo si están definidos
                        if (typeof value === 'boolean') {
                            acc[ key ] = value;
                        } else if (typeof value === 'string' && value.trim() !== '') {
                            // Para strings, solo si no están vacíos después de quitar espacios
                            acc[ key ] = value.trim();
                        } else if (typeof value !== 'string') {
                            // Para otros tipos (number, boolean, etc.)
                            acc[ key ] = value;
                        }
                    }
                    return acc;
                }, {} as any);



                await updateCompany(company.id, filteredData);

                // El toast se maneja en el hook useCompanies


                // Mostrar indicador de éxito temporal
                setShowSuccess(true);
                setTimeout(() => setShowSuccess(false), 3000);
            }
        } catch (error: any) {
            console.error("❌ Error al actualizar empresa:", error);

            // Mostrar error más detallado
            let errorMessage = "Ocurrió un error al procesar la solicitud";
            if (error.response?.data?.message) {
                errorMessage = error.response.data.message;
            } else if (error.message) {
                errorMessage = error.message;
            }

            toast({
                title: "Error al actualizar",
                description: errorMessage,
                variant: "destructive",
            });
        }
    };

    if (error) {
        return (
            <div className="container mx-auto p-6">
                <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                    <div className="flex items-center gap-2 text-red-700 mb-4">
                        <Building2 className="h-5 w-5" />
                        <p>Error al cargar la información de la empresa: {error.message}</p>
                    </div>
                    <button
                        onClick={() => refetch()}
                        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                    >
                        Reintentar
                    </button>
                </div>
            </div>
        );
    }

    if (isLoading) {
        return (
            <div className="container mx-auto p-6">
                <div className="text-center py-8">
                    <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-2" />
                    <p className="text-muted-foreground">Cargando información de la empresa...</p>
                </div>
            </div>
        );
    }

    if (!activeCompany) {
        return (
            <div className="container mx-auto p-6">
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                    <div className="flex items-center gap-2 text-yellow-700 mb-4">
                        <Building2 className="h-5 w-5" />
                        <p>No se encontró información de la empresa activa</p>
                    </div>
                    <button
                        onClick={() => refetch()}
                        className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors"
                    >
                        Reintentar
                    </button>
                </div>
            </div>
        );
    }

    const company = activeCompany as Company;

    return (
        <div className="container mx-auto p-6">
            {/* Header Simple */}
            <div className="mb-8">
                <div className="flex items-center gap-3 mb-2">
                    <Building2 className="h-8 w-8 text-purple-600" />
                    <h1 className="text-3xl font-bold text-foreground">
                        Información de la Empresa
                    </h1>
                </div>
                <p className="text-muted-foreground">
                    Actualiza la información de tu empresa. Los cambios se guardarán automáticamente.
                </p>
                {isUpdating && (
                    <div className="flex items-center gap-2 mt-2 text-sm text-blue-600 bg-blue-50 px-3 py-2 rounded-lg border border-blue-200">
                        <RefreshCw className="h-4 w-4 animate-spin" />
                        Guardando cambios en el servidor...
                    </div>
                )}
                {showSuccess && (
                    <div className="flex items-center gap-2 mt-2 text-sm text-green-600 bg-green-50 px-3 py-2 rounded-lg border border-green-200">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        ¡Cambios guardados exitosamente!
                    </div>
                )}
            </div>

            {/* Formulario Principal */}
            <CompanyForm
                company={company}
                onSubmit={handleSubmit}
                onCancel={() => { }} // No necesario para cancelar
                onSuccess={() => {
                    // Resetear estados después de guardar exitosamente
                    setShowSuccess(true);
                    setTimeout(() => setShowSuccess(false), 3000);
                }}
            />
        </div>
    );
}
