import { HealthMetric } from "../entities/Metric";

export interface MetricRepository {
  // Save one metric row (DB details stay inside the repository).
  save(metric: HealthMetric): Promise<HealthMetric>;

  // Fetch the full metric log for a user (use-cases can pick "latest" if needed).
  findByUserId(userId: string): Promise<HealthMetric[]>;
}
