"use client";

import { Wifi, Shield, Clock, Users, HeadphonesIcon, TrendingUp } from "lucide-react";

const features = [
    {
        icon: Wifi,
        title: "Fibra Óptica",
        description: "Infraestructura de última generación con tecnología de fibra óptica para una conexión ultrarrápida y estable."
    },
    {
        icon: Shield,
        title: "Seguridad Avanzada",
        description: "Protección integral con firewall integrado y sistemas de seguridad que mantienen tu red segura 24/7."
    },
    {
        icon: Clock,
        title: "Instalación Rápida",
        description: "Nuestro equipo técnico puede instalar tu servicio en menos de 24 horas, con cita previa."
    },
    {
        icon: Users,
        title: "Atención Personalizada",
        description: "Equipo de atención al cliente dedicado a resolver tus dudas y problemas de manera rápida y eficiente."
    },
    {
        icon: HeadphonesIcon,
        title: "Soporte 24/7",
        description: "Disponibles las 24 horas del día, los 7 días de la semana para ayudarte cuando lo necesites."
    },
    {
        icon: TrendingUp,
        title: "Sin Cortes",
        description: "99.9% de disponibilidad garantizada. Conectividad constante para tu trabajo, estudios y entretenimiento."
    }
];

export function FeaturesSection() {
    return (
        <section className="py-20 bg-white dark:bg-gray-800">
            <div className="container mx-auto px-6">
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
                        ¿Por Qué Elegirnos?
                    </h2>
                    <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                        Somos más que un proveedor de internet, somos tu aliado en conectividad
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
                    {features.map((feature, index) => {
                        const Icon = feature.icon;
                        return (
                            <div
                                key={index}
                                className="p-6 rounded-xl bg-gray-50 dark:bg-gray-900 hover:shadow-lg transition-all border border-gray-200 dark:border-gray-700"
                            >
                                <div className="w-12 h-12 rounded-lg bg-blue-100 dark:bg-blue-900 flex items-center justify-center mb-4">
                                    <Icon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                                </div>
                                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                                    {feature.title}
                                </h3>
                                <p className="text-gray-600 dark:text-gray-300">
                                    {feature.description}
                                </p>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}

