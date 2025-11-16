// app/(auth)/forgot-password.tsx
import React from 'react';
import { View, Text, TextInput, Button } from 'react-native';
import { authStyles } from '../../src/presentation/styles/authStyles';
// --- 1. Importamos el nuevo hook de lógica ---
import { useForgotPassword } from '../../src/presentation/hooks/useForgotPassword';

export default function ForgotPasswordScreen() {
    // --- 2. Consumimos el hook ---
    const {
        email,
        setEmail,
        loading,
        handlePasswordReset,
    } = useForgotPassword();

    // --- 3. El JSX se mantiene idéntico ---
    return (
        < View style={authStyles.container} >
            < Text style={authStyles.title} > Recuperar Contraseña</Text >
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
        </View >
    );
}