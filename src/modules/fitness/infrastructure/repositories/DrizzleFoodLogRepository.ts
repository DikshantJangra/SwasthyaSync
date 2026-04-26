/**
 * DrizzleFoodLogRepository
 * 
 * Implements the FoodLogRepository interface using Drizzle ORM.
 * 
 * This is the INFRASTRUCTURE layer — it knows about the database
 * and how to map between our simple FoodLog entity and the
 * existing fitnessNutritionLogs table.
 * 
 * We reuse the existing DB table (fitnessNutritionLogs) so
 * no new database migration is needed!
 */

import { FoodLogRepository } from "../../domain/repositories/FoodLogRepository";
import { FoodLog } from "../../domain/entities/FoodLog";
import { db } from "@/lib/db/db";
import { fitnessNutritionLogs } from "../schema";
import { eq, and, sql } from "drizzle-orm";

export class DrizzleFoodLogRepository implements FoodLogRepository {

  /**
   * Save a food log entry to the database.
   * 
   * Maps our simple FoodLog entity to the existing fitnessNutritionLogs table.
   * The existing table expects a `nutrients` JSONB column, so we store
   * calories there and set other nutrient values to 0.
   */
  async saveFoodLog(log: FoodLog): Promise<void> {
    await db.insert(fitnessNutritionLogs).values({
      id: log.id,
      userId: log.userId,
      // Convert Date to "YYYY-MM-DD" string for the date column
      date: log.date.toISOString().split("T")[0],
      mealType: log.mealType,
      foodName: log.foodName,
      foodId: null,          // Not using food dictionary for this feature
      mealId: "legacy",
      quantity: 1,           // Default to 1 serving
      unit: "serving",       // Default unit
      // Store calories in the nutrients JSONB column
      nutrients: {
        calories: log.calories,
        protein: log.protein || 0,
        carbs: log.carbs || 0,
        fat: log.fat || 0,
      },
    });
  }

  /**
   * Get all food logs for a user on a specific date.
   * 
   * Queries the fitnessNutritionLogs table filtered by userId and date,
   * then maps the DB rows back to our simple FoodLog entity.
   */
  async getFoodLogsByDate(userId: string, date: Date): Promise<FoodLog[]> {
    // Convert date to "YYYY-MM-DD" format for comparison
    const dateStr = date.toISOString().split("T")[0];

    const rows = await db
      .select()
      .from(fitnessNutritionLogs)
      .where(
        and(
          eq(fitnessNutritionLogs.userId, userId),
          eq(fitnessNutritionLogs.date, dateStr)
        )
      );

    // Map DB rows to our simple FoodLog entity
    return rows.map((row) => {
      const nutrients = row.nutrients as any || {};
      return {
        id: row.id,
        userId: row.userId,
        foodName: row.foodName || "Unknown Food",
        calories: nutrients.calories || 0,
        protein: nutrients.protein || 0,
        carbs: nutrients.carbs || 0,
        fat: nutrients.fat || 0,
        mealType: row.mealType as FoodLog["mealType"],
        date: new Date(row.date),
      };
    });
  }

  /**
   * Get total calories consumed by a user today.
   * 
   * Fetches all of today's logs and sums up the calories.
   * This is done in JavaScript for simplicity (could be a SQL aggregate
   * for better performance at scale, but fine for our use case).
   */
  async getTodayCalories(userId: string): Promise<number> {
    const today = new Date();
    const logs = await this.getFoodLogsByDate(userId, today);

    // Sum up all calories from today's food logs
    return logs.reduce((total, log) => total + log.calories, 0);
  }

  /**
   * Delete a food log entry from the database.
   * 
   * Uses both id AND userId in the WHERE clause for security —
   * ensures a user can only delete their own food logs.
   */
  async deleteFoodLog(id: string, userId: string): Promise<void> {
    await db
      .delete(fitnessNutritionLogs)
      .where(
        and(
          eq(fitnessNutritionLogs.id, id),
          eq(fitnessNutritionLogs.userId, userId)
        )
      );
  }
}
