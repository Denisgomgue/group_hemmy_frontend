# Ejemplos de Uso - Frontend Grupo Hemmy

## 🔐 Ejemplos de Autenticación

### 1. Página de Login

```typescript
"use client";

import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";

export default function LoginPage() {
  const { login, isLoading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      await login(email, password);
      // Redirige automáticamente a /dashboard
    } catch (err: any) {
      setError(err.response?.data?.message || "Error al iniciar sesión");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button type="submit" disabled={isLoading}>
        Iniciar Sesión
      </button>
      {error && <p>{error}</p>}
    </form>
  );
}
```

### 2. Página Protegida

```typescript
"use client";

import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

export default function DashboardPage() {
  const { user, logout, checkAuth } = useAuth();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return (
    <ProtectedRoute>
      <div>
        <h1>Hola {user?.actor?.person?.email}</h1>
        <button onClick={logout}>Cerrar Sesión</button>
      </div>
    </ProtectedRoute>
  );
}
```

### 3. Obtener Usuario Actual

```typescript
"use client";

import { useAuth } from "@/hooks/useAuth";

export default function MiComponente() {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated) return null;

  return (
    <div>
      <p>Email: {user?.actor?.person?.email}</p>
      <p>Nombre: {user?.actor?.person?.firstName}</p>
    </div>
  );
}
```

## 📝 Ejemplos de Schemas y Validación

### Schema con Zod

```typescript
// schemas/client.schema.ts
import { z } from "zod";

export const clientSchema = z.object({
  email: z.string().email("Email inválido"),
  firstName: z.string().min(2, "Nombre demasiado corto"),
  lastName: z.string().min(2, "Apellido demasiado corto"),
  phone: z.string().optional(),
});

export type ClientFormData = z.infer<typeof clientSchema>;
```

### Uso con React Hook Form

```typescript
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { clientSchema } from "@/schemas/client.schema";

export default function ClientForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(clientSchema),
  });

  const onSubmit = (data: ClientFormData) => {
    console.log(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register("email")} />
      {errors.email && <p>{errors.email.message}</p>}

      <input {...register("firstName")} />
      {errors.firstName && <p>{errors.firstName.message}</p>}

      <button type="submit">Guardar</button>
    </form>
  );
}
```

## 🔌 Ejemplos de API Services

### Estructura de un Service

```typescript
// lib/api/client.ts
import api from "../api";
import { Client } from "@/types/client";

export interface CreateClientDto {
  email: string;
  firstName: string;
  lastName: string;
}

export const clientApi = {
  getAll: async (): Promise<Client[]> => {
    const response = await api.get<Client[]>("/client");
    return response.data;
  },

  getById: async (id: number): Promise<Client> => {
    const response = await api.get<Client>(`/client/${id}`);
    return response.data;
  },

  create: async (data: CreateClientDto): Promise<Client> => {
    const response = await api.post<Client>("/client", data);
    return response.data;
  },

  update: async (
    id: number,
    data: Partial<CreateClientDto>
  ): Promise<Client> => {
    const response = await api.patch<Client>(`/client/${id}`, data);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/client/${id}`);
  },
};
```

### Uso del Service

```typescript
"use client";

import { useState, useEffect } from "react";
import { clientApi } from "@/lib/api/client";
import { Client } from "@/types/client";

export default function ClientList() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadClients();
  }, []);

  const loadClients = async () => {
    try {
      const data = await clientApi.getAll();
      setClients(data);
    } catch (error) {
      console.error("Error al cargar clientes:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Cargando...</div>;

  return (
    <div>
      {clients.map((client) => (
        <div key={client.id}>
          {client.firstName} {client.lastName}
        </div>
      ))}
    </div>
  );
}
```

## 🎨 Ejemplos de Notificaciones

### Notificación de Éxito

```typescript
"use client";

import { useState } from "react";
import NotificationBanner from "@/components/ui/notification-banner";
import { clientApi } from "@/lib/api/client";

export default function ClientForm() {
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSubmit = async (data) => {
    await clientApi.create(data);
    setShowSuccess(true);
  };

  return (
    <>
      {showSuccess && (
        <NotificationBanner
          message="Cliente creado exitosamente"
          type="success"
          duration={3000}
          onClose={() => setShowSuccess(false)}
        />
      )}
      {/* Formulario */}
    </>
  );
}
```

### Notificación de Error

```typescript
"use client";

import { useState } from "react";
import NotificationBanner from "@/components/ui/notification-banner";

export default function MiComponente() {
  const [error, setError] = useState("");

  const handleAction = async () => {
    try {
      // Acción
    } catch (err) {
      setError("Ocurrió un error");
    }
  };

  return (
    <>
      {error && (
        <NotificationBanner
          message={error}
          type="error"
          duration={5000}
          onClose={() => setError("")}
        />
      )}
      {/* Contenido */}
    </>
  );
}
```

## 🛠️ Ejemplos de Utils

### Formatear Nombre

```typescript
import { formatName } from "@/lib/utils";

// Salida: "Juan P. Pérez"
const nombre = formatName("Juan Pedro", "Pérez");
```

### Formatear Moneda

```typescript
import { formatCurrency } from "@/lib/utils";

// Salida: "$1,250.00"
const precio = formatCurrency(1250);
```

### Formatear Fecha

```typescript
import { formatDate, formatDateTime } from "@/lib/utils";

// Salida: "15 de enero de 2024"
const fecha = formatDate("2024-01-15");

// Salida: "15 de enero de 2024, 10:30"
const fechaHora = formatDateTime("2024-01-15T10:30:00");
```

### Merge de Clases Tailwind

```typescript
import { cn } from "@/lib/utils";

const className = cn(
  "base-class",
  condition && "conditional-class",
  "another-class"
);
```

## 📊 Ejemplo Completo: CRUD de Clientes

```typescript
"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { clientSchema } from "@/schemas/client.schema";
import { clientApi } from "@/lib/api/client";
import { Client } from "@/types/client";

export default function ClientsPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(clientSchema),
  });

  useEffect(() => {
    loadClients();
  }, []);

  const loadClients = async () => {
    const data = await clientApi.getAll();
    setClients(data);
  };

  const onSubmit = async (data) => {
    if (selectedClient) {
      await clientApi.update(selectedClient.id, data);
    } else {
      await clientApi.create(data);
    }
    reset();
    setShowForm(false);
    setSelectedClient(null);
    loadClients();
  };

  const handleEdit = (client: Client) => {
    setSelectedClient(client);
    reset(client);
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (confirm("¿Está seguro?")) {
      await clientApi.delete(id);
      loadClients();
    }
  };

  return (
    <div>
      <h1>Clientes</h1>

      {showForm && (
        <form onSubmit={handleSubmit(onSubmit)}>
          <input {...register("email")} />
          {errors.email && <p>{errors.email.message}</p>}

          <input {...register("firstName")} />
          {errors.firstName && <p>{errors.firstName.message}</p>}

          <button type="submit">Guardar</button>
          <button
            type="button"
            onClick={() => {
              setShowForm(false);
              setSelectedClient(null);
              reset();
            }}
          >
            Cancelar
          </button>
        </form>
      )}

      <table>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Email</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {clients.map((client) => (
            <tr key={client.id}>
              <td>
                {client.firstName} {client.lastName}
              </td>
              <td>{client.email}</td>
              <td>
                <button onClick={() => handleEdit(client)}>Editar</button>
                <button onClick={() => handleDelete(client.id)}>
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
```

Este patrón se puede replicar para todos los módulos del sistema.
