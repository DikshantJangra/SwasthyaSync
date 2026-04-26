/**
 * GetFoodLogsByDateUseCase
 * 
 * Fetches all food logs for a specific date and groups them by meal type.
 * 
 * This is used to display the day-wise meal breakdown:
 * 
 *   Breakfast:
 *     - Apple (52 cal)
 *   Lunch:
 *     - Rice (200 cal)
 *   Dinner:
 *     - Chicken (300 cal)
 *   Snacks:
 *     - Cookies (150 cal)
 * 
 * The grouping logic lives here (application layer) because it's
 * business logic — not a database concern.
 */

import { FoodLogRepository } from "../../domain/repositories/FoodLogRepository";
import { FoodLog, MealType } from "../../domain/entities/FoodLog";

// Type for the grouped result — each meal type maps to an array of food logs
export type GroupedFoodLogs = Record<MealType, FoodLog[]>;

export class GetFoodLogsByDateUseCase {
  constructor(private foodLogRepo: FoodLogRepository) {}

  /**
   * Execute the use case
   * @param userId - The user whose logs we want
   * @param date - The date to fetch logs for
   * @returns Food logs grouped by meal type
   */
  async execute(userId: string, date: Date): Promise<GroupedFoodLogs> {
    // Step 1: Fetch all logs for the given date from the database
    const logs = await this.foodLogRepo.getFoodLogsByDate(userId, date);

    // Step 2: Group the logs by meal type
    // Initialize empty arrays for each meal type
    const grouped: GroupedFoodLogs = {
      breakfast: [],
      lunch: [],
      dinner: [],
      snacks: [],
    };

    // Step 3: Put each log into its corresponding meal type group
    for (const log of logs) {
      if (grouped[log.mealType]) {
        grouped[log.mealType].push(log);
      }
    }

    return grouped;
  }
}
