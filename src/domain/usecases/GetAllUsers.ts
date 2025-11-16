// src/domain/usecases/GetAllUsers.ts
import { UserProfile } from "../entities/TrainingPlan";
import { ITrainingPlanRepository } from "../repositories/ITrainingPlanRepository";

export class GetAllUsers {
    constructor(private planRepository: ITrainingPlanRepository) { }

    async execute(): Promise<UserProfile[]> {
        return this.planRepository.getAllUsers();
    }
}