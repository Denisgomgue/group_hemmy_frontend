export const IMAGE_CONFIG = {
    // Rutas base para las imágenes
    BASE_PATH: '/uploads',

    // Rutas específicas para empresas
    COMPANIES: {
        LOGOS: '/uploads/companies/logos',
        // Subcarpetas para cada tipo de logo
        LOGO_TYPES: {
            NORMAL: '/uploads/companies/logos/normal',
            HORIZONTAL: '/uploads/companies/logos/horizontal',
            REDUCED: '/uploads/companies/logos/reduced',
            NEGATIVE: '/uploads/companies/logos/negative'
        }
    },

    // Configuración de archivos
    ALLOWED_TYPES: [ 'image/jpeg', 'image/jpg', 'image/png', 'image/svg+xml', 'image/webp' ],
    MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB

    // Dimensiones recomendadas para cada tipo de logo
    LOGO_DIMENSIONS: {
        NORMAL: { width: 200, height: 200 },
        HORIZONTAL: { width: 300, height: 100 },
        REDUCED: { width: 100, height: 100 },
        NEGATIVE: { width: 200, height: 200 }
    },

    // Nombres de archivo por defecto
    DEFAULT_NAMES: {
        NORMAL: 'logo-normal',
        HORIZONTAL: 'logo-horizontal',
        REDUCED: 'logo-reduced',
        NEGATIVE: 'logo-negative'
    }
};

// Función para obtener la URL completa de una imagen
export function getImageUrl(path: string): string {
    if (!path) return '';

    // Si ya es una URL completa, devolverla tal como está
    if (path.startsWith('http://') || path.startsWith('https://')) {
        return path;
    }

    // Si es una ruta relativa, convertirla a URL completa
    if (path.startsWith('/')) {
        return `${window.location.origin}${path}`;
    }

    // Si no tiene slash, agregar la ruta base
    return `${window.location.origin}${IMAGE_CONFIG.BASE_PATH}/${path}`;
}

// Función para obtener la URL de un logo específico
export function getLogoUrl(companyId: number, logoType: keyof typeof IMAGE_CONFIG.COMPANIES.LOGO_TYPES, filename: string): string {
    const basePath = IMAGE_CONFIG.COMPANIES.LOGO_TYPES[ logoType ];
    return `${basePath}/${companyId}/${filename}`;
}

// Función para validar el tipo de archivo
export function isValidImageType(file: File): boolean {
    return IMAGE_CONFIG.ALLOWED_TYPES.includes(file.type);
}

// Función para validar el tamaño del archivo
export function isValidFileSize(file: File): boolean {
    return file.size <= IMAGE_CONFIG.MAX_FILE_SIZE;
}

// Función para generar un nombre de archivo único
export function generateUniqueFilename(originalName: string, companyId: number, logoType: string): string {
    const timestamp = Date.now();
    const extension = originalName.split('.').pop();
    return `${companyId}_${logoType}_${timestamp}.${extension}`;
}
