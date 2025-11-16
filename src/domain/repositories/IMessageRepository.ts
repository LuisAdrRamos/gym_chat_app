// src/domain/repositories/IMessageRepository.ts
import { Message } from "../entities/Message";

export interface SendMessageData {
    sender_id: string;
    receiver_id: string;
    content: string;
}

// El callback que se ejecutará cuando llegue un nuevo mensaje
export type NewMessageCallback = (message: Message) => void;

export interface IMessageRepository {
    /**
     * Obtiene el historial de mensajes entre dos usuarios.
     */
    getMessages(
        sender_id: string,
        receiver_id: string
    ): Promise<Message[]>;

    /**
     * Envía un nuevo mensaje.
     */
    sendMessage(data: SendMessageData): Promise<Message>;

    /**
     * Se suscribe a nuevos mensajes en un canal específico.
     * @param channelName - El canal al que escuchar (ej: 'chat:user1_user2')
     * @param callback - La función a llamar cuando llega un mensaje nuevo.
     * @returns Una función para desuscribirse.
     */
    subscribeToMessages(
        callback: NewMessageCallback
    ): () => void;
}