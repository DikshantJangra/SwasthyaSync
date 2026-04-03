import { Workout, WorkoutLog, Exercise } from "../entities/Workout";
import { NutritionLogEntry, Food } from "../entities/Nutrition";
import { Goal, ProgressMetric, AIInsight } from "../entities/Goal";

export interface FitnessRepository {
  // Workouts
  saveExercise(exercise: Exercise): Promise<void>;
  saveWorkout(workout: Workout): Promise<void>;
  logWorkout(log: WorkoutLog): Promise<void>;
  getWorkouts(userId: string): Promise<Workout[]>;
  getWorkoutLogs(userId: string): Promise<WorkoutLog[]>;

  // Nutrition
  saveFood(food: Food): Promise<void>;
  logNutrition(log: NutritionLogEntry): Promise<void>;
  getNutritionLogs(userId: string): Promise<NutritionLogEntry[]>;

  // Goals & Progress
  saveGoal(goal: Goal): Promise<void>;
  getGoals(userId: string): Promise<Goal[]>;
  logProgress(progress: ProgressMetric): Promise<void>;
  getProgress(userId: string): Promise<ProgressMetric[]>;

  // AI
  saveAIInsight(insight: AIInsight): Promise<void>;
  getAIInsights(userId: string): Promise<AIInsight[]>;
}
