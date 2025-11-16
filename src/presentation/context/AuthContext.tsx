// src/presentation/context/AuthContext.tsx

import { supabase } from "@/src/config/supabaseCliente";
import { Session, User } from "@supabase/supabase-js";
import { createContext, useContext, useEffect, useState } from "react";
import { UserRole } from "../../domain/entities/User";


// Definimos los tipos para nuestro contexto de autenticación
// type UserRole = "Entrenador" | "Cliente";

interface AuthContextType {
    session: Session | null;
    user: User | null;
    role: UserRole | null;
    loading: boolean;
}

// Creamos el contexto
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Creamos el componente Provider
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    // Aquí iría la lógica para manejar la sesión, el usuario, el rol y el estado de carga
    const [session, setSession] = useState<Session | null>(null);
    const [user, setUser] = useState<User | null>(null);
    const [role, setRole] = useState<UserRole | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        setLoading(true);

        // 1. Obtenemos la sesion y el usuario desde Supabase
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
            setUser(session?.user ?? null);
            setLoading(false);
        });

        // 2. Escuchamos los cambios en la autenticación
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            (_event, session) => {
                setSession(session);
                setUser(session?.user ?? null);
            }
        );

        return () => {
            subscription?.unsubscribe();
        };
    });

    // Efecto para obtener el Rol del usuario
    useEffect(() => {
        if (user) {
            const fetchRole = async () => {
                try {
                    const { data, error } = await supabase
                        .from('profiles')
                        .select('role')
                        .eq('id', user.id)
                        .single();

                    if (error) throw error;
                    if (data) {
                        setRole(data.role);
                    };

                } catch (error) {
                    console.error("Error al obtener el rol del usuario:", error);
                    setRole(null);
                }
            };

            fetchRole();
        } else {
            setRole(null);
        }
    }, [user]);

    return (
        <AuthContext.Provider value={{ session, user, role, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

// Hook personalizado para usar el contexto facilmente
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth debe usarse dentro de un AuthProvider");
    }
    return context;
}