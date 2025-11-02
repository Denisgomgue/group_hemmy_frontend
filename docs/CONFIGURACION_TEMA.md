# 🎨 Configuración de Tema - Grupo Hemmy

## ✅ Configuraciones Aplicadas

### **1. Variables CSS en `globals.css`**

- ✅ Variables de colores para modo claro (`:root`)
- ✅ Variables de colores para modo oscuro (`.dark`)
- ✅ Color principal Hemmy: `#5E3583` (272.2 58.8% 51.4%)
- ✅ Scrollbar personalizado
- ✅ Animaciones y transiciones

### **2. Layout Principal (`app/layout.tsx`)**

```typescript
- ThemeProvider: Maneja el tema claro/oscuro global
- AuthProvider: Maneja autenticación de usuarios
- Toaster: Notificaciones con Sonner
- Fuente: Nunito
```

### **3. Login Page Mejorado**

- ✅ Usa logos reales de `/public/logos/`
- ✅ Integrado con `ThemeProvider`
- ✅ Toggle de tema claro/oscuro
- ✅ Animaciones con Framer Motion
- ✅ CircuitBackground animado
- ✅ Responsive (móvil/desktop)

### **4. Archivos de Logos Usados**

```
/public/logos/
├── grupo_hemmy.jpg          → Logo principal (256x256)
├── minilogo_grupo_hemmy.png → Minilogo (56x56)
```

## 🎨 Paleta de Colores Hemmy

### **Modo Claro:**

- Principal: `#5E3583`
- Secundario: `#8E6AAF`
- Gradiente: `from-[#5E3583] via-[#4A2A6A] to-[#8E6AAF]`

### **Modo Oscuro:**

- Principal: `#5E3583`
- Fondo oscuro: `from-[#2A1B3D] via-[#5E3583] to-[#3D2953]`

## 🔧 Uso del Tema

### **Toggle de Tema:**

```typescript
import { useTheme } from "@/contexts/ThemeContext";

const { colorScheme, setColorScheme } = useTheme();

// Cambiar tema
setColorScheme("dark"); // o "light"
```

### **Clases Tailwind para Colores:**

```css
/* Principal Hemmy */
bg-[#5E3583] text-white
hover:bg-[#4A2A6A]

/* Secundario */
bg-[#8E6AAF] text-white

/* Gradientes */
bg-gradient-to-r from-[#5E3583] to-[#8E6AAF]
```

## 📱 Estructura Completa

```
src/app/
├── layout.tsx                    → Providers principales
├── globals.css                   → Variables CSS y estilos
├── (auth)/
│   ├── layout.tsx              → Layout de autenticación
│   └── login/
│       ├── page.tsx            → Export del login
│       └── login-enhanced.tsx → Login con animaciones
└── (main)/
    └── ...

src/contexts/
├── ThemeContext.tsx             → Manejo de tema
└── AuthContext.tsx              → Manejo de auth

src/components/ui/
├── button.tsx
├── input.tsx
├── card.tsx
├── toaster.tsx
└── CircuitBackground.tsx
```

## 🎯 Funcionalidades

1. ✅ **Tema Claro/Oscuro**: Toggle funcional en todo el sistema
2. ✅ **Logos Reales**: Usa imágenes de `/public/logos/`
3. ✅ **Colores Corporativos**: #5E3583 como color principal
4. ✅ **Variables CSS**: Configuración completa para modo claro/oscuro
5. ✅ **Providers**: ThemeProvider, AuthProvider, Toaster
6. ✅ **Responsive**: Adaptado para móvil y desktop
7. ✅ **Animaciones**: Framer Motion en login

## 🚀 Próximos Pasos

1. Agregar más páginas usando el sistema de tema
2. Implementar sidebar con colores Hemmy
3. Crear componentes reutilizables con colores corporativos
4. Agregar más animaciones según sea necesario
