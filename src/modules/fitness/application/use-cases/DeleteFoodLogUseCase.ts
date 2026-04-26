/**
 * DeleteFoodLogUseCase
 * 
 * Application layer use case for deleting a food log entry.
 * 
 * Flow:
 * 1. User sees a logged food item in their daily meals
 * 2. User clicks the remove/delete button
 * 3. This use case deletes the food log from the database
 * 
 * Security: Both id and userId are required to ensure
 * a user can only delete their own food logs.
 */

import { FoodLogRepository } from "../../domain/repositories/FoodLogRepository";

export class DeleteFoodLogUseCase {
  // Dependency Injection: repository is passed in via constructor
  constructor(private foodLogRepo: FoodLogRepository) {}

  /**
   * Execute the use case — delete a food log entry
   * @param id - The ID of the food log to delete
   * @param userId - The user's ID (for security check)
   */
  async execute(id: string, userId: string): Promise<void> {
    await this.foodLogRepo.deleteFoodLog(id, userId);
  }
}
