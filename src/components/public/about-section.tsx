"use client";

import { Target, Award, Globe } from "lucide-react";

export function AboutSection() {
    return (
        <section id="nosotros" className="py-20 bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
            <div className="container mx-auto px-6">
                <div className="max-w-4xl mx-auto">
                    <div className="text-center mb-12">
                        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
                            Sobre Nosotros
                        </h2>
                        <p className="text-xl text-gray-600 dark:text-gray-300">
                            Conectando comunidades, transformando vidas
                        </p>
                    </div>

                    <div className="prose prose-lg max-w-none dark:prose-invert">
                        <p className="text-gray-700 dark:text-gray-300 text-lg leading-relaxed mb-6">
                            Grupo Hemmy es un proveedor de servicios de internet líder en la región,
                            comprometido con llevar conectividad de alta calidad a cada hogar y empresa.
                            Con años de experiencia en el sector de telecomunicaciones, hemos construido
                            una infraestructura robusta y confiable.
                        </p>
                        <p className="text-gray-700 dark:text-gray-300 text-lg leading-relaxed mb-8">
                            Nuestra misión es democratizar el acceso a internet de alta velocidad,
                            facilitando que personas y empresas alcancen su máximo potencial a través
                            de la tecnología y la conectividad.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
                        <div className="text-center p-6 rounded-xl bg-white dark:bg-gray-800 shadow-lg">
                            <Target className="w-12 h-12 text-blue-600 dark:text-blue-400 mx-auto mb-4" />
                            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                                Nuestra Misión
                            </h3>
                            <p className="text-gray-600 dark:text-gray-300">
                                Conectar a cada hogar con internet de alta velocidad, facilitando el acceso
                                a oportunidades digitales.
                            </p>
                        </div>

                        <div className="text-center p-6 rounded-xl bg-white dark:bg-gray-800 shadow-lg">
                            <Award className="w-12 h-12 text-blue-600 dark:text-blue-400 mx-auto mb-4" />
                            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                                Nuestra Visión
                            </h3>
                            <p className="text-gray-600 dark:text-gray-300">
                                Ser el proveedor de internet más confiable y preferido en nuestra región,
                                reconocido por la excelencia en servicio.
                            </p>
                        </div>

                        <div className="text-center p-6 rounded-xl bg-white dark:bg-gray-800 shadow-lg">
                            <Globe className="w-12 h-12 text-blue-600 dark:text-blue-400 mx-auto mb-4" />
                            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                                Nuestros Valores
                            </h3>
                            <p className="text-gray-600 dark:text-gray-300">
                                Compromiso, innovación, transparencia y atención al cliente son los pilares
                                que guían nuestro trabajo diario.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

