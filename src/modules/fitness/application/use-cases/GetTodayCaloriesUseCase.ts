/**
 * GetTodayCaloriesUseCase
 * 
 * Returns the total calories consumed by a user today.
 * 
 * This is used in two places:
 * 1. Top of the Nutrition tab — "Total Calories Today: 1200 kcal"
 * 2. Dashboard — "Today's Calories: 1200 kcal"
 * 
 * The actual summing logic is delegated to the repository
 * since it can be done efficiently at the database level.
 */

import { FoodLogRepository } from "../../domain/repositories/FoodLogRepository";

export class GetTodayCaloriesUseCase {
  constructor(private foodLogRepo: FoodLogRepository) {}

  /**
   * Execute the use case
   * @param userId - The user whose calories we want to sum
   * @returns Total calories consumed today (number)
   */
  async execute(userId: string): Promise<number> {
    return this.foodLogRepo.getTodayCalories(userId);
  }
}
