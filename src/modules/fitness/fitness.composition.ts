import { DrizzleFitnessRepository } from "./infrastructure/repositories/DrizzleFitnessRepository";
import { LogWorkoutUseCase } from "./application/use-cases/LogWorkoutUseCase";
import { LogMealUseCase } from "./application/use-cases/LogMealUseCase";
import { GetFitnessDashboardUseCase } from "./application/use-cases/GetFitnessDashboardUseCase";
import { SetGoalUseCase } from "./application/use-cases/SetGoalUseCase";
import { GenerateInsightsUseCase } from "./application/use-cases/GenerateInsightsUseCase";
import { UpdateAdaptiveTdeeUseCase } from "./application/use-cases/UpdateAdaptiveTdeeUseCase";

// Infrastructure
const fitnessRepo = new DrizzleFitnessRepository();

// Application / Use Cases
const logWorkoutUseCase = new LogWorkoutUseCase(fitnessRepo);
const logMealUseCase = new LogMealUseCase(fitnessRepo);
const getFitnessDashboardUseCase = new GetFitnessDashboardUseCase(fitnessRepo);
const setGoalUseCase = new SetGoalUseCase(fitnessRepo);
const generateInsightsUseCase = new GenerateInsightsUseCase(fitnessRepo);
const updateAdaptiveTdeeUseCase = new UpdateAdaptiveTdeeUseCase(fitnessRepo);

// Composition Root / Unified Engine API
export const fitnessEngine = {
  // Queries
  getDashboard: (userId: string) => getFitnessDashboardUseCase.execute(userId),
  getWorkouts: (userId: string) => fitnessRepo.getWorkouts(userId),
  getNutritionLogs: (userId: string) => fitnessRepo.getNutritionLogs(userId),
  getGoals: (userId: string) => fitnessRepo.getGoals(userId),

  // Commands
  logWorkout: (log: any) => logWorkoutUseCase.execute(log),
  logMeal: (log: any) => logMealUseCase.execute(log),
  setGoal: (goal: any) => setGoalUseCase.execute(goal),
  
  // High-Level Tasks
  generateInsights: (userId: string) => generateInsightsUseCase.execute(userId),
  syncTdee: (userId: string) => updateAdaptiveTdeeUseCase.execute(userId),

  // Holistic (Direct Access for now, Use Cases can be extracted as they grow)
  sleep: {
    log: (log: any) => fitnessRepo.saveSleepLog(log),
    get: (userId: string) => fitnessRepo.getSleepLogs(userId),
  },
  water: {
    log: (intake: any) => fitnessRepo.logWaterIntake(intake),
    get: (userId: string, date: Date) => fitnessRepo.getWaterIntake(userId, date),
    saveContainer: (container: any) => fitnessRepo.saveWaterContainer(container),
    getContainers: (userId: string) => fitnessRepo.getWaterContainers(userId),
  },
  fasting: {
    log: (log: any) => fitnessRepo.saveFastingLog(log),
    get: (userId: string) => fitnessRepo.getFastingLogs(userId),
  }
};
