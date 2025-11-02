# 🎯 Guía de Permisos a Nivel de Componente

## 📖 Introducción

Esta guía explica cómo implementar y usar permisos granulares a nivel de componente en el frontend, permitiendo controlar qué elementos específicos pueden ver o interactuar los usuarios según sus permisos.

---

## 🏗️ Arquitectura Actual

### Componente `Can` Básico

El componente `Can` permite mostrar/ocultar elementos según permisos:

```tsx
import Can from "@/components/permission/can";

<Can action="read" subject="User">
  <UserList />
</Can>;
```

### Sistema de Abilities (CASL)

El frontend usa CASL para gestionar permisos:

- **Actions:** `read`, `create`, `update`, `delete`, `manage`
- **Subjects:** `User`, `Role`, `Customer`, `Payment`, etc.

---

## 🚀 Mejora del Componente `Can`

### Versión Mejorada con Más Funcionalidades

```tsx
// src/components/permission/can.tsx
"use client";
import { useAbility } from "@/contexts/AbilityContext";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect, useState } from "react";

type CanProps = {
  // Una acción o múltiples acciones
  action: string | string[];

  // Un subject o múltiples subjects
  subject: string | string[];

  children: React.ReactNode;

  // Componente a mostrar si NO tiene permiso
  fallback?: React.ReactNode;

  // Modo de validación: 'any' = al menos uno, 'all' = todos requeridos
  mode?: "any" | "all";

  // Si es true, redirige si no tiene permiso (para rutas)
  redirectOnFail?: boolean;

  // Ruta alternativa si redirectOnFail es true
  redirectTo?: string;

  // Mostrar loading mientras verifica
  showLoading?: boolean;
};

export const Can = ({
  action,
  subject,
  children,
  fallback = null,
  mode = "any",
  redirectOnFail = false,
  redirectTo = "/dashboard",
  showLoading = false,
}: CanProps) => {
  const ability = useAbility();
  const { user, loading } = useAuth();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (!loading) {
      setIsReady(true);
    }
  }, [loading]);

  if (!isReady || !ability || (showLoading && loading)) {
    return showLoading ? <div>Cargando permisos...</div> : null;
  }

  // Normalizar a arrays
  const actions = Array.isArray(action) ? action : [action];
  const subjects = Array.isArray(subject) ? subject : [subject];

  // Verificar permisos
  let hasAccess = false;

  if (mode === "all") {
    // Requiere TODOS los permisos
    hasAccess = actions.every((a) => subjects.every((s) => ability.can(a, s)));
  } else {
    // Requiere al menos UNO de los permisos
    hasAccess = actions.some((a) => subjects.some((s) => ability.can(a, s)));
  }

  if (!hasAccess) {
    if (redirectOnFail) {
      // Redirigir (se maneja en el useEffect)
      useEffect(() => {
        if (typeof window !== "undefined") {
          window.location.href = redirectTo;
        }
      }, []);
      return null;
    }
    return <>{fallback}</>;
  }

  return <>{children}</>;
};

export default Can;
```

---

## 💡 Ejemplos de Uso

### 1. Permiso Simple - Mostrar/Ocultar Botón

```tsx
import Can from "@/components/permission/can";

function UserActions() {
  return (
    <div className="flex gap-2">
      {/* Solo mostrar botón si tiene permiso de editar */}
      <Can action="update" subject="User">
        <Button>Editar</Button>
      </Can>

      {/* Solo mostrar botón si tiene permiso de eliminar */}
      <Can action="delete" subject="User">
        <Button variant="destructive">Eliminar</Button>
      </Can>
    </div>
  );
}
```

### 2. Múltiples Permisos (Modo "Cualquiera")

```tsx
// Muestra si tiene permiso de editar O actualizar
<Can action={["edit", "update"]} subject="User" mode="any">
  <Button>Modificar Usuario</Button>
</Can>
```

### 3. Múltiples Permisos (Modo "Todos")

```tsx
// Solo muestra si tiene AMBOS permisos: leer Y exportar
<Can action={["read", "export"]} subject="Report" mode="all">
  <ExportReportButton />
</Can>
```

### 4. Múltiples Subjects

```tsx
// Muestra si puede leer User O Customer
<Can action="read" subject={["User", "Customer"]} mode="any">
  <DataTable />
</Can>
```

