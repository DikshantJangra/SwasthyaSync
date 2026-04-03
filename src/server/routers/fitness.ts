import { z } from "zod";
import { router, protectedProcedure } from "../trpc";
import { fitnessEngine } from "@/modules/fitness/fitness.composition";

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
});
