// app/(tabs)/_layout.tsx
import { Tabs } from 'expo-router';
import React from 'react';
import { FontAwesome, Ionicons } from '@expo/vector-icons';

export default function TabsLayout() {
    return (
        <Tabs
            screenOptions={{
                tabBarActiveTintColor: '#007AFF',
            }}
        >
            {/* (Tabs.Screen para 'index', 'chat', 'profile' sin cambios) */}
            <Tabs.Screen
                name="index"
                options={{
                    title: 'Inicio',
                    tabBarIcon: ({ color, size }) => (
                        <FontAwesome name="home" size={size} color={color} />
                    ),
                    headerShown: false,
                }}
            />
            <Tabs.Screen
                name="chat" // <-- Esta es la lista de contactos
                options={{
                    title: 'Chat',
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="chatbubbles" size={size} color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="profile"
                options={{
                    title: 'Perfil',
                    tabBarIcon: ({ color, size }) => (
                        <FontAwesome name="user" size={size} color={color} />
                    ),
                }}
            />

            {/* (Screen de 'assign-plan' sin cambios) */}
            <Tabs.Screen
                name="assign-plan"
                options={{
                    title: 'Asignar Plan',
                    href: null,
                    headerShown: true,
                }}
            />

            {/* --- AÑADIR ESTA PANTALLA --- */}
            {/* Esta es la pantalla de conversación específica */}
            <Tabs.Screen
                name="chat/[receiver_id]" // Ruta dinámica
                options={{
                    title: 'Conversación',
                    href: null, // Oculta del TabBar
                    headerShown: true, // Muestra un header con botón de "atrás"
                }}
            />
        </Tabs>
    );
}