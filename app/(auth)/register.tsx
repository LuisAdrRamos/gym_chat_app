// app/(auth)/register.tsx
import React from 'react';
import { View, Text, TextInput, Button, Pressable } from 'react-native';
import { authStyles } from '../../src/presentation/styles/authStyles';
import { UserRole } from '../../src/domain/entities/User'; // <-- Este tipo aún lo necesita la UI
// --- 1. Importamos el nuevo hook de lógica ---
import { useRegister } from '../../src/presentation/hooks/useRegister';

export default function RegisterScreen() {
    // --- 2. Consumimos el hook ---
    const {
        email,
        setEmail,
        password,
        setPassword,
        role,
        setRole,
        loading,
        handleRegister,
    } = useRegister();

    // --- 3. El JSX se mantiene idéntico ---
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

            <Button
                title={loading ? 'Registrando...' : 'Crear Cuenta'}
                onPress={handleRegister}
                disabled={loading}
            />
        </View>
    );
}