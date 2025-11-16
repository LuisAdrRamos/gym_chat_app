// src/data/repositories/SupabaseProgressRepository.ts
import { supabase } from "../../config/supabaseCliente";
import { Progress } from "../../domain/entities/Progress";
import {
    CreateProgressData,
    IProgressRepository
} from "../../domain/repositories/IProgressRepository";

export class SupabaseProgressRepository implements IProgressRepository {

    /**
     * Implementación de 'create'
     * Inserta un nuevo registro en la tabla 'progreso'
     */
    async create(data: CreateProgressData): Promise<Progress> {
        const { data: newProgress, error } = await supabase
            .from('progreso')
            .insert({
                usuario_id: data.usuario_id,
                comentarios: data.comentarios,
                foto_url: data.foto_url,
                rutina_id: data.rutina_id, // Opcional
            })
            .select()
            .single();

        if (error) {
            console.error("Error creating progress record:", error.message);
            throw new Error(`Error al crear el registro de progreso: ${error.message}`);
        }
        if (!newProgress) {
            throw new Error("No se recibió el registro creado desde Supabase.");
        }
        return newProgress as Progress;
    }

    /**
     * Implementación de 'findByUser'
     * Obtiene todos los registros de un usuario
     */
    async findByUser(usuario_id: string): Promise<Progress[]> {
        const { data: progressList, error } = await supabase
            .from('progreso')
            .select('*')
            .eq('usuario_id', usuario_id)
            .order('created_at', { ascending: false }); // Mostrar el más reciente primero

        if (error) {
            console.error("Error fetching progress:", error.message);
            throw new Error(`Error al obtener el progreso: ${error.message}`);
        }
        return progressList || [];
    }
}