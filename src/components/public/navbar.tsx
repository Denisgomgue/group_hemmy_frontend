"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Wifi, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";

export function Navbar() {
    const [ isScrolled, setIsScrolled ] = useState(false);
    const [ isMobileMenuOpen, setIsMobileMenuOpen ] = useState(false);
    const { user } = useAuth();

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <nav
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled
                    ? "bg-white dark:bg-gray-900 shadow-lg"
                    : "bg-transparent"
                }`}
        >
            <div className="container mx-auto px-6">
                <div className="flex items-center justify-between h-20">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2">
                        <Wifi className={`w-8 h-8 ${isScrolled ? "text-blue-600" : "text-white"}`} />
                        <span
                            className={`text-xl font-bold ${isScrolled ? "text-gray-900 dark:text-white" : "text-white"
                                }`}
                        >
                            Grupo Hemmy
                        </span>
                    </Link>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex items-center gap-8">
                        <Link
                            href="#planes"
                            className={`font-medium transition-colors ${isScrolled
                                    ? "text-gray-700 dark:text-gray-300 hover:text-blue-600"
                                    : "text-white/90 hover:text-white"
                                }`}
                        >
                            Planes
                        </Link>
                        <Link
                            href="#nosotros"
                            className={`font-medium transition-colors ${isScrolled
                                    ? "text-gray-700 dark:text-gray-300 hover:text-blue-600"
                                    : "text-white/90 hover:text-white"
                                }`}
                        >
                            Nosotros
                        </Link>
                        <Link
                            href="#contacto"
                            className={`font-medium transition-colors ${isScrolled
                                    ? "text-gray-700 dark:text-gray-300 hover:text-blue-600"
                                    : "text-white/90 hover:text-white"
                                }`}
                        >
                            Contacto
                        </Link>
                        <Link href={user ? "/dashboard" : "/login"}>
                            <Button
                                className={
                                    isScrolled
                                        ? "bg-blue-600 hover:bg-blue-700"
                                        : "bg-white text-blue-600 hover:bg-blue-50"
                                }
                            >
                                {user ? "Panel" : "Iniciar Sesión"}
                            </Button>
                        </Link>
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        className={`md:hidden ${isScrolled ? "text-gray-900" : "text-white"}`}
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    >
                        {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>
                </div>

                {/* Mobile Menu */}
                {isMobileMenuOpen && (
                    <div className="md:hidden py-4 border-t border-gray-200 dark:border-gray-700">
                        <div className="flex flex-col gap-4">
                            <Link
                                href="#planes"
                                className="font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600"
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                Planes
                            </Link>
                            <Link
                                href="#nosotros"
                                className="font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600"
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                Nosotros
                            </Link>
                            <Link
                                href="#contacto"
                                className="font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600"
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                Contacto
                            </Link>
                            <Link href={user ? "/dashboard" : "/login"}>
                                <Button className="w-full bg-blue-600 hover:bg-blue-700">
                                    {user ? "Panel" : "Iniciar Sesión"}
                                </Button>
                            </Link>
                        </div>
                    </div>
                )}
            </div>
        </nav>
    );
}


