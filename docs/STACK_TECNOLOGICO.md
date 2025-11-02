# 📚 Stack Tecnológico - Grupo Hemmy Frontend

## 📦 Versiones Actuales (package.json)

| Paquete           | Versión Actual | Versión Recomendada            |
| ----------------- | -------------- | ------------------------------ |
| **Next.js**       | `16.0.0`       | ✅ Última (estable)            |
| **React**         | `19.2.0`       | ✅ Última                      |
| **TypeScript**    | `5.x`          | ✅ Correcta                    |
| **Tailwind CSS**  | `4.x`          | ✅ Última                      |
| **Zustand**       | `5.0.8`        | ✅ Correcta                    |
| **Axios**         | `1.12.2`       | ✅ Correcta                    |
| **Framer Motion** | `12.23.24`     | ✅ Última                      |
| **Zod**           | `4.1.12`       | ⚠️ Nueva (API cambió desde v3) |
| **Sonner**        | `2.0.7`        | ✅ Última                      |
| **Lucide React**  | `0.548.0`      | ✅ Última                      |

## 🎯 Stack Tecnológico Implementado

### **Core Framework**

- ✅ **Next.js 16** (App Router)
- ✅ **React 19**
- ✅ **TypeScript 5**

### **Gestión de Estado y Datos**

- ✅ **Zustand 5** - Estado global ligero
- ⚠️ **@tanstack/react-query** - NO instalado
- ⚠️ **SWR** - NO instalado

### **UI y Componentes**

- ✅ **shadcn/ui** (Radix UI)
- ✅ **Tailwind CSS 4**
- ✅ **Framer Motion 12**
- ✅ **Lucide React**
- ⚠️ **react-icons** - NO instalado

### **Formularios y Validación**

- ✅ **react-hook-form 7**
- ✅ **@hookform/resolvers**
- ✅ **Zod 4** ⚠️ (API cambió desde v3)

### **HTTP y Autenticación**

- ✅ **Axios 1.12**
- ✅ **js-cookie 3**
- ✅ **js-sha256 0.11**

### **Notificaciones**

- ✅ **Sonner 2.0**
- ⚠️ **next-themes** - NO instalado (usamos ThemeContext custom)

### **Efectos y Animaciones**

- ✅ **@react-spring/web 10**
- ⚠️ **Swiper** - NO instalado
- ⚠️ **react-tsparticles** - NO instalado

## ⚠️ Diferencias entre Documentación y Realidad

### **NO Implementados:**

| Paquete                 | Estado          | Necesario                             |
| ----------------------- | --------------- | ------------------------------------- |
| `@tanstack/react-query` | ❌ No instalado | ❓ Opcional (Axios funciona)          |
| `SWR`                   | ❌ No instalado | ❓ Opcional                           |
| `react-icons`           | ❌ No instalado | ✅ Debería agregarse                  |
| `@casl/ability`         | ❌ No instalado | ⚠️ Importante para permisos           |
| `@casl/react`           | ❌ No instalado | ⚠️ Importante para permisos           |
| `next-themes`           | ❌ No instalado | ✅ No necesario (ThemeContext custom) |
| `Swiper`                | ❌ No instalado | ❓ Solo si necesitas carousels        |
| `react-tsparticles`     | ❌ No instalado | ❓ Solo si necesitas particles        |

### **Implementados con Versiones Diferentes:**

- **Zod**: `v4.1.12` (vs `v3.24.1` documentado)
  - ⚠️ API cambió significativamente en v4
  - Necesita actualizar código que usa Zod

## 📋 Estructura Actual del Proyecto

```
src/
├── app/                 # Next.js App Router
│   ├── (auth)/         # Route Group: Autenticación
│   │   ├── login/      # Login page
│   │   └── layout.tsx # Layout de auth
│   ├── (main)/         # Route Group: Dashboard
│   │   ├── (company)/  # Dashboard empresa
│   │   ├── (customer)/ # Dashboard cliente
│   │   ├── layout.tsx  # Layout protegido
│   │   └── page.tsx    # Redirección automática
│   ├── layout.tsx      # Root layout
│   └── globals.css     # Estilos globales
├── components/         # Componentes React
│   ├── auth/          # Autenticación
│   ├── ui/            # shadcn/ui components
│   ├── sidebar/       # Sidebar navigation
│   └── ...
├── contexts/          # Context Providers
│   ├── ThemeContext.tsx
│   ├── AuthContext.tsx
│   └── AbilityContext.tsx
├── hooks/             # Custom Hooks
│   ├── useAuth.ts
│   └── use-toast.ts
├── lib/               # Utilidades
│   ├── axios.ts       # Config Axios
│   ├── api.ts         # API client
│   └── utils.ts       # Helpers
├── schemas/           # Zod Schemas
│   └── auth.schema.ts
└── types/             # TypeScript Types
    ├── auth.ts
    └── api.ts
```

## 🔧 Configuración Importante

### **Next.js Config:**

- ✅ App Router habilitado
- ✅ Puerto: `3001`
- ✅ TypeScript strict mode

### **Tailwind Config:**

- ✅ Tailwind v4 (nuevo sistema)
- ✅ CSS variables personalizadas
- ✅ Dark mode con clase `.dark`

### **Sistema de Tema:**

```typescript
// ThemeContext custom (no next-themes)
- colorScheme: "light" | "dark"
- Persiste en localStorage
- Sincroniza con DOM automaticamente
```

## 📝 Recomendaciones

### **Agregar para Funcionalidad Completa:**

```bash
npm install @casl/ability @casl/react
npm install react-icons
```

### **Agregar para Mejoras (Opcional):**

```bash
npm install @tanstack/react-query  # Reemplazar Axios
npm install swiper                  # Si necesitas carousels
```

### **Mantener:**

- ✅ Zustand (más simple que Redux)
- ✅ Axios (funciona bien)
- ✅ Framer Motion (ya instalado)
- ✅ ThemeContext custom (mejor control)

## 🚀 Estado Actual

### **✅ Funcionando:**

- Login con autenticación
- Modo claro/oscuro
- Dashboard company
- Redirección automática por rol
- Responsive design

### **⚠️ Pendiente:**

- Sistema de permisos CASL
- Dashboard customer
- Integración con backend real
- Validación con Zod v4

## 📚 Documentación Disponible

- `ESTRUCTURA_FRONTEND.md` - Arquitectura general
- `STACK_TECNOLOGICO.md` - Este documento
- `CONFIGURACION_TEMA.md` - Sistema de temas
- `SOLUCION_MODO_OSCURO.md` - Fix de dark mode
- `COMO_FUNCIONA_DASHBOARD.md` - Explicación de dashboards
