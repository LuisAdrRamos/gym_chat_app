// src/domain/usecases/CreateRoutine.ts
import { Routine } from "../entities/Routine";
import { IRoutineRepository, CreateRoutineData } from "../repositories/IRoutineRepository";

export class CreateRoutine {
    // Inyectamos la dependencia del repositorio (la interfaz, no la implementación)
    constructor(private routineRepository: IRoutineRepository) { }

    async execute(data: CreateRoutineData): Promise<Routine> {
        // Aquí podría ir lógica de negocio (validaciones, etc.)
        if (!data.nombre || data.nombre.trim() === '') {
            throw new Error("El nombre de la rutina es obligatorio.");
        }

        // Llama al método del repositorio
        return this.routineRepository.create(data);
    }
}