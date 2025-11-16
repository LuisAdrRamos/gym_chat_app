// app/(auth)/_layout.tsx
import { Stack } from 'expo-router';
import React from 'react';

export default function AuthLayout() {
    return (
        <Stack>
            <Stack.Screen name="login" options={{ headerShown: false }} />
            <Stack.Screen name="register" options={{ headerShown: false }} />
            <Stack.Screen
                name="forgot-password"
                options={{
                    title: 'Recuperar Contraseña',
                    headerBackTitle: 'Login', // Título del botón "Atrás" en iOS
                    headerShown: true // Es útil mostrarlo aquí para poder volver
                }}
            />
        </Stack>
    );
}