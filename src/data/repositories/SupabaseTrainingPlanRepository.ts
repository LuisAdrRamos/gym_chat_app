// src/data/repositories/SupabaseTrainingPlanRepository.ts
import { supabase } from "../../config/supabaseCliente";
import { TrainingPlan, UserProfile } from "../../domain/entities/TrainingPlan";
import {
    CreatePlanData,
    ITrainingPlanRepository
} from "../../domain/repositories/ITrainingPlanRepository";

export class SupabaseTrainingPlanRepository implements ITrainingPlanRepository {

    /**
     * Implementación de 'assignPlan'
     */
    async assignPlan(data: CreatePlanData): Promise<TrainingPlan> {
        const { data: newPlan, error } = await supabase
            .from('planes_entrenamiento')
            .insert({
                entrenador_id: data.entrenador_id,
                usuario_id: data.usuario_id,
                nombre: data.nombre,
                fecha_inicio: data.fecha_inicio,
                fecha_fin: data.fecha_fin,
            })
            .select()
            .single();

        if (error) {
            console.error("Error assigning plan:", error.message);
            throw new Error(`Error al asignar el plan: ${error.message}`);
        }
        if (!newPlan) {
            throw new Error("No se recibió el plan creado desde Supabase.");
        }
        return newPlan as TrainingPlan;
    }

    /**
     * Implementación de 'getPlansByUserId'
     */
    async getPlansByUserId(usuario_id: string): Promise<TrainingPlan[]> {
        const { data: plans, error } = await supabase
            .from('planes_entrenamiento')
            .select('*')
            .eq('usuario_id', usuario_id)
            .order('fecha_inicio', { ascending: true });

        if (error) {
            console.error("Error fetching user plans:", error.message);
            throw new Error(`Error al obtener los planes: ${error.message}`);
        }
        return plans || [];
    }

    /**
     * Implementación de 'getAllUsers'
     * Busca en 'profiles' todos los que tengan el rol 'Usuario'
     */
    async getAllUsers(): Promise<UserProfile[]> {
        const { data: users, error } = await supabase
            .from('profiles')
            // --- ESTO ES CLAVE: No debe haber filtro de rol ---
            .select('id, username, full_name, role');

        if (error) {
            console.error("Error fetching users:", error.message);
            throw new Error(`Error al obtener los usuarios: ${error.message}`);
        }

        return users || [];
    }
}