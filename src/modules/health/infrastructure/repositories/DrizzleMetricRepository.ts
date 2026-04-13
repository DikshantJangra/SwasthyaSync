import { MetricRepository } from "../../domain/repositories/MetricRepository";
import { HealthMetric } from "../../domain/entities/Metric";
import { db } from "@/lib/db/db";
import { healthMetrics } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export class DrizzleMetricRepository implements MetricRepository {
  async save(metric: HealthMetric): Promise<HealthMetric> {
    try {
      // Preferred shape (works when `health_metrics.value` is text)
      const [result] = await db
        .insert(healthMetrics)
        .values({
          userId: metric.userId,
          type: metric.type,
          value: String(metric.value),
          unit: metric.unit,
          timestamp: metric.timestamp,
        })
        .returning();

      return {
        ...result,
        type: result.type as any, // Drizzle type casting
      };
    } catch (error) {
      // Backward-compatible fallback if DB column is still integer:
      // store blood group in `unit` (text) and keep a dummy numeric value.
      if (metric.type !== "blood_group") throw error;

      const [result] = await db
        .insert(healthMetrics)
        .values({
          userId: metric.userId,
          type: metric.type,
          value: 0 as any,
          unit: String(metric.value),
          timestamp: metric.timestamp,
        })
        .returning();

      return {
        ...result,
        type: result.type as any,
      };
    }
  }

  async findByUserId(userId: string): Promise<HealthMetric[]> {
    const results = await db.query.healthMetrics.findMany({
      where: eq(healthMetrics.userId, userId),
    });

    return results.map(r => ({
      ...r,
      type: r.type as any,
    }));
  }
}
