"use client";

import { Check, Zap, Rocket, Crown } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const plans = [
    {
        name: "Plan Básico",
        speed: "50 Mbps",
        price: "S/. 79",
        period: "mes",
        icon: Zap,
        features: [
            "50 Mbps de velocidad",
            "Conexión ilimitada",
            "Soporte técnico 24/7",
            "Router WiFi incluido",
            "Sin costo de instalación",
            "Ideal para hasta 3 dispositivos"
        ],
        popular: false
    },
    {
        name: "Plan Estándar",
        speed: "100 Mbps",
        price: "S/. 129",
        period: "mes",
        icon: Rocket,
        features: [
            "100 Mbps de velocidad",
            "Conexión ilimitada",
            "Soporte técnico prioritario",
            "Router WiFi avanzado",
            "Instalación gratuita",
            "Ideal para hasta 6 dispositivos"
        ],
        popular: true
    },
    {
        name: "Plan Premium",
        speed: "200 Mbps",
        price: "S/. 199",
        period: "mes",
        icon: Crown,
        features: [
            "200 Mbps de velocidad",
            "Conexión ilimitada",
            "Soporte técnico VIP",
            "Router WiFi Premium",
            "Instalación y configuración incluida",
            "Ideal para hogares con muchos dispositivos",
            "IP estática disponible"
        ],
        popular: false
    }
];

export function PlansSection() {
    return (
        <section id="planes" className="py-20 bg-gray-50 dark:bg-gray-900">
            <div className="container mx-auto px-6">
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
                        Elige el Plan Perfecto
                    </h2>
                    <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                        Planes diseñados para satisfacer todas tus necesidades de conectividad
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                    {plans.map((plan) => {
                        const Icon = plan.icon;
                        return (
                            <Card
                                key={plan.name}
                                className={`relative overflow-hidden transition-all transform hover:scale-105 ${plan.popular
                                        ? "border-2 border-blue-500 shadow-2xl scale-105"
                                        : "hover:shadow-xl"
                                    }`}
                            >
                                {plan.popular && (
                                    <div className="absolute top-0 right-0 bg-blue-500 text-white px-4 py-1 text-sm font-semibold rounded-bl-lg">
                                        Más Popular
                                    </div>
                                )}
                                <CardHeader className="text-center pb-4">
                                    <div className="mx-auto mb-4 w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                                        <Icon className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                                    </div>
                                    <CardTitle className="text-2xl mb-2">{plan.name}</CardTitle>
                                    <div className="flex items-baseline justify-center gap-2">
                                        <span className="text-4xl font-bold text-gray-900 dark:text-white">
                                            {plan.price}
                                        </span>
                                        <span className="text-gray-600 dark:text-gray-400">/{plan.period}</span>
                                    </div>
                                    <CardDescription className="text-lg font-semibold text-blue-600 dark:text-blue-400 mt-2">
                                        {plan.speed}
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <ul className="space-y-3 mb-6">
                                        {plan.features.map((feature, index) => (
                                            <li key={index} className="flex items-start gap-3">
                                                <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                                                <span className="text-gray-700 dark:text-gray-300">{feature}</span>
                                            </li>
                                        ))}
                                    </ul>
                                    <Link href="/login" className="block">
                                        <Button
                                            className={`w-full ${plan.popular
                                                    ? "bg-blue-600 hover:bg-blue-700"
                                                    : "bg-gray-900 hover:bg-gray-800 dark:bg-gray-800"
                                                }`}
                                            size="lg"
                                        >
                                            Contratar Ahora
                                        </Button>
                                    </Link>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}

