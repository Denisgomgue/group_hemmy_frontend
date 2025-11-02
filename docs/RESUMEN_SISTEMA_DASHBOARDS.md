# 📊 Resumen: Sistema de Dashboards Dual

## 🎯 Tu Pregunta: "¿Cuál dashboard se va a ingresar?"

### **Respuesta Corta:**

**Depende del tipo de usuario que inicie sesión**

## 🔄 Flujo Completo

### **Paso 1: Usuario Inicia Sesión**

```
Usuario ingresa email y password en /login
    ↓
Backend valida credenciales
    ↓
Backend retorna objeto User con datos del actor
```

### **Paso 2: Sistema Redirige Automáticamente**

```
Usuario con éxito → Redirige a /
    ↓
(main)/page.tsx se ejecuta
    ↓
Lee user?.actor?.organization o user?.actor?.person
    ↓
┌─────────────────────────────────┐
│ ¿Tiene organization?            │
│ (Es una EMPRESA)                │
└─────────────────────────────────┘
    ↓ SÍ
Redirige a: /company/dashboard
    ↓ NO
┌─────────────────────────────────┐
│ ¿Tiene person?                  │
│ (Es un CLIENTE)                 │
└─────────────────────────────────┘
    ↓ SÍ
Redirige a: /customer/dashboard
```

## 🏗️ Estructura Real del Sistema

```
src/app/
├── (auth)/
│   └── login/page.tsx           → Login con toggle de tema ✓
│
└── (main)/
    ├── layout.tsx              → Protege todas las rutas
    ├── page.tsx                → Redirige según tipo de usuario
    │
    ├── (company)/              ← Solo para EMPRESAS
    │   ├── layout.tsx          → Verifica: user?.actor?.organization
    │   └── dashboard/
    │       └── page.tsx       → URL: /company/dashboard
    │
    └── (customer)/             ← Solo para CLIENTES
        ├── layout.tsx          → Verifica: user?.actor?.person
        └── dashboard/
            └── page.tsx       → URL: /customer/dashboard
```

## 🚀 Cómo Funciona el Redireccionamiento

### **Código en (main)/page.tsx:**

```typescript
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";

export default function MainPage() {
  const router = useRouter();
  const { user, isLoading } = useAuth();

  useEffect(() => {
    if (isLoading) return;

    // Verificar tipo de usuario
    const isCompany = user?.actor?.organization;
    const isCustomer = user?.actor?.person && !user?.actor?.organization;

    if (isCompany) {
      router.replace("/company/dashboard"); // ← EMPRESA
    } else if (isCustomer) {
      router.replace("/customer/dashboard"); // ← CLIENTE
    } else {
      router.replace("/login");
    }
  }, [user, isLoading, router]);

  return <LoadingSpinner />;
}
```

## 🎨 Sistema de Modo Claro/Oscuro

### **Problema Detectado:**

El modo claro/oscuro no funciona en dashboards porque **no se está sincronizando con el ThemeContext**.

### **Solución:**

Agregar sincronización en los layouts de dashboards.

#### **Layout de Dashboards Necesita Actualización:**

```typescript
"use client";

import { useTheme } from "@/contexts/ThemeContext";
import { useEffect } from "react";

export default function DashboardLayout({ children }) {
  const { colorScheme } = useTheme();

  // Sincronizar tema con DOM
  useEffect(() => {
    if (colorScheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [colorScheme]);

  return <>{children}</>;
}
```

## 📋 Tabla Comparativa de Dashboards

| Característica | Dashboard Empresa            | Dashboard Cliente                |
| -------------- | ---------------------------- | -------------------------------- |
| URL            | `/company/dashboard`         | `/customer/dashboard`            |
| Requisito      | `user?.actor?.organization`  | `user?.actor?.person`            |
| Acceso         | Gestión completa del sistema | Solo información propia          |
| Funciones      | CRUD completo, reportes      | Ver servicios, facturas, tickets |
| Rutas futuras  | `/company/clients`, etc.     | `/customer/my-services`, etc.    |

## ✅ Ventajas de Esta Arquitectura

1. **Sin Conflicto de Rutas**: URLs completamente diferentes
2. **Seguridad**: Layouts verifican tipo de usuario
3. **Escalabilidad**: Fácil agregar más rutas específicas
4. **Separación Clara**: Código organizado por rol
5. **Redirección Automática**: El sistema decide por ti

## 🔧 Para Solucionar el Modo Claro/Oscuro

1. Agregar `useTheme` en los dashboards
2. Sincronizar con `useEffect`
3. Aplicar clase `dark` al DOM
4. Probar toggle en login y verificar en dashboards
