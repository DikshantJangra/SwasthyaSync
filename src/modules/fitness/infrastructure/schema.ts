import { pgTable, text, integer, timestamp, doublePrecision, jsonb, boolean, date } from "drizzle-orm/pg-core";
import { user } from "@/lib/db/schema";

// 1. Core Exercise Dictionary
export const fitnessExercises = pgTable("fitness_exercises", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  category: text("category").notNull(),
  targetMuscles: jsonb("target_muscles"),
  equipment: jsonb("equipment"),
  mechanic: text("mechanic"),
  force: text("force"),
  level: text("level"),
});

// 2. Workout Templates/Plans
export const fitnessWorkouts = pgTable("fitness_workouts", {
  id: text("id").primaryKey(),
  userId: text("userId").notNull().references(() => user.id),
  name: text("name").notNull(),
  description: text("description"),
  exerciseIds: jsonb("exercise_ids").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// 3. Detailed Workout Entry (The "Log")
export const fitnessWorkoutLogs = pgTable("fitness_workout_logs", {
  id: text("id").primaryKey(),
  userId: text("userId").notNull().references(() => user.id),
  workoutId: text("workout_id").references(() => fitnessWorkouts.id),
  date: timestamp("date").notNull().defaultNow(),
  durationMinutes: integer("duration_minutes").notNull(),
  caloriesBurned: integer("calories_burned"),
  avgHeartRate: integer("avg_heart_rate"),
  steps: integer("steps"),
  notes: text("notes"),
  sets: jsonb("sets").notNull(), // Array of ExerciseSet
});

// 4. Food Dictionary
export const fitnessFoods = pgTable("fitness_foods", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  brand: text("brand"),
  calories: integer("calories").notNull(),
  protein: doublePrecision("protein").notNull(),
  carbs: doublePrecision("carbs").notNull(),
  fat: doublePrecision("fat").notNull(),
  micronutrients: jsonb("micronutrients"), // Detailed nutrients
  servingSize: doublePrecision("serving_size").notNull(),
  servingUnit: text("serving_unit").notNull(),
});

// 5. Meals (Sets of Foods)
export const fitnessMeals = pgTable("fitness_meals", {
  id: text("id").primaryKey(),
  userId: text("userId").notNull().references(() => user.id),
  name: text("name").notNull(),
  mealType: text("meal_type").notNull(),
  items: jsonb("items").notNull(), // Array of { foodId, quantity, unit }
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// 6. Nutrition Logging
export const fitnessNutritionLogs = pgTable("fitness_nutrition_logs", {
  id: text("id").primaryKey(),
  userId: text("userId").notNull().references(() => user.id),
  date: date("date").notNull(),
  mealType: text("meal_type").notNull(),
  foodName: text("food_name"),
  foodId: text("food_id"),
  mealId: text("meal_id"),
  quantity: doublePrecision("quantity").notNull(),
  unit: text("unit").notNull(),
  nutrients: jsonb("nutrients").notNull(), // Snapshotted Nutrients
});

// 7. Goals & Timeline
export const fitnessGoals = pgTable("fitness_goals", {
  id: text("id").primaryKey(),
  userId: text("userId").notNull().references(() => user.id),
  type: text("type").notNull(),
  goalDate: date("goal_date"),
  targetNutrients: jsonb("target_nutrients"),
  targetValues: jsonb("target_values"), // weight, count, etc.
  status: text("status").notNull().default("active"),
});

// 8. Progress & Metrics (Garmin/Manual)
export const fitnessProgress = pgTable("fitness_progress", {
  id: text("id").primaryKey(),
  userId: text("userId").notNull().references(() => user.id),
  date: timestamp("date").notNull().defaultNow(),
  type: text("type").notNull(), // weight, sleep, etc.
  value: doublePrecision("value").notNull(),
  unit: text("unit").notNull(),
  metadata: jsonb("metadata"),
});

// 9. Family Access Control (Privileged mapping)
export const fitnessFamilyAccess = pgTable("fitness_family_access", {
  id: text("id").primaryKey(),
  ownerId: text("owner_id").notNull().references(() => user.id),
  memberId: text("member_id").notNull().references(() => user.id),
  permissions: jsonb("permissions").notNull(),
  isActive: boolean("is_active").notNull().default(true),
  expiresAt: timestamp("expires_at"),
});

// 10. AI Analytics
export const fitnessAIInsights = pgTable("fitness_ai_insights", {
  id: text("id").primaryKey(),
  userId: text("userId").notNull().references(() => user.id),
  type: text("type").notNull(),
  content: text("content").notNull(),
  source: text("source").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});
