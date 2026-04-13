import { WorkoutRepository } from "../../domain/repositories/WorkoutRepository";
import { SimpleWorkout } from "../../domain/entities/Workout";

export class GetWorkoutsByDateUseCase {
  constructor(private workoutRepo: WorkoutRepository) {}

  async execute(userId: string, date: Date): Promise<SimpleWorkout[]> {
    return this.workoutRepo.getWorkoutsByDate(userId, date);
  }
}
