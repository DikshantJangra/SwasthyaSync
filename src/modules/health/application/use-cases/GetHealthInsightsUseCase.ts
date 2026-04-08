import { type MetricType, type HealthMetric } from "../../domain/entities/Metric";
import { MetricRepository } from "../../domain/repositories/MetricRepository";

export type HealthInsightsDTO = {
  bmiCategory: string;
  hydrationStatus: string;
  weightStatus: string;
};

// Simple helper: from metric log, pick the latest row for a given type.
function pickLatestMetricValue(
  allRows: HealthMetric[],
  type: MetricType
): number | null {
  // Step 1: filter only the requested type
  const rows = allRows.filter((m) => m.type === type);
  if (rows.length === 0) return null;

  // Step 2: pick the newest by timestamp
  rows.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

  // Step 3: metric value may be string for blood group, but for our insights we use number metrics
  const value = rows[0]?.value;
  return typeof value === "number" ? value : null;
}

export class GetHealthInsightsUseCase {
  constructor(private metricRepository: MetricRepository) {}

  async execute(userId: string): Promise<HealthInsightsDTO> {
    // Step 1: load all metrics (we will pick latest values)
    const allMetricRows = await this.metricRepository.findByUserId(userId);

    // Step 2: get the latest height/weight/hydration
    const heightCm = pickLatestMetricValue(allMetricRows, "height");
    const weightKg = pickLatestMetricValue(allMetricRows, "weight");
    const hydrationLitres = pickLatestMetricValue(allMetricRows, "hydration");

    // calculate BMI (using height in meters)
    let bmi: number | null = null;
    if (heightCm !== null && weightKg !== null && heightCm > 0) {
      const heightM = heightCm / 100;
      bmi = weightKg / (heightM * heightM);
    }

    // decide BMI category
    let bmiCategory = "Unknown";
    if (bmi !== null) {
      if (bmi < 18.5) bmiCategory = "Underweight";
      else if (bmi < 25) bmiCategory = "Normal";
      else bmiCategory = "Overweight";
    }

    // hydration status
    // if hydration is missing, keep it simple and treat it as Low (encourages user to log it)
    const hydrationValue = hydrationLitres ?? 0;
    const hydrationStatus = hydrationValue < 2 ? "Low" : "Good";

    // weight status based on BMI category
    let weightStatus = "Unknown";
    if (bmiCategory === "Underweight") weightStatus = "Below Ideal";
    else if (bmiCategory === "Normal") weightStatus = "Healthy";
    else if (bmiCategory === "Overweight") weightStatus = "Above Ideal";

    return {
      bmiCategory,
      hydrationStatus,
      weightStatus,
    };
  }
}

