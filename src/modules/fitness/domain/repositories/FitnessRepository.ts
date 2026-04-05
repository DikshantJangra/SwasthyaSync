import { Workout, WorkoutLog, Exercise } from "../entities/Workout";
import { NutritionLogEntry, Food } from "../entities/Nutrition";
import { Goal, ProgressMetric, AIInsight } from "../entities/Goal";
import { SleepLog, FastingLog, WaterContainer, WaterIntake } from "../entities/Holistic";
import { DailySummary, TdeeLog, ExternalProvider } from "../entities/Metabolic";

export interface FitnessRepository {
  // --- Workouts ---
  saveExercise(exercise: Exercise): Promise<void>;
  saveWorkout(workout: Workout): Promise<void>;
  logWorkout(log: WorkoutLog): Promise<void>;
  getWorkouts(userId: string): Promise<Workout[]>;
  getWorkoutLogs(userId: string): Promise<WorkoutLog[]>;

  // --- Nutrition ---
  saveFood(food: Food): Promise<void>;
  logNutrition(log: NutritionLogEntry): Promise<void>;
  getNutritionLogs(userId: string): Promise<NutritionLogEntry[]>;

  // --- Goals & AI ---
  saveGoal(goal: Goal): Promise<void>;
  getGoals(userId: string): Promise<Goal[]>;
  saveAIInsight(insight: AIInsight): Promise<void>;
  getAIInsights(userId: string): Promise<AIInsight[]>;

  // --- Holistic Wellness (Sparky Port) ---
  saveSleepLog(log: SleepLog): Promise<void>;
  getSleepLogs(userId: string): Promise<SleepLog[]>;
  saveFastingLog(log: FastingLog): Promise<void>;
  getFastingLogs(userId: string): Promise<FastingLog[]>;
  saveWaterContainer(container: WaterContainer): Promise<void>;
  getWaterContainers(userId: string): Promise<WaterContainer[]>;
  logWaterIntake(intake: WaterIntake): Promise<void>;
  getWaterIntake(userId: string, date: Date): Promise<WaterIntake[]>;

  // --- Metabolic Hub ---
  saveDailySummary(summary: DailySummary): Promise<void>;
  getDailySummaries(userId: string, limit?: number): Promise<DailySummary[]>;
  saveTdeeLog(log: TdeeLog): Promise<void>;
  getTdeeLogs(userId: string): Promise<TdeeLog[]>;

  // --- Integrations ---
  saveExternalProvider(provider: ExternalProvider): Promise<void>;
  getExternalProviders(userId: string): Promise<ExternalProvider[]>;
}
