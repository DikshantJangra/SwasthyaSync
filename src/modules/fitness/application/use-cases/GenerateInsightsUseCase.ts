import { FitnessRepository } from "../../domain/repositories/FitnessRepository";
import { AIInsight } from "../../domain/entities/Goal";

export class GenerateInsightsUseCase {
  constructor(private fitnessRepo: FitnessRepository) {}

  async execute(userId: string): Promise<AIInsight[]> {
    const [workouts, nutrition, progress] = await Promise.all([
      this.fitnessRepo.getWorkoutLogs(userId),
      this.fitnessRepo.getNutritionLogs(userId),
      this.fitnessRepo.getProgress(userId),
    ]);
    
    const insights: AIInsight[] = [];

    // 1. Workout Analysis
    if (workouts.length > 0) {
      const totalMinutes = workouts.reduce((acc, curr) => acc + curr.durationMinutes, 0);
      insights.push({
        id: Math.random().toString(36).substr(2, 9),
        userId,
        type: "analysis",
        content: `You've completed ${workouts.length} workouts totaling ${totalMinutes} minutes. Keep up the momentum!`,
        source: "workout",
        createdAt: new Date(),
      });
    }

    // 2. Nutrition Analysis (Thin but connected)
    const today = new Date().toISOString().split('T')[0];
    const todayLogs = nutrition.filter(n => n.date.toISOString().split('T')[0] === today);
    if (todayLogs.length > 0) {
      const totalCalories = todayLogs.reduce((acc, curr) => acc + curr.nutrients.calories, 0);
      insights.push({
        id: Math.random().toString(36).substr(2, 9),
        userId,
        type: "recommendation",
        content: `Today's intake: ${totalCalories} kcal. Ensure you're hitting your protein target for better recovery.`,
        source: "nutrition",
        createdAt: new Date(),
      });
    }

    // 3. Weight/Progress Insight
    const weightLogs = progress.filter(p => p.type === 'weight').sort((a,b) => b.date.getTime() - a.date.getTime());
    if (weightLogs.length >= 2) {
      const change = weightLogs[0].value - weightLogs[1].value;
      insights.push({
        id: Math.random().toString(36).substr(2, 9),
        userId,
        type: "prediction",
        content: `Weight changed by ${change.toFixed(1)}kg since last check. Trends look ${change <= 0 ? 'promising' : 'consistent'}.`,
        source: "general",
        createdAt: new Date(),
      });
    }

    // Save one primary insight to DB
    if (insights.length > 0) {
      await this.fitnessRepo.saveAIInsight(insights[0]);
    }

    return insights;
  }
}
