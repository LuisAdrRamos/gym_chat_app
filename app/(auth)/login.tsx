// app/(auth)/login.tsx
import { Link, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, Button, Text, TextInput, View } from 'react-native';
import { supabase } from '../../src/config/supabaseCliente';
import { authStyles } from '../../src/presentation/styles/authStyles'; // <-- Importar

export default function LoginScreen() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleLogin = async () => {
        setLoading(true);
        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) {
            Alert.alert('Error', error.message);
        }
        // No es necesario redirigir, el layout raíz lo hará
        setLoading(false);
    };

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

            <Button title={loading ? 'Iniciando...' : 'Iniciar Sesión'} onPress={handleLogin} disabled={loading} />
            
            <Link href="/(auth)/forgot-password" style={[authStyles.link, { marginTop: 10 }]}>
                ¿Olvidaste tu contraseña?
            </Link>

            <Link href="/(auth)/register" style={authStyles.link}>
                ¿No tienes cuenta? Regístrate
            </Link>
        </View>
    );
}