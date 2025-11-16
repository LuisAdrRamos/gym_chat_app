// app/(tabs)/chat.tsx
import { View, Text, StyleSheet } from 'react-native';
import React from 'react';

export default function ChatScreen() {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Chat en Tiempo Real</Text>
            <Text>Próximamente: Chat entre Entrenador y Usuario.</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    title: { fontSize: 20, fontWeight: 'bold' },
});