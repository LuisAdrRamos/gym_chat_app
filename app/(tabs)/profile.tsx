// app/(tabs)/profile.tsx
import { View, Text, Button, Alert, StyleSheet } from 'react-native';
import React from 'react';
import { useAuth } from '../../src/presentation/context/AuthContext';
import { supabase } from '../../src/config/supabaseCliente';

export default function ProfileScreen() {
    const { user, role } = useAuth();

    const handleLogout = async () => {
        const { error } = await supabase.auth.signOut();
        if (error) {
            Alert.alert("Error", "No se pudo cerrar sesión: " + error.message);
        }
        // No necesitamos redirigir manualmente.
        // El AuthContext detectará el cambio y el RootLayout nos
        // enviará automáticamente a /(auth)/login.
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Mi Perfil</Text>
            <Text style={styles.info}>Email: {user?.email}</Text>
            <Text style={styles.info}>Rol: {role}</Text>

            <View style={styles.buttonContainer}>
                <Button title="Cerrar Sesión" onPress={handleLogout} color="red" />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20, paddingTop: 40 },
    title: { fontSize: 22, fontWeight: 'bold', marginBottom: 20 },
    info: { fontSize: 18, marginBottom: 10 },
    buttonContainer: { marginTop: 30 }
});