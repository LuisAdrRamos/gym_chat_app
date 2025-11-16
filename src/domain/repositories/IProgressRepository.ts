// src/domain/repositories/IProgressRepository.ts
import { Progress } from "../entities/Progress";

// Datos necesarios para crear un nuevo registro
export interface CreateProgressData {
    usuario_id: string;
    comentarios: string;
    foto_url: string;
    rutina_id?: number | null;
}

export interface IProgressRepository {
    /**
     * Crea un nuevo registro de progreso en la base de datos.
     */
    create(data: CreateProgressData): Promise<Progress>;

    /**
     * Obtiene todos los registros de progreso de un usuario específico.
     */
    findByUser(usuario_id: string): Promise<Progress[]>;
}