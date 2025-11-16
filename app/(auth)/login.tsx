// app/(auth)/login.tsx
import React from 'react';
import { View, Text, TextInput, Button } from 'react-native';
import { Link } from 'expo-router';
import { authStyles } from '../../src/presentation/styles/authStyles';
// --- 1. Importamos el nuevo hook de lógica ---
import { useLogin } from '../../src/presentation/hooks/useLogin';

export default function LoginScreen() {
    // --- 2. Consumimos el hook ---
    const {
        email,
        setEmail,
        password,
        setPassword,
        loading,
        handleLogin,
    } = useLogin();

    // --- 3. El JSX se mantiene casi idéntico ---
    return (
        <View style={authStyles.container}>
            <Text style={authStyles.title}>Iniciar Sesión</Text>

            <TextInput
                style={authStyles.input}
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
            />

            <TextInput
                style={authStyles.input}
                placeholder="Contraseña"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
            />

            <Button
                title={loading ? 'Iniciando...' : 'Iniciar Sesión'}
                onPress={handleLogin}
                disabled={loading}
            />

            <Link href="/(auth)/register" style={authStyles.link}>
                ¿No tienes cuenta? Regístrate
            </Link>
            <Link href="/(auth)/forgot-password" style={[authStyles.link, { marginTop: 10 }]}>
                ¿Olvidaste tu contraseña?
            </Link>
        </View>
    );
}