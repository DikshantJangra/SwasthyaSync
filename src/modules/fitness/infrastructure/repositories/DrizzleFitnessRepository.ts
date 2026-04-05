import { FitnessRepository } from "../../domain/repositories/FitnessRepository";
import { Workout, WorkoutLog, Exercise } from "../../domain/entities/Workout";
import { NutritionLogEntry, Food } from "../../domain/entities/Nutrition";
import { Goal, ProgressMetric, AIInsight } from "../../domain/entities/Goal";
import { SleepLog, FastingLog, WaterContainer, WaterIntake } from "../../domain/entities/Holistic";
import { DailySummary, TdeeLog, ExternalProvider } from "../../domain/entities/Metabolic";
import { db } from "@/lib/db/db";
import { 
  fitnessExercises, 
  fitnessWorkouts, 
  fitnessWorkoutLogs, 
  fitnessFoods, 
  fitnessNutritionLogs, 
  fitnessGoals, 
  fitnessAIInsights,
  fitnessDailySummaries,
  fitnessTdeeLogs,
  fitnessSleepLogs,
  fitnessFastingLogs,
  fitnessWaterIntake,
  fitnessWaterContainers,
  fitnessExternalProviders
} from "../schema";
import { eq, and, desc } from "drizzle-orm";

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
      set: { ...workout, description: workout.description ?? null },
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
    return res.map(r => ({ ...r, description: r.description ?? undefined, exerciseIds: r.exerciseIds as string[] }));
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
      date: log.date.toISOString().split('T')[0],
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

  // --- Goals & AI ---
  async saveGoal(goal: Goal): Promise<void> {
    await db.insert(fitnessGoals).values({
      ...goal,
      goalDate: goal.goalDate ? goal.goalDate.toISOString().split('T')[0] : null,
      targetNutrients: goal.targetNutrients as any,
      targetValues: goal.targetValues as any,
    }).onConflictDoUpdate({
      target: fitnessGoals.id,
      set: {
        ...goal,
        goalDate: goal.goalDate ? goal.goalDate.toISOString().split('T')[0] : null,
        targetNutrients: goal.targetNutrients as any,
        targetValues: goal.targetValues as any,
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
      targetValues: r.targetValues as any,
    })) as Goal[];
  }

  async saveAIInsight(insight: AIInsight): Promise<void> {
    await db.insert(fitnessAIInsights).values(insight);
  }

  async getAIInsights(userId: string): Promise<AIInsight[]> {
    const res = await db.select().from(fitnessAIInsights).where(eq(fitnessAIInsights.userId, userId));
    return res as AIInsight[];
  }

  // --- Holistic Wellness ---
  async saveSleepLog(log: SleepLog): Promise<void> {
    await db.insert(fitnessSleepLogs).values({
      ...log,
      date: log.date.toISOString().split('T')[0],
      bedTime: log.bedTime ?? null,
      wakeTime: log.wakeTime ?? null,
      stages: log.stages as any,
    }).onConflictDoUpdate({
      target: fitnessSleepLogs.id,
      set: { 
        ...log, 
        date: log.date.toISOString().split('T')[0], 
        bedTime: log.bedTime ?? null,
        wakeTime: log.wakeTime ?? null,
        stages: log.stages as any 
      },
    });
  }

  async getSleepLogs(userId: string): Promise<SleepLog[]> {
    const res = await db.select().from(fitnessSleepLogs).where(eq(fitnessSleepLogs.userId, userId));
    return res.map(r => ({ 
      ...r, 
      date: new Date(r.date), 
      bedTime: r.bedTime ?? undefined,
      wakeTime: r.wakeTime ?? undefined,
      totalDurationMinutes: r.totalDurationMinutes ?? undefined,
      qualityScore: r.qualityScore ?? undefined,
      latencyMinutes: r.latencyMinutes ?? undefined,
      stages: r.stages as any 
    }));
  }

  async saveFastingLog(log: FastingLog): Promise<void> {
    await db.insert(fitnessFastingLogs).values({
      ...log,
      endTime: log.endTime ?? null,
      targetDurationHours: log.targetDurationHours ?? null,
    }).onConflictDoUpdate({
      target: fitnessFastingLogs.id,
      set: { 
        ...log, 
        endTime: log.endTime ?? null,
        targetDurationHours: log.targetDurationHours ?? null 
      },
    });
  }

  async getFastingLogs(userId: string): Promise<FastingLog[]> {
    const res = await db.select().from(fitnessFastingLogs).where(eq(fitnessFastingLogs.userId, userId));
    return res.map(r => ({
      ...r,
      endTime: r.endTime ?? undefined,
      targetDurationHours: r.targetDurationHours ?? undefined,
    })) as FastingLog[];
  }

  async saveWaterContainer(container: WaterContainer): Promise<void> {
    await db.insert(fitnessWaterContainers).values(container).onConflictDoUpdate({
      target: fitnessWaterContainers.id,
      set: container,
    });
  }

  async getWaterContainers(userId: string): Promise<WaterContainer[]> {
    const res = await db.select().from(fitnessWaterContainers).where(eq(fitnessWaterContainers.userId, userId));
    return res.map(r => ({
      ...r,
      isDefault: r.isDefault ?? false,
    }));
  }

  async logWaterIntake(intake: WaterIntake): Promise<void> {
    await db.insert(fitnessWaterIntake).values({
      ...intake,
      containerId: intake.containerId ?? null,
    });
  }

  async getWaterIntake(userId: string, date: Date): Promise<WaterIntake[]> {
    const res = await db.select().from(fitnessWaterIntake).where(eq(fitnessWaterIntake.userId, userId));
    return res.map(r => ({ ...r, containerId: r.containerId ?? undefined }));
  }

  // --- Metabolic Hub ---
  async saveDailySummary(summary: DailySummary): Promise<void> {
    await db.insert(fitnessDailySummaries).values({
      ...summary,
      date: summary.date.toISOString().split('T')[0],
      totalCaloriesIn: summary.totalCaloriesIn,
      totalCaloriesOut: summary.totalCaloriesOut,
      netCalories: summary.netCalories,
      weightKg: summary.weightKg ?? null,
      steps: summary.steps ?? null,
      sleepMinutes: summary.sleepMinutes ?? null,
      waterMl: summary.waterMl ?? null,
      moodScore: summary.moodScore ?? null,
      metadata: summary.metadata as any,
    }).onConflictDoUpdate({
      target: fitnessDailySummaries.id,
      set: { 
        ...summary, 
        date: summary.date.toISOString().split('T')[0], 
        weightKg: summary.weightKg ?? null,
        metadata: summary.metadata as any 
      },
    });
  }

  async getDailySummaries(userId: string, limit: number = 30): Promise<DailySummary[]> {
    const res = await db.select().from(fitnessDailySummaries)
      .where(eq(fitnessDailySummaries.userId, userId))
      .orderBy(desc(fitnessDailySummaries.date))
      .limit(limit);
    return res.map(r => ({ 
      ...r, 
      date: new Date(r.date), 
      totalCaloriesIn: r.totalCaloriesIn ?? 0,
      totalCaloriesOut: r.totalCaloriesOut ?? 0,
      netCalories: r.netCalories ?? 0,
      weightKg: r.weightKg ?? undefined,
      steps: r.steps ?? undefined,
      sleepMinutes: r.sleepMinutes ?? undefined,
      waterMl: r.waterMl ?? undefined,
      moodScore: r.moodScore ?? undefined,
      metadata: r.metadata as any 
    }));
  }

  async saveTdeeLog(log: TdeeLog): Promise<void> {
    await db.insert(fitnessTdeeLogs).values({
      ...log,
      date: log.date.toISOString().split('T')[0],
      calculationContext: log.calculationContext as any,
    });
  }

  async getTdeeLogs(userId: string): Promise<TdeeLog[]> {
    const res = await db.select().from(fitnessTdeeLogs).where(eq(fitnessTdeeLogs.userId, userId));
    return res.map(r => ({ ...r, date: new Date(r.date), calculationContext: r.calculationContext as any })) as TdeeLog[];
  }

  // --- Integrations ---
  async saveExternalProvider(provider: ExternalProvider): Promise<void> {
    await db.insert(fitnessExternalProviders).values({
      ...provider,
      accessToken: provider.accessToken ?? null,
      refreshToken: provider.refreshToken ?? null,
      tokenExpiry: provider.tokenExpiry ?? null,
      lastSync: provider.lastSync ?? null,
      config: provider.config as any,
    }).onConflictDoUpdate({
      target: fitnessExternalProviders.id,
      set: {
        ...provider,
        accessToken: provider.accessToken ?? null,
        refreshToken: provider.refreshToken ?? null,
        config: provider.config as any,
      },
    });
  }

  async getExternalProviders(userId: string): Promise<ExternalProvider[]> {
    const res = await db.select().from(fitnessExternalProviders).where(eq(fitnessExternalProviders.userId, userId));
    return res.map(r => ({
      ...r,
      providerType: r.providerType as any,
      accessToken: r.accessToken ?? undefined,
      refreshToken: r.refreshToken ?? undefined,
      tokenExpiry: r.tokenExpiry ?? undefined,
      lastSync: r.lastSync ?? undefined,
      isActive: r.isActive ?? false,
      config: r.config as any,
    }));
  }
}