### 5. Con Fallback Personalizado

```tsx
<Can
  action impeccable"delete"
  subject="User"
  fallback={
    <Tooltip>
      <span>No tienes permiso para eliminar usuarios</span>
    </Tooltip>
  }
>
  <Button variant="destructive">Eliminar</Button>
</Can>
```

### 6. Componente Completo con Permisos Granulares

```tsx
// src/components/users/user-card.tsx
import Can from "@/components/permission/can";

export function UserCard({ user }: { user: User }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{user.name}</CardTitle>
        <CardDescription>{user.email}</CardDescription>
      </CardHeader>

      <CardContent>
        <p>Rol: {user.role}</p>
      </CardContent>

      <CardFooter className="flex gap-2">
        {/* Ver różnych detalles */}
        <Can action="read" subject="User">
          <Button variant="outline">Ver Detalles</Button>
        </Can>

        {/* Editar usuario */}
        <Can action="update" subject="User">
          <Button>Editar</Button>
        </Can>

        {/* Cambiar contraseña (permiso específico) */}
        <Can action="update" subject="User">
          <Can action="manage" subject="User" mode="all">
            <Button variant="outline">Cambiar Contraseña</Button>
          </Can>
        </Can>

        {/* Eliminar usuario */}
        <Can action="delete" subject="User">
          <Button variant="destructive">Eliminar</Button>
        </Can>

        {/* Solo superadmin puede ver este botón */}
        <Can action="manage" subject="all">
          <Button variant="ghost">Ver Logs</Button>
        </Can>
      </CardFooter>
    </Card>
  );
}
```

### 7. Permisos en Tablas/Listas

```tsx
// src/components/users/user-table.tsx
import Can from "@/components/permission/can";

export function UserTable({ users }: { users: User[] }) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Nombre</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Rol</TableHead>
          {/* Solo mostrar columna de acciones si tiene algún permiso */}
          <Can action={["update", "delete"]} subject="User" mode="any">
            <TableHead>Acciones</TableHead>
          </Can>
        </TableRow>
      </TableHeader>
      <TableBody>
        {users.map((user) => (
          <TableRow key={user.id}>
            <TableCell>{user.name}</TableCell>
            <TableCell>{user.email}</TableCell>
            <TableCell>{user.role}</TableCell>
            {/* Columna de acciones */}
            <Can action={["update", "delete"]} subject="User" mode="any">
              <TableCell>
                <div className="flex gap-2">
                  <Can action="update" subject="User">
                    <Button size="sm">Editar</Button>
                  </Can>
                  <Can action="delete" subject="User">
                    <Button size="sm" variant="destructive">
                      Eliminar
                    </Button>
                  </Can>
                </div>
              </TableCell>
            </Can>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
```

### 8. Permisos en Formularios

```tsx
// src/components/users/user-form.tsx
import Can from "@/components/permission/can";

export function UserForm({
  user,
  mode,
}: {
  user?: User;
  mode: "create" | "edit";
}) {
  const action = mode === "create" ? "create" : "update";

  return (
    <Form>
      {/* Campo básico - todos pueden ver */}
      <FormField name="name" label="Nombre" />

      {/* Campo avanzado - solo con permiso */}
      <Can action="update" subject="User">
        <FormField name="role" label="Rol" type="select" />
      </Can>

      {/* Campo crítico - solo superadmin */}
      <Can action="manage" subject="all">
        <FormField name="isActive" label="Usuario Activo" type="checkbox" />
      </Can>

      {/* Botones de acción */}
      <div className="flex gap-2">
        <Can action={action} subject="User">
          <Button type="submit">
            {mode === "create" ? "Crear" : "Guardar"}
          </Button>
        </Can>

        <Button type="button" variant="outline">
          Cancelar
        </Button>
      </div>
    </Form>
  );
}
```

### 9. Protección de Rutas Completas

```tsx
// src/app/(main)/admin/users/page.tsx
import Can from "@/components/permission/can";
import { redirect } from "next/navigation";

export default function UsersPage() {
  return (
    <Can
      action="read"
      subject="User不仅仅是"
      redirectOnFail={true}
      redirectTo="/dashboard"
    >
      <div>
        <h1>Gestión de Usuarios</h1>
        <UserTable />
      </div>
    </Can>
  );
}
```

### 10. Hook Personalizado para Verificar Permisos

