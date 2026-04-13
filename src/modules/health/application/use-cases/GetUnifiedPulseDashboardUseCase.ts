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
    // Builds the "Unified Pulse" response used by the dashboard.
    // It basically stitches together data from fitness + health + medical tables.

    const today = new Date();
    
    // Step 1: Fetch everything in parallel (keeps the endpoint snappy)
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

    // Step 2: Pull out the latest height/weight for BMI
    const latestWeight = metrics
      .filter((m) => m.type === "weight")
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())[0];

    const latestHeight = metrics
      .filter((m) => m.type === "height")
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())[0];

    // Step 3: Assemble the final dashboard payload
    const currentTdee = tdeeLogs[0]?.tdee || 2000;
    
    return {
      metabolicPulse: {
        tdee: currentTdee,
        confidence: tdeeLogs[0]?.confidence || 'LOW',
        dailyCaloriesIn: nutrition
          .filter((n) => n.date.toDateString() === today.toDateString())
          .reduce((total, item) => total + item.nutrients.calories, 0),
      },
      movementPulse: {
        recentWorkouts: workouts.slice(0, 3),
        weeklyActiveMinutes: workouts
          .filter((w) => w.date > new Date(today.getTime() - 7 * 86400000))
          .reduce((total, item) => total + item.durationMinutes, 0),
      },
      recoveryPulse: {
        sleepScore: sleep[0]?.qualityScore || 0,
        hydrationMl: water.reduce((total, item) => total + item.amountMl, 0),
        fastingHours: fasting.find(f => !f.isCompleted)?.targetDurationHours || 0,
      },
      medicalPulse: {
        upcomingAppointments: appointments.filter(a => a.status === 'scheduled'),
        recentRecords: records.slice(0, 3),
        vitals: {
          weight: Number(latestWeight?.value) || 0,
          height: Number(latestHeight?.value) || 0,
          bmi: (latestWeight && latestHeight)
            ? (Number(latestWeight.value) / ((Number(latestHeight.value) / 100) ** 2)).toFixed(1)
            : "0.0",
        }
      },
      aiInsights: insights.slice(0, 3),
    };
  }
}
