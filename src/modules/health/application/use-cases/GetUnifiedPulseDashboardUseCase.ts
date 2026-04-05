import { FitnessRepository } from "@/modules/fitness/domain/repositories/FitnessRepository";
import { MetricRepository } from "@/modules/health/domain/repositories/MetricRepository";
import { MedicalRepository } from "@/modules/health/infrastructure/repositories/DrizzleMedicalRepository";

export class GetUnifiedPulseDashboardUseCase {
  constructor(
    private fitnessRepo: FitnessRepository,
    private metricRepo: MetricRepository,
    private medicalRepo: MedicalRepository
  ) {}

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
      tdeeLogs,
      metrics,
      appointments,
      records
    ] = await Promise.all([
      this.fitnessRepo.getWorkoutLogs(userId),
      this.fitnessRepo.getNutritionLogs(userId),
      this.fitnessRepo.getGoals(userId),
      this.fitnessRepo.getAIInsights(userId),
      this.fitnessRepo.getSleepLogs(userId),
      this.fitnessRepo.getWaterIntake(userId, today),
      this.fitnessRepo.getFastingLogs(userId),
      this.fitnessRepo.getTdeeLogs(userId),
      this.metricRepo.findByUserId(userId),
      this.medicalRepo.getAppointments(userId),
      this.medicalRepo.getVaultRecords(userId),
    ]);

    // Aggregate Latest Metrics
    const latestWeight = metrics.filter(m => m.type === 'weight').sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())[0];
    const latestHeight = metrics.filter(m => m.type === 'height').sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())[0];
    
    // Metabolic Engine logic
    const currentTdee = tdeeLogs[0]?.tdee || 2000;
    
    return {
      metabolicPulse: {
        tdee: currentTdee,
        confidence: tdeeLogs[0]?.confidence || 'LOW',
        dailyCaloriesIn: nutrition.filter(n => n.date.toDateString() === today.toDateString())
          .reduce((acc, curr) => acc + curr.nutrients.calories, 0),
      },
      movementPulse: {
        recentWorkouts: workouts.slice(0, 3),
        weeklyActiveMinutes: workouts.filter(w => w.date > new Date(today.getTime() - 7 * 86400000))
          .reduce((acc, curr) => acc + curr.durationMinutes, 0),
      },
      recoveryPulse: {
        sleepScore: sleep[0]?.qualityScore || 0,
        hydrationMl: water.reduce((acc, curr) => acc + curr.amountMl, 0),
        fastingHours: fasting.find(f => !f.isCompleted)?.targetDurationHours || 0,
      },
      medicalPulse: {
        upcomingAppointments: appointments.filter(a => a.status === 'scheduled'),
        recentRecords: records.slice(0, 3),
        vitals: {
          weight: latestWeight?.value || 0,
          height: latestHeight?.value || 0,
          bmi: (latestWeight && latestHeight) 
            ? (latestWeight.value / ((latestHeight.value / 100) ** 2)).toFixed(1)
            : "0.0",
        }
      },
      aiInsights: insights.slice(0, 3),
    };
  }
}
