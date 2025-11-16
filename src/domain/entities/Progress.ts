// src/domain/entities/Progress.ts
export interface Progress {
    id: number;
    usuario_id: string;
    rutina_id?: number | null; // Opcional, por si quieren ligarlo a una rutina
    comentarios: string;
    foto_url: string; // La URL pública de Supabase Storage
    created_at: string;
}