# 📦 Guía de Instalación de Dependencias

## 🚀 Instalación Actual

```bash
# Todas las dependencias ya están instaladas
cd grupo_hemmy_frontend
npm install
```

## 📋 Dependencias Actuales

### **Producción:**

```json
{
  "@hookform/resolvers": "^5.2.2",
  "@radix-ui/react-toast": "^1.2.15",
  "@react-spring/web": "^10.0.3",
  "axios": "^1.12.2",
  "class-variance-authority": "^0.7.1",
  "clsx": "^2.1.1",
  "framer-motion": "^12.23.24",
  "js-cookie": "^3.0.5",
  "js-sha256": "^0.11.1",
  "lucide-react": "^0.548.0",
  "next": "16.0.0",
  "react": "19.2.0",
  "react-dom": "19.2.0",
  "react-hook-form": "^7.65.0",
  "sonner": "^2.0.7",
  "tailwind-merge": "^3.3.1",
  "tailwind-variants": "^3.1.1",
  "zod": "^4.1.12",
  "zustand": "^5.0.8"
}
```

## ⚠️ Dependencias Faltantes Documentadas

Si quieres agregar las funcionalidades documentadas, ejecuta:

### **Sistema de Permisos (CASL):**

```bash
npm install @casl/ability @casl/react
```

### **Iconos Adicionales:**

```bash
npm install react-icons
```

### **Gestión de Datos (Opcional):**

```bash
npm install @tanstack/react-query
# o
npm install swr
```

## ✅ Tareas Completadas

- [x] Next.js 16 instalado
- [x] React 19 instalado
- [x] TypeScript configurado
- [x] Tailwind CSS 4 instalado
- [x] Zustand para estado global
- [x] Framer Motion para animaciones
- [x] Sonner para notificaciones
- [x] Axios para HTTP requests
- [x] react-hook-form + Zod para formularios
- [x] shadcn/ui componentes

## 🔄 Tareas Pendientes

- [ ] Instalar @casl/ability para permisos
- [ ] Instalar react-icons para iconografía
- [ ] Migrar a Zod v4 API (o downgrade a v3)
- [ ] Implementar dashboard customer
- [ ] Conectar con backend real
