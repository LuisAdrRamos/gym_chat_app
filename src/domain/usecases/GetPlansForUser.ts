// src/domain/usecases/GetPlansForUser.ts
import { TrainingPlan } from "../entities/TrainingPlan";
import { ITrainingPlanRepository } from "../repositories/ITrainingPlanRepository";

export class GetPlansForUser {
    constructor(private planRepository: ITrainingPlanRepository) { }

    async execute(usuario_id: string): Promise<TrainingPlan[]> {
        if (!usuario_id) {
            throw new Error("ID de usuario no proporcionado.");
        }
        return this.planRepository.getPlansByUserId(usuario_id);
    }
}