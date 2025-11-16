// src/presentation/hooks/useAuthProvider.ts
import { useState, useEffect } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '../../config/supabaseCliente';
import { UserRole } from '../../domain/entities/User';

export function useAuthProvider() {
    const [session, setSession] = useState<Session | null>(null);
    const [user, setUser] = useState<User | null>(null);
    const [role, setRole] = useState<UserRole | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    // EFECTO 1: Cargar sesión y escuchar cambios de auth
    useEffect(() => {
        setLoading(true);

        // 1. Obtenemos la sesion
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
            setUser(session?.user ?? null);
            setLoading(false);
        });

        // 2. Escuchamos los cambios
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            (_event, session) => {
                setSession(session);
                setUser(session?.user ?? null);
            }
        );

        return () => {
            subscription?.unsubscribe();
        };
    }, []); // <-- ¡LA CORRECCIÓN DEL BUCLE INFINITO ESTÁ AQUÍ!

    // EFECTO 2: Obtener el Rol del usuario
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
                    }
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

    // Devolvemos los valores que el Provider necesita
    return {
        session,
        user,
        role,
        loading,
    };
}