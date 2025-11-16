// app/(tabs)/_layout.tsx
import { Tabs } from 'expo-router';
import React from 'react';
import { FontAwesome, Ionicons } from '@expo/vector-icons'; // Usaremos estos íconos

export default function TabsLayout() {
    return (
        <Tabs
            screenOptions={{
                tabBarActiveTintColor: '#007AFF', // Un color activo
            }}
        >
            <Tabs.Screen
                name="index" // Corresponde a index.tsx
                options={{
                    title: 'Inicio',
                    tabBarIcon: ({ color, size }) => (
                        <FontAwesome name="home" size={size} color={color} />
                    ),
                    headerShown: false, // Ocultamos el header por defecto aquí
                }}
            />
            <Tabs.Screen
                name="chat" // Corresponde a chat.tsx
                options={{
                    title: 'Chat',
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="chatbubbles" size={size} color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="profile" // Corresponde a profile.tsx
                options={{
                    title: 'Perfil',
                    tabBarIcon: ({ color, size }) => (
                        <FontAwesome name="user" size={size} color={color} />
                    ),
                }}
            />
        </Tabs>
    );
}