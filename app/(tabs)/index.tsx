// app/(tabs)/index.tsx
import { View, Text, ActivityIndicator } from 'react-native';
import React from 'react';
import { useAuth } from '../../src/presentation/context/AuthContext';
import { SafeAreaView } from 'react-native-safe-area-context';

// Estilos
import { tabsStyles } from '../../src/presentation/styles/tabsStyles';

// --- AHORA IMPORTAMOS LOS COMPONENTES LOCALES ---
import TrainerDashboard from './(components)/TrainerDashboard';
import UserDashboard from './(components)/UserDashboard';

export default function DashboardScreen() {
    const { user, role, loading } = useAuth();

    // Función para renderizar el dashboard correcto
    const renderDashboard = () => {
        if (loading || !user) {
            return (
                <View style={tabsStyles.index_centered}>
                    <ActivityIndicator size="large" color="#007AFF" />
                </View>
            );
        }

        switch (role) {
            case 'Entrenador':
                return <TrainerDashboard user={user} />;
            case 'Usuario':
                return <UserDashboard user={user} />;
            default:
                // Fallback en caso de que el rol sea null (mientras carga) o inesperado
                return (
                    <View style={tabsStyles.index_centered}>
                        <ActivityIndicator size="large" color="#007AFF" />
                    </View>
                );
        }
    };

    return (
        <SafeAreaView style={tabsStyles.index_container}>
            {loading ? (
                <View style={tabsStyles.index_centered}>
                    <ActivityIndicator size="large" color="#007AFF" />
                </View>
            ) : (
                <>
                    <Text style={tabsStyles.index_title}>Bienvenido, {user?.email}</Text>
                    <Text style={tabsStyles.index_roleText}>{role}</Text>
                    {renderDashboard()}
                </>
            )}
        </SafeAreaView>
    );
}