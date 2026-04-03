import { FitnessRepository } from "../../domain/repositories/FitnessRepository";
import { Goal } from "../../domain/entities/Goal";

export class SetGoalUseCase {
  constructor(private fitnessRepo: FitnessRepository) {}

  async execute(goal: Goal): Promise<void> {
    await this.fitnessRepo.saveGoal(goal);
  }
}
