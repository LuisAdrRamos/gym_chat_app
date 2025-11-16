// app/(tabs)/chat.tsx
import { View, Text, StyleSheet } from 'react-native';
import React from 'react';
import { tabsStyles } from '../../src/presentation/styles/tabsStyles'; // <-- Importar

export default function ChatScreen() {
    return (
        // --- Usar los estilos importados ---
        <View style={tabsStyles.chat_container}>
            <Text style={tabsStyles.chat_title}>Chat en Tiempo Real</Text>
            <Text>Próximamente: Chat entre Entrenador y Usuario.</Text>
        </View>
    );
}
