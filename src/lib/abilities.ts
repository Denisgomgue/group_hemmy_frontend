import { AbilityBuilder, Ability, AbilityClass } from "@casl/ability";

// Define tipos para acciones y sujetos dinámicos
type DynamicActions = string;
type DynamicSubjects = string | Record<string, any>;

export type AppAbility = Ability<[ DynamicActions, DynamicSubjects ]>;

// Construir habilidades dinámicas
export const defineAbilitiesFor = (user: any): AppAbility => {
    const { can, cannot, build } = new AbilityBuilder<AppAbility>(
        Ability as AbilityClass<AppAbility>
    );

    if (!user) {
        return build({
            detectSubjectType: (item) => item!.type || item,
        });
    }

    // Verificar si es SUPERADMIN con permiso '*'
    const isSuperAdmin = user.roles?.some((userRole: any) => {
        if (userRole.role?.code === 'SUPERADMIN') {
            // Verificar si tiene permiso '*'
            const permissions = userRole.role?.permissions || [];
            return permissions.some((perm: any) => {
                const permCode = perm.permission?.code || perm.code;
                return permCode === '*';
            });
        }
        return false;
    });

    // Si es superadmin, dar acceso total
    if (isSuperAdmin) {
        can("manage", "all");
        return build({
            detectSubjectType: (item) => item!.type || item,
        });
    }

    // Mapeo de permisos del backend a subjects del frontend
    const permissionToSubjectMap: Record<string, string[]> = {
        'users:read': [ 'read', 'User' ],
        'users:create': [ 'create', 'User' ],
        'users:update': [ 'update', 'User' ],
        'users:delete': [ 'delete', 'User' ],
        'roles:read': [ 'read', 'Role' ],
        'roles:create': [ 'create', 'Role' ],
        'roles:update': [ 'update', 'Role' ],
        'roles:delete': [ 'delete', 'Role' ],
        'equipment:read': [ 'read', 'Equipment' ],
        'equipment:create': [ 'create', 'Equipment' ],
        'equipment:update': [ 'update', 'Equipment' ],
        'equipment:delete': [ 'delete', 'Equipment' ],
        'installations:read': [ 'read', 'Installation' ],
        'installations:create': [ 'create', 'Installation' ],
        'installations:update': [ 'update', 'Installation' ],
        'installations:delete': [ 'delete', 'Installation' ],
        'payments:read': [ 'read', 'Payment' ],
        'payments:create': [ 'create', 'Payment' ],
        'payments:update': [ 'update', 'Payment' ],
        'tickets:read': [ 'read', 'Ticket' ],
        'tickets:create': [ 'create', 'Ticket' ],
        'tickets:update': [ 'update', 'Ticket' ],
        'clients:read': [ 'read', 'Customer' ],
        'clients:create': [ 'create', 'Customer' ],
        'clients:update': [ 'update', 'Customer' ],
        'reports:read': [ 'read', 'Report' ],
        'config:read': [ 'read', 'Configuration' ],
        'config:update': [ 'update', 'Configuration' ],
    };

    // Extraer todos los permisos del usuario desde sus roles
    const allPermissions = new Set<string>();
    user.roles?.forEach((userRole: any) => {
        const permissions = userRole.role?.permissions || [];
        permissions.forEach((perm: any) => {
            const permCode = perm.permission?.code || perm.code;
            if (permCode && permCode !== '*') {
                allPermissions.add(permCode);
            }
        });
    });

    // Aplicar permisos usando el mapa
    allPermissions.forEach((permCode: string) => {
        const mapped = permissionToSubjectMap[ permCode ];
        if (mapped) {
            const [ action, subject ] = mapped;
            can(action, subject);
        } else {
            // Si no está en el mapa, intentar inferir del código
            const parts = permCode.split(':');
            if (parts.length === 2) {
                const [ actionPart, subjectPart ] = parts;
                const subject = subjectPart.charAt(0).toUpperCase() + subjectPart.slice(1);
                can(actionPart, subject);
            }
        }
    });

    // Mapeo específico para subjects comunes
    const commonSubjects = [
        'Customer', 'Payment', 'Subscription', 'Service', 'Plan',
        'Installation', 'Employee', 'User', 'Role', 'Permission',
        'Ticket', 'Prediction', 'Equipment', 'Report', 'Configuration'
    ];

    // Si tiene algún permiso relacionado, dar acceso básico de lectura
    commonSubjects.forEach(subject => {
        const subjectLower = subject.toLowerCase();
        const hasRelatedPermission = Array.from(allPermissions).some(perm =>
            perm.includes(subjectLower)
        );
        if (hasRelatedPermission) {
            can('read', subject);
        }
    });

    return build({
        detectSubjectType: (item) => item!.type || item,
    });
};