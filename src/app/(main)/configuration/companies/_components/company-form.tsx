"use client";

import type React from "react";
import { ImageUpload } from "@/components/ui/image-upload";
import { SocialMediaForm } from "./social-media-form";
import { BusinessHoursForm } from "./business-hours-form";
import { useState, useEffect, useMemo, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Building2, MapPin, Phone, ImageIcon, FileText, Target, RefreshCw } from "lucide-react";
import { Company } from "@/types/company/company";
import { CompanyFormData, UpdateCompanyFormData, useCompanyUpdateForm } from "@/schemas/company-schema";

interface CompanyFormProps {
    company?: Company | null;
    onSubmit: (data: UpdateCompanyFormData) => Promise<void>;
    onCancel: () => void;
    onSuccess?: () => void; // Callback para cuando se guarde exitosamente
}

export function CompanyForm({ company, onSubmit, onCancel, onSuccess }: CompanyFormProps) {
    const form = useCompanyUpdateForm(company || undefined);
    const [ isSubmitting, setIsSubmitting ] = useState(false);
    const [ initialValues, setInitialValues ] = useState<UpdateCompanyFormData | null>(null);
    const [ businessHoursChanged, setBusinessHoursChanged ] = useState(false);
    const [ socialMediaChanged, setSocialMediaChanged ] = useState(false);
    const [ isInitialized, setIsInitialized ] = useState(false);

    // Establecer valores por defecto cuando se edita
    useEffect(() => {
        if (company) {
            // Incluir TODOS los campos que vienen del backend
            const companyAny = company as any;
            const initialData: any = {
                id: company.id,
                name: company.name || "",
                businessName: company.businessName || "",
                ruc: company.ruc || "",
                address: company.address || "",
                district: company.district || "",
                city: company.city || "",
                province: company.province || "",
                country: company.country || "",
                phone: company.phone || "",
                email: company.email || "",
                website: company.website || "",
                description: company.description || "",
                logoNormal: company.logoNormal || companyAny.logos?.normal || "",
                logoHorizontal: company.logoHorizontal || companyAny.logos?.horizontal || "",
                logoReduced: company.logoReduced || companyAny.logos?.reduced || "",
                logoNegative: company.logoNegative || companyAny.logos?.negative || "",
                slogan: company.slogan || "",
                mission: company.mission || "",
                vision: company.vision || "",
                socialMedia: company.socialMedia || "",
                businessHours: company.businessHours ? (typeof company.businessHours === 'string' ? [] : company.businessHours) : [],
                taxCategory: company.taxCategory || "",
                economicActivity: company.economicActivity || "",
                isActive: Boolean(companyAny.isActive === true || companyAny.isActive === 1 || companyAny.isActive === '1')
            };

            console.log("🏢 CompanyForm - Datos iniciales:", initialData);

            // Establecer valores en el formulario
            Object.entries(initialData).forEach(([ field, value ]) => {
                form.setValue(field as keyof CompanyFormData, value as any);
            });

            // Usar un delay para asegurar que form.getValues() esté sincronizado
            setTimeout(() => {
                setInitialValues(initialData);
                setBusinessHoursChanged(false);
                setSocialMediaChanged(false);
                setIsInitialized(true);
                console.log("🏢 CompanyForm - Inicialización completada");
            }, 100);
        }
    }, [ company, form ]);

    // Efecto adicional para sincronizar el formulario cuando se inicializa
    useEffect(() => {
        if (isInitialized && initialValues) {
            // Verificar que todos los valores estén sincronizados
            const currentValues = form.getValues();
            let needsSync = false;

            Object.entries(initialValues).forEach(([ field, value ]) => {
                if (currentValues[ field as keyof CompanyFormData ] !== value) {
                    form.setValue(field as keyof CompanyFormData, value as any);
                    needsSync = true;
                }
            });

            if (needsSync) {
                console.log("🏢 CompanyForm - Sincronización adicional realizada");
            }
        }
    }, [ isInitialized, initialValues, form ]);

    // Efecto para escuchar cambios en el formulario
    useEffect(() => {
        if (!isInitialized || !initialValues) return;

        const subscription = form.watch((value, { name, type }) => {
            if (name && type === 'change') {
                console.log(`🏢 CompanyForm - Campo ${name} cambió a:`, value[ name as keyof CompanyFormData ]);

                // Comparar con el valor inicial para detectar cambios reales
                if (initialValues && initialValues[ name as keyof CompanyFormData ] !== value[ name as keyof CompanyFormData ]) {
                    console.log(`🏢 CompanyForm - Cambio confirmado en ${name}:`, {
                        inicial: initialValues[ name as keyof CompanyFormData ],
                        actual: value[ name as keyof CompanyFormData ]
                    });
                }

                // Forzar re-render para actualizar hasChanges
                form.trigger();
            }
        });

        return () => subscription.unsubscribe();
    }, [ form, isInitialized, initialValues ]);

    // Detectar si hay cambios en el formulario de manera eficiente
    const hasChanges = useMemo(() => {
        // Solo detectar cambios después de que se haya inicializado
        if (!initialValues || !isInitialized) {
            return false;
        }

        // Usar form.formState.isDirty para detectar cambios
        const formIsDirty = form.formState.isDirty;

        // También verificar cambios específicos en businessHours y socialMedia
        const finalResult = formIsDirty || businessHoursChanged || socialMediaChanged;

        console.log("🏢 CompanyForm - Estado de cambios:", {
            formIsDirty,
            businessHoursChanged,
            socialMediaChanged,
            finalResult,
            dirtyFields: form.formState.dirtyFields
        });

        return finalResult;
    }, [ initialValues, isInitialized, form.formState.isDirty, form.formState.dirtyFields, businessHoursChanged, socialMediaChanged ]);

    // Efecto para forzar la detección de cambios
    useEffect(() => {
        if (!isInitialized || !initialValues) return;

        // Forzar la validación del formulario para detectar cambios
        const timer = setInterval(() => {
            if (form.formState.isDirty !== hasChanges) {
                console.log("🏢 CompanyForm - Estado de cambios actualizado:", {
                    isDirty: form.formState.isDirty,
                    hasChanges
                });
            }
        }, 1000);

        return () => clearInterval(timer);
    }, [ isInitialized, initialValues, form.formState.isDirty, hasChanges ]);

    // Efecto para forzar la actualización del estado cuando se detecten cambios
    useEffect(() => {
        if (!isInitialized || !initialValues) return;

        // Forzar la actualización del estado del formulario
        const forceUpdate = () => {
            const currentValues = form.getValues();
            let hasRealChanges = false;

            Object.keys(currentValues).forEach(field => {
                const fieldKey = field as keyof CompanyFormData;
                if (initialValues[ fieldKey ] !== currentValues[ fieldKey ]) {
                    hasRealChanges = true;
                    console.log(`🏢 CompanyForm - Campo ${field} tiene cambios reales:`, {
                        inicial: initialValues[ fieldKey ],
                        actual: currentValues[ fieldKey ]
                    });
                }
            });

            if (hasRealChanges) {
                console.log("🏢 CompanyForm - Cambios reales detectados, forzando actualización");
                form.trigger();
            }
        };

        // Ejecutar después de un delay para asegurar que el formulario esté sincronizado
        const timer = setTimeout(forceUpdate, 500);

        return () => clearTimeout(timer);
    }, [ isInitialized, initialValues, form ]);

    // Callback para notificar cambios en businessHours
    const handleBusinessHoursChange = (value: any) => {
        // Asegurar que businessHours sea siempre un array
        const businessHoursArray = Array.isArray(value) ? value : [];
        form.setValue("businessHours", businessHoursArray);
        setBusinessHoursChanged(true);
        console.log("🏢 CompanyForm - businessHours cambiado:", businessHoursArray);
    };

    // Callback para notificar cambios en socialMedia
    const handleSocialMediaChange = (value: string) => {
        form.setValue("socialMedia", value);
        setSocialMediaChanged(true);
    };


    const handleSubmit = async (data: UpdateCompanyFormData) => {
        setIsSubmitting(true);
        try {
            console.log("🏢 CompanyForm - Enviando datos:", data);
            console.log("🏢 CompanyForm - Valores iniciales antes del envío:", initialValues);
            console.log("🏢 CompanyForm - Campos sucios:", form.formState.dirtyFields);

            await onSubmit(data);

            // Actualizar los valores iniciales con los datos enviados
            setInitialValues(data);

            // Resetear el formulario con los nuevos valores
            form.reset(data);

            // Resetear todos los estados de cambios
            setBusinessHoursChanged(false);
            setSocialMediaChanged(false);

            // Notificar éxito al componente padre
            onSuccess?.();

            console.log("🏢 CompanyForm - Formulario enviado exitosamente");
            console.log("🏢 CompanyForm - Nuevos valores iniciales:", data);
        } catch (error) {
            console.error("🏢 CompanyForm - Error en el formulario:", error);
            // No resetear el formulario en caso de error
            // Mantener los valores actuales para que el usuario pueda corregir
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <Tabs defaultValue="basic" className="w-full">
                <TabsList className="grid w-full grid-cols-5 bg-muted/50 p-1 rounded-xl">
                    <TabsTrigger
                        value="basic"
                        className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-lg transition-all"
                    >
                        <Building2 className="h-4 w-4 mr-2" />
                        Básico
                    </TabsTrigger>
                    <TabsTrigger
                        value="location"
                        className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-lg transition-all"
                    >
                        <MapPin className="h-4 w-4 mr-2" />
                        Ubicación
                    </TabsTrigger>
                    <TabsTrigger
                        value="branding"
                        className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-lg transition-all"
                    >
                        <ImageIcon className="h-4 w-4 mr-2" />
                        Branding
                    </TabsTrigger>
                    <TabsTrigger
                        value="corporate"
                        className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-lg transition-all"
                    >
                        <Target className="h-4 w-4 mr-2" />
                        Corporativo
                    </TabsTrigger>
                    <TabsTrigger
                        value="business"
                        className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-lg transition-all"
                    >
                        <FileText className="h-4 w-4 mr-2" />
                        Comercial
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="basic" className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Building2 className="h-5 w-5" />
                                Información Básica
                            </CardTitle>
                            <CardDescription>Datos fundamentales de la empresa</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="name">Nombre de la Empresa *</Label>
                                    <Input
                                        id="name"
                                        {...form.register("name")}
                                        placeholder="Ingresa el nombre de la empresa"
                                        className={form.formState.errors.name ? "border-red-500" : ""}
                                        required
                                    />
                                    {form.formState.errors.name && (
                                        <p className="text-sm text-red-500">
                                            {form.formState.errors.name.message}
                                        </p>
                                    )}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="businessName">Razón Social *</Label>
                                    <Input
                                        id="businessName"
                                        {...form.register("businessName")}
                                        placeholder="Razón social completa"
                                        className={form.formState.errors.businessName ? "border-red-500" : ""}
                                        required
                                    />
                                    {form.formState.errors.businessName && (
                                        <p className="text-sm text-red-500">
                                            {form.formState.errors.businessName.message}
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="ruc">RUC *</Label>
                                <Input
                                    id="ruc"
                                    {...form.register("ruc")}
                                    placeholder="Número de RUC"
                                    maxLength={11}
                                    className={form.formState.errors.ruc ? "border-red-500" : ""}
                                    required
                                />
                                {form.formState.errors.ruc && (
                                    <p className="text-sm text-red-500">
                                        {form.formState.errors.ruc.message}
                                    </p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="description">Descripción</Label>
                                <Textarea
                                    id="description"
                                    {...form.register("description")}
                                    placeholder="Descripción de la empresa"
                                    rows={3}
                                    className={form.formState.errors.description ? "border-red-500" : ""}
                                />
                                {form.formState.errors.description && (
                                    <p className="text-sm text-red-500">
                                        {form.formState.errors.description.message}
                                    </p>
                                )}
                            </div>

                            <div className="flex items-center space-x-2">
                                <Switch
                                    id="isActive"
                                    checked={form.watch("isActive")}
                                    onCheckedChange={(checked) => form.setValue("isActive", checked)}
                                />
                                <Label htmlFor="isActive">Empresa Activa</Label>
                                {form.watch("isActive") ? (
                                    <Badge variant="default">Activa</Badge>
                                ) : (
                                    <Badge variant="secondary">Inactiva</Badge>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Phone className="h-5 w-5" />
                                Información de Contacto
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="phone">Teléfono</Label>
                                    <Input
                                        id="phone"
                                        {...form.register("phone")}
                                        placeholder="+51 999 999 999"
                                        className={form.formState.errors.phone ? "border-red-500" : ""}
                                    />
                                    {form.formState.errors.phone && (
                                        <p className="text-sm text-red-500">
                                            {form.formState.errors.phone.message}
                                        </p>
                                    )}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="email">Email</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        {...form.register("email")}
                                        placeholder="contacto@empresa.com"
                                        className={form.formState.errors.email ? "border-red-500" : ""}
                                    />
                                    {form.formState.errors.email && (
                                        <p className="text-sm text-red-500">
                                            {form.formState.errors.email.message}
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="website">Sitio Web</Label>
                                <Input
                                    id="website"
                                    {...form.register("website")}
                                    placeholder="https://www.empresa.com"
                                    className={form.formState.errors.website ? "border-red-500" : ""}
                                />
                                {form.formState.errors.website && (
                                    <p className="text-sm text-red-500">
                                        {form.formState.errors.website.message}
                                    </p>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="location" className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <MapPin className="h-5 w-5" />
                                Ubicación
                            </CardTitle>
                            <CardDescription>Dirección y ubicación de la empresa</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="address">Dirección</Label>
                                <Input
                                    id="address"
                                    {...form.register("address")}
                                    placeholder="Av. Principal 123"
                                    className={form.formState.errors.address ? "border-red-500" : ""}
                                />
                                {form.formState.errors.address && (
                                    <p className="text-sm text-red-500">
                                        {form.formState.errors.address.message}
                                    </p>
                                )}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="district">Distrito</Label>
                                    <Input
                                        id="district"
                                        {...form.register("district")}
                                        placeholder="Miraflores"
                                        className={form.formState.errors.district ? "border-red-500" : ""}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="city">Ciudad</Label>
                                    <Input
                                        id="city"
                                        {...form.register("city")}
                                        placeholder="Lima"
                                        className={form.formState.errors.city ? "border-red-500" : ""}
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="province">Provincia</Label>
                                    <Input
                                        id="province"
                                        {...form.register("province")}
                                        placeholder="Lima"
                                        className={form.formState.errors.province ? "border-red-500" : ""}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="country">País</Label>
                                    <Input
                                        id="country"
                                        {...form.register("country")}
                                        placeholder="Perú"
                                        defaultValue="Perú"
                                        className={form.formState.errors.country ? "border-red-500" : ""}
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="branding" className="space-y-6">
                    <Card className="border-primary/20 shadow-lg">
                        <CardHeader className="bg-gradient-to-r from-primary/5 to-secondary/5">
                            <CardTitle className="flex items-center gap-2 text-primary">
                                <ImageIcon className="h-5 w-5" />
                                Branding y Logos
                            </CardTitle>
                            <CardDescription>Gestiona los diferentes tipos de logos de tu empresa con vista previa</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6 p-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <ImageUpload
                                    id="logoNormal"
                                    label="Logo Normal"
                                    value={form.watch("logoNormal") || ""}
                                    onChange={(value) => form.setValue("logoNormal", value)}
                                    logoType="normal"
                                    companyId={company?.id || 1}
                                />
                                <ImageUpload
                                    id="logoHorizontal"
                                    label="Logo Horizontal"
                                    value={form.watch("logoHorizontal") || ""}
                                    onChange={(value) => form.setValue("logoHorizontal", value)}
                                    logoType="horizontal"
                                    companyId={company?.id || 1}
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <ImageUpload
                                    id="logoReduced"
                                    label="Logo Reducido"
                                    value={form.watch("logoReduced") || ""}
                                    onChange={(value) => form.setValue("logoReduced", value)}
                                    logoType="reduced"
                                    companyId={company?.id || 1}
                                />
                                <ImageUpload
                                    id="logoNegative"
                                    label="Logo Negativo"
                                    value={form.watch("logoNegative") || ""}
                                    onChange={(value) => form.setValue("logoNegative", value)}
                                    logoType="negative"
                                    companyId={company?.id || 1}
                                />
                            </div>

                            <Separator className="bg-primary/20" />

                            <div className="space-y-2">
                                <Label htmlFor="slogan" className="text-base font-medium">
                                    Slogan
                                </Label>
                                <div className="relative">
                                    <Input
                                        id="slogan"
                                        {...form.register("slogan")}
                                        placeholder="El slogan de tu empresa"
                                        className="pl-4 pr-4 py-3 text-base border-primary/30 focus:border-primary focus:ring-primary/20"
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="corporate" className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Target className="h-5 w-5" />
                                Información Corporativa
                            </CardTitle>
                            <CardDescription>Misión, visión y redes sociales</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="mission">Misión</Label>
                                <Textarea
                                    id="mission"
                                    {...form.register("mission")}
                                    placeholder="La misión de tu empresa"
                                    rows={3}
                                    className={form.formState.errors.mission ? "border-red-500" : ""}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="vision">Visión</Label>
                                <Textarea
                                    id="vision"
                                    {...form.register("vision")}
                                    placeholder="La visión de tu empresa"
                                    rows={3}
                                    className={form.formState.errors.vision ? "border-red-500" : ""}
                                />
                            </div>

                            <SocialMediaForm
                                value={form.watch("socialMedia") || "{}"}
                                onChange={handleSocialMediaChange}
                            />
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="business" className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <FileText className="h-5 w-5" />
                                Información Comercial
                            </CardTitle>
                            <CardDescription>Datos comerciales y fiscales</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <BusinessHoursForm
                                value={form.watch("businessHours")}
                                onChange={handleBusinessHoursChange}
                            />

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="taxCategory">Categoría Tributaria</Label>
                                    <Input
                                        id="taxCategory"
                                        {...form.register("taxCategory")}
                                        placeholder="Régimen General"
                                        className={form.formState.errors.taxCategory ? "border-red-500" : ""}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="economicActivity">Actividad Económica</Label>
                                    <Input
                                        id="economicActivity"
                                        {...form.register("economicActivity")}
                                        placeholder="Servicios de consultoría"
                                        className={form.formState.errors.economicActivity ? "border-red-500" : ""}
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>

            {/* Indicador de campos modificados */}
            {hasChanges && (
                <div className="mt-6 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex items-center gap-2 text-sm text-blue-700">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        <span className="font-medium">Campos modificados:</span>
                        <span className="text-xs">
                            {(() => {
                                const changedFields = [];

                                // Agregar campos del formulario que han cambiado
                                if (form.formState.dirtyFields) {
                                    Object.keys(form.formState.dirtyFields).forEach(field => {
                                        if (form.formState.dirtyFields[ field as keyof CompanyFormData ]) {
                                            changedFields.push(field);
                                        }
                                    });
                                }

                                // Si no hay campos sucios pero el formulario está sucio, hacer comparación manual
                                if (changedFields.length === 0 && form.formState.isDirty && initialValues) {
                                    const currentValues = form.getValues();
                                    Object.keys(currentValues).forEach(field => {
                                        const fieldKey = field as keyof CompanyFormData;
                                        if (initialValues[ fieldKey ] !== currentValues[ fieldKey ]) {
                                            changedFields.push(field);
                                        }
                                    });
                                }

                                // Agregar campos especiales
                                if (businessHoursChanged) changedFields.push("Horarios de negocio");
                                if (socialMediaChanged) changedFields.push("Redes sociales");

                                return changedFields.length > 0 ? changedFields.join(", ") : "Campos del formulario";
                            })()} han sido modificado(s)
                        </span>
                    </div>

                    {/* Botón de debug temporal */}
                    <div className="mt-2">
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => {
                                console.log("🏢 CompanyForm - DEBUG - Estado actual:");
                                console.log("Valores del formulario:", form.getValues());
                                console.log("Valores iniciales:", initialValues);
                                console.log("Campos sucios:", form.formState.dirtyFields);
                                console.log("isDirty:", form.formState.isDirty);
                                console.log("Errores:", form.formState.errors);
                                console.log("isInitialized:", isInitialized);
                                console.log("hasChanges:", hasChanges);

                                // Comparación manual de campos
                                if (initialValues) {
                                    const currentValues = form.getValues();
                                    console.log("🏢 CompanyForm - Comparación manual de campos:");
                                    Object.keys(currentValues).forEach(field => {
                                        const fieldKey = field as keyof CompanyFormData;
                                        if (initialValues[ fieldKey ] !== currentValues[ fieldKey ]) {
                                            console.log(`  ${field}:`, {
                                                inicial: initialValues[ fieldKey ],
                                                actual: currentValues[ fieldKey ]
                                            });
                                        }
                                    });
                                }
                            }}
                        >
                            Debug Form
                        </Button>
                    </div>
                </div>
            )}


            {/* Barra de estado en la parte inferior */}
            <div className="mt-8 pt-4 border-t border-gray-100">
                {/* Barra de estado normal */}
                {hasChanges ? (
                    <div className="sticky bottom-0 left-0 right-0 bg-orange-50 border border-orange-200 rounded-lg p-4 shadow-md">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="flex items-center gap-2 text-sm text-orange-700">
                                    <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
                                    Hay cambios sin guardar en el formulario
                                </div>
                                {isSubmitting && (
                                    <div className="flex items-center gap-2 text-xs text-orange-600">
                                        <RefreshCw className="h-3 w-3 animate-spin" />
                                        Procesando...
                                    </div>
                                )}
                            </div>
                            <Button
                                type="submit"
                                disabled={isSubmitting || !hasChanges}
                                className="px-6 py-2 bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 shadow-lg disabled:opacity-50 transition-all duration-200"
                                onClick={() => {
                                    console.log("🏢 CompanyForm - Botón actualizar clickeado");
                                    console.log("🏢 CompanyForm - Valores actuales:", form.getValues());
                                    console.log("🏢 CompanyForm - Valores iniciales:", initialValues);
                                }}
                            >
                                {isSubmitting ? (
                                    <div className="flex items-center gap-2">
                                        <RefreshCw className="h-4 w-4 animate-spin" />
                                        Actualizando...
                                    </div>
                                ) : (
                                    "Actualizar Empresa"
                                )}
                            </Button>
                        </div>
                    </div>
                ) : initialValues && (
                    <div className="text-center py-4">
                        <div className="flex items-center justify-center gap-2 text-sm text-green-600">
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                            Todos los cambios están guardados
                        </div>
                        {isSubmitting && (
                            <div className="mt-2 text-xs text-blue-600">
                                <RefreshCw className="h-3 w-3 animate-spin inline mr-1" />
                                Guardando cambios...
                            </div>
                        )}
                    </div>
                )}
            </div>
        </form>
    );
}
