// src/presentation/styles/chatStyles.ts
import { StyleSheet } from 'react-native';

export const chatStyles = StyleSheet.create({
    // Estilos del placeholder (los borraremos, pero los muevo por si acaso)
    chat_container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    chat_title: { fontSize: 20, fontWeight: 'bold' },

    // Estilos de app/(tabs)/chat/index.tsx (Lista de Contactos)
    chat_listContainer: {
        flex: 1,
    },
    chat_listItem: {
        backgroundColor: '#fff',
        paddingVertical: 15,
        paddingHorizontal: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    chat_listName: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    chat_listRole: {
        fontSize: 14,
        color: 'gray',
    },

    // Estilos de app/(tabs)/chat/[receiver_id].tsx (Conversación)
    chat_convoContainer: {
        flex: 1,
        backgroundColor: '#fff',
        // <-- Agregamos flex: 1 para ocupar toda la pantalla
    },
    chat_inputContainer: {
        flexDirection: 'row',
        padding: 10,
        borderTopWidth: 1,
        borderTopColor: '#f0f0f0',
        backgroundColor: '#fff',
        // <-- Aseguramos que el input se vea bien
    },
    chat_messageBubble: {
        padding: 12,
        borderRadius: 18,
        maxWidth: '75%',
        marginVertical: 4,
    },
    chat_myMessage: {
        backgroundColor: '#007AFF',
        alignSelf: 'flex-end',
    },
    chat_theirMessage: {
        backgroundColor: '#E5E5EA',
        alignSelf: 'flex-start',
    },
    chat_messageText: {
        fontSize: 16,
        color: 'black', // El color blanco para 'myMessage' se aplica en el .tsx
    },
    chat_textInput: {
        flex: 1,
        marginRight: 10,
        height: 40,
        paddingHorizontal: 10,
        paddingVertical: 8, // Añadido para mejor padding vertical
        // Usamos un fondo y borde legible
        backgroundColor: '#F5F5F5',
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#E0E0E0',
        marginBottom: 0, // Aseguramos que no haya margen inferior
        fontSize: 16, // Aseguramos el tamaño
    },
});