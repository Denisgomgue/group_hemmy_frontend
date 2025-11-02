"use client";

import { useState, useEffect } from "react";

type DeviceType = "mobile" | "tablet" | "laptop" | "desktop";

interface UseResponsiveTableReturn {
    isCardsView: boolean;
    deviceType: DeviceType;
    isMobile: boolean;
    isTablet: boolean;
    isLaptop: boolean;
    isDesktop: boolean;
}

const MOBILE_BREAKPOINT = 640; // sm
const TABLET_BREAKPOINT = 1024; // lg
const LAPTOP_BREAKPOINT = 1280; // xl


export function useResponsiveTable(): UseResponsiveTableReturn {
    const [ deviceType, setDeviceType ] = useState<DeviceType>("desktop");
    const [ isCardsView, setIsCardsView ] = useState(false);

    useEffect(() => {
        const updateDeviceType = () => {
            const width = window.innerWidth;

            if (width < MOBILE_BREAKPOINT) {
                setDeviceType("mobile");
                setIsCardsView(true); // Vista cards en móvil
            } else if (width < TABLET_BREAKPOINT) {
                setDeviceType("tablet");
                setIsCardsView(false); // Vista tabla en tablet
            } else if (width < LAPTOP_BREAKPOINT) {
                setDeviceType("laptop");
                setIsCardsView(false); // Vista tabla en laptop
            } else {
                setDeviceType("desktop");
                setIsCardsView(false); // Vista tabla en desktop
            }
        };

        // Ejecutar inmediatamente
        updateDeviceType();

        // Escuchar cambios de tamaño de ventana
        window.addEventListener("resize", updateDeviceType);

        // Limpiar listener al desmontar
        return () => {
            window.removeEventListener("resize", updateDeviceType);
        };
    }, []);

    return {
        isCardsView,
        deviceType,
        isMobile: deviceType === "mobile",
        isTablet: deviceType === "tablet",
        isLaptop: deviceType === "laptop",
        isDesktop: deviceType === "desktop",
    };
}


