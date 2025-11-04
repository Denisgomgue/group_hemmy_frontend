import { Company } from '@/hooks/use-company';

export interface DocumentInfo {
    name: string;
    ruc?: string;
    address?: string;
    phone?: string;
    email?: string;
    website?: string;
}

export interface ContactInfo {
    phone?: string;
    email?: string;
    address?: string;
    website?: string;
}

export interface SocialMedia {
    facebook?: string;
    twitter?: string;
    instagram?: string;
    linkedin?: string;
}

export function getDocumentInfo(company: Company): DocumentInfo {
    return {
        name: company.name || 'Grupo Hemmy E.I.R.L.',
        ruc: company.ruc || '20123456789',
        address: company.address || 'Av. Principal 123, Lima, Perú',
        phone: company.phone || '+51 800 123 4567',
        email: company.email || 'contacto@grupohemmy.com',
        website: company.website || 'www.grupohemmy.com',
    };
}

export function getContactInfo(company: Company): ContactInfo {
    return {
        phone: company.phone || '+51 800 123 4567',
        email: company.email || 'contacto@grupohemmy.com',
        address: company.address || 'Av. Principal 123, Lima, Perú',
        website: company.website || 'www.grupohemmy.com',
    };
}

export function getSocialMedia(company: Company): SocialMedia {
    // Datos ficticios para redes sociales
    return {
        facebook: 'https://facebook.com/grupohemmy',
        twitter: 'https://twitter.com/grupohemmy',
        instagram: 'https://instagram.com/grupohemmy',
        linkedin: 'https://linkedin.com/company/grupohemmy',
    };
}

export function getBestLogo(company: Company, variant: 'header' | 'footer' | 'full' = 'full'): string | null {
    // Retornar logo si existe, sino null
    return company.logo || null;
}

