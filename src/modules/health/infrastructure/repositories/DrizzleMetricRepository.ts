import { MetricRepository } from "../../domain/repositories/MetricRepository";
import { HealthMetric } from "../../domain/entities/Metric";
import { db } from "@/lib/db/db";
import { healthMetrics } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export class DrizzleMetricRepository implements MetricRepository {
  async save(metric: HealthMetric): Promise<HealthMetric> {
    const [result] = await db.insert(healthMetrics).values({
      userId: metric.userId,
      type: metric.type,
      value: metric.value,
      unit: metric.unit,
      timestamp: metric.timestamp,
    }).returning();

    return {
      ...result,
      type: result.type as any, // Drizzle type casting
    };
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
