// src/domain/entities/Routine.ts
export interface Routine {
    id: number;
    nombre: string;
    descripcion: string;
    entrenador_id: string; // El UUID del entrenador que la creó
    created_at: string;
    video_url?: string | null; // URL del video asociado, si existe
}