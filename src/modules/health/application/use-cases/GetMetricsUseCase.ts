import { MetricRepository } from "../../domain/repositories/MetricRepository";
import { MetricMapper } from "../mappers/metric.mapper";
import { MetricDTO } from "../dtos/metric.dto";
import { type HealthMetric, type MetricType } from "../../domain/entities/Metric";

/** One row per type: the most recently logged value (for dashboard “current” vitals). */
function latestMetricPerType(metrics: HealthMetric[]): HealthMetric[] {
  const byType = new Map<MetricType, HealthMetric>();
  for (const m of metrics) {
    const prev = byType.get(m.type);
    if (!prev) {
      byType.set(m.type, m);
      continue;
    }
    const a = m.timestamp.getTime();
    const b = prev.timestamp.getTime();
    const newer =
      a > b || (a === b && (m.id ?? 0) > (prev.id ?? 0));
    if (newer) {
      byType.set(m.type, m);
    }
  }
  return [...byType.values()];
}

export class GetMetricsUseCase {
  constructor(private metricRepository: MetricRepository) {}

  async execute(userId: string): Promise<MetricDTO[]> {
    const metrics = await this.metricRepository.findByUserId(userId);
    return MetricMapper.toDTOs(latestMetricPerType(metrics));
  }
}
