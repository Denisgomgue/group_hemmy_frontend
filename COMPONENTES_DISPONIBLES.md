# 📦 Guía de Componentes Disponibles - Grupo Hemmy

Este documento describe todos los componentes disponibles en tu proyecto y cómo te pueden ayudar.

---

## 🎨 1. Componentes UI Base (Shadcn/UI)

### Ubicación: `src/components/ui/`

Son componentes reutilizables basados en Radix UI y Tailwind CSS.

#### **Formularios y Entradas**

- **`input.tsx`** - Campo de entrada de texto
- **`textarea.tsx`** - Área de texto multilínea
- **`select.tsx`** - Selector dropdown
- **`checkbox.tsx`** - Casillas de verificación
- **`radio-group.tsx`** - Grupo de botones radio
- **`switch.tsx`** - Interruptor on/off
- **`slider.tsx`** - Control deslizante
- **`date-picker.tsx`** - Selector de fechas
- **`form.tsx`** - Manejo de formularios con React Hook Form
- **`ip-address-input.tsx`** - Input específico para direcciones IP

#### **Botones y Acciones**

- **`button.tsx`** - Botón estándar con variantes
- **`responsive-button.tsx`** - Botón que se adapta a móviles
- **`badge.tsx`** - Etiquetas/chips para mostrar estados
- **`status-badge.tsx`** - Badge específico para estados

#### **Contenedores y Layout**

- **`card.tsx`** - Tarjeta contenedora
- **`dialog.tsx`** - Modal/diálogo
- **`sheet.tsx`** - Panel lateral deslizante
- **`drawer.tsx`** - Cajón lateral
- **`popover.tsx`** - Popover flotante
- **`accordion.tsx`** - Acordeón plegable
- **`tabs.tsx`** - Pestañas
- **`separator.tsx`** - Separador visual

#### **Feedback y Notificaciones**

- **`toast.tsx`** - Notificaciones toast
- **`toaster.tsx`** - Contenedor de toasts
- **`alert.tsx`** - Alertas
- **`alert-dialog.tsx`** - Diálogo de confirmación
- **`skeleton.tsx`** - Placeholder de carga
- **`spinner.tsx`** - Indicador de carga
- **`progress.tsx`** - Barra de progreso

#### **Tablas y Datos**

- **`table.tsx`** - Estructura de tabla base
- **`scroll-area.tsx`** - Área con scroll personalizado

#### **Navegación**

- **`dropdown-menu.tsx`** - Menú desplegable
- **`command.tsx`** - Paleta de comandos (búsqueda)

#### **Otros Componentes Útiles**

- **`avatar.tsx`** - Avatar de usuario
- **`tooltip.tsx`** - Tooltip informativo
- **`calendar.tsx`** - Calendario
- **`label.tsx`** - Etiqueta para formularios
- **`chip.tsx`** - Chip/tag personalizable
- **`filter-tabs.tsx`** - Pestañas de filtro
- **`carousel.tsx`** - Carrusel de imágenes

#### **Componentes Especializados**

- **`image-upload.tsx`** - Subida de imágenes
- **`file-upload.tsx`** - Subida de archivos
- **`dropzone.tsx`** - Zona de arrastrar y soltar
- **`client-image.tsx`** - Mostrar imagen de cliente
- **`safe-image.tsx`** - Imagen con manejo de errores
- **`device-info.tsx`** - Información de dispositivos
- **`search-select-input.tsx`** - Input de búsqueda con autocompletado
- **`multi-step-form.tsx`** - Formulario de múltiples pasos
- **`confirm-dialog.tsx`** - Diálogo de confirmación genérico
- **`delete-confirmation-dialog.tsx`** - Diálogo para confirmar eliminación
- **`floating-notifications.tsx`** - Notificaciones flotantes
- **`notification-banner.tsx`** - Banner de notificaciones
- **`modal-content.tsx`** - Contenido de modal reutilizable
- **`CircuitBackground.tsx`** - Fondo animado tipo circuito

---

## 📊 2. Componentes de Tablas y Datos

### Ubicación: `src/components/dataTable/`

Sistema completo de tablas avanzadas con funcionalidades profesionales.

#### **Tabla Principal**

- **`table.tsx`** - Tabla genérica con:
  - Ordenamiento (sorting)
  - Paginación
  - Búsqueda
  - Navegación de páginas
  - Responsive

#### **Vista en Tarjetas**

