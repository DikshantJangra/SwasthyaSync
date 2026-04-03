import { FitnessRepository } from "../../domain/repositories/FitnessRepository";
import { WorkoutLog } from "../../domain/entities/Workout";

export class LogWorkoutUseCase {
  constructor(private fitnessRepo: FitnessRepository) {}

  async execute(log: WorkoutLog): Promise<void> {
    // Thin validation could go here
    await this.fitnessRepo.logWorkout(log);
  }
}
