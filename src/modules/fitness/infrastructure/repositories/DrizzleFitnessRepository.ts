import { FitnessRepository } from "../../domain/repositories/FitnessRepository";
import { Workout, WorkoutLog, Exercise } from "../../domain/entities/Workout";
import { NutritionLogEntry, Food, DailyNutritionSummary } from "../../domain/entities/Nutrition";
import { Goal, ProgressMetric, AIInsight } from "../../domain/entities/Goal";
import { db } from "@/lib/db/db";
import { 
  fitnessExercises, 
  fitnessWorkouts, 
  fitnessWorkoutLogs, 
  fitnessFoods, 
  fitnessNutritionLogs, 
  fitnessGoals, 
  fitnessProgress, 
  fitnessAIInsights 
} from "../schema";
import { eq, and } from "drizzle-orm";

export class DrizzleFitnessRepository implements FitnessRepository {
  // --- Workouts ---
  async saveExercise(exercise: Exercise): Promise<void> {
    await db.insert(fitnessExercises).values(exercise).onConflictDoUpdate({
      target: fitnessExercises.id,
      set: exercise,
    });
  }

  async saveWorkout(workout: Workout): Promise<void> {
    await db.insert(fitnessWorkouts).values({
      ...workout,
      description: workout.description ?? null,
    }).onConflictDoUpdate({
      target: fitnessWorkouts.id,
      set: {
        ...workout,
        description: workout.description ?? null,
      },
    });
  }

  async logWorkout(log: WorkoutLog): Promise<void> {
    await db.insert(fitnessWorkoutLogs).values({
      ...log,
      workoutId: log.workoutId ?? null,
      notes: log.notes ?? null,
      caloriesBurned: log.caloriesBurned ?? null,
      avgHeartRate: log.avgHeartRate ?? null,
      steps: log.steps ?? null,
      sets: log.sets,
    });
  }

  async getWorkouts(userId: string): Promise<Workout[]> {
    const res = await db.select().from(fitnessWorkouts).where(eq(fitnessWorkouts.userId, userId));
    return res.map(r => ({
      ...r,
      description: r.description ?? undefined,
      exerciseIds: r.exerciseIds as string[],
    }));
  }

  async getWorkoutLogs(userId: string): Promise<WorkoutLog[]> {
    const res = await db.select().from(fitnessWorkoutLogs).where(eq(fitnessWorkoutLogs.userId, userId));
    return res.map(r => ({
      ...r,
      workoutId: r.workoutId ?? undefined,
      notes: r.notes ?? undefined,
      caloriesBurned: r.caloriesBurned ?? undefined,
      avgHeartRate: r.avgHeartRate ?? undefined,
      steps: r.steps ?? undefined,
      sets: r.sets as any,
    }));
  }

  // --- Nutrition ---
  async saveFood(food: Food): Promise<void> {
    await db.insert(fitnessFoods).values({
      ...food,
      brand: food.brand ?? null,
      micronutrients: food.nutrients as any,
      calories: food.nutrients.calories,
      protein: food.nutrients.protein,
      carbs: food.nutrients.carbs,
      fat: food.nutrients.fat,
    }).onConflictDoUpdate({
      target: fitnessFoods.id,
      set: {
        ...food,
        brand: food.brand ?? null,
        micronutrients: food.nutrients as any,
        calories: food.nutrients.calories,
        protein: food.nutrients.protein,
        carbs: food.nutrients.carbs,
        fat: food.nutrients.fat,
      },
    });
  }

  async logNutrition(log: NutritionLogEntry): Promise<void> {
    await db.insert(fitnessNutritionLogs).values({
      ...log,
      date: log.date.toISOString().split('T')[0], // YYYY-MM-DD
      foodName: log.foodName ?? null,
      foodId: log.foodId ?? null,
      mealId: log.mealId ?? null,
      nutrients: log.nutrients as any,
    });
  }

  async getNutritionLogs(userId: string): Promise<NutritionLogEntry[]> {
    const res = await db.select().from(fitnessNutritionLogs).where(eq(fitnessNutritionLogs.userId, userId));
    return res.map(r => ({
      ...r,
      foodName: r.foodName ?? undefined,
      foodId: r.foodId ?? undefined,
      mealId: r.mealId ?? undefined,
      date: new Date(r.date),
      nutrients: r.nutrients as any,
    }));
  }

  // --- Goals & Progress ---
  async saveGoal(goal: Goal): Promise<void> {
    await db.insert(fitnessGoals).values({
      ...goal,
      goalDate: goal.goalDate ? goal.goalDate.toISOString().split('T')[0] : null,
      targetNutrients: goal.targetNutrients as any,
      targetValues: { 
        workoutCount: goal.targetWorkoutCount, 
        workoutDuration: goal.targetWorkoutDuration, 
        weight: goal.targetWeight 
      },
    }).onConflictDoUpdate({
      target: fitnessGoals.id,
      set: {
        ...goal,
        goalDate: goal.goalDate ? goal.goalDate.toISOString().split('T')[0] : null,
        targetNutrients: goal.targetNutrients as any,
        targetValues: { 
          workoutCount: goal.targetWorkoutCount, 
          workoutDuration: goal.targetWorkoutDuration, 
          weight: goal.targetWeight 
        },
      },
    });
  }

  async getGoals(userId: string): Promise<Goal[]> {
    const res = await db.select().from(fitnessGoals).where(eq(fitnessGoals.userId, userId));
    return res.map(r => ({
      ...r,
      goalDate: r.goalDate ? new Date(r.goalDate) : undefined,
      type: r.type as any,
      status: r.status as any,
      targetNutrients: r.targetNutrients as any,
      targetWeight: (r.targetValues as any)?.weight,
      targetWorkoutCount: (r.targetValues as any)?.workoutCount,
      targetWorkoutDuration: (r.targetValues as any)?.workoutDuration,
    }));
  }

  async logProgress(progress: ProgressMetric): Promise<void> {
    await db.insert(fitnessProgress).values({
      ...progress,
      metadata: progress.metadata as any ?? null,
    });
  }

  async getProgress(userId: string): Promise<ProgressMetric[]> {
    const res = await db.select().from(fitnessProgress).where(eq(fitnessProgress.userId, userId));
    return res.map(r => ({
      ...r,
      type: r.type as any,
      metadata: r.metadata as any ?? undefined,
    }));
  }

  // --- AI ---
  async saveAIInsight(insight: AIInsight): Promise<void> {
    await db.insert(fitnessAIInsights).values(insight);
  }

  async getAIInsights(userId: string): Promise<AIInsight[]> {
    const res = await db.select().from(fitnessAIInsights).where(eq(fitnessAIInsights.userId, userId));
    return res as AIInsight[];
  }
}
