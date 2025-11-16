// src/presentation/hooks/useRegister.ts
import { useState } from 'react';
import { useRouter } from 'expo-router';
import { Alert } from 'react-native';
import { supabase } from '../../config/supabaseCliente';
import { UserRole } from '../../domain/entities/User';

export function useRegister() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState<UserRole>('Usuario'); // Rol por defecto
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleRegister = async () => {
        if (!role) {
            Alert.alert('Error', 'Por favor, selecciona un rol.');
            return;
        }

        setLoading(true);
        const { error } = await supabase.auth.signUp({
            email,
            password,
            // Pasamos el rol en 'data' para que el trigger lo lea.
            options: {
                data: {
                    role: role,
                },
            },
        });

        if (error) {
            Alert.alert('Error', error.message);
        } else {
            Alert.alert('Éxito', '¡Registro exitoso! Revisa tu email para confirmar.');
            router.push('/login'); // Enviamos al login
        }
        setLoading(false);
    };

    return {
        email,
        setEmail,
        password,
        setPassword,
        role,
        setRole,
        loading,
        handleRegister,
    };
}