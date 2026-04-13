import { WorkoutRepository } from "../../domain/repositories/WorkoutRepository";
import { SimpleWorkout } from "../../domain/entities/Workout";

export class LogSimpleWorkoutUseCase {
  constructor(private workoutRepo: WorkoutRepository) {}

  async execute(workout: Omit<SimpleWorkout, "caloriesBurned">): Promise<void> {
    // Logic: caloriesBurned = sets * caloriesPerSet OR duration * 5
    const caloriesBurned = workout.caloriesPerSet 
      ? workout.sets * workout.caloriesPerSet 
      : workout.duration * 5;
    
    const newWorkout: SimpleWorkout = {
      ...workout,
      caloriesBurned,
    };

    await this.workoutRepo.saveWorkout(newWorkout);
  }
}
