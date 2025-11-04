import { useState, useEffect } from 'react';

export interface Company {
    id: number;
    name: string;
    ruc?: string;
    address?: string;
    phone?: string;
    email?: string;
    website?: string;
    logo?: string;
}

// Datos ficticios de Grupo Hemmy
const defaultCompanyInfo: Company = {
    id: 1,
    name: 'Grupo Hemmy E.I.R.L.',
    ruc: '20123456789',
    address: 'Av. Principal 123, Lima, Perú',
    phone: '+51 800 123 4567',
    email: 'contacto@grupohemmy.com',
    website: 'www.grupohemmy.com',
};

export function useCompany() {
    const [companyInfo, setCompanyInfo] = useState<Company | null>(null);
    const [isLoadingInfo, setIsLoadingInfo] = useState(true);
    const [errorInfo, setErrorInfo] = useState<Error | null>(null);

    useEffect(() => {
        // Simular carga de datos de la empresa
        const loadCompanyInfo = async () => {
            try {
                setIsLoadingInfo(true);
                // Simular delay de red
                await new Promise(resolve => setTimeout(resolve, 100));
                setCompanyInfo(defaultCompanyInfo);
                setErrorInfo(null);
            } catch (error) {
                setErrorInfo(error as Error);
                setCompanyInfo(null);
            } finally {
                setIsLoadingInfo(false);
            }
        };

        loadCompanyInfo();
    }, []);

    return {
        companyInfo,
        isLoadingInfo,
        errorInfo,
    };
}

