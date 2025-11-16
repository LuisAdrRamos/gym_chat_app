// src/data/repositories/SupabaseMessageRepository.ts
import { supabase } from "../../config/supabaseCliente";
import { Message } from "../../domain/entities/Message";
import {
    IMessageRepository,
    SendMessageData,
    NewMessageCallback
} from "../../domain/repositories/IMessageRepository";
import { RealtimeChannel } from "@supabase/supabase-js";

export class SupabaseMessageRepository implements IMessageRepository {

    private channel: RealtimeChannel | null = null;

    /**
     * Obtiene el historial de chat entre dos usuarios.
     */
    async getMessages(sender_id: string, receiver_id: string): Promise<Message[]> {
        // Buscamos mensajes donde (yo soy sender Y tu eres receiver) O (tu eres sender Y yo soy receiver)
        const { data, error } = await supabase
            .from('messages')
            .select('*')
            .or(`(sender_id.eq.${sender_id},receiver_id.eq.${receiver_id}),(sender_id.eq.${receiver_id},receiver_id.eq.${sender_id})`)
            .order('created_at', { ascending: true }); // Ordenamos por más antiguo

        if (error) {
            console.error("Error fetching messages:", error.message);
            throw new Error(`Error al obtener los mensajes: ${error.message}`);
        }
        return data || [];
    }

    /**
     * Envía (inserta) un nuevo mensaje en la base de datos.
     */
    async sendMessage(data: SendMessageData): Promise<Message> {
        const { data: newMessage, error } = await supabase
            .from('messages')
            .insert({
                sender_id: data.sender_id,
                receiver_id: data.receiver_id,
                content: data.content,
            })
            .select()
            .single();

        if (error) {
            console.error("Error sending message:", error.message);
            throw new Error(`Error al enviar el mensaje: ${error.message}`);
        }
        if (!newMessage) {
            throw new Error("No se recibió el mensaje enviado desde Supabase.");
        }
        return newMessage as Message;
    }

    /**
     * Se suscribe a los cambios en la tabla 'messages'.
     * Esta es la función de Realtime.
     */
    subscribeToMessages(callback: NewMessageCallback): () => void {
        // Usamos un canal único para todos los mensajes
        this.channel = supabase.channel('public:messages');

        this.channel
            .on(
                'postgres_changes', // Escuchamos cambios en la base de datos
                {
                    event: 'INSERT', // Específicamente en eventos INSERT
                    schema: 'public',
                    table: 'messages' // En la tabla 'messages'
                },
                (payload) => {
                    // 'payload.new' contiene el registro completo del mensaje insertado
                    const newMessage = payload.new as Message;
                    // Llamamos al callback que nos pasó la UI
                    callback(newMessage);
                }
            )
            .subscribe((status) => {
                if (status === 'SUBSCRIBED') {
                    console.log('¡Conectado al canal de chat en tiempo real!');
                }
                if (status === 'CHANNEL_ERROR') {
                    console.error('Error en el canal de chat.');
                }
            });

        // Devolvemos una función para limpiar (desuscribirse)
        return () => {
            if (this.channel) {
                supabase.removeChannel(this.channel);
                this.channel = null;
                console.log('Desconectado del canal de chat.');
            }
        };
    }
}