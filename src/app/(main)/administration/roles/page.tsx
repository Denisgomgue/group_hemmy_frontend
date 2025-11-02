"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UserCog } from "lucide-react";

export default function RolesPage() {
    return (
        <div className="container mx-auto p-6 space-y-6">
            <div className="flex items-center gap-3">
                <UserCog className="h-8 w-8 text-purple-600" />
                <div>
                    <h1 className="text-3xl font-bold text-foreground">Gestión de Roles</h1>
                    <p className="text-muted-foreground">
                        Administra los roles y permisos del sistema
                    </p>
                </div>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Roles</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground">
                        Aquí se mostrará la lista de roles y las opciones de gestión.
                    </p>
                </CardContent>
            </Card>
        </div>
    );
}
