/**
 * FoodLog Entity
 * 
 * Represents a single food item logged by the user.
 * Each entry tracks what food was eaten, how many calories it had,
 * which meal it belonged to (breakfast/lunch/dinner/snacks),
 * and on which date it was logged.
 * 
 * This is a simplified entity focused on calorie tracking.
 */

// Meal type options — used across the app for consistency
export type MealType = "breakfast" | "lunch" | "dinner" | "snacks";

export interface FoodLog {
  id: string;           // Unique identifier for this log entry
  userId: string;       // Which user logged this food
  foodName: string;     // Name of the food (e.g., "Apple", "Rice")
  calories: number;     // Calorie count for this food item
  protein?: number;     // Protein in grams
  carbs?: number;       // Carbs in grams
  fat?: number;         // Fat in grams
  mealType: MealType;   // Which meal this belongs to
  date: Date;           // Date when this food was consumed
}

/**
 * FoodSearchResult
 * 
 * Shape of data returned from the external food search API.
 * Kept simple — just name and calories.
 */
export interface FoodSearchResult {
  foodName: string;     // Name of the food from API
  calories: number;     // Calories per serving (approx)
  protein?: number;
  carbs?: number;
  fat?: number;
}
