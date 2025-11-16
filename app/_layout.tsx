// app/_layout.tsx
import React, { useEffect } from 'react';
import { Stack, useRouter, useSegments, useRootNavigationState } from 'expo-router';
// --- 1. MODIFICA ESTA LÍNEA ---
// Añade 'useAuth' a la importación
import { AuthContext, useAuth } from '../src/presentation/context/AuthContext';
import { useAuthProvider } from '../src/presentation/hooks/useAuthProvider';
import { ActivityIndicator, View } from 'react-native';

// Esta función es el "Consumidor" del hook
function RootLayoutNav() {
    // --- 2. Esta línea ahora funcionará ---
    const { session, loading } = useAuth();

    const router = useRouter();
    const segments = useSegments();
    const navigationState = useRootNavigationState();

    useEffect(() => {
        if (loading || !navigationState?.key) {
            return;
        }
        const inAuthGroup = segments[0] === '(auth)';

        if (!session && !inAuthGroup) {
            router.replace('/login');
        }
        else if (session && inAuthGroup) {
            router.replace('/');
        }
    }, [session, loading, segments, router, navigationState?.key]);

    // Spinner mientras carga
    if (loading || !navigationState?.key) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color="#007AFF" />
            </View>
        );
    }

    // El Stack explícito
    return (
        <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="(auth)" />
            <Stack.Screen name="(tabs)" />
        </Stack>
    );
}

// El export principal ahora es el PROVIDER
export default function RootLayout() {
    const authLogic = useAuthProvider();

    return (
        <AuthContext.Provider value={authLogic}>
            <RootLayoutNav />
        </AuthContext.Provider>
    );
}