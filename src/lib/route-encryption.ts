/**
 * Utilidades para cifrar y descifrar rutas y parámetros sensibles
 * Usa Base64 con una clave de rotación para mayor seguridad
 */

// Clave secreta para el cifrado (en producción debería estar en variables de entorno)
const ENCRYPTION_KEY = 'hemmy_secure_2024';

/**
 * Cifra un ID o texto usando Base64 con clave
 */
export function encryptId(id: string | number): string {
    try {
        const text = `${ENCRYPTION_KEY}:${id}`;
        const encrypted = btoa(text);
        return encrypted;
    } catch (error) {
        console.error('Error encrypting ID:', error);
        return id.toString(); // Fallback al ID original
    }
}

/**
 * Descifra un ID cifrado con compatibilidad hacia atrás
 */
export function decryptId(encryptedId: string): string {
    try {
        // Si el ID parece ser un número simple (sin cifrar), devolverlo tal como está
        if (/^\d+$/.test(encryptedId)) {
            return encryptedId;
        }

        const decrypted = atob(encryptedId);
        const [ key, id ] = decrypted.split(':');

        if (key !== ENCRYPTION_KEY) {
            // Si la clave no coincide, pero el ID parece válido, devolverlo
            if (/^\d+$/.test(encryptedId)) {
                return encryptedId;
            }
            console.warn('Invalid encryption key, using fallback');
            return encryptedId; // Fallback al ID original si la clave no coincide
        }

        return id;
    } catch (error) {
        console.error('Error decrypting ID:', error);
        // Si falla el descifrado, verificar si es un ID numérico simple
        if (/^\d+$/.test(encryptedId)) {
            return encryptedId;
        }
        return encryptedId; // Fallback al ID original
    }
}

/**
 * Cifra un término de búsqueda
 */
export function encryptSearchTerm(term: string): string {
    try {
        if (!term.trim()) return '';
        const text = `${ENCRYPTION_KEY}:search:${term}`;
        return btoa(text);
    } catch (error) {
        console.error('Error encrypting search term:', error);
        return term; // Fallback al término original
    }
}

/**
 * Descifra un término de búsqueda
 */
export function decryptSearchTerm(encryptedTerm: string): string {
    try {
        if (!encryptedTerm) return '';
        const decrypted = atob(encryptedTerm);
        const [ key, type, term ] = decrypted.split(':');

        if (key !== ENCRYPTION_KEY || type !== 'search') {
            console.warn('Invalid encrypted search term');
            return encryptedTerm; // Fallback al término original
        }

        return term;
    } catch (error) {
        console.error('Error decrypting search term:', error);
        return encryptedTerm; // Fallback al término original
    }
}

/**
 * Cifra parámetros de filtros
 */
export function encryptFilters(filters: Record<string, any>): string {
    try {
        const filterString = JSON.stringify(filters);
        const text = `${ENCRYPTION_KEY}:filters:${filterString}`;
        return btoa(text);
    } catch (error) {
        console.error('Error encrypting filters:', error);
        return '';
    }
}

/**
 * Descifra parámetros de filtros
 */
export function decryptFilters(encryptedFilters: string): Record<string, any> {
    try {
        if (!encryptedFilters) return {};
        const decrypted = atob(encryptedFilters);
        const [ key, type, filterString ] = decrypted.split(':');

        if (key !== ENCRYPTION_KEY || type !== 'filters') {
            console.warn('Invalid encrypted filters');
            return {};
        }

        return JSON.parse(filterString);
    } catch (error) {
        console.error('Error decrypting filters:', error);
        return {};
    }
}

/**
 * Valida si un string parece estar cifrado
 */
export function isEncrypted(text: string): boolean {
    try {
        // Si es un número simple, no está cifrado
        if (/^\d+$/.test(text)) {
            return false;
        }

        const decoded = atob(text);
        return decoded.includes(ENCRYPTION_KEY);
    } catch {
        return false;
    }
}
