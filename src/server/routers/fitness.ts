/**
 * Fitness tRPC Router
 * 
 * Defines all the API endpoints for the fitness module.
 * Each route maps to a use case or direct repository call
 * via the fitnessEngine composition root.
 * 
 * Routes are grouped by feature:
 * - Workouts: log workout sessions
 * - Nutrition: search food, log meals, get calorie data (NEW)
 * - Holistic: sleep, water, fasting tracking
 * - Goals: set fitness goals
 */

import { z } from "zod";
import { router, protectedProcedure } from "../trpc";
import { fitnessEngine } from "@/modules/fitness/fitness.composition";
// NEW: Import the food search API service
import { searchFood } from "@/modules/fitness/infrastructure/foodApiService";

const NutrientSchema = z.object({
  calories: z.number(),
  protein: z.number(),
  carbs: z.number(),
  fat: z.number(),
  saturatedFat: z.number().optional(),
  fiber: z.number().optional(),
  sugar: z.number().optional(),
  sodium: z.number().optional(),
});

export const fitnessRouter = router({
  getDashboard: protectedProcedure.query(({ ctx }) => {
    return fitnessEngine.getDashboard(ctx.session.user.id);
  }),

  getExercises: protectedProcedure.query(async () => {
    const { db } = await import("@/lib/db");
    const { fitnessExercises } = await import("@/lib/db/schema");
    return db.select().from(fitnessExercises);
  }),

  // --- Workouts ---
  logWorkout: protectedProcedure
    .input(z.object({
      workoutId: z.string().optional(),
      durationMinutes: z.number(),
      notes: z.string().optional(),
      sets: z.array(z.object({
        exerciseId: z.string(),
        setNumber: z.number(),
        setType: z.enum(["warmup", "working", "dropset", "failure"]),
        reps: z.number().optional(),
        weight: z.number().optional(),
        rpe: z.number().optional(),
      })),
      caloriesBurned: z.number().optional(),
    }))
    .mutation(async ({ input, ctx }) => {
      return fitnessEngine.logWorkout({
        ...input,
        id: Math.random().toString(36).substr(2, 9),
        userId: ctx.session.user.id,
        date: new Date(),
      });
    }),

  // --- Nutrition (Legacy — kept for backward compatibility) ---
  logMeal: protectedProcedure
    .input(z.object({
      mealType: z.string(),
      foodName: z.string().optional(),
      quantity: z.number(),
      unit: z.string(),
      nutrients: NutrientSchema,
    }))
    .mutation(async ({ input, ctx }) => {
      return fitnessEngine.logMeal({
        ...input,
        id: Math.random().toString(36).substr(2, 9),
        userId: ctx.session.user.id,
        date: new Date(),
      });
    }),

  // ============================================================
  // NEW: Nutrition Tracking Routes (Food Search + Calorie Tracking)
  // ============================================================

  /**
   * searchFood — Search for food items using external API
   * 
   * Input: query string (e.g., "apple", "rice")
   * Output: Array of { foodName, calories }
   * 
   * Uses Open Food Facts API (free, no API key needed)
   */
  searchFood: protectedProcedure
    .input(z.object({
      query: z.string().min(1), // At least 1 character to search
    }))
    .query(async ({ input }) => {
      // Call the food API service to search for food items
      const results = await searchFood(input.query);
      return results;
    }),

  /**
   * searchExercise — Search for gym exercises
   */
  searchExercise: protectedProcedure
    .input(z.object({
      query: z.string().min(1),
    }))
    .query(async ({ input }) => {
      const { searchExercise } = await import("@/modules/fitness/infrastructure/exerciseApiService");
      return await searchExercise(input.query);
    }),

  /**
   * logFood — Log a food item to the user's daily meal log
   * 
   * Input: foodName, calories, mealType
   * Output: void (just saves to DB)
   * 
   * This is called when user selects a food from search results
   * and picks a meal type (breakfast/lunch/dinner/snacks)
   */
  logFood: protectedProcedure
    .input(z.object({
      foodName: z.string(),
      calories: z.number(),
      protein: z.number().optional(),
      carbs: z.number().optional(),
      fat: z.number().optional(),
      mealType: z.enum(["breakfast", "lunch", "dinner", "snacks"]),
      date: z.string(), // "YYYY-MM-DD"
    }))
    .mutation(async ({ input, ctx }) => {
      return fitnessEngine.nutrition.logFood({
        id: Math.random().toString(36).substr(2, 9), // Generate unique ID
        userId: ctx.session.user.id,                  // Get user from session
        foodName: input.foodName,
        calories: input.calories,
        protein: input.protein,
        carbs: input.carbs,
        fat: input.fat,
        mealType: input.mealType,
        date: new Date(input.date),                   // Explicit date string
      });
    }),

  /**
   * getFoodLogsByDate — Get all food logs for a specific date, grouped by meal type
   * 
   * Input: date string (YYYY-MM-DD)
   * Output: { breakfast: [...], lunch: [...], dinner: [...], snacks: [...] }
   * 
   * Used to display the day-wise meal breakdown in the Nutrition tab
   */
  getFoodLogsByDate: protectedProcedure
    .input(z.object({
      date: z.string(), // Date in "YYYY-MM-DD" format
    }))
    .query(async ({ input, ctx }) => {
      const date = new Date(input.date);
      return fitnessEngine.nutrition.getFoodLogsByDate(ctx.session.user.id, date);
    }),

  /**
   * getTodayCalories — Get total calories consumed today
   * 
   * Input: none (uses session userId)
   * Output: number (total calories)
   * 
   * Used in both the Nutrition tab header and the Dashboard
   */
  getTodayCalories: protectedProcedure
    .query(async ({ ctx }) => {
      return fitnessEngine.nutrition.getTodayCalories(ctx.session.user.id);
    }),

  /**
   * deleteFoodLog — Remove a food log entry
   * 
   * Input: id (the food log ID to delete)
   * Output: void
   * 
   * Security: Uses session userId to ensure users can only delete their own logs
   */
  deleteFoodLog: protectedProcedure
    .input(z.object({
      id: z.string(), // The food log entry ID to delete
    }))
    .mutation(async ({ input, ctx }) => {
      return fitnessEngine.nutrition.deleteFood(input.id, ctx.session.user.id);
    }),

  // ============================================================

  syncTdee: protectedProcedure.mutation(async ({ ctx }) => {
    return fitnessEngine.syncTdee(ctx.session.user.id);
  }),

  // --- Holistic / Wellness ---
  logSleep: protectedProcedure
    .input(z.object({
      date: z.date(),
      bedTime: z.date().optional(),
      wakeTime: z.date().optional(),
      qualityScore: z.number().min(0).max(100).optional(),
      latencyMinutes: z.number().optional(),
    }))
    .mutation(async ({ input, ctx }) => {
      return fitnessEngine.sleep.log({
        ...input,
        id: Math.random().toString(36).substr(2, 9),
        userId: ctx.session.user.id,
      });
    }),

  logWater: protectedProcedure
    .input(z.object({
      amountMl: z.number(),
      containerId: z.string().optional(),
    }))
    .mutation(async ({ input, ctx }) => {
      return fitnessEngine.water.log({
        ...input,
        id: Math.random().toString(36).substr(2, 9),
        userId: ctx.session.user.id,
        date: new Date(),
      });
    }),

  startFast: protectedProcedure
    .input(z.object({
      targetDurationHours: z.number(),
    }))
    .mutation(async ({ input, ctx }) => {
      return fitnessEngine.fasting.log({
        ...input,
        id: Math.random().toString(36).substr(2, 9),
        userId: ctx.session.user.id,
        startTime: new Date(),
        isCompleted: false,
      });
    }),

  // --- Goals ---
  setGoal: protectedProcedure
    .input(z.object({
      type: z.enum(["nutrition", "workout", "weight", "custom"]),
      targetWeight: z.number().optional(),
      targetNutrients: NutrientSchema.optional(),
    }))
    .mutation(async ({ input, ctx }) => {
      return fitnessEngine.setGoal({
        ...input,
        id: Math.random().toString(36).substr(2, 9),
        userId: ctx.session.user.id,
        status: "active",
      });
    }),

  // ============================================================
  // NEW: Simple Workout Tracking Routes
  // ============================================================
  
  logSimpleWorkout: protectedProcedure
    .input(z.object({
      exerciseName: z.string().min(1),
      caloriesPerSet: z.number().optional(),
      sets: z.number().min(1),
      reps: z.number().min(1),
      duration: z.number().min(1),
      date: z.string(), // "YYYY-MM-DD"
    }))
    .mutation(async ({ input, ctx }) => {
      return fitnessEngine.workoutTracking.logWorkout({
        ...input,
        id: Math.random().toString(36).substr(2, 9),
        userId: ctx.session.user.id,
        date: new Date(input.date),
      });
    }),

  getSimpleWorkoutsByDate: protectedProcedure
    .input(z.object({
      date: z.string(), // "YYYY-MM-DD"
    }))
    .query(async ({ input, ctx }) => {
      return fitnessEngine.workoutTracking.getWorkoutsByDate(ctx.session.user.id, new Date(input.date));
    }),

  getTodayCaloriesBurned: protectedProcedure
    .query(async ({ ctx }) => {
      return fitnessEngine.workoutTracking.getTodayCaloriesBurned(ctx.session.user.id);
    }),

  deleteSimpleWorkout: protectedProcedure
    .input(z.object({
      id: z.string(),
    }))
    .mutation(async ({ input, ctx }) => {
      return fitnessEngine.workoutTracking.deleteWorkout(input.id, ctx.session.user.id);
    }),

  // --- New Simple Goals ---
  setSimpleGoal: protectedProcedure
    .input(z.object({
      type: z.enum(["lose_weight", "build_muscle", "maintain"]),
    }))
    .mutation(async ({ input, ctx }) => {
      return fitnessEngine.goalsTracking.setGoal(ctx.session.user.id, input.type);
    }),

  getGoalProgress: protectedProcedure
    .query(async ({ ctx }) => {
      return fitnessEngine.goalsTracking.getGoalProgress(ctx.session.user.id);
    }),

  getDailySummary: protectedProcedure
    .input(z.object({
      date: z.string(),
    }))
    .query(async ({ input, ctx }) => {
      const date = new Date(input.date);
      return fitnessEngine.getDailySummary(ctx.session.user.id, date);
    }),
});
