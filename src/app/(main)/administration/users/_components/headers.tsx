"use client";

import { Badge } from "@/components/ui/badge";
import { User } from "@/types/user";

export const headers = [
    {
        key: "id",
        label: "ID",
        render: (value: string, item: User) => {
            return <span className="font-medium">{item.id}</span>;
        },
    },
    {
        key: "displayName",
        label: "Nombre",
        render: (value: string, item: User) => {
            const displayName = item.actor?.displayName ||
                (item.actor?.person
                    ? `${item.actor.person.firstName} ${item.actor.person.lastName}`.trim()
                    : item.actor?.organization?.name) ||
                '-';
            return displayName;
        },
    },
    {
        key: "email",
        label: "Email",
        render: (value: string, item: User) => {
            const email = item.actor?.person?.email ||
                item.actor?.organization?.email ||
                '-';
            return email;
        },
    },
    {
        key: "phone",
        label: "Teléfono",
        render: (value: string, item: User) => {
            const phone = item.actor?.person?.phone ||
                item.actor?.organization?.phone ||
                '-';
            return phone;
        },
    },
    {
        key: "documentNumber",
        label: "Documento",
        render: (value: string, item: User) => {
            const docNumber = item.actor?.person?.documentNumber ||
                item.actor?.organization?.taxId ||
                '-';
            return docNumber;
        },
    },
    {
        key: "kind",
        label: "Tipo",
        render: (value: string, item: User) => {
            const kind = item.actor?.kind;
            return (
                <Badge variant="outline">
                    {kind === 'PERSON' ? 'Persona' : kind === 'ORGANIZATION' ? 'Organización' : '-'}
                </Badge>
            );
        },
    },
    {
        key: "isActive",
        label: "Estado",
        render: (value: string, item: User) => {
            const isActive = item.isActive;
            return (
                <Badge
                    variant="outline"
                    className={
                        isActive
                            ? "bg-green-100 text-green-800 border-green-200"
                            : "bg-red-100 text-red-800 border-red-200"
                    }
                >
                    {isActive ? "Activo" : "Inactivo"}
                </Badge>
            );
        },
    },
    {
        key: "created_at",
        label: "Fecha Creación",
        render: (value: string, item: User) => {
            const date = new Date(item.created_at);
            return date.toLocaleDateString('es-PE');
        },
    },
];
