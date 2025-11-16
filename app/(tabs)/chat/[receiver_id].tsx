// app/(tabs)/chat/[receiver_id].tsx
import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
    View, Text, TextInput, Button, FlatList, ActivityIndicator, Alert, KeyboardAvoidingView, Platform
} from 'react-native';
import { useLocalSearchParams, useNavigation } from 'expo-router';
import { useAuth } from '../../../src/presentation/context/AuthContext';
import { chatStyles } from '../../../src/presentation/styles/chatStyles';
import { authStyles } from '../../../src/presentation/styles/authStyles';

// Importaciones del Dominio y Datos del Chat
import { Message } from '../../../src/domain/entities/Message';
import { SupabaseMessageRepository } from '../../../src/data/repositories/SupabaseMessageRepository';

// Instancia del Repositorio
const messageRepository = new SupabaseMessageRepository();

export default function ConversationScreen() {
    const { user: currentUser } = useAuth();
    const flatListRef = useRef<FlatList>(null);
    const { receiver_id, receiver_name } = useLocalSearchParams();
    const navigation = useNavigation();

    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const [enviando, setEnviando] = useState(false);

    const otherUserId = Array.isArray(receiver_id) ? receiver_id[0] : receiver_id;

    // 1. Cargar Historial de Mensajes (sin cambios)
    useEffect(() => {
        if (!currentUser || !otherUserId) {
            setLoading(false);
            return;
        }
        navigation.setOptions({ title: receiver_name || `Chat con ID: ${otherUserId.slice(0, 8)}` });

        const fetchMessages = async () => {
            try {
                const history = await messageRepository.getMessages(currentUser.id, otherUserId);
                setMessages(history);
            } catch (error) { Alert.alert("Error", "No se pudo cargar el historial."); }
            setLoading(false);
        };
        fetchMessages();
    }, [currentUser, otherUserId, receiver_name, navigation]);

    // 2. Suscribirse a Mensajes en Tiempo Real (sin cambios)
    useEffect(() => {
        if (!currentUser || !otherUserId) return;

        const handleNewMessage = (newMessage: Message) => {
            const isMyMessage = newMessage.sender_id === currentUser.id && newMessage.receiver_id === otherUserId;
            const isTheirMessage = newMessage.sender_id === otherUserId && newMessage.receiver_id === currentUser.id;

            if (isMyMessage || isTheirMessage) {
                setMessages(currentMessages => [...currentMessages, newMessage]);
            }
        };
        const unsubscribe = messageRepository.subscribeToMessages(handleNewMessage);
        return () => unsubscribe();
    }, [currentUser, otherUserId]);

    // 3. Enviar un Mensaje Nuevo (sin cambios)
    const handleSendMessage = async () => {
        if (newMessage.trim() === '' || !currentUser || !otherUserId) return;

        const messageContent = newMessage;
        setNewMessage('');
        setEnviando(true);

        try {
            await messageRepository.sendMessage({
                sender_id: currentUser.id,
                receiver_id: otherUserId,
                content: messageContent,
            });
        } catch (error) {
            Alert.alert("Error", "No se pudo enviar el mensaje.");
            setNewMessage(messageContent);
        } finally {
            setEnviando(false);
        }
    };

    // 4. Auto-scroll al final (sin cambios)
    useEffect(() => {
        if (messages.length > 0) {
            setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 100);
        }
    }, [messages]);


    if (loading) {
        return <ActivityIndicator style={{ marginTop: 50 }} size="large" />;
    }

    return (
        <KeyboardAvoidingView
            // Forzamos padding en ambos, ya que es más estable para que el input no se esconda
            behavior="padding"
            style={chatStyles.chat_convoContainer}
            // Offset de 90px es la altura del header + la altura de la TabBar
            keyboardVerticalOffset={90}
        >
            <FlatList
                ref={flatListRef}
                data={messages}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <View
                        style={[
                            chatStyles.chat_messageBubble,
                            item.sender_id === currentUser?.id
                                ? chatStyles.chat_myMessage
                                : chatStyles.chat_theirMessage
                        ]}
                    >
                        <Text style={[
                            chatStyles.chat_messageText,
                            item.sender_id === currentUser?.id && { color: '#fff' }
                        ]}>
                            {item.content}
                        </Text>
                    </View>
                )}
                style={{ flex: 1 }} // El FlatList debe crecer
                contentContainerStyle={{ padding: 10, paddingBottom: 10 }}
            />

            {/* Input para enviar mensaje */}
            <View style={chatStyles.chat_inputContainer}>
                <TextInput
                    // --- CORRECCIÓN AQUÍ: Usar chatStyles.chat_textInput directamente ---
                    style={chatStyles.chat_textInput}
                    placeholder="Escribe un mensaje..."
                    value={newMessage}
                    onChangeText={setNewMessage}
                />
                <Button
                    title={enviando ? "..." : "Enviar"}
                    onPress={handleSendMessage}
                    disabled={enviando || !newMessage.trim()}
                />
            </View>
        </KeyboardAvoidingView>
    );
}