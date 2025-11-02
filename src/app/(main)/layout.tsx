import type { Metadata } from "next"
import { Inter } from "next/font/google"
import Providers from "@/components/providers"
import { ClientLayoutWrapper } from "./client-layout-wrapper"

// Fallback para cuando Google Fonts no esté disponible
const inter = Inter({ 
    subsets: ["latin"],
    fallback: ['system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
    display: 'swap'
})

export const metadata: Metadata = {
    title: "Grupo Hemmy",
    description: "Pagina aministrativa de Grupo Hemmy",
}

export default function MainLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <Providers>
            <ClientLayoutWrapper>{children}</ClientLayoutWrapper>
        </Providers>
    )
}