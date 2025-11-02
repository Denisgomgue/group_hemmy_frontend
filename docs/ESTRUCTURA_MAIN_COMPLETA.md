# 📁 Estructura Completa de (main) - Dashboard

## 🎯 Estructura Final

```
src/app/(main)/
├── layout.tsx                    → Layout principal con protección de auth
├── page.tsx                      → Redirige según tipo de usuario
│
├── (company)/                    ═══════════════════════════════
│   ├── layout.tsx               → Verifica que sea EMPRESA
│   └── dashboard/
│       └── page.tsx             → Dashboard empresarial
│                                        │
├── (customer)/                   ═══════════════════════════════
│   ├── layout.tsx               → Verifica que sea CLIENTE
│   └── dashboard/
│       └── page.tsx             → Dashboard de cliente
│                                        │
```

## 🔒 Sistema de Protección por Capas

### **1. Layout Principal - `(main)/layout.tsx`**

```typescript
ProtectedRoute → Protege TODAS las rutas hijas
```

### **2. Layout Empresa - `(main)/(company)/layout.tsx`**

```typescript
Verifica: user?.actor?.organization
Acceso: Solo usuarios de tipo ORGANIZATION
```

### **3. Layout Cliente - `(main)/(customer)/layout.tsx`**

```typescript
Verifica: user?.actor?.person && !user?.actor?.organization
Acceso: Solo usuarios de tipo PERSON (cliente)
```

## 🎨 Rutas y URLs

### **Empresa:**

- `/company/dashboard` → Dashboard empresarial
- `/company/clients` (futuro)
- `/company/installations` (futuro)
- `/company/equipment` (futuro)
- `/company/reports` (futuro)

### **Cliente:**

- `/customer/dashboard` → Dashboard de cliente
- `/customer/my-services` (futuro)
- `/customer/invoices` (futuro)
- `/customer/tickets` (futuro)

## 🔄 Flujo de Redirección

```
Usuario entra a / (main)
    ↓
page.tsx detecta tipo de usuario
    ↓
┌─────────────────────┐
│ ¿Es empresa?        │ → Redirige a /company/dashboard
│ user.actor.         │
│ organization        │
└─────────────────────┘
    ↓
┌─────────────────────┐
│ ¿Es cliente?        │ → Redirige a /customer/dashboard
│ user.actor.person   │
│ !organization       │
└─────────────────────┘
    ↓
Redirige a /login
```

## 📋 Funcionalidades Implementadas

### **Dashboard Empresa (`company/dashboard`)**

- ✅ Header con branding Hemmy
- ✅ Tarjetas de estadísticas
- ✅ Acciones rápidas
- ✅ Diseño responsivo
- ✅ Soporte para dark mode

### **Dashboard Cliente (`customer/dashboard`)**

- ✅ Bienvenida personalizada
- ✅ Sección de gradiente corporativo
- ✅ Información del usuario
- ✅ Acciones rápidas
- ✅ Soporte para dark mode

## 🎨 Colores Hemmy Aplicados

```css
/* Principal */
bg-[#5E3583]          /* Morado principal */
hover:bg-[#4A2A6A]    /* Hover más oscuro */

/* Secundario */
bg-[#8E6AAF]          /* Morado claro */
hover:bg-[#6E4A9F]    /* Hover medio */

/* Gradientes */
from-[#5E3583] to-[#8E6AAF]  /* Gradiente principal */
```

## 🚀 Próximos Pasos

1. ✅ Estructura de (main) completada
2. ✅ Dashboards de empresa y cliente creados
3. ⏳ Implementar sidebar/navegación
4. ⏳ Crear páginas de CRUD (clientes, instalaciones, etc.)
5. ⏳ Integrar con backend
6. ⏳ Agregar tablas de datos
7. ⏳ Sistema de filtros y búsqueda

## 📝 Archivos Creados/Modificados

1. ✅ `(main)/page.tsx` → Redirección inteligente
2. ✅ `(main)/(company)/dashboard/page.tsx` → Dashboard empresa
3. ✅ `(main)/(customer)/dashboard/page.tsx` → Dashboard cliente
4. ✅ `(main)/layout.tsx` → Ya existía, verificado
5. ✅ `(main)/(company)/layout.tsx` → Ya existía, verificado
6. ✅ `(main)/(customer)/layout.tsx` → Ya existía, verificado

## 🔧 Cómo Usar

### **Para Empresas:**

```typescript
// El usuario es redirigido automáticamente a /company/dashboard
// Puede acceder a:
- Gestión de clientes
- Instalaciones
- Equipamiento
- Reportes
```

### **Para Clientes:**

```typescript
// El usuario es redirigido automáticamente a /customer/dashboard
// Puede acceder a:
- Ver sus servicios
- Consultar facturas
- Crear tickets de soporte
```

## 🎯 Características de los Dashboards

### **Empresa:**

- Panel administrativo completo
- Gestión de recursos
- Reportes y estadísticas
- Acceso a todas las funcionalidades del sistema

### **Cliente:**

- Panel personalizado
- Solo información propia
- Acceso limitado a funciones básicas
- Interfaz simplificada
