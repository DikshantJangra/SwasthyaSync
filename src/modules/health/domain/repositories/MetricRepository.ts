import { HealthMetric } from "../entities/Metric";

export interface MetricRepository {
  save(metric: HealthMetric): Promise<HealthMetric>;
  findByUserId(userId: string): Promise<HealthMetric[]>;
}
