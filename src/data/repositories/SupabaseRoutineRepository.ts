// src/data/repositories/SupabaseRoutineRepository.ts
import { supabase } from "../../config/supabaseCliente";
import { Routine } from "../../domain/entities/Routine";
import {
    CreateRoutineData,
    IRoutineRepository
} from "../../domain/repositories/IRoutineRepository";

export class SupabaseRoutineRepository implements IRoutineRepository {
    /**
     * Implementación del método 'create' usando Supabase
     */
    async create(data: CreateRoutineData): Promise<Routine> {
        const { data: newRoutine, error } = await supabase
            .from('rutinas')
            .insert({
                nombre: data.nombre,
                descripcion: data.descripcion,
                entrenador_id: data.entrenador_id,
            })
            .select() // .select() devuelve el registro recién creado
            .single(); // Esperamos un solo objeto de vuelta

        if (error) {
            console.error("Error creating routine:", error.message);
            throw new Error(`Error al crear la rutina: ${error.message}`);
        }

        if (!newRoutine) {
            throw new Error("No se recibió la rutina creada desde Supabase.");
        }

        // Mapeamos la respuesta de Supabase a nuestra entidad 'Routine' del dominio
        // (En este caso, los nombres coinciden, pero si no, este es el lugar para mapear)
        return newRoutine as Routine;
    }

    /**
     * Implementación del método 'findByTrainer' usando Supabase
     */
    async findByTrainer(entrenador_id: string): Promise<Routine[]> {
        const { data: routines, error } = await supabase
            .from('rutinas')
            .select('*')
            .eq('entrenador_id', entrenador_id)
            .order('created_at', { ascending: false }); // Ordenar por más nuevas

        if (error) {
            console.error("Error fetching routines:", error.message);
            throw new Error(`Error al obtener las rutinas: ${error.message}`);
        }

        return routines || [];
    }

    async updateVideoUrl(routineId: number, videoUrl: string): Promise<Routine> {
        const { data: updatedRoutine, error } = await supabase
            .from('rutinas')
            .update({ video_url: videoUrl }) // Actualiza solo la columna video_url
            .eq('id', routineId) // Donde el ID coincida
            .select() // Devuelve el registro actualizado
            .single();

        if (error) {
            console.error("Error updating routine video_url:", error.message);
            throw new Error(`Error al actualizar la rutina: ${error.message}`);
        }
        if (!updatedRoutine) {
            throw new Error("No se recibió la rutina actualizada.");
        }
        return updatedRoutine as Routine;
    }
}