- **`card-table.tsx`** - Vista de tarjetas (grid)
- **`card-table-skeleton.tsx`** - Skeleton para vista de tarjetas
- **`paginated-cards.tsx`** - Tarjetas paginadas

#### **Filtros Avanzados**

- **`advanced-filters.tsx`** - Panel de filtros avanzados con:
  - Filtros por checkbox
  - Rangos con slider
  - Rangos de fechas
  - Filtros múltiples
- **`filter-button.tsx`** - Botón para activar filtros
- **`checkbox-group.tsx`** - Grupo de checkboxes

#### **Herramientas de Tabla**

- **`table-toolbar.tsx`** - Barra de herramientas para tablas
- **`view-mode-switcher.tsx`** - Cambiar entre vista tabla/grilla
- **`responsive-table.tsx`** - Tabla adaptativa para móviles
- **`sector-selector.tsx`** - Selector de sectores para filtros

---

## 🔍 3. Componentes de Búsqueda y Selección

### Ubicación: `src/components/search-select/`

Componentes para búsqueda y selección inteligente de entidades.

- **`client-search-select.tsx`** - Buscar y seleccionar clientes
- **`employee-search-select.tsx`** - Buscar y seleccionar empleados
- **`plan-search-select.tsx`** - Buscar y seleccionar planes
- **`sector-search-select.tsx`** - Buscar y seleccionar sectores
- **`example-usage.tsx`** - Ejemplos de uso

**Características:**

- Búsqueda en tiempo real
- Autocompletado
- Mostrar información adicional (DNI, teléfono, etc.)
- Integración con hooks personalizados

---

## 🔐 4. Componentes de Autenticación y Permisos

### Ubicación: `src/components/auth/` y `src/components/permissions/`

#### **Autenticación**

- **`ProtectedRoute.tsx`** - Ruta protegida (requiere auth)

#### **Permisos**

- **`permission-guard.tsx`** - Proteger componentes por permisos
  - Verificación individual
  - Verificación múltiple (ANY/ALL)
  - Fallback cuando no hay permisos
  - HOC `withPermission()`
- **`can.tsx`** - Componente para renderizar condicionalmente por permisos

**Ejemplo de uso:**

```tsx
<PermissionGuard permission="users:create" module="users">
  <Button>Crear Usuario</Button>
</PermissionGuard>
```

---

## 💰 5. Componentes de Pagos

### Ubicación: `src/components/payment/`

- **`payment-summary-cards.tsx`** - Resumen de pagos con:
  - Total recaudado (con animación)
  - Contadores de pagos pagados/pendientes/atrasados/anulados
  - Toggle para mostrar/ocultar montos
- **`payment-status-badge.tsx`** - Badge de estado de pago
- **`payment-method-icon.tsx`** - Icono del método de pago
- **`payment-detail-modal.tsx`** - Modal con detalles de pago
- **`payment-preview-ticket.tsx`** - Vista previa de ticket de pago
- **`payment-professional-ticket.tsx`** - Ticket profesional para impresión
- **`download-options-modal.tsx`** - Opciones de descarga de tickets

---

## 📈 6. Componentes de Gráficos

### Ubicación: `src/components/chart/` y `src/componentsչarts/`

- **`chart-bar.tsx`** - Gráfico de barras
- **`chart-line.tsx`** - Gráfico de líneas
- **`chart-area.tsx`** - Gráfico de área
- **`chart-pie.tsx`** - Gráfico circular
- **`payment-predictions.tsx`** - Predicciones de pagos
- **`prediction-metrics.tsx`** - Métricas de predicción
- **`sectors-analytics-chart.tsx`** - Análisis por sectores

---

## 🎯 7. Componentes de Resumen (Summary Cards)

### Ubicación: `src/components/`

- **`info-summary-cards.tsx`** - Tarjetas de resumen genéricas
- **`info-card-shell.tsx`** - Shell para tarjetas de información
- **`client-summary-cards.tsx`** - Resumen de clientes
- **`device-summary-cards.tsx`** - Resumen de dispositivos
- **`payment-summary-cards.tsx`** - Resumen de pagos (ver sección Pagos)

---

## 🎨 8. Componentes de Layout

### Ubicación: `src/components/layout/`

- **`main-container.tsx`** - Contenedor principal de páginas
- **`header-actions.tsx`** - Acciones del header
- **`add-button.tsx`** - Botón flotante para agregar
- **`reload-button.tsx`** - Botón de recargar/actualizar

---

## 🗂️ 9. Componentes de Sidebar y Navegación

