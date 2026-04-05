import { FitnessRepository } from "../../domain/repositories/FitnessRepository";
import { TdeeCalculator } from "../../domain/logic/TdeeCalculator";

export class UpdateAdaptiveTdeeUseCase {
  constructor(private fitnessRepo: FitnessRepository) {}

  async execute(userId: string): Promise<void> {
    const [measurements, nutrition] = await Promise.all([
      this.fitnessRepo.getNutritionLogs(userId), // We'll need weight from progress/daily summary ideally
      this.fitnessRepo.getNutritionLogs(userId),
    ]);

    // For simplicity in this port, we fetch from existing logs and progress
    // In a real scenario, this would aggregate from the holistic modules
    const result = TdeeCalculator.calculate(
      [], // TODO: Get weight measurements
      nutrition.map(n => ({ date: n.date, calories: n.nutrients.calories }))
    );

    if (!result.isFallback) {
      await this.fitnessRepo.saveTdeeLog({
        id: Math.random().toString(36).substr(2, 9),
        userId,
        date: new Date(),
        tdee: result.tdee,
        confidence: result.confidence,
        isFallback: false,
        calculationContext: result,
      });
    }
  }
}
