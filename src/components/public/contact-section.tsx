"use client";

import { Phone, Mail, MapPin, MessageCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

export function ContactSection() {
    return (
        <section id="contacto" className="py-20 bg-white dark:bg-gray-800">
            <div className="container mx-auto px-6">
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
                        Contáctanos
                    </h2>
                    <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                        Estamos aquí para ayudarte. Escríbenos y te responderemos lo antes posible.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
                    {/* Contact Info */}
                    <div className="space-y-6">
                        <Card>
                            <CardContent className="p-6">
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 rounded-lg bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                                        <Phone className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Teléfono</h3>
                                        <p className="text-gray-600 dark:text-gray-300">+51 999 999 999</p>
                                        <p className="text-gray-600 dark:text-gray-300">Lun - Dom: 24/7</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardContent className="p-6">
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 rounded-lg bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                                        <Mail className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Email</h3>
                                        <p className="text-gray-600 dark:text-gray-300">info@grupohemmy.com</p>
                                        <p className="text-gray-600 dark:text-gray-300">soporte@grupohemmy.com</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardContent className="p-6">
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 rounded-lg bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                                        <MapPin className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Oficina</h3>
                                        <p className="text-gray-600 dark:text-gray-300">
                                            Av. Principal 123<br />
                                            Lima, Perú
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Contact Form */}
                    <Card>
                        <CardContent className="p-6">
                            <form className="space-y-4">
                                <div>
                                    <Label htmlFor="name">Nombre Completo</Label>
                                    <Input id="name" placeholder="Juan Pérez" />
                                </div>
                                <div>
                                    <Label htmlFor="email">Email</Label>
                                    <Input id="email" type="email" placeholder="juan@example.com" />
                                </div>
                                <div>
                                    <Label htmlFor="phone">Teléfono</Label>
                                    <Input id="phone" type="tel" placeholder="+51 999 999 999" />
                                </div>
                                <div>
                                    <Label htmlFor="message">Mensaje</Label>
                                    <Textarea
                                        id="message"
                                        rows={5}
                                        placeholder="Cuéntanos en qué podemos ayudarte..."
                                    />
                                </div>
                                <Button type="submit" className="w-full" size="lg">
                                    <MessageCircle className="mr-2 w-5 h-5" />
                                    Enviar Mensaje
                                </Button>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </section>
    );
}

