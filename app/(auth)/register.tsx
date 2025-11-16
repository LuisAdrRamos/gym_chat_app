// app/(auth)/register.tsx
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, Button, Pressable, Text, TextInput, View } from 'react-native';
import { supabase } from '../../src/config/supabaseCliente';
import { authStyles } from '../../src/presentation/styles/authStyles';
import { UserRole } from '../../src/domain/entities/User';

export default function RegisterScreen() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState<UserRole>('Usuario');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleRegister = async () => {
        // ... (la lógica de handleRegister sigue igual) ...
        if (!role) {
            Alert.alert('Error', 'Por favor, selecciona un rol.');
            return;
        }

        setLoading(true);
        const { error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    role: role,
                },
            },
        });

        if (error) {
            Alert.alert('Error', error.message);
        } else {
            Alert.alert('Éxito', '¡Registro exitoso! Revisa tu email para confirmar.');
            router.push('/(auth)/login');
        }
        setLoading(false);
    };

    return (
        <View style={authStyles.container}>
            <Text style={authStyles.title}>Crear Cuenta</Text>

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
                placeholder="Contraseña (mín. 6 caracteres)"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
            />

            <Text style={authStyles.roleLabel}>Selecciona tu rol:</Text>
            <View style={authStyles.roleContainer}>
                <Pressable
                    style={[authStyles.roleButton, role === 'Usuario' && authStyles.roleButtonSelected]}
                    onPress={() => setRole('Usuario')}>
                    <Text style={role === 'Usuario' ? authStyles.roleTextSelected : authStyles.roleText}>Usuario</Text>
                </Pressable>
                <Pressable
                    style={[authStyles.roleButton, role === 'Entrenador' && authStyles.roleButtonSelected]}
                    onPress={() => setRole('Entrenador')}>
                    <Text style={role === 'Entrenador' ? authStyles.roleTextSelected : authStyles.roleText}>Entrenador</Text>
                </Pressable>
            </View>

            <Button title={loading ? 'Registrando...' : 'Crear Cuenta'} onPress={handleRegister} disabled={loading} />
        </View>
    );
}