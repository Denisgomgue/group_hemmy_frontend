"use client";

import Link from "next/link";
import { Wifi, Facebook, Twitter, Instagram, Linkedin } from "lucide-react";

export function Footer() {
    return (
        <footer className="bg-gray-900 text-gray-300">
            <div className="container mx-auto px-6 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* Company Info */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2">
                            <Wifi className="w-8 h-8 text-blue-400" />
                            <span className="text-xl font-bold text-white">Grupo Hemmy</span>
                        </div>
                        <p className="text-sm">
                            Conectando comunidades con internet de alta velocidad y servicio confiable.
                        </p>
                        <div className="flex gap-4">
                            <a href="#" className="hover:text-blue-400 transition-colors">
                                <Facebook className="w-5 h-5" />
                            </a>
                            <a href="#" className="hover:text-blue-400 transition-colors">
                                <Twitter className="w-5 h-5" />
                            </a>
                            <a href="#" className="hover:text-blue-400 transition-colors">
                                <Instagram className="w-5 h-5" />
                            </a>
                            <a href="#" className="hover:text-blue-400 transition-colors">
                                <Linkedin className="w-5 h-5" />
                            </a>
                        </div>
                    </div>

                    {/* Services */}
                    <div>
                        <h3 className="text-white font-semibold mb-4">Servicios</h3>
                        <ul className="space-y-2 text-sm">
                            <li>
                                <Link href="#planes" className="hover:text-blue-400 transition-colors">
                                    Planes de Internet
                                </Link>
                            </li>
                            <li>
                                <Link href="#" className="hover:text-blue-400 transition-colors">
                                    Internet Empresarial
                                </Link>
                            </li>
                            <li>
                                <Link href="#" className="hover:text-blue-400 transition-colors">
                                    Soporte Técnico
                                </Link>
                            </li>
                            <li>
                                <Link href="#" className="hover:text-blue-400 transition-colors">
                                    Instalación
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Company */}
                    <div>
                        <h3 className="text-white font-semibold mb-4">Empresa</h3>
                        <ul className="space-y-2 text-sm">
                            <li>
                                <Link href="#" className="hover:text-blue-400 transition-colors">
                                    Sobre Nosotros
                                </Link>
                            </li>
                            <li>
                                <Link href="#" className="hover:text-blue-400 transition-colors">
                                    Noticias
                                </Link>
                            </li>
                            <li>
                                <Link href="#" className="hover:text-blue-400 transition-colors">
                                    Carreras
                                </Link>
                            </li>
                            <li>
                                <Link href="/login" className="hover:text-blue-400 transition-colors">
                                    Portal Cliente
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Support */}
                    <div>
                        <h3 className="text-white font-semibold mb-4">Soporte</h3>
                        <ul className="space-y-2 text-sm">
                            <li>
                                <Link href="#contacto" className="hover:text-blue-400 transition-colors">
                                    Contacto
                                </Link>
                            </li>
                            <li>
                                <Link href="#" className="hover:text-blue-400 transition-colors">
                                    Preguntas Frecuentes
                                </Link>
                            </li>
                            <li>
                                <Link href="#" className="hover:text-blue-400 transition-colors">
                                    Términos y Condiciones
                                </Link>
                            </li>
                            <li>
                                <Link href="#" className="hover:text-blue-400 transition-colors">
                                    Política de Privacidad
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-gray-800 mt-12 pt-8 text-center text-sm">
                    <p>© {new Date().getFullYear()} Grupo Hemmy. Todos los derechos reservados.</p>
                </div>
            </div>
        </footer>
    );
}

