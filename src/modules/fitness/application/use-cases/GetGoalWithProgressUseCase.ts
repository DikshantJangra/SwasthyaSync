import { GoalRepository } from "../../domain/repositories/GoalRepository";
import { FoodLogRepository } from "../../domain/repositories/FoodLogRepository";
import { WorkoutRepository } from "../../domain/repositories/WorkoutRepository";
import { GoalType } from "../../domain/entities/Goal";

export class GetGoalWithProgressUseCase {
  constructor(
    private goalRepo: GoalRepository,
    private foodLogRepo: FoodLogRepository,
    private workoutRepo: WorkoutRepository
  ) {}

  async execute(userId: string) {
    const goal = await this.goalRepo.getUserGoal(userId);
    if (!goal) return null;

    const caloriesIntake = await this.foodLogRepo.getTodayCalories(userId);
    const caloriesBurned = await this.workoutRepo.getTodayCaloriesBurned(userId);

    let targetBurn = 0;
    let targetIntake = 0;
    let achieved = false;

    if (goal.goalType === "lose_weight") {
      targetBurn = 400;
      targetIntake = 1800;
      achieved = caloriesBurned > caloriesIntake; // User logic request
    } else if (goal.goalType === "build_muscle") {
      targetBurn = 300;
      targetIntake = 2500;
      achieved = caloriesIntake > caloriesBurned;
    } else if (goal.goalType === "maintain") {
      targetBurn = 300;
      targetIntake = 2000;
      achieved = Math.abs(caloriesIntake - caloriesBurned) < 200;
    }

    return {
      goalType: goal.goalType,
      targetBurn,
      targetIntake,
      caloriesIntake,
      caloriesBurned,
      achieved,
    };
  }
}
