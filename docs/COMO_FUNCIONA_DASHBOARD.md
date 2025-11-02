# 🎯 Cómo Funciona el Sistema de Dashboards

## 📍 Respuesta a: "¿Cuál dashboard se va a ingresar?"

### **El Sistema Decide Automáticamente Basado en el Tipo de Usuario**

## 🔄 Flujo de Redirección

```
Usuario inicia sesión exitosamente
    ↓
Redirige a / (main)
    ↓
(main)/page.tsx ejecuta
    ↓
Verifica: ¿user?.actor?.organization?
    ├─ SÍ → Redirige a /company/dashboard (Empresa)
    └─ NO → Verifica: ¿user?.actor?.person?
            ├─ SÍ → Redirige a /customer/dashboard (Cliente)
            └─ NO → Redirige a /login
```

## 🏢 Estructura de Rutas

### **Rutas Diferentes, NO Conflictivas:**

```
src/app/(main)/
├── (company)/               ═══════════════════════
│   ├── layout.tsx         → /company
│   └── dashboard/
│       └── page.tsx      → /company/dashboard ✓
│                                    │
└── (customer)/             ═══════════════════════
    ├── layout.tsx         → /customer
    └── dashboard/
        └── page.tsx      → /customer/dashboard ✓
```

## ✅ **NO Hay Conflicto Porque:**

1. **URLs Diferentes**:

   - Empresa: `/company/dashboard`
   - Cliente: `/customer/dashboard`

2. **Route Groups**:

   - `(company)` y `(customer)` son grupos paralelos
   - NO crean segmentos en la URL
   - Permiten diferentes layouts

3. **Protección por Capas**:
   - `(main)/layout.tsx` → Protege todo
   - `(company)/layout.tsx` → Solo empresas
   - `(customer)/layout.tsx` → Solo clientes

## 🔐 Sistema de Acceso

### **Dashboard de Empresa (`/company/dashboard`)**

```typescript
Acceso: Solo usuarios con user?.actor?.organization
URL: /company/dashboard
Funcionalidad:
  - Gestión de clientes
  - Instalaciones
  - Equipamiento
  - Reportes
```

### **Dashboard de Cliente (`/customer/dashboard`)**

```typescript
Acceso: Solo usuarios con user?.actor?.person && !organization
URL: /customer/dashboard
Funcionalidad:
  - Ver servicios propios
  - Consultar facturas
  - Crear tickets
```

## 🎯 Ejemplo Práctico

### **Usuario Empresa:**

```typescript
// Backend retorna:
{
  actor: {
    organization: {
      name: "Empresa XYZ"
    }
  }
}

// Redirección:
/user/login → / → /company/dashboard ✓
```

### **Usuario Cliente:**

```typescript
// Backend retorna:
{
  actor: {
    person: {
      firstName: "Juan",
      lastName: "Pérez"
    }
  }
}

// Redirección:
/user/login → / → /customer/dashboard ✓
```

## 🚀 El Sistema NO Permite:

- ❌ Cliente acceder a `/company/*`
- ❌ Empresa acceder a `/customer/*`
- ❌ Ambos dashboards resolviendo a `/dashboard`

## ✅ Ventajas de Esta Estructura:

1. **Separación Clara**: Rutas completamente diferentes
2. **Seguridad**: Layouts verifican tipo de usuario
3. **Escalable**: Fácil agregar más rutas específicas
4. **Sin Conflicto**: Next.js maneja las rutas correctamente
5. **URLs Semánticas**: Fácil de recordar y entender
