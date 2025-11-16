// src/domain/usecases/GetRoutinesByTrainer.ts
import { Routine } from "../entities/Routine";
import { IRoutineRepository } from "../repositories/IRoutineRepository";

export class GetRoutinesByTrainer {
    constructor(private routineRepository: IRoutineRepository) { }

    async execute(entrenador_id: string): Promise<Routine[]> {
        if (!entrenador_id) {
            throw new Error("ID del entrenador no proporcionado.");
        }

        return this.routineRepository.findByTrainer(entrenador_id);
    }
}