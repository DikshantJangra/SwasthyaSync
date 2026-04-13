import { WorkoutRepository } from "../../domain/repositories/WorkoutRepository";
import { SimpleWorkout } from "../../domain/entities/Workout";
import { db } from "@/lib/db/db";
import { fitnessWorkoutLogs } from "../schema";
import { eq, and, gte, lte } from "drizzle-orm";

export class DrizzleWorkoutRepository implements WorkoutRepository {
  async saveWorkout(workout: SimpleWorkout): Promise<void> {
    await db.insert(fitnessWorkoutLogs).values({
      id: workout.id,
      userId: workout.userId,
      date: workout.date,
      durationMinutes: workout.duration,
      caloriesBurned: workout.caloriesBurned,
      notes: workout.exerciseName,
      sets: [
        {
          exerciseId: workout.exerciseName,
          setNumber: workout.sets,
          reps: workout.reps,
          setType: "working",
        }
      ]
    });
  }

  async getWorkoutsByDate(userId: string, date: Date): Promise<SimpleWorkout[]> {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    const rows = await db
      .select()
      .from(fitnessWorkoutLogs)
      .where(
        and(
          eq(fitnessWorkoutLogs.userId, userId),
          gte(fitnessWorkoutLogs.date, startOfDay),
          lte(fitnessWorkoutLogs.date, endOfDay)
        )
      );

    return rows.map((row) => {
      const sets = Array.isArray(row.sets) ? row.sets[0] as any : null;
      return {
        id: row.id,
        userId: row.userId,
        exerciseName: row.notes || "Unknown Exercise",
        sets: sets?.setNumber || 1,
        reps: sets?.reps || 1,
        duration: row.durationMinutes,
        caloriesBurned: row.caloriesBurned || 0,
        date: new Date(row.date),
      };
    });
  }

  async getTodayCaloriesBurned(userId: string): Promise<number> {
    const today = new Date();
    const workouts = await this.getWorkoutsByDate(userId, today);
    return workouts.reduce((total, w) => total + w.caloriesBurned, 0);
  }

  async deleteWorkout(id: string, userId: string): Promise<void> {
    await db.delete(fitnessWorkoutLogs)
      .where(
        and(
          eq(fitnessWorkoutLogs.id, id),
          eq(fitnessWorkoutLogs.userId, userId)
        )
      );
  }
}
