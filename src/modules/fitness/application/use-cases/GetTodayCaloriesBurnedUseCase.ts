import { WorkoutRepository } from "../../domain/repositories/WorkoutRepository";

export class GetTodayCaloriesBurnedUseCase {
  constructor(private workoutRepo: WorkoutRepository) {}

  async execute(userId: string): Promise<number> {
    return this.workoutRepo.getTodayCaloriesBurned(userId);
  }
}
