// app/_layout.tsx
import React, { useEffect } from 'react';
import { Slot, useRouter, useSegments } from 'expo-router';
import { AuthProvider, useAuth } from '../src/presentation/context/AuthContext';
import { ActivityIndicator, View } from 'react-native';

// Este componente está DENTRO del provider, por lo que puede usar useAuth()
function InitialLayout() {
    const { session, loading } = useAuth();
    const router = useRouter();
    const segments = useSegments(); // Obtiene la ruta actual (ej: ['(auth)', 'login'])

    useEffect(() => {
        // 1. Si está cargando, no hacemos nada (se muestra el spinner)
        if (loading) {
            return;
        }

        // 2. Verificamos si estamos en una pantalla de autenticación
        const inAuthGroup = segments[0] === '(auth)';

        // 3. Lógica de redirección

        // Si NO hay sesión y NO estamos en el grupo (auth),
        // redirigir al login.
        if (!session && !inAuthGroup) {
            router.replace('/(auth)/login');
        }
        // Si HAY sesión y ESTAMOS en el grupo (auth) (ej: en la pantalla de login)
        // redirigir a la app principal (que será /tabs).
        else if (session && inAuthGroup) {
            router.replace('/(tabs)'); // (Aún no existe, pero lo crearemos)
        }

    }, [session, loading, segments, router]); // Se re-ejecuta cuando cambian estos valores

    // Mientras carga la sesión, mostramos un spinner
    if (loading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color="#007AFF" />
            </View>
        );
    }

    // Si no está cargando, renderiza la pantalla actual
    return <Slot />;
}

// Layout Raíz (Wrapper principal)
export default function RootLayout() {
    return (
        // Envolvemos toda la app con nuestro AuthProvider
        <AuthProvider>
            <InitialLayout />
        </AuthProvider>
    );
}