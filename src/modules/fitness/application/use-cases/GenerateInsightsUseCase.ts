import { FitnessRepository } from "../../domain/repositories/FitnessRepository";
import { AIInsight } from "../../domain/entities/Goal";

export class GenerateInsightsUseCase {
  constructor(private fitnessRepo: FitnessRepository) {}

  async execute(userId: string): Promise<AIInsight[]> {
    const [workouts, nutrition, summaries] = await Promise.all([
      this.fitnessRepo.getWorkoutLogs(userId),
      this.fitnessRepo.getNutritionLogs(userId),
      this.fitnessRepo.getDailySummaries(userId, 7),
    ]);
    
    const insights: AIInsight[] = [];

    // 1. Workout Analysis
    if (workouts.length > 0) {
      const totalMinutes = workouts.reduce((acc, curr) => acc + curr.durationMinutes, 0);
      insights.push({
        id: Math.random().toString(36).substr(2, 9),
        userId,
        type: "analysis",
        content: `Momentum check: You've completed ${workouts.length} workouts totaling ${totalMinutes} minutes. You're building life-long habits.`,
        source: "workout",
        createdAt: new Date(),
      });
    }

    // 2. Nutrition & Metabolic Analysis
    const today = new Date().toISOString().split('T')[0];
    const todayLogs = nutrition.filter(n => n.date.toISOString().split('T')[0] === today);
    if (todayLogs.length > 0) {
      const totalCalories = todayLogs.reduce((acc, curr) => acc + curr.nutrients.calories, 0);
      insights.push({
        id: Math.random().toString(36).substr(2, 9),
        userId,
        type: "recommendation",
        content: `Today's caloric intake is ${totalCalories} kcal. Prioritize protein in your next meal to optimize metabolic thermal effect.`,
        source: "nutrition",
        createdAt: new Date(),
      });
    }

    // 3. Weight/Progress Insight (from Summaries)
    if (summaries.length >= 2) {
      const latest = summaries[0].weightKg;
      const previous = summaries[1].weightKg;
      if (latest && previous) {
        const change = latest - previous;
        insights.push({
          id: Math.random().toString(36).substr(2, 9),
          userId,
          type: "prediction",
          content: `Weight changed by ${change.toFixed(1)}kg. Our metabolic engine is currently calibrating your TDEE based on this trend.`,
          source: "general",
          createdAt: new Date(),
        });
      }
    }

    // Save one primary insight to DB
    if (insights.length > 0) {
      await this.fitnessRepo.saveAIInsight(insights[0]);
    }

    return insights;
  }
}
