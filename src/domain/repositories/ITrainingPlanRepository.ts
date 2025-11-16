// src/domain/repositories/ITrainingPlanRepository.ts
import { TrainingPlan, UserProfile } from "../entities/TrainingPlan";

export interface CreatePlanData {
    entrenador_id: string;
    usuario_id: string;
    nombre: string;
    fecha_inicio: string;
    fecha_fin: string;
}

export interface ITrainingPlanRepository {
    /**
     * Asigna un nuevo plan de entrenamiento a un usuario.
     * @param data - Los datos del plan.
     */
    assignPlan(data: CreatePlanData): Promise<TrainingPlan>;

    /**
     * Obtiene todos los planes asignados a un usuario específico.
     * @param usuario_id - El ID del usuario.
     */
    getPlansByUserId(usuario_id: string): Promise<TrainingPlan[]>;

    /**
     * Obtiene una lista de todos los usuarios con el rol 'Usuario'.
     * (Necesario para que el Entrenador elija a quién asignar un plan)
     */
    getAllUsers(): Promise<UserProfile[]>;
}