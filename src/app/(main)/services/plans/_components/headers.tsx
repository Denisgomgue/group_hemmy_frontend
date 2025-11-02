"use client";

import { Plan } from "@/types/plan";

export const headers = [
    {
        key: "id",
        label: "ID",
        render: (value: string, item: Plan) => {
            return <span className="font-medium">{item.id}</span>;
        },
    },
    {
        key: "name",
        label: "Nombre",
        render: (value: string, item: Plan) => {
            return <span className="font-medium">{item.name}</span>;
        },
    },
    {
        key: "service",
        label: "Servicio",
        render: (value: string, item: Plan) => {
            return item.service?.name || '-';
        },
    },
    {
        key: "speedMbps",
        label: "Velocidad",
        render: (value: string, item: Plan) => {
            return item.speedMbps ? `${item.speedMbps} Mbps` : '-';
        },
    },
    {
        key: "price",
        label: "Precio",
        render: (value: string, item: Plan) => {
            const price = item.price;
            return `S/ ${typeof price === 'number' ? price.toFixed(2) : price}`;
        },
    },
    {
        key: "type",
        label: "Tipo Web",
        render: (value: string, item: Plan) => {
            return item.type ? 'Web' : 'Normal';
        },
    },
    {
        key: "isActive",
        label: "Estado",
        render: (value: string, item: Plan) => {
            return item.isActive ? 'Activo' : 'Inactivo';
        },
    },
];
