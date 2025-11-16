// src/domain/entities/TrainingPlan.ts

// Esta entidad es la tabla 'planes_entrenamiento'
export interface TrainingPlan {
    id: number;
    entrenador_id: string; // UUID del entrenador
    usuario_id: string;    // UUID del usuario asignado
    nombre: string;
    fecha_inicio: string;  // Usamos string para las fechas (ISO 8601)
    fecha_fin: string;
    created_at: string;
}

// También definiremos una entidad para la tabla 'profiles'
// ya que necesitaremos una lista de usuarios para asignar planes.
export interface UserProfile {
    id: string;
    username: string | null;
    full_name: string | null;
    role: 'Entrenador' | 'Usuario';
}