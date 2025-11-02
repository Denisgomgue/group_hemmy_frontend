import { Toaster } from "@/components/ui/toaster";

/**
 * Layout para páginas de autenticación
 * No incluye sidebar ni navegación adicional
 */
export default function AuthLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <>
            {children}
            <Toaster />
        </>
    );
}

