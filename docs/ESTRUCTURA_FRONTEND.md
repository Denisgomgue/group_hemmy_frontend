# Estructura del Frontend - Grupo Hemmy

## 📁 Organización de Directorios

```
src/
├── app/                      # Rutas y páginas (Next.js App Router)
│   ├── dashboard/           # Rutas protegidas
│   ├── login/               # Página de autenticación
│   └── layout.tsx           # Layout principal
│
├── components/                 # Componentes reutilizables
│   ├── auth/                # Componentes de autenticación
│   │   └── ProtectedRoute.tsx
│   └── ui/                  # Componentes UI
│       └── notification-banner.tsx
│
├── hooks/                   # Hooks personalizados
│   └── useAuth.ts
│
├── lib/                     # Configuración y utilidades
│   ├── api/                 # Servicios de API
│   │   └── auth.ts
│   ├── api.ts              # Cliente axios
│   ├── store/              # Stores de Zustand
│   │   └── auth.store.ts
│   └── utils.ts            # Utilidades generales
│
├── schemas/                 # Schemas de validación con Zod
│   └── auth.schema.ts
│
├── types/                   # Tipos TypeScript
│   ├── auth.ts
│   └── api.ts
│
└── middleware.ts            # Middleware de Next.js
```

## 🔑 Autenticación (Auth)

### Flujo de Autenticación

1. **Store de Zustand** (`lib/store/auth.store.ts`)

   - Estado global de autenticación
   - Persistencia con localStorage
   - Métodos: `setUser`, `logout`, etc.

2. **Hook useAuth** (`hooks/useAuth.ts`)

   - Funciones de autenticación: `login`, `logout`, `checkAuth`
   - Estado: `user`, `isAuthenticated`, `isLoading`
   - Manejo de rutas

3. **API Service** (`lib/api/auth.ts`)

   - Endpoints del backend
   - `login`, `logout`, `refresh`, `getProfile`
   - Tipos seguros con TypeScript

4. **Schemas** (`schemas/auth.schema.ts`)

   - Validación con Zod
   - `loginSchema` para formularios

5. **Componente ProtectedRoute** (`components/auth/ProtectedRoute.tsx`)
   - Protege rutas privadas
   - Verifica autenticación
   - Redirige si no está autenticado

### Uso en Páginas

```typescript
// Página de Login
import { useAuth } from "@/hooks/useAuth";

export default function LoginPage() {
  const { login, isLoading } = useAuth();

  const handleSubmit = async () => {
    await login(email, password);
  };
}

// Página Protegida
import ProtectedRoute from "@/components/auth/ProtectedRoute";

export default function DashboardPage() {
  return <ProtectedRoute>{/* Tu contenido aquí */}</ProtectedRoute>;
}
```

## 📦 Services (Servicios API)

### Estructura

```typescript
// lib/api/{module}.ts
export const {module}Api = {
    getById: async (id: number) => { },
    create: async (data: Dto) => { },
    update: async (id: number, data: Dto) => { },
    delete: async (id: number) => { },
};
```

### Patrón a Seguir

1. **Tipos en `types/`** - Interfaces TypeScript
2. **Schemas en `schemas/`** - Validación con Zod
3. **API en `lib/api/`** - Funciones de llamadas
4. **Hooks en `hooks/`** - Lógica de negocio

## 🎯 Types (Tipos TypeScript)

### Ubicación: `src/types/`

```typescript
// types/{module}.ts
export interface Entity {
  id: number;
  // propiedades
}

export interface CreateDto {
  // campos requeridos
}
```

### Convenciones

- Interfaces con PascalCase
- Tipos de respuesta: `{Entity}Response`
- DTOs: `Create{Entity}Dto`, `Update{Entity}Dto`

## ✅ Schemas (Validación Zod)

### Ubicación: `src/schemas/`

```typescript
// schemas/{module}.schema.ts
import { z } from 'zod';

export const {entity}Schema = z.object({
    name: z.string().min(1),
    email: z.string().email(),
});

export type {Entity}FormData = z.infer<typeof {entity}Schema>;
```

### Uso con React Hook Form

```typescript
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema } from "@/schemas/auth.schema";

const { register, handleSubmit } = useForm({
  resolver: zodResolver(loginSchema),
});
```

## 🔧 Utils (Utilidades)

### Archivo: `src/lib/utils.ts`

Funciones de utilidad disponibles:

- `cn()` - Merge de clases de Tailwind
- `formatDate()` - Formatear fechas
- `formatCurrency()` - Formatear moneda
- `formatName()` - Formatear nombres (según preferencia [[memory:7002278]])

## 🛡️ Middleware

### Archivo: `src/middleware.ts`

- Protección de rutas
- Redirección automática a login
- Verificación de cookies

## 📋 Mejores Prácticas

1. **Simplicidad** [[memory:7831397]]

   - Módulos funcionales y simples
   - DTOs concisos (~4 líneas)
   - Evitar complejidad innecesaria

2. **Tipos Seguros**

   - Usar TypeScript en todo
   - Tipos explícitos
   - Evitar `any`

3. **Organización**

   - Un archivo por responsabilidad
   - Sin archivos `index.ts` [[memory:7002260]]
   - Estructura directa

4. **UI Consistente**

   - Usar `NotificationBanner` para errores [[memory:7002284]]
   - Componentes reutilizables
   - Mantener diseño existente [[memory:4982765]]

5. **API y Endpoints**
   - URLs relativas [[memory:7831391]]
   - Cliente axios centralizado
   - Manejo de errores unificado

## 🚀 Ejemplo Completo: Módulo de Clientes

```
src/
├── types/
│   └── client.ts           # interface Client, CreateClientDto
├── schemas/
│   └── client.schema.ts    # clientSchema con Zod
├── lib/
│   └── api/
│       └── client.ts       # clientApi con CRUD
├── hooks/
│   └── useClient.ts        # Lógica de clientes
└── app/
    └── clients/
        ├── page.tsx        # Lista de clientes
        └── [id]/
            └── page.tsx    # Detalle de cliente
```

Este patrón se repite para todos los módulos del sistema.
