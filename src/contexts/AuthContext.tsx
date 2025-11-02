import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/axios";
import { User } from "@/types/user";

type AuthContextType = {
  user: User | null;
  setUser: (user: User | null) => void;
  loading: boolean;
  logout: () => void;
};

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const router = useRouter();
  const [ user, setUser ] = useState<User | null>(null);
  const [ loading, setLoading ] = useState(true);

  // Cargar usuario desde localStorage al inicializar
  useEffect(() => {
    const loadUser = async () => {
      const userProfile = localStorage.getItem("userProfile");
      if (userProfile) {
        try {
          // Verificar que el token sigue siendo válido obteniendo el perfil
          const response = await api.post("/auth/profile");
          setUser(response.data);
        } catch (error) {
          console.error("Error loading user profile:", error);
          // Si hay error, limpiar localStorage y redirigir
          localStorage.removeItem("userProfile");
          localStorage.removeItem("passwordHash");
        }
      }
      setLoading(false);
    };

    loadUser();
  }, []);

  const logout = async () => {
    try {
      // Llamar al endpoint de logout del backend para limpiar cookies
      await api.post("/auth/logout");
    } catch (error) {
      console.error("Error logging out:", error);
    } finally {
      // Limpiar localStorage
      localStorage.removeItem("userProfile");
      localStorage.removeItem("passwordHash");
      setUser(null);
      router.push("/login");
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        loading,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
