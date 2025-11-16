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
            {/* --- PESTAÑAS VISIBLES --- */}
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
                name="chat" // Carpeta /chat
                options={{
                    title: 'Chat',
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="chatbubbles" size={size} color={color} />
                    ),
                    headerShown: false,
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

            {/* --- PANTALLAS Y CARPETAS OCULTAS --- */}
            <Tabs.Screen
                name="assign-plan"
                options={{
                    href: null,
                    headerShown: true,
                }}
            />
            <Tabs.Screen
                name="(components)/TrainerDashboard"
                options={{
                    href: null,
                }}
            />
            <Tabs.Screen
                name="(components)/UserDashboard"
                options={{
                    href: null,
                }}
            />

            {/* --- AÑADE ESTA ENTRADA PARA CORREGIR EL TABBAR --- */}
            <Tabs.Screen
                name="(components)/RoutineVideoPlayer"
                options={{
                    href: null,
                }}
            />
        </Tabs>
    );
}