```tsx
// src/hooks/use-can.ts
import { useAbility } from "@/contexts/AbilityContext";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect, useState } from "react";

export function useCan(
  action: string | string[],
  subject: string | string[],
  mode: "any" | "all" = "any"
): boolean {
  const ability = useAbility();
  const { loading } = useAuth();
  const [can, setCan] = useState(false);

  useEffect(() => {
    if (loading || !ability) {
      setCan(false);
      return;
    }

    const actions = Array.isArray(action) ? action : [action];
    const subjects = Array.isArray(subject) ? subject : [subject];

    let result = false;

    if (mode === "all") {
      result = actions.every((a) => subjects.every((s) => ability.can(a, s)));
    } else {
      result = actions.some((a) => subjects.some((s) => ability.can(a, s)));
    }

    setCan(result);
  }, [action, subject, mode, ability, loading]);

  return can;
}

// Uso:
function MyComponent() {
  const canEdit = useCan("update", "User");
  const canDelete = useCan("delete", "User");
  const canManage = useCan(
    ["read", "create", "update", "delete"],
    "User",
    "all"
  );

  return (
    <div>
      {canEdit && <Button>Editar</Button>}
      {canDelete && <Button variant="destructive">Eliminar</Button>}
      {canManage && <Button>Gestión Completa</Button>}
    </div>
  );
}
```

---

## 🎨 Mejores Prácticas

### ✅ DO (Hacer)

1. **Usar permisos específicos:**

   ```tsx
   // ✅ Bueno
   <Can action="update" subject="User">
     <Button>Editar</Button>
   </Can>

   // ❌ Evitar (demasiado permisivo)
   <Can action="manage" subject="all">
     <Button>Editar</Button>
   </Can>
   ```

2. **Agrupar verificaciones relacionadas:**

   ```tsx
   // ✅ Bueno
   <Can action={["read",ยัง"create"]} subject="User" mode="any">
     <UserSection />
   </Can>
   ```

3. **Proporcionar fallbacks informativos:**

   ```tsx
   // ✅ Bueno
   <Can
     action="delete"
     subject="User"
     fallback={<Tooltip>No tienes permiso para eliminar</Tooltip>}
   >
     <Button>Eliminar</Button>
   </Can>
   ```

4. **Verificar permisos en backend también:**
   ```tsx
   // El frontend oculta, pero el backend debe validar
   // Ver: EVALUACION_SEGURIDAD_PERMISOS.md
   ```

### ❌ DON'T (No hacer)

1. **No confiar solo en el frontend:**

   ```tsx
   // ❌ MAL - Sin validación en backend
   // Un usuario puede modificar el código y hacer la petición
   ```

2. **No usar permisos demasiado amplios:**

   ```tsx
   // ❌ MAL
   <Can action="manage" subject="all">
     <SensitiveButton />
   </Can>
   ```

3. **No anidar demasiado:**

   ```tsx
   // ❌ MAL - Difícil de leer
   <Can action="read" subject="User">
     <Can action="update" subject="User">
       <Can action="delete" subject="User">
         <Button>Acción</Button>
       </Can>
     </Can>
   </Can>

   // ✅ MEJOR
   <Can action={["read", "update", "delete"]} subject="User" mode="all">
     <Button>Acción</Button>
   </Can>
   ```

---

## 🔄 Flujo de Trabajo Recomendado

1. **Definir permisos en el backend:**

   - Agregar a `resource.seeder.ts`
   - Ejemplo: `users:read`, `users:create`, `users:update`, `users:delete`

2. **Mapear permisos en el frontend:**

   - Actualizar `permissionToSubjectMap` en `abilities.ts`

3. **Implementar guard en el backend:**

   - Agregar `@Permissions('users:read')` al endpoint correspondiente

4. **Proteger en el frontend:**

   - Usar `<Can>` para mostrar/ocultar elementos

5. **Probar:**
   - Verificar que elementos se ocultan sin permisos
   - Verificar que backend rechaza requests sin permisos

---

## 📚 Recursos Adicionales

- [CASL Documentation](https://casl.js.org/v6/en)
- [NestJS Guards](https://docs.nestjs.com/guards)
- Ver `EVALUACION_SEGURIDAD_PERMISOS.md` para detalles de seguridad

---

**Última actualización:** {{ fecha }}
