"use client";

import * as React from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Trash2, Package, Wifi } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface DeleteConfirmationDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (forceDelete?: boolean) => void;
    title: string;
    description: string;
    itemName: string;
    dependencies?: {
        devices?: Array<{
            id: number;
            serialNumber: string;
            brand: string;
            model: string;
            status: string;
        }>;
        installations?: Array<{
            id: number;
            reference: string;
            clientName: string;
            clientLastName: string;
        }>;
    };
    isLoading?: boolean;
}

export function DeleteConfirmationDialog({
    isOpen,
    onClose,
    onConfirm,
    title,
    description,
    itemName,
    dependencies,
    isLoading = false
}: DeleteConfirmationDialogProps) {
    const [ forceDelete, setForceDelete ] = React.useState(false);

    const hasDependencies = dependencies && (
        (dependencies.devices && dependencies.devices.length > 0) ||
        (dependencies.installations && dependencies.installations.length > 0)
    );

    const handleConfirm = () => {
        onConfirm(hasDependencies ? forceDelete : undefined);
    };

    const handleClose = () => {
        setForceDelete(false);
        onClose();
    };

    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <AlertTriangle className="h-5 w-5 text-destructive" />
                        {title}
                    </DialogTitle>
                    <DialogDescription>
                        {description}
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4">
                    {/* Información del elemento a eliminar */}
                    <div className="p-3 bg-muted rounded-lg">
                        <div className="flex items-center gap-2">
                            <Trash2 className="h-4 w-4 text-muted-foreground" />
                            <span className="font-medium">{itemName}</span>
                        </div>
                    </div>

                    {/* Dependencias encontradas */}
                    {hasDependencies && (
                        <div className="space-y-3">
                            <div className="flex items-center gap-2 text-sm font-medium text-destructive">
                                <AlertTriangle className="h-4 w-4" />
                                Elementos asociados encontrados:
                            </div>

                            {/* Equipos asignados */}
                            {dependencies.devices && dependencies.devices.length > 0 && (
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2 text-sm font-medium">
                                        <Wifi className="h-4 w-4 text-blue-500" />
                                        Equipos asignados ({dependencies.devices.length})
                                    </div>
                                    <div className="max-h-32 overflow-y-auto space-y-1">
                                        {dependencies.devices.map((device) => (
                                            <div key={device.id} className="flex items-center justify-between p-2 bg-muted rounded text-xs">
                                                <div>
                                                    <span className="font-medium">{device.brand} {device.model}</span>
                                                    <div className="text-muted-foreground">
                                                        SN: {device.serialNumber}
                                                    </div>
                                                </div>
                                                <Badge variant="secondary" className="text-xs">
                                                    {device.status}
                                                </Badge>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Instalaciones asociadas */}
                            {dependencies.installations && dependencies.installations.length > 0 && (
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2 text-sm font-medium">
                                        <Package className="h-4 w-4 text-green-500" />
                                        Instalaciones asociadas ({dependencies.installations.length})
                                    </div>
                                    <div className="max-h-32 overflow-y-auto space-y-1">
                                        {dependencies.installations.map((installation) => (
                                            <div key={installation.id} className="p-2 bg-muted rounded text-xs">
                                                <div className="font-medium">
                                                    {installation.reference || `Instalación #${installation.id}`}
                                                </div>
                                                <div className="text-muted-foreground">
                                                    Cliente: {installation.clientName} {installation.clientLastName}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Opción de eliminación forzada */}
                            <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
                                <div className="flex items-start gap-2">
                                    <input
                                        type="checkbox"
                                        id="forceDelete"
                                        checked={forceDelete}
                                        onChange={(e) => setForceDelete(e.target.checked)}
                                        className="mt-1"
                                    />
                                    <label htmlFor="forceDelete" className="text-sm">
                                        <span className="font-medium text-destructive">
                                            Eliminar elementos asociados también
                                        </span>
                                        <div className="text-xs text-muted-foreground mt-1">
                                            {dependencies.devices && dependencies.devices.length > 0 && (
                                                <div>• Los equipos se pondrán en estado STOCK</div>
                                            )}
                                            {dependencies.installations && dependencies.installations.length > 0 && (
                                                <div>• Las instalaciones se eliminarán completamente</div>
                                            )}
                                        </div>
                                    </label>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                <DialogFooter className="gap-2">
                    <Button
                        variant="outline"
                        onClick={handleClose}
                        disabled={isLoading}
                    >
                        Cancelar
                    </Button>
                    <Button
                        variant="destructive"
                        onClick={handleConfirm}
                        disabled={isLoading}
                        className="gap-2"
                    >
                        {isLoading ? (
                            <>
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                                Eliminando...
                            </>
                        ) : (
                            <>
                                <Trash2 className="h-4 w-4" />
                                {hasDependencies && !forceDelete ? "Eliminar solo este elemento" : "Eliminar"}
                            </>
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
