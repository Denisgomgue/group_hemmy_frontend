"use client";

import Link from "next/link";
import { Wifi, ArrowRight, PlayCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export function HeroSection() {
    return (
        <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-900 text-white overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10">
                <div className="absolute inset-0" style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E% defined/g%3E%3C/svg%3E")`,
                }}></div>
            </div>

            {/* Animated Circles */}
            <div className="absolute top-20 left-10 w-72 h-72 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
            <div className="absolute top-40 right-10 w-72 h-72 bg-purple-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
            <div className="absolute bottom-20 left-1/2 w-72 h-72 bg-pink-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>

            <div className="relative z-10 container mx-auto px-6 py-20 text-center">
                <div className="max-w-4xl mx-auto space-y-8">
                    {/* Badge */}
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20">
                        <Wifi className="w-5 h-5" />
                        <span className="text-sm font-medium">Internet de Alta Velocidad</span>
                    </div>

                    {/* Main Heading */}
                    <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight">
                        Internet Rápido y{" "}
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-orange-300">
                            Confiable
                        </span>
                        {" "}para Tu Hogar
                    </h1>

                    {/* Subheading */}
                    <p className="text-xl md:text-2xl text-blue-100 max-w-2xl mx-auto">
                        Conectamos tu vida digital con la mejor infraestructura de fibra óptica.
                        Velocidades ultrarrápidas para trabajar, estudiar y entretenerte.
                    </p>

                    {/* CTA Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
                        <Link href="/login">
                            <Button
                                size="lg"
                                className="bg-white text-blue-600 hover:bg-blue-50 text-lg px-8 py-6 rounded-full shadow-xl hover:shadow-2xl transition-all transform hover:scale-105"
                            >
                                Contratar Ahora
                                <ArrowRight className="ml-2 w-5 h-5" />
                            </Button>
                        </Link>
                        <Button
                            variant="outline"
                            size="lg"
                            className="border-2 border-white text-white hover:bg-white/10 text-lg px-8 py-6 rounded-full backdrop-blur-sm"
                        >
                            <PlayCircle className="mr-2 w-5 h-5" />
                            Ver Planes
                        </Button>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-16 mt-16 border-t border-white/20">
                        <div>
                            <div className="text-4xl font-bold mb-2">99.9%</div>
                            <div className="text-blue-200">Uptime Garantizado</div>
                        </div>
                        <div>
                            <div className="text-4xl font-bold mb-2">24/7</div>
                            <div className="text-blue-200">Soporte Técnico</div>
                        </div>
                        <div>
                            <div className="text-4xl font-bold mb-2">10K+</div>
                            <div className="text-blue-200">Clientes Satisfechos</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Scroll Indicator */}
            <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce">
                <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
                    <div className="w-1 h-3 bg-white/50 rounded-full mt-2"></div>
                </div>
            </div>
        </section>
    );
}

