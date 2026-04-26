/**
 * LogFoodUseCase
 * 
 * Application layer use case for saving a food log entry.
 * 
 * Flow:
 * 1. User searches for a food item (via API)
 * 2. User selects a meal type (breakfast/lunch/dinner/snacks)
 * 3. This use case saves the food log to the database
 * 
 * Follows the Single Responsibility Principle —
 * this class only handles the "log food" action.
 */

import { FoodLogRepository } from "../../domain/repositories/FoodLogRepository";
import { FoodLog } from "../../domain/entities/FoodLog";

export class LogFoodUseCase {
  // Dependency Injection: repository is passed in via constructor
  constructor(private foodLogRepo: FoodLogRepository) {}

  /**
   * Execute the use case — save a food log entry
   * @param log - The food log data to save
   */
  async execute(log: FoodLog): Promise<void> {
    await this.foodLogRepo.saveFoodLog(log);
  }
}
