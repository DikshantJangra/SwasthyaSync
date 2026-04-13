import { SimpleWorkout } from "../entities/Workout";

export interface WorkoutRepository {
  saveWorkout(workout: SimpleWorkout): Promise<void>;
  getWorkoutsByDate(userId: string, date: Date): Promise<SimpleWorkout[]>;
  getTodayCaloriesBurned(userId: string): Promise<number>;
  deleteWorkout(id: string, userId: string): Promise<void>;
}
