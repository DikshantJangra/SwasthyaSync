import { DrizzleFitnessRepository } from "./infrastructure/repositories/DrizzleFitnessRepository";
import { LogWorkoutUseCase } from "./application/use-cases/LogWorkoutUseCase";
import { LogMealUseCase } from "./application/use-cases/LogMealUseCase";
import { SetGoalUseCase } from "./application/use-cases/SetGoalUseCase";
import { GetFitnessDashboardUseCase } from "./application/use-cases/GetFitnessDashboardUseCase";
import { GenerateInsightsUseCase } from "./application/use-cases/GenerateInsightsUseCase";

export class FitnessComposition {
  private static repo = new DrizzleFitnessRepository();

  static getLogWorkoutUseCase() {
    return new LogWorkoutUseCase(this.repo);
  }

  static getLogMealUseCase() {
    return new LogMealUseCase(this.repo);
  }

  static getSetGoalUseCase() {
    return new SetGoalUseCase(this.repo);
  }

  static getDashboardUseCase() {
    return new GetFitnessDashboardUseCase(this.repo);
  }

  static getGenerateInsightsUseCase() {
    return new GenerateInsightsUseCase(this.repo);
  }
}

// Unified Fitness Engine (As requested)
export const fitnessEngine = {
  logWorkout: (log: any) => FitnessComposition.getLogWorkoutUseCase().execute(log),
  logMeal: (log: any) => FitnessComposition.getLogMealUseCase().execute(log),
  setGoal: (goal: any) => FitnessComposition.getSetGoalUseCase().execute(goal),
  getDashboard: (userId: string) => FitnessComposition.getDashboardUseCase().execute(userId),
  generateInsights: (userId: string) => FitnessComposition.getGenerateInsightsUseCase().execute(userId),
};
