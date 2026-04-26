/**
 * FoodLogRepository Interface
 * 
 * Defines the contract for food log data operations.
 * This follows the Repository pattern from Clean Architecture —
 * the domain layer defines WHAT operations are needed,
 * and the infrastructure layer implements HOW they work.
 * 
 * Four core operations:
 * 1. Save a food log entry
 * 2. Get all food logs for a specific date (for day-wise view)
 * 3. Get total calories consumed today (for dashboard)
 * 4. Delete a food log entry (for removing logged foods)
 */

import { FoodLog } from "../entities/FoodLog";

export interface FoodLogRepository {
  // Save a new food log entry to the database
  saveFoodLog(log: FoodLog): Promise<void>;

  // Get all food logs for a user on a specific date
  // Used to show the day-wise meal breakdown
  getFoodLogsByDate(userId: string, date: Date): Promise<FoodLog[]>;

  // Get the total calories consumed by a user today
  // Used for the dashboard calorie counter
  getTodayCalories(userId: string): Promise<number>;

  // Delete a food log entry by its ID
  // Used when user wants to remove a logged food item
  deleteFoodLog(id: string, userId: string): Promise<void>;
}
