import { FitnessRepository } from "../../domain/repositories/FitnessRepository";

export class GetFitnessDashboardUseCase {
  constructor(private fitnessRepo: FitnessRepository) {}

  async execute(userId: string) {
    const today = new Date();
    
    const [
      workouts, 
      nutrition, 
      goals, 
      insights, 
      sleep, 
      water, 
      fasting,
      tdeeLogs
    ] = await Promise.all([
      this.fitnessRepo.getWorkoutLogs(userId),
      this.fitnessRepo.getNutritionLogs(userId),
      this.fitnessRepo.getGoals(userId),
      this.fitnessRepo.getAIInsights(userId),
      this.fitnessRepo.getSleepLogs(userId),
      this.fitnessRepo.getWaterIntake(userId, today),
      this.fitnessRepo.getFastingLogs(userId),
      this.fitnessRepo.getTdeeLogs(userId),
    ]);

    // Aggregate today's intake
    const todayStr = today.toISOString().split('T')[0];
    const todayNutrition = nutrition.filter(n => n.date.toISOString().split('T')[0] === todayStr);

    return {
      recentWorkouts: workouts.slice(0, 5),
      todayNutrition,
      activeGoals: goals.filter(g => g.status === 'active'),
      insights: insights.slice(0, 3),
      // Holistic Snapshot
      sleepSnapshot: sleep[0] || null, // Latest sleep
      waterIntakeMl: water.reduce((acc, curr) => acc + curr.amountMl, 0),
      currentFast: fasting.find(f => !f.isCompleted) || null,
      metabolic: {
        currentTdee: tdeeLogs[0]?.tdee || 2000,
        confidence: tdeeLogs[0]?.confidence || 'LOW',
      }
    };
  }
}
