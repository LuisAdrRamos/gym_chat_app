// src/domain/repositories/IRoutineRepository.ts
import { Routine } from "../entities/Routine";

// Definimos los datos para crear una nueva rutina
export interface CreateRoutineData {
    nombre: string;
    descripcion: string;
    entrenador_id: string;
}

export interface IRoutineRepository {
    /**
     * Crea una nueva rutina en la base de datos.
     * @param data - Los datos de la rutina a crear.
     * @returns La rutina creada.
     */
    create(data: CreateRoutineData): Promise<Routine>;

    /**
     * Obtiene todas las rutinas creadas por un entrenador específico.
     * @param entrenador_id - El ID del entrenador.
     * @returns Una lista de rutinas.
     */
    findByTrainer(entrenador_id: string): Promise<Routine[]>;

    // (Podríamos añadir 'update', 'delete', 'findById' aquí después)
}