// src/presentation/hooks/useLogin.ts
import { useState } from 'react';
import { useRouter } from 'expo-router';
import { Alert } from 'react-native';
import { supabase } from '../../config/supabaseCliente';

export function useLogin() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleLogin = async () => {
        setLoading(true);
        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) {
            Alert.alert('Error', error.message);
        }
        // No es necesario redirigir, el layout raíz lo hará
        setLoading(false);
    };

    // Devolvemos el estado y las funciones que la UI necesitará
    return {
        email,
        setEmail,
        password,
        setPassword,
        loading,
        handleLogin,
    };
}