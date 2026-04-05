import { format, subDays, startOfDay, eachDayOfInterval, isSameDay, differenceInDays } from "date-fns";

export interface TdeeResult {
  tdee: number;
  confidence: "HIGH" | "MEDIUM" | "LOW";
  weightTrend: number;
  isFallback: boolean;
  avgIntake: number;
  daysOfData: number;
  reason?: string;
}

export class TdeeCalculator {
  /**
   * Adaptive TDEE Calculation based on Energy Balance
   * Formula: TDEE = (Avg_Daily_Intake) - (Avg_Daily_Weight_Change_kg * 7700)
   */
  static calculate(
    measurements: { date: Date; weight: number }[],
    nutrition: { date: Date; calories: number }[],
    calculationDate: Date = new Date()
  ): TdeeResult {
    const windowDays = 28;
    const startDate = startOfDay(subDays(calculationDate, windowDays + 7)); // 7 extra days for SMA smoothing
    
    // 1. Prepare Daily Data
    const dayInterval = eachDayOfInterval({ start: startDate, end: calculationDate });
    const dailyData = dayInterval.map(day => {
      const dateStr = format(day, "yyyy-MM-dd");
      const measurement = measurements.find(m => isSameDay(m.date, day));
      const nutritionEntry = nutrition.find(n => isSameDay(n.date, day));
      
      return {
        date: day,
        actualWeight: measurement?.weight ?? null,
        calories: nutritionEntry?.calories ?? 0,
        interpolatedWeight: 0,
        weightTrend: 0,
      };
    });

    // 2. Linear Interpolation for Weight
    for (let i = 0; i < dailyData.length; i++) {
      if (dailyData[i].actualWeight === null) {
        let prev = dailyData.slice(0, i).reverse().find(d => d.actualWeight !== null);
        let next = dailyData.slice(i + 1).find(d => d.actualWeight !== null);

        if (prev && next) {
          const totalDays = differenceInDays(next.date, prev.date);
          const daysFromPrev = differenceInDays(dailyData[i].date, prev.date);
          dailyData[i].interpolatedWeight = prev.actualWeight! + (next.actualWeight! - prev.actualWeight!) * (daysFromPrev / totalDays);
        } else if (prev) {
          dailyData[i].interpolatedWeight = prev.actualWeight!;
        } else if (next) {
          dailyData[i].interpolatedWeight = next.actualWeight!;
        } else {
          // No weight data at all - cannot calculate TDEE
          return this.fallbackResult(2000, "Insufficient weight data");
        }
      } else {
        dailyData[i].interpolatedWeight = dailyData[i].actualWeight!;
      }
    }

    // 3. 7-Day SMA Weight Smoothing
    for (let i = 0; i < dailyData.length; i++) {
      if (i < 6) {
        dailyData[i].weightTrend = dailyData[i].interpolatedWeight;
        continue;
      }
      const last7Days = dailyData.slice(i - 6, i + 1);
      const sum = last7Days.reduce((acc, d) => acc + d.interpolatedWeight, 0);
      dailyData[i].weightTrend = sum / 7;
    }

    // 4. Analysis Window (Last 28 days)
    const calculationWindow = dailyData.slice(-windowDays);
    const validCalorieLogs = calculationWindow.filter(d => d.calories >= 200).map(d => d.calories);
    
    if (validCalorieLogs.length < 7) {
      return this.fallbackResult(2000, "Insufficient calorie logs (min 7 days)");
    }

    const avgDailyIntake = validCalorieLogs.reduce((a, b) => a + b, 0) / validCalorieLogs.length;
    const startWeightTrend = calculationWindow[0].weightTrend;
    const endWeightTrend = calculationWindow[calculationWindow.length - 1].weightTrend;
    const weightChange = endWeightTrend - startWeightTrend;
    const dailyWeightChange = weightChange / windowDays;

    // Body tissue is approx 7700 kcal per kg
    const adaptiveTdee = avgDailyIntake - (dailyWeightChange * 7700);

    return {
      tdee: Math.round(adaptiveTdee),
      confidence: this.getConfidence(validCalorieLogs.length, measurements.length, windowDays),
      weightTrend: Math.round(endWeightTrend * 10) / 10,
      isFallback: false,
      avgIntake: Math.round(avgDailyIntake),
      daysOfData: validCalorieLogs.length,
    };
  }

  private static fallbackResult(tdee: number, reason: string): TdeeResult {
    return {
      tdee,
      confidence: "LOW",
      weightTrend: 0,
      isFallback: true,
      avgIntake: 0,
      daysOfData: 0,
      reason,
    };
  }

  private static getConfidence(calorieDays: number, weightEntries: number, daySpan: number): "HIGH" | "MEDIUM" | "LOW" {
    if (calorieDays >= 21 && weightEntries >= 8 && daySpan >= 21) return "HIGH";
    if (calorieDays >= 14 && weightEntries >= 4 && daySpan >= 14) return "MEDIUM";
    return "LOW";
  }
}
