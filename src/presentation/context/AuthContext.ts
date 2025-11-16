// src/presentation/context/AuthContext.ts
import { Session, User } from "@supabase/supabase-js";
import { createContext, useContext } from "react";
import { UserRole } from "../../domain/entities/User";

// 1. Definimos el tipo de datos del contexto
export interface AuthContextType {
    session: Session | null;
    user: User | null;
    role: UserRole | null;
    loading: boolean;
}

// 2. Creamos el contexto (sin un provider aquí)
export const AuthContext = createContext<AuthContextType | undefined>(undefined);

// 3. Creamos el hook para consumir el contexto
// (Este hook sí puede vivir aquí, ya que se usará en archivos .tsx)
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth debe usarse dentro de un AuthProvider");
    }
    return context;
};