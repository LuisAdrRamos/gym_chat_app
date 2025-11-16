// app/(tabs)/profile.tsx
import { View, Text, Button, Alert, StyleSheet } from 'react-native';
import React from 'react';
import { useAuth } from '../../src/presentation/context/AuthContext';
import { supabase } from '../../src/config/supabaseCliente';
import { tabsStyles } from '../../src/presentation/styles/tabsStyles'; // <-- Importar

export default function ProfileScreen() {
    const { user, role } = useAuth();

    const handleLogout = async () => {
        const { error } = await supabase.auth.signOut();
        if (error) {
            Alert.alert('Error', 'No se pudo cerrar sesión: ' + error.message);
        }
        // Redirección automática por el AuthContext
    };

    return (
        // --- Usar los estilos importados ---
        <View style={tabsStyles.profile_container}>
            <Text style={tabsStyles.profile_title}>Mi Perfil</Text>
            <Text style={tabsStyles.profile_info}>Email: {user?.email}</Text>
            <Text style={tabsStyles.profile_info}>Rol: {role}</Text>

            <View style={tabsStyles.profile_buttonContainer}>
                <Button title="Cerrar Sesión" onPress={handleLogout} color="red" />
            </View>
        </View>
    );
}