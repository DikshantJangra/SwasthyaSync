/**
 * Fitness Module — Composition Root
 * 
 * This is where we wire up all the dependencies (Dependency Injection).
 * 
 * Pattern:
 * 1. Create repository instances (infrastructure)
 * 2. Inject them into use cases (application)
 * 3. Export a unified "fitnessEngine" API
 * 
 * This way, the rest of the app (tRPC routes, etc.) only interacts
 * with the fitnessEngine — it doesn't need to know about repositories.
 */

import { DrizzleFitnessRepository } from "./infrastructure/repositories/DrizzleFitnessRepository";
import { DrizzleFoodLogRepository } from "./infrastructure/repositories/DrizzleFoodLogRepository";
import { LogWorkoutUseCase } from "./application/use-cases/LogWorkoutUseCase";
import { LogMealUseCase } from "./application/use-cases/LogMealUseCase";
import { GetFitnessDashboardUseCase } from "./application/use-cases/GetFitnessDashboardUseCase";
import { SetGoalUseCase } from "./application/use-cases/SetGoalUseCase";
import { GenerateInsightsUseCase } from "./application/use-cases/GenerateInsightsUseCase";
import { UpdateAdaptiveTdeeUseCase } from "./application/use-cases/UpdateAdaptiveTdeeUseCase";
// NEW: Nutrition tracking use cases
import { LogFoodUseCase } from "./application/use-cases/LogFoodUseCase";
import { GetFoodLogsByDateUseCase } from "./application/use-cases/GetFoodLogsByDateUseCase";
import { GetTodayCaloriesUseCase } from "./application/use-cases/GetTodayCaloriesUseCase";
import { DeleteFoodLogUseCase } from "./application/use-cases/DeleteFoodLogUseCase";
// NEW: Simple Workout Tracking use cases
import { DrizzleWorkoutRepository } from "./infrastructure/repositories/DrizzleWorkoutRepository";
import { LogSimpleWorkoutUseCase } from "./application/use-cases/LogSimpleWorkoutUseCase";
import { GetWorkoutsByDateUseCase } from "./application/use-cases/GetWorkoutsByDateUseCase";
import { GetTodayCaloriesBurnedUseCase } from "./application/use-cases/GetTodayCaloriesBurnedUseCase";
import { DeleteSimpleWorkoutUseCase } from "./application/use-cases/DeleteSimpleWorkoutUseCase";
// NEW: Goals tracking use cases
import { DrizzleGoalRepository } from "./infrastructure/repositories/DrizzleGoalRepository";
import { SetSimpleGoalUseCase } from "./application/use-cases/SetSimpleGoalUseCase";
import { GetGoalWithProgressUseCase } from "./application/use-cases/GetGoalWithProgressUseCase";
import { GetDailySummaryUseCase } from "./application/use-cases/GetDailySummaryUseCase";

// Infrastructure — create repository instances
const fitnessRepo = new DrizzleFitnessRepository();
const foodLogRepo = new DrizzleFoodLogRepository(); // NEW: separate repo for food logs
const simpleWorkoutRepo = new DrizzleWorkoutRepository(); // NEW: simple workout repo
const goalRepo = new DrizzleGoalRepository(); // NEW: simple goals repo

// Application / Use Cases — inject repositories
const logWorkoutUseCase = new LogWorkoutUseCase(fitnessRepo);
const logMealUseCase = new LogMealUseCase(fitnessRepo);
const getFitnessDashboardUseCase = new GetFitnessDashboardUseCase(fitnessRepo);
const setGoalUseCase = new SetGoalUseCase(fitnessRepo);
const generateInsightsUseCase = new GenerateInsightsUseCase(fitnessRepo);
const updateAdaptiveTdeeUseCase = new UpdateAdaptiveTdeeUseCase(fitnessRepo);
// NEW: Nutrition tracking use cases
const logFoodUseCase = new LogFoodUseCase(foodLogRepo);
const getFoodLogsByDateUseCase = new GetFoodLogsByDateUseCase(foodLogRepo);
const getTodayCaloriesUseCase = new GetTodayCaloriesUseCase(foodLogRepo);
const deleteFoodLogUseCase = new DeleteFoodLogUseCase(foodLogRepo);
// NEW: Simple Workout tracking use cases
const logSimpleWorkoutUseCase = new LogSimpleWorkoutUseCase(simpleWorkoutRepo);
const getWorkoutsByDateUseCase = new GetWorkoutsByDateUseCase(simpleWorkoutRepo);
const getTodayCaloriesBurnedUseCase = new GetTodayCaloriesBurnedUseCase(simpleWorkoutRepo);
const deleteSimpleWorkoutUseCase = new DeleteSimpleWorkoutUseCase(simpleWorkoutRepo);
// NEW: Goals tracking use cases
const setSimpleGoalUseCase = new SetSimpleGoalUseCase(goalRepo);
const getGoalWithProgressUseCase = new GetGoalWithProgressUseCase(goalRepo, foodLogRepo, simpleWorkoutRepo);
const getDailySummaryUseCase = new GetDailySummaryUseCase(foodLogRepo, simpleWorkoutRepo);

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
  },

  // NEW: Nutrition Tracking — food search, logging, and calorie tracking
  nutrition: {
    logFood: (log: any) => logFoodUseCase.execute(log),
    getFoodLogsByDate: (userId: string, date: Date) => getFoodLogsByDateUseCase.execute(userId, date),
    getTodayCalories: (userId: string) => getTodayCaloriesUseCase.execute(userId),
    deleteFood: (id: string, userId: string) => deleteFoodLogUseCase.execute(id, userId),
  },

  // NEW: Simple Workout Tracking
  workoutTracking: {
    logWorkout: (workout: any) => logSimpleWorkoutUseCase.execute(workout),
    getWorkoutsByDate: (userId: string, date: Date) => getWorkoutsByDateUseCase.execute(userId, date),
    getTodayCaloriesBurned: (userId: string) => getTodayCaloriesBurnedUseCase.execute(userId),
    deleteWorkout: (id: string, userId: string) => deleteSimpleWorkoutUseCase.execute(id, userId),
  },

  // NEW: Goals Tracking
  goalsTracking: {
    setGoal: (userId: string, type: any) => setSimpleGoalUseCase.execute(userId, type),
    getGoalProgress: (userId: string) => getGoalWithProgressUseCase.execute(userId),
  },

  // Centralized Daily Summary
  getDailySummary: (userId: string, date: Date) => getDailySummaryUseCase.execute(userId, date),
};
