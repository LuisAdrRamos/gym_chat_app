// src/presentation/hooks/useForgotPassword.ts
import { useState } from 'react';
import { useRouter } from 'expo-router';
import { Alert } from 'react-native';
import { supabase } from '../../config/supabaseCliente';

export function useForgotPassword() {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handlePasswordReset = async () => {
        setLoading(true);
        // Esta es la función clave de Supabase
        const { error } = await supabase.auth.resetPasswordForEmail(email);

        setLoading(false);

        if (error) {
            Alert.alert('Error', error.message);
        } else {
            Alert.alert('Éxito', 'Revisa tu bandeja de entrada para las instrucciones.');
            router.back(); // Regresa al login
        }
    };

    return {
        email,
        setEmail,
        loading,
        handlePasswordReset,
    };
}