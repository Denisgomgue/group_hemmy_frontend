"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { User } from "@/types/user";
import { Mail, Phone, FileText, Building2, User as UserIcon } from "lucide-react";
import { ActionsCell } from "./actions-cell";

interface UserCardProps {
    user: User;
}

export function UserCard({ user }: UserCardProps) {
    const displayName = user.actor?.displayName ||
        (user.actor?.person
            ? `${user.actor.person.firstName} ${user.actor.person.lastName}`.trim()
            : user.actor?.organization?.name) ||
        'Sin nombre';

    const email = user.actor?.person?.email || user.actor?.organization?.email;
    const phone = user.actor?.person?.phone || user.actor?.organization?.phone;
    const documentNumber = user.actor?.person?.documentNumber || user.actor?.organization?.taxId;
    const kind = user.actor?.kind;

    return (
        <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                    <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                            {kind === 'PERSON' ? (
                                <UserIcon className="h-5 w-5 text-blue-600" />
                            ) : (
                                <Building2 className="h-5 w-5 text-blue-600" />
                            )}
                            <h3 className="font-semibold text-lg">{displayName}</h3>
                        </div>
                        <Badge
                            variant="outline"
                            className={
                                user.isActive
                                    ? "bg-green-100 text-green-800 border-green-200"
                                    : "bg-red-100 text-red-800 border-red-200"
                            }
                        >
                            {user.isActive ? "Activo" : "Inactivo"}
                        </Badge>
                    </div>
                    <ActionsCell rowData={user} />
                </div>
            </CardHeader>
            <CardContent className="space-y-2">
                {email && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Mail className="h-4 w-4" />
                        <span>{email}</span>
                    </div>
                )}
                {phone && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Phone className="h-4 w-4" />
                        <span>{phone}</span>
                    </div>
                )}
                {documentNumber && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <FileText className="h-4 w-4" />
                        <span>{documentNumber}</span>
                    </div>
                )}
                <div className="pt-2 border-t">
                    <span className="text-xs text-muted-foreground">
                        ID: {user.id} • Creado: {new Date(user.created_at).toLocaleDateString('es-PE')}
                    </span>
                </div>
            </CardContent>
        </Card>
    );
}

