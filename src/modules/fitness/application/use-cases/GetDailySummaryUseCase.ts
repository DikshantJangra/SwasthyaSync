import { FoodLogRepository } from "../../domain/repositories/FoodLogRepository";
import { WorkoutRepository } from "../../domain/repositories/WorkoutRepository";

export class GetDailySummaryUseCase {
  // Centralized calculation to ensure consistency across the application
  constructor(
    private foodLogRepo: FoodLogRepository,
    private workoutRepo: WorkoutRepository
  ) {}

  async execute(userId: string, date: Date) {
    // 1. Get workout calories burned for the specific date
    const workouts = await this.workoutRepo.getWorkoutsByDate(userId, date);
    const caloriesBurned = workouts.reduce((sum, w) => sum + w.caloriesBurned, 0);
    
    // 2. Get nutrition calories intake for the specific date
    const foodLogs = await this.foodLogRepo.getFoodLogsByDate(userId, date);
    const caloriesIntake = foodLogs.reduce((sum, f) => sum + f.calories, 0);

    // 3. Calculate consistent net calories
    const netCalories = caloriesBurned - caloriesIntake;

    return {
      caloriesBurned,
      caloriesIntake,
      netCalories
    };
  }
}
