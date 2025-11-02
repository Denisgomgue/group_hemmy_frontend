"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { Navbar } from "@/components/public/navbar";
import { HeroSection } from "@/components/public/hero-section";
import { PlansSection } from "@/components/public/plans-section";
import { FeaturesSection } from "@/components/public/features-section";
import { AboutSection } from "@/components/public/about-section";
import { ContactSection } from "@/components/public/contact-section";
import { Footer } from "@/components/public/footer";

export default function Home() {
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading) {
      if (user) {
        router.push("/dashboard");
      }
    }
  }, [ user, loading, router ]);

  // Si está autenticado, no mostrar la página principal
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (user) {
    return null;
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      <HeroSection />
      <PlansSection />
      <FeaturesSection />
      <AboutSection />
      <ContactSection />
      <Footer />
    </div>
  );
}
