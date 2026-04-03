import { FitnessRepository } from "../../domain/repositories/FitnessRepository";

export class GetFitnessDashboardUseCase {
  constructor(private fitnessRepo: FitnessRepository) {}

  async execute(userId: string) {
    const [workouts, nutrition, goals, progress, insights] = await Promise.all([
      this.fitnessRepo.getWorkoutLogs(userId),
      this.fitnessRepo.getNutritionLogs(userId),
      this.fitnessRepo.getGoals(userId),
      this.fitnessRepo.getProgress(userId),
      this.fitnessRepo.getAIInsights(userId),
    ]);

    return {
      recentWorkouts: workouts.slice(-5),
      todayNutrition: nutrition.filter(n => n.date.toDateString() === new Date().toDateString()),
      activeGoals: goals.filter(g => g.status === "active"),
      recentProgress: progress.slice(-5),
      insights: insights.slice(-3),
    };
  }
}
