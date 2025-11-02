"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Bot, Send, X, Minimize2, Maximize2, User, Mic, MicOff, Volume2, VolumeX } from "lucide-react"
import { cn } from "@/lib/utils"
import { useMutation } from "@tanstack/react-query"
import axios from "@/lib/axios"

interface Message {
    id: string
    role: "user" | "assistant"
    content: string
    timestamp: Date
}

interface ChatBotResponse {
    response: string
    data?: any
}

export function FloatingChatBot() {
    const [ isOpen, setIsOpen ] = useState(false)
    const [ isMinimized, setIsMinimized ] = useState(false)
    const [ messages, setMessages ] = useState<Message[]>([
        {
            id: "welcome",
            role: "assistant",
            content: "¡Hola! 👋 Soy Rimi, tu asistente virtual de Grupo Hemmy. Puedo ayudarte con información sobre clientes, pagos, dispositivos, empleados y más. ¿En qué puedo ayudarte hoy?",
            timestamp: new Date()
        }
    ])
    const [ input, setInput ] = useState("")
    const [ isListening, setIsListening ] = useState(false)
    const [ isSpeaking, setIsSpeaking ] = useState(false)
    const [ voiceEnabled, setVoiceEnabled ] = useState(true)
    const scrollAreaRef = useRef<HTMLDivElement>(null)
    const recognitionRef = useRef<any>(null)
    const synthRef = useRef<SpeechSynthesis | null>(null)
    const isListeningRef = useRef(false) // Para mantener el estado actualizado en los callbacks

    // Inicializar síntesis de voz
    useEffect(() => {
        if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
            synthRef.current = window.speechSynthesis
        }
    }, [])

    // Inicializar reconocimiento de voz
    useEffect(() => {
        if (typeof window !== 'undefined' && ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
            const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition
            recognitionRef.current = new SpeechRecognition()
            recognitionRef.current.lang = 'es-ES'
            recognitionRef.current.continuous = true  // Mantener escuchando
            recognitionRef.current.interimResults = true  // Mostrar resultados parciales
            recognitionRef.current.maxAlternatives = 1

            recognitionRef.current.onresult = (event: any) => {
                let transcript = ''

                // Obtener todos los resultados
                for (let i = 0; i < event.results.length; i++) {
                    transcript += event.results[ i ][ 0 ].transcript
                }

                setInput(transcript)
            }

            recognitionRef.current.onerror = (event: any) => {
                console.error('Error de reconocimiento de voz:', event.error)

                // Manejar errores específicos
                switch (event.error) {
                    case 'no-speech':
                        // No hubo habla, continuar
                        return
                    case 'network':
                        // Error de red, intentar reconectar
                        console.log('Error de red en reconocimiento de voz, reintentando...')
                        setTimeout(() => {
                            if (isListeningRef.current && recognitionRef.current) {
                                try {
                                    recognitionRef.current.start()
                                } catch (e) {
                                    console.log('No se pudo reconectar')
                                }
                            }
                        }, 1000)
                        return
                    case 'not-allowed':
                        alert('Permisos de micrófono denegados. Por favor, permite el acceso al micrófono.')
                        setIsListening(false)
                        isListeningRef.current = false
                        break
                    case 'service-not-allowed':
                        alert('Servicio de reconocimiento no disponible. Intenta en HTTPS o localhost.')
                        setIsListening(false)
                        isListeningRef.current = false
                        break
                    default:
                        if (event.error !== 'aborted') {
                            setIsListening(false)
                            isListeningRef.current = false
                        }
                }
            }

            recognitionRef.current.onend = () => {
                // Si aún debe estar escuchando (usando ref para evitar stale state), reiniciar
                if (isListeningRef.current && recognitionRef.current) {
                    try {
                        recognitionRef.current.start()
                    } catch (error) {
                        console.log('No se pudo reiniciar el reconocimiento')
                        setIsListening(false)
                        isListeningRef.current = false
                    }
                } else {
                    setIsListening(false)
                    isListeningRef.current = false
                }
            }
        }
    }, [])

    // Función para leer texto en voz alta
    const speakText = (text: string) => {
        if (!synthRef.current || !voiceEnabled) return

        // Cancelar cualquier lectura anterior
        synthRef.current.cancel()

        // Limpiar markdown y emojis para mejor lectura
        const cleanText = text
            .replace(/[*_~`#]/g, '') // Eliminar markdown
            .replace(/[📊💰📦👥📋🗺️✅⚠️🔍]/g, '') // Eliminar emojis comunes
            .replace(/\n+/g, '. ') // Reemplazar saltos de línea con pausas

        const utterance = new SpeechSynthesisUtterance(cleanText)
        utterance.lang = 'es-ES'
        utterance.rate = 1.0
        utterance.pitch = 1.0

        utterance.onstart = () => setIsSpeaking(true)
        utterance.onend = () => setIsSpeaking(false)
        utterance.onerror = () => setIsSpeaking(false)

        synthRef.current.speak(utterance)
    }

    // Función para iniciar/detener reconocimiento de voz
    const toggleListening = () => {
        if (!recognitionRef.current) {
            alert('Tu navegador no soporta reconocimiento de voz. Intenta usar Chrome o Edge.')
            return
        }

        if (isListening) {
            // Detener el reconocimiento
            try {
                isListeningRef.current = false
                recognitionRef.current.stop()
                setIsListening(false)
            } catch (error) {
                console.error('Error al detener reconocimiento de voz:', error)
                isListeningRef.current = false
                setIsListening(false)
            }
        } else {
            // Iniciar el reconocimiento
            try {
                setInput('') // Limpiar input anterior
                isListeningRef.current = true
                recognitionRef.current.start()
                setIsListening(true)
            } catch (error) {
                console.error('Error al iniciar reconocimiento de voz:', error)
                // Si ya está corriendo, detenerlo primero
                if (error instanceof Error && error.message.includes('already started')) {
                    recognitionRef.current.stop()
                    isListeningRef.current = false
                    setTimeout(() => {
                        try {
                            isListeningRef.current = true
                            recognitionRef.current.start()
                            setIsListening(true)
                        } catch (e) {
                            console.error('No se pudo iniciar:', e)
                            isListeningRef.current = false
                        }
                    }, 100)
                } else {
                    isListeningRef.current = false
                }
            }
        }
    }

    // Función para detener la lectura
    const stopSpeaking = () => {
        if (synthRef.current) {
            synthRef.current.cancel()
            setIsSpeaking(false)
        }
    }

    // Mutation para enviar mensaje al bot
    const { mutate: sendMessage, isPending } = useMutation({
        mutationFn: async (query: string) => {
            const response = await axios.post<ChatBotResponse>("/chatbot/query", { query })
            return response.data
        },
        onSuccess: (data, query) => {
            // Agregar mensaje del usuario
            const userMessage: Message = {
                id: Date.now().toString(),
                role: "user",
                content: query,
                timestamp: new Date()
            }

            // Agregar respuesta del bot
            const botMessage: Message = {
                id: (Date.now() + 1).toString(),
                role: "assistant",
                content: data.response,
                timestamp: new Date()
            }

            setMessages(prev => [ ...prev, userMessage, botMessage ])
            setInput("")

            // Leer respuesta en voz alta
            speakText(data.response)
        },
        onError: () => {
            const errorMessage: Message = {
                id: Date.now().toString(),
                role: "assistant",
                content: "Lo siento, hubo un error al procesar tu consulta. Por favor, intenta de nuevo.",
                timestamp: new Date()
            }
            setMessages(prev => [ ...prev, errorMessage ])
            speakText("Lo siento, hubo un error al procesar tu consulta. Por favor, intenta de nuevo.")
        }
    })

    const handleSendMessage = () => {
        if (!input.trim() || isPending) return
        sendMessage(input.trim())
    }

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault()
            handleSendMessage()
        }
    }

    useEffect(() => {
        if (scrollAreaRef.current) {
            scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight
        }
    }, [ messages ])

    if (!isOpen) {
        return (
            <Button
                onClick={() => setIsOpen(true)}
                size="icon"
                className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg hover:scale-110 transition-transform z-50 overflow-hidden"
            >
                <img
                    src="/bot/head_Rimi.png"
                    alt="Rimi - Asistente Hemmy"
                    className="h-full w-full object-cover"
                />
            </Button>
        )
    }

    return (
        <Card
            className={cn(
                "fixed bottom-6 right-6 w-96 shadow-2xl z-50 transition-all duration-300",
                isMinimized ? "h-16" : "h-[600px]"
            )}
        >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3 border-b">
                <div className="flex items-center space-x-2">
                    <Avatar className="h-8 w-8">
                        <AvatarImage src="/bot/head_Rimi.png" alt="Rimi" />
                        <AvatarFallback>
                            <Bot className="h-5 w-5 text-primary-foreground" />
                        </AvatarFallback>
                    </Avatar>
                    <div>
                        <CardTitle className="text-sm font-semibold">Rimi - Asistente Hemmy</CardTitle>
                        <CardDescription className="text-xs">
                            {isPending ? "Escribiendo..." : isSpeaking ? "Hablando..." : isListening ? "Escuchando..." : "En línea"}
                        </CardDescription>
                    </div>
                </div>
                <div className="flex items-center space-x-1">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => setVoiceEnabled(!voiceEnabled)}
                        title={voiceEnabled ? "Desactivar voz" : "Activar voz"}
                    >
                        {voiceEnabled ? (
                            <Volume2 className="h-4 w-4" />
                        ) : (
                            <VolumeX className="h-4 w-4" />
                        )}
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => setIsMinimized(!isMinimized)}
                    >
                        {isMinimized ? (
                            <Maximize2 className="h-4 w-4" />
                        ) : (
                            <Minimize2 className="h-4 w-4" />
                        )}
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => setIsOpen(false)}
                    >
                        <X className="h-4 w-4" />
                    </Button>
                </div>
            </CardHeader>

            {!isMinimized && (
                <>
                    <CardContent className="p-0 h-[calc(600px-140px)]">
                        <ScrollArea className="h-full p-4" ref={scrollAreaRef}>
                            <div className="space-y-4">
                                {messages.map((message) => (
                                    <div
                                        key={message.id}
                                        className={cn(
                                            "flex gap-3",
                                            message.role === "user" ? "justify-end" : "justify-start"
                                        )}
                                    >
                                        {message.role === "assistant" && (
                                            <Avatar className="h-8 w-8 mt-1">
                                                <AvatarImage src="/bot/head_Rimi.png" alt="Rimi" />
                                                <AvatarFallback>
                                                    <Bot className="h-4 w-4 text-primary-foreground" />
                                                </AvatarFallback>
                                            </Avatar>
                                        )}
                                        <div
                                            className={cn(
                                                "rounded-lg px-4 py-2 max-w-[75%]",
                                                message.role === "user"
                                                    ? "bg-primary text-primary-foreground"
                                                    : "bg-muted"
                                            )}
                                        >
                                            <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                                            <p className="text-xs opacity-70 mt-1">
                                                {message.timestamp.toLocaleTimeString("es-PE", {
                                                    hour: "2-digit",
                                                    minute: "2-digit"
                                                })}
                                            </p>
                                        </div>
                                        {message.role === "user" && (
                                            <Avatar className="h-8 w-8 bg-secondary mt-1">
                                                <AvatarFallback>
                                                    <User className="h-4 w-4" />
                                                </AvatarFallback>
                                            </Avatar>
                                        )}
                                    </div>
                                ))}
                                {isPending && (
                                    <div className="flex gap-3 justify-start">
                                        <Avatar className="h-8 w-8 mt-1">
                                            <AvatarImage src="/bot/head_Rimi.png" alt="Rimi" />
                                            <AvatarFallback>
                                                <Bot className="h-4 w-4 text-primary-foreground animate-pulse" />
                                            </AvatarFallback>
                                        </Avatar>
                                        <div className="rounded-lg px-4 py-2 bg-muted">
                                            <div className="flex space-x-2">
                                                <div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: "0ms" }} />
                                                <div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: "150ms" }} />
                                                <div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: "300ms" }} />
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </ScrollArea>
                    </CardContent>

                    <div className="border-t p-4">
                        <div className="flex gap-2">
                            <Input
                                placeholder={isListening ? "🎤 Escuchando... (Click en stop para finalizar)" : "Escribe tu pregunta o usa el micrófono..."}
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyPress={handleKeyPress}
                                disabled={isPending}
                                className={cn("flex-1", isListening && "border-red-500 border-2")}
                            />
                            <Button
                                onClick={toggleListening}
                                disabled={isPending || isSpeaking}
                                size="icon"
                                variant={isListening ? "destructive" : "outline"}
                                className={cn(isListening && "animate-pulse")}
                                title={isListening ? "Detener grabación (Click aquí cuando termines)" : "Iniciar grabación de voz"}
                            >
                                {isListening ? (
                                    <MicOff className="h-4 w-4" />
                                ) : (
                                    <Mic className="h-4 w-4" />
                                )}
                            </Button>
                            <Button
                                onClick={handleSendMessage}
                                disabled={!input.trim() || isPending || isListening}
                                size="icon"
                                title="Enviar mensaje"
                            >
                                <Send className="h-4 w-4" />
                            </Button>
                        </div>
                        <p className="text-xs text-muted-foreground mt-2">
                            {isListening ? (
                                <span className="text-red-500 font-semibold animate-pulse">● Grabando... Click en el botón rojo para detener</span>
                            ) : (
                                "Pregunta sobre clientes, pagos, dispositivos y más. 🎤 Click para grabar tu voz."
                            )}
                        </p>
                    </div>
                </>
            )}
        </Card>
    )
}

