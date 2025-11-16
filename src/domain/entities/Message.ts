// src/domain/entities/Message.ts
export interface Message {
    id: number;
    sender_id: string;
    receiver_id: string;
    content: string;
    created_at: string;
}