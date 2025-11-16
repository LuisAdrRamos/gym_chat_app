// app/(auth)/forgot-password.tsx
import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { supabase } from '../../src/config/supabaseCliente';
import { authStyles } from '../../src/presentation/styles/authStyles';

export default function ForgotPasswordScreen() {
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

    return (
        <View style={authStyles.container}>
            <Text style={authStyles.title}>Recuperar Contraseña</Text>
            <Text style={{ textAlign: 'center', marginBottom: 20 }}>
                Ingresa tu email y te enviaremos un enlace para restablecer tu contraseña.
            </Text>

            <TextInput
                style={authStyles.input}
                placeholder="Tu email"
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
            />

            <Button
                title={loading ? 'Enviando...' : 'Enviar enlace de recuperación'}
                onPress={handlePasswordReset}
                disabled={loading}
            />
        </View>
    );
}