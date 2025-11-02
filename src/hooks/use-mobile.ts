"use client";

import { useState, useEffect } from "react";

type DeviceType = "mobile" | "tablet" | "laptop" | "desktop";

const MOBILE_BREAKPOINT = 640; // sm
const TABLET_BREAKPOINT = 1024; // lg
const LAPTOP_BREAKPOINT = 1280; // xl

export function useDeviceType(): DeviceType {
    const [ deviceType, setDeviceType ] = useState<DeviceType>("desktop");

    useEffect(() => {
        const updateDeviceType = () => {
            const width = window.innerWidth;

            if (width < MOBILE_BREAKPOINT) {
                setDeviceType("mobile");
            } else if (width < TABLET_BREAKPOINT) {
                setDeviceType("tablet");
            } else if (width < LAPTOP_BREAKPOINT) {
                setDeviceType("laptop");
            } else {
                setDeviceType("desktop");
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

    return deviceType;
}

