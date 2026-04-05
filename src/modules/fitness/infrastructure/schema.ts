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
  micronutrients: jsonb("micronutrients"), // Detailed nutrients (vitamins, etc.)
  servingSize: doublePrecision("serving_size").notNull(),
  servingUnit: text("serving_unit").notNull(),
});

// 5. Nutrition Logging
export const fitnessNutritionLogs = pgTable("fitness_nutrition_logs", {
  id: text("id").primaryKey(),
  userId: text("userId").notNull().references(() => user.id),
  date: date("date").notNull(),
  mealType: text("meal_type").notNull(), // breakfast, lunch, etc.
  foodName: text("food_name"),
  foodId: text("food_id"),
  mealId: text("meal_id"),
  quantity: doublePrecision("quantity").notNull(),
  unit: text("unit").notNull(),
  nutrients: jsonb("nutrients").notNull(), // Snapshotted Nutrients
});

// 6. Metabolic Engine (Adaptive TDEE & Daily Summaries)
export const fitnessDailySummaries = pgTable("fitness_daily_summaries", {
  id: text("id").primaryKey(),
  userId: text("userId").notNull().references(() => user.id),
  date: date("date").notNull(),
  totalCaloriesIn: doublePrecision("total_calories_in").default(0),
  totalCaloriesOut: doublePrecision("total_calories_out").default(0),
  netCalories: doublePrecision("net_calories").default(0),
  weightKg: doublePrecision("weight_kg"),
  steps: integer("steps"),
  sleepMinutes: integer("sleep_minutes"),
  waterMl: integer("water_ml"),
  moodScore: integer("mood_score"),
  metadata: jsonb("metadata"), // Adaptive TDEE result at that point
});

export const fitnessTdeeLogs = pgTable("fitness_tdee_logs", {
  id: text("id").primaryKey(),
  userId: text("userId").notNull().references(() => user.id),
  date: date("date").notNull(),
  tdee: doublePrecision("tdee").notNull(),
  confidence: text("confidence").notNull(), // HIGH, MEDIUM, LOW
  isFallback: boolean("is_fallback").default(false),
  calculationContext: jsonb("calculation_context"), // The data window used
});

// 7. Wellness & Holistic Module
export const fitnessSleepLogs = pgTable("fitness_sleep_logs", {
  id: text("id").primaryKey(),
  userId: text("userId").notNull().references(() => user.id),
  date: date("date").notNull(), // wake up date
  bedTime: timestamp("bed_time"),
  wakeTime: timestamp("wake_time"),
  totalDurationMinutes: integer("total_duration_minutes"),
  qualityScore: integer("quality_score"), // 1-100
  stages: jsonb("stages"), // REM, Light, Deep
  latencyMinutes: integer("latency_minutes"),
  metadata: jsonb("metadata"),
});

export const fitnessFastingLogs = pgTable("fitness_fasting_logs", {
  id: text("id").primaryKey(),
  userId: text("userId").notNull().references(() => user.id),
  startTime: timestamp("start_time").notNull(),
  endTime: timestamp("end_time"),
  targetDurationHours: integer("target_duration_hours"),
  isCompleted: boolean("is_completed").default(false),
  metadata: jsonb("metadata"),
});

export const fitnessWaterIntake = pgTable("fitness_water_intake", {
  id: text("id").primaryKey(),
  userId: text("userId").notNull().references(() => user.id),
  date: timestamp("date").notNull().defaultNow(),
  amountMl: integer("amount_ml").notNull(),
  containerId: text("container_id"),
});

export const fitnessWaterContainers = pgTable("fitness_water_containers", {
  id: text("id").primaryKey(),
  userId: text("userId").notNull().references(() => user.id),
  name: text("name").notNull(), // Bottle, Cup, etc.
  volumeMl: integer("volume_ml").notNull(),
  isDefault: boolean("is_default").default(false),
});

// 8. Goals & Timeline
export const fitnessGoals = pgTable("fitness_goals", {
  id: text("id").primaryKey(),
  userId: text("userId").notNull().references(() => user.id),
  type: text("type").notNull(),
  goalDate: date("goal_date"),
  targetNutrients: jsonb("target_nutrients"),
  targetValues: jsonb("target_values"),
  status: text("status").notNull().default("active"),
});

// 9. Swasthya Connect (Integrations)
export const fitnessExternalProviders = pgTable("fitness_external_providers", {
  id: text("id").primaryKey(),
  userId: text("userId").notNull().references(() => user.id),
  providerType: text("provider_type").notNull(), // garmin, fitbit, etc.
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  tokenExpiry: timestamp("token_expiry"),
  lastSync: timestamp("last_sync"),
  isActive: boolean("is_active").default(true),
  config: jsonb("config"), // specific settings for this provider
});

// 10. AI & Family
export const fitnessFamilyAccess = pgTable("fitness_family_access", {
  id: text("id").primaryKey(),
  ownerId: text("owner_id").notNull().references(() => user.id),
  memberId: text("member_id").notNull().references(() => user.id),
  permissions: jsonb("permissions").notNull(),
  isActive: boolean("is_active").notNull().default(true),
});

export const fitnessAIInsights = pgTable("fitness_ai_insights", {
  id: text("id").primaryKey(),
  userId: text("userId").notNull().references(() => user.id),
  type: text("type").notNull(),
  content: text("content").notNull(),
  source: text("source").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});
