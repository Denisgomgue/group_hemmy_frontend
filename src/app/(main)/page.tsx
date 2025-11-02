"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function MainPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirigir automáticamente al dashboard
    router.replace("/dashboard");
  }, [ router ]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-900 mx-auto"></div>
        <p className="mt-4 text-lg text-muted-foreground">Hemmy dirigiendose a la página principal...</p>
      </div>
    </div>
  );
}

