// app/(tabs)/chat/_layout.tsx
import { Stack } from 'expo-router';
import React from 'react';

export default function ChatStack() {
    return (
        <Stack>
            <Stack.Screen
                name="index" // Esta es la lista de contactos
                options={{ headerShown: false }} // Ocultamos el header aquí
            />
            <Stack.Screen
                name="[receiver_id]" // Esta es la conversación
                options={{ headerShown: true }} // El header se mostrará (viene de _layout.tsx de (tabs))
            />
        </Stack>
    );
}