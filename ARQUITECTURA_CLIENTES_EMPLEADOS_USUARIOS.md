# 🏗️ Arquitectura: Clientes, Empleados y Usuarios

## 📋 Regla de Negocio Principal

**Los Usuarios NO se crean directamente.** Solo se crean cuando:

1. Se crea un **Cliente** (opcionalmente)
2. Se crea un **Empleado** (opcionalmente)
3. **Excepción**: El superadministrador (creado por seeder)

---

## 🔄 Flujos de Creación

### 1️⃣ Crear Cliente

**Cliente puede ser Persona u Organización:**

#### A) Cliente como Persona:

```
1. Crear Persona
   ├─ documentType: DNI
   ├─ documentNumber
   ├─ firstName, lastName
   ├─ email, phone, address
   └─ birthdate

2. Crear Actor
   ├─ kind: 'PERSON'
   ├─ displayName: "firstName lastName"
   └─ personId: persona.id

3. Crear Cliente
   ├─ actorId: actor.id
   └─ status: ACTIVE | INACTIVE | SUSPENDED

4. [OPCIONAL] Crear Usuario
   ├─ actorId: actor.id (el mismo del Cliente)
   ├─ passwordHash
   └─ isActive: true
```

#### B) Cliente como Organización:

```
1. Crear Organización
   ├─ legalName
   ├─ documentType: RUC
   ├─ documentNumber
   ├─ email, phone, address
   └─ representativePersonId: (opcional, persona representante)

2. Crear Actor
   ├─ kind: 'ORGANIZATION'
   ├─ displayName: organization.legalName
   └─ organizationId: organization.id

3. Crear Cliente
   ├─ actorId: actor.id
   └─ status: ACTIVE | INACTIVE | SUSPENDED

4. [OPCIONAL] Crear Usuario
   ├─ actorId: actor.id (el mismo del Cliente)
   ├─ passwordHash
   └─ isActive: true
```

---

### 2️⃣ Crear Empleado

**Empleado SIEMPRE es una Persona:**

```
1. Crear Persona
   ├─ documentType: DNI
   ├─ documentNumber
   ├─ firstName, lastName
   ├─ email, phone, address
   └─ birthdate

2. Crear Empleado
   ├─ personId: persona.id
   ├─ jobTitle: "Cargo"
   ├─ hireDate: fecha
   └─ status: ACTIVE | INACTIVE

3. [OPCIONAL] Crear Actor (para poder crear Usuario)
   ├─ kind: 'PERSON'
   ├─ displayName: "firstName lastName"
   └─ personId: persona.id

4. [OPCIONAL] Crear Usuario
   ├─ actorId: actor.id
   ├─ passwordHash
   └─ isActive: true
```

**Nota importante**: El Empleado NO tiene Actor directamente en su entidad, pero para crear un Usuario necesitamos un Actor, por lo que se crea el Actor si se desea crear Usuario.

---

## 🎯 Página de Usuarios (`/administration/users`)

### ¿Qué debe mostrar?

- **Solo lectura**: Lista de todos los usuarios existentes
- **NO debe permitir crear** usuarios directamente
- **Puede permitir**:
  - Ver detalles
  - Editar `isActive`
  - Cambiar `passwordHash` (reset de contraseña)
  - Eliminar (con validaciones)

### ¿Qué debe hacer?

- Mostrar usuarios vinculados a Clientes
- Mostrar usuarios vinculados a Empleados
- Mostrar el superadministrador

---

## 📁 Estructura de Schemas Recomendada

```
src/schemas/
├── person-schema.ts          # Schema para Persona (DNI, nombres, etc.)
├── organization-schema.ts    # Schema para Organización (RUC, legalName, etc.)
├── client-schema.ts          # Schema para Cliente (status, actorId)
├── employee-schema.ts        # Schema para Empleado (jobTitle, hireDate, status, personId)
└── user-schema.ts            # Schema para Usuario (solo passwordHash, isActive, actorId)
```

---

## 🔐 Lógica de Usuarios

### Crear Usuario desde Cliente:

- Checkbox: "Crear cuenta de usuario para este cliente"
- Si está marcado → después de crear Cliente, crear Usuario
- Formulario incluye: Password + Confirm Password + isActive

### Crear Usuario desde Empleado:

- Checkbox: "Crear cuenta de usuario para este empleado"
- Si está marcado → crear Actor (si no existe) + crear Usuario
- Formulario incluye: Password + Confirm Password + isActive

---

## ✅ Resumen

1. **Usuarios NO se crean desde `/administration/users`**
2. **Usuarios se crean desde:**
   - Formulario de Cliente (opcional)
   - Formulario de Empleado (opcional)
3. **`/administration/users` es solo para:**
   - Ver usuarios
   - Gestionar estado (activar/desactivar)
   - Reset de contraseña
   - Eliminar (con validaciones)
