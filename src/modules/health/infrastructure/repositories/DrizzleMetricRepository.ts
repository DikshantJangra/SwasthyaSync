import { MetricRepository } from "../../domain/repositories/MetricRepository";
import { HealthMetric } from "../../domain/entities/Metric";
import { db } from "@/lib/db/db";
import { healthMetrics } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export class DrizzleMetricRepository implements MetricRepository {
  // Drizzle-backed implementation of MetricRepository (real DB reads/writes).

  async save(metric: HealthMetric): Promise<HealthMetric> {
    try {
      // Normal path: store the value in the `value` column.
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
      // Fallback for older DBs where `health_metrics.value` is still INTEGER:
      // blood group ("B+") can't go into an integer column, so we store it in `unit`.
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
    // Fetch full metric log for the user.
    const results = await db.query.healthMetrics.findMany({
      where: eq(healthMetrics.userId, userId),
    });

    return results.map(r => ({
      ...r,
      type: r.type as any,
    }));
  }
}
