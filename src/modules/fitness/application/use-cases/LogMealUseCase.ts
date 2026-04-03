import { FitnessRepository } from "../../domain/repositories/FitnessRepository";
import { NutritionLogEntry } from "../../domain/entities/Nutrition";

export class LogMealUseCase {
  constructor(private fitnessRepo: FitnessRepository) {}

  async execute(log: NutritionLogEntry): Promise<void> {
    await this.fitnessRepo.logNutrition(log);
  }
}