### Ubicación: `src/components/sidebar/`

- **`sidebar.tsx`** - Sidebar principal con navegación
- **`sidebar-menu-item.tsx`** - Item del menú del sidebar
- **`sidebar-dropdown.tsx`** - Menú desplegable del sidebar
- **`top-bar.tsx`** - Barra superior con:
  - Información del usuario
  - Notificaciones
  - Configuración de tema
  - Logout
- **`theme-settings.tsx`** - Configuración de tema
- **`language-selector.tsx`** - Selector de idioma
- **`notifications.tsx`** - Sistema de notificaciones

---

## 🌐 10. Componentes Públicos (Landing Page)

### Ubicación: `src/components/public/`

- **`navbar.tsx`** - Navegación de la página pública
- **`hero-section.tsx`** - Sección hero principal
- **`plans-section.tsx`** - Sección de planes de internet
- **`features-section.tsx`** - Características y beneficios
- **`about-section.tsx`** - Sobre la empresa
- **`contact-section.tsx`** - Formulario de contacto
- **`footer.tsx`** - Footer de la página pública

---

## 👥 11. Componentes de Usuarios

### Ubicación: `src/components/user/`

- **`user-card.tsx`** - Tarjeta de usuario
- **`user-columns.tsx`** - Columnas para tabla de usuarios
- **`user-form-modal.tsx`** - Modal de formulario de usuario

---

## 🔧 12. Componentes Especializados

### Recursos

- **`resources/resources-table.tsx`** - Tabla de recursos
- **`resources/add-resource-modal.tsx`** - Modal para agregar recursos

### Roles

- **`roles/role-form.tsx`** - Formulario de roles

### Empresa

- **`company/company-info-display.tsx`** - Mostrar información de empresa

### Módulos

- **`modules/payment-actions.tsx`** - Acciones de pagos
- **`modules/payment-summary-cards.tsx`** - Resumen de pagos (módulo)

### Chatbot

- **`chatbot/floating-chatbot.tsx`** - Chatbot flotante

### Partículas

- **`Particles/Particles.js`** - Efecto de partículas animadas

---

## 🎯 ¿Cómo te Ayudan Estos Componentes?

### ✅ **Ahorro de Tiempo**

- Componentes pre-construidos listos para usar
- No necesitas crear desde cero
- Consistencia visual en toda la app

### ✅ **Mantenibilidad**

- Código centralizado y reutilizable
- Fácil de actualizar en un solo lugar
- Mejor organización del proyecto

### ✅ **Funcionalidades Avanzadas**

- Tablas con sorting, paginación, filtros
- Búsqueda inteligente con autocompletado
- Sistema de permisos integrado
- Gráficos y visualizaciones de datos

### ✅ **UX/UI Profesional**

- Componentes accesibles
- Responsive por defecto
- Animaciones y transiciones suaves
- Dark mode compatible

### ✅ **Integración Backend**

- Hooks personalizados integrados
- Manejo de estados de carga
- Manejo de errores
- React Query integrado

---

## 📝 Ejemplos de Uso Rápido

### Usar una Tabla

```tsx
import { GeneralTable } from "@/components/dataTable/table";

<GeneralTable
  columns={columns}
  data={data}
  isLoading={loading}
  onPaginationChange={handlePageChange}
/>;
```

### Usar Búsqueda de Clientes

```tsx
import { ClientSearchSelect } from "@/components/search-select/client-search-select";

<ClientSearchSelect
  value={clientId}
  onChange={setClientId}
  placeholder="Buscar cliente..."
/>;
```

### Proteger con Permisos

```tsx
import { PermissionGuard } from "@/components/permissions/permission-guard";

<PermissionGuard permission="users:create">
  <Button>Crear Usuario</Button>
</PermissionGuard>;
```

### Resumen de Pagos

```tsx
import { PaymentSummaryCards } from "@/components/payment/payment-summary-cards";

<PaymentSummaryCards summary={paymentData} isLoading={loading} />;
```

---

## 🚀 Próximos Pasos

1. **Revisar Componentes Específicos**: Lee los archivos de componentes que necesites para entender su API completa
2. **Customizar**: Adapta los componentes a tus necesidades específicas
3. **Extender**: Crea variantes o nuevos componentes basados en los existentes
4. **Documentar**: Agrega JSDoc a componentes personalizados que crees

---

**💡 Tip**: Todos estos componentes están construidos con TypeScript, por lo que tendrás autocompletado y type-checking en tu IDE.
