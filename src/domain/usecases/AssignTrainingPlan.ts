// src/domain/usecases/AssignTrainingPlan.ts
import { TrainingPlan } from "../entities/TrainingPlan";
import { CreatePlanData, ITrainingPlanRepository } from "../repositories/ITrainingPlanRepository";

export class AssignTrainingPlan {
    constructor(private planRepository: ITrainingPlanRepository) { }

    async execute(data: CreatePlanData): Promise<TrainingPlan> {
        if (!data.usuario_id || !data.entrenador_id) {
            throw new Error("Faltan IDs de usuario o entrenador.");
        }
        if (!data.nombre) {
            throw new Error("El plan debe tener un nombre.");
        }
        return this.planRepository.assignPlan(data);
    }
}