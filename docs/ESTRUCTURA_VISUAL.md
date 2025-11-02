# 🎨 Estructura Visual: Dashboard Dual

## 📊 Comparación Visual

### **ESTRUCTURA ACTUAL:**

```
src/app/
├── page.tsx              → /         (landing)
├── login/
│   └── page.tsx         → /login
└── dashboard/
    └── page.tsx         → /dashboard
```

### **ESTRUCTURA PROPUESTA:**

```
src/app/
├── (public)/                    ═══════════════════
│   ├── page.tsx                →  /                 │
│   ├── about/                   │  PÁGINAS          │
│   │   └── page.tsx           →  /about             │  PÚBLICAS
│   ├── services/                │  INFORMATIVAS     │
│   │   └── page.tsx           →  /services          │
│   └── contact/                 │  (sin auth)       │
│       └── page.tsx           →  /contact          ═══════════════════
│
├── (auth)/                                             ═══════════════
│   ├── layout.tsx                                    │  AUTENTICACIÓN  │
│   ├── login/                                        │  (login,         │
│   │   └── page.tsx           →  /login             │   registro)     │
│   └── register/                                     │                 │
│       └── page.tsx           →  /register         ═══════════════
│
└── (dashboard)/                                        ════════════════════════════════════════════
    ├── layout.tsx                                   │  DASHBOARD PRINCIPAL                       │
    │   └── Header + Sidebar                                   │  (Con protección de auth)              │
    │                                                          │                                         │
    ├── dashboard/                                         │                                         │
    │   └── page.tsx              →  /dashboard         │                                         │
    │                                                          │                                         │
    ├── (company)/                                      ═══════╡ EMPRESA                            │
    │   ├── layout.tsx                                   │  (Layout específico)                     │
    │   ├── page.tsx               →  /company           │                                         │
    │   ├── clients/                                       │                                         │
    │   │   └── page.tsx         →  /clients            │                                         │
    │   ├── installations/                                │                                         │
    │   │   └── page.tsx         →  /installations       │                                         │
    │   └── equipment/                                    │                                         │
    │       └── page.tsx         →  /equipment           ════════════════════════════════════════════
    │
    └── (customer)/                                     ════════════════════════════════════════════
        ├── layout.tsx                                 │  CLIENTE                                  │
        ├── page.tsx               →  /customer         │  (Layout específico)                     │
        ├── my-services/                               │                                          │
        │   └── page.tsx           →  /my-services      │                                          │
        ├── invoices/                                  │                                          │
        │   └── page.tsx           →  /invoices         │                                          │
        └── tickets/                                   │                                          │
            └── page.tsx           →  /tickets        ════════════════════════════════════════════
```

---

## 🔑 Características por Sección

### **1️⃣ (public)/ - Páginas Informativas**

```
✅ Sin autenticación
✅ Header público con menu
✅ Footer público
✅ SEO-friendly
✅ Landing pages
```

**Ejemplo de URL:**

- `/` - Inicio
- `/about` - Sobre nosotros
- `/services` - Servicios
- `/contact` - Contacto

---

### **2️⃣ (auth)/ - Autenticación**

```
✅ Layout centrado para login
✅ Sin sidebar
✅ Redirección automática
✅ Manejo de tokens
```

**Ejemplo de URL:**

- `/login` - Iniciar sesión
- `/register` - Registrarse

---

### **3️⃣ (dashboard)/ - Área Privada**

```
✅ Requiere autenticación
✅ Header con usuario
✅ Sidebar dinámico
✅ Protección por roles
```

#### **3a. (company)/ - Área de Empresa**

```
Usuarios: Tipo ORGANIZATION
Verifica: user?.actor?.organization

Menú:
├── Mi Empresa
├── Clientes
├── Instalaciones
├── Equipamiento
└── Reportes
```

#### **3b. (customer)/ - Área de Cliente**

```
Usuarios: Tipo PERSON (Cliente)
Verifica: user?.actor?.person

Menú:
├── Mi Panel
├── Mis Servicios
├── Facturas
└── Tickets
```

---

## 🎯 Cómo Funciona el Flujo

### **Flujo de Usuario:**

```
1. Usuario visita "/"
   ↓
2. Middleware verifica: ¿Es ruta pública? → SÍ
   ↓
3. Muestra página pública

┌─────────────────────────┐
│   Usuario hace click    │
│   en "Login"            │
└─────────────────────────┘
           ↓
4. Middleware verifica: ¿Tiene token? → NO
   ↓
5. Redirige a /login
   ↓
6. Usuario inicia sesión
   ↓
7. Middleware recibe token
   ↓
8. Redirige a /dashboard
   ↓
9. Layout de dashboard verifica:
   - ¿Es empresa? → Muestra sidebar empresa
   - ¿Es cliente? → Muestra sidebar cliente
```

---

## 📝 Middleware: Decision Tree

```
Request llega
    ↓
¿Es ruta pública? (/, /about, /contact)
    ↓ SÍ
Permitir acceso
    ↓
¿Es ruta protegida? (/dashboard, /clients, etc)
    ↓ SÍ
¿Tiene token?
    ↓ NO
Redirigir a /login
    ↓
¿Tiene token?
    ↓ SÍ
¿Es ruta de empresa?
    ↓ SÍ
¿Usuario es empresa?
    ↓ NO
Mostrar error de acceso
    ↓
¿Usuario es empresa?
    ↓ SÍ
Permitir acceso
    ↓
¿Es ruta de cliente?
    ↓ SÍ
¿Usuario es cliente?
    ↓ NO
Mostrar error de acceso
    ↓
¿Usuario es cliente?
    ↓ SÍ
Permitir acceso
```

---

## 🚦 Estado Actual vs Futuro

| **Característica**  | **Actual** | **Futuro**                       |
| ------------------- | ---------- | -------------------------------- |
| Route Groups        | ❌ No      | ✅ (public), (auth), (dashboard) |
| Layouts específicos | ❌ Solo 1  | ✅ Por sección (3+)              |
| Middleware          | ✅ Básico  | ✅ Con verificación de roles     |
| Protección por rol  | ❌ No      | ✅ Empresa vs Cliente            |
| Páginas públicas    | ❌ Solo 1  | ✅ Múltiples informativas        |
| Sidebar dinámico    | ❌ No      | ✅ Por tipo de usuario           |
| Organización        | ⚠️ Simple  | ✅ Completa y escalable          |

---

## 💡 Ventajas de esta Estructura

1. ✅ **Separación clara** de responsabilidades
2. ✅ **URLs limpias** (sin prefijos innecesarios)
3. ✅ **Layouts específicos** por sección
4. ✅ **Fácil de mantener** y escalar
5. ✅ **SEO-friendly** con páginas públicas
6. ✅ **Experiencia diferenciada** por tipo de usuario
7. ✅ **Seguridad mejorada** con verificación de roles
