import { WorkoutRepository } from "../../domain/repositories/WorkoutRepository";

export class DeleteSimpleWorkoutUseCase {
  constructor(private workoutRepo: WorkoutRepository) {}

  async execute(id: string, userId: string): Promise<void> {
    await this.workoutRepo.deleteWorkout(id, userId);
  }
